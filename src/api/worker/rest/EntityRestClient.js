//@flow
import {restClient, MediaType} from "./RestClient"
import {loginFacade} from "../facades/LoginFacade"
import {
	decryptAndMapToInstance,
	encryptAndMapToLiteral,
	applyMigrations,
	resolveSessionKey,
	setNewOwnerEncSessionKey
} from "../crypto/CryptoFacade"
import type {HttpMethodEnum} from "../../common/EntityFunctions"
import {resolveTypeReference, TypeRef, HttpMethod} from "../../common/EntityFunctions"
import {assertWorkerOrNode} from "../../Env"

assertWorkerOrNode()

export function typeRefToPath(typeRef: TypeRef<any>): string {
	return `/rest/${typeRef.app}/${typeRef.type.toLowerCase()}`
}
/**
 * Retrieves the instances from the backend (db) and converts them to entities.
 *
 * Part of this process is
 * * the decryption for the returned instances (GET) and the encryption of all instances before they are sent (POST, PUT)
 * * the injection of aggregate instances for the returned instances (GET)
 * * caching for retrieved instances (GET)
 *
 */
export class EntityRestClient {
	constructor() {
	}


	entityRequest<T>(typeRef: TypeRef<T>, method: HttpMethodEnum, listId: ?Id, id: ?Id, entity: ?T, queryParameter: ?Params): Promise<any> {
		return resolveTypeReference(typeRef).then(model => {
			let path = typeRefToPath(typeRef)
			if (listId) {
				path += '/' + listId
			}
			if (id) {
				path += '/' + id
			}
			let queryParams = queryParameter == null ? {} : queryParameter
			let headers = loginFacade.createAuthHeaders()
			headers['v'] = model.version
			if (method === HttpMethod.POST) {
				let sk = setNewOwnerEncSessionKey(model, (entity:any))
				return encryptAndMapToLiteral(model, entity, sk).then(encryptedEntity => {
					// we do not make use of the PersistencePostReturn anymore but receive all updates via PUSH only
					return restClient.request(path, method, queryParams, headers, JSON.stringify(encryptedEntity), MediaType.Json).then(persistencePostReturn => {
						return JSON.parse(persistencePostReturn).generatedId
					})
				})
			} else if (method === HttpMethod.PUT) {
				return resolveSessionKey(model, (entity:any))
					.then(sk => encryptAndMapToLiteral(model, entity, sk))
					.then(encryptedEntity => restClient.request(path, method, (queryParams:any), headers, JSON.stringify(encryptedEntity), MediaType.Json))
			} else if (method === HttpMethod.GET) {
				return restClient.request(path, method, queryParams, headers, null, MediaType.Json).then(json => {
					let data = JSON.parse((json:string))
					if (data instanceof Array) {
						return Promise.all(data.map(instance => resolveSessionKey(model, instance).then(sk => decryptAndMapToInstance(model, instance, sk))))
					} else {
						return applyMigrations(typeRef, data).then(data => {
							return resolveSessionKey(model, data).then(sk => {
								return decryptAndMapToInstance(model, data, sk)
							})
						})
					}
				})
			} else if (method === HttpMethod.DELETE) {
				return restClient.request(path, method, queryParams, headers)
			} else {
				return Promise.reject("Illegal method: " + method)
			}
		})
	}
}
