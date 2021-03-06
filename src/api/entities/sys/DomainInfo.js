// @flow
import {create, TypeRef} from "../../common/EntityFunctions"

export const DomainInfoTypeRef: TypeRef<DomainInfo> = new TypeRef("sys", "DomainInfo")
export const _TypeModel: TypeModel = {
	"name": "DomainInfo",
	"since": 9,
	"type": "AGGREGATED_TYPE",
	"id": 696,
	"rootId": "A3N5cwACuA",
	"versioned": false,
	"encrypted": false,
	"values": {
		"_id": {
			"name": "_id",
			"id": 697,
			"since": 9,
			"type": "CustomId",
			"cardinality": "One",
			"final": true,
			"encrypted": false
		},
		"certificateExpiryDate": {
			"name": "certificateExpiryDate",
			"id": 1134,
			"since": 22,
			"type": "Date",
			"cardinality": "ZeroOrOne",
			"final": true,
			"encrypted": false
		},
		"domain": {
			"name": "domain",
			"id": 698,
			"since": 9,
			"type": "String",
			"cardinality": "One",
			"final": true,
			"encrypted": false
		},
		"validatedMxRecord": {
			"name": "validatedMxRecord",
			"id": 699,
			"since": 9,
			"type": "Boolean",
			"cardinality": "One",
			"final": true,
			"encrypted": false
		}
	},
	"associations": {
		"catchAllMailGroup": {
			"name": "catchAllMailGroup",
			"since": 18,
			"type": "ELEMENT_ASSOCIATION",
			"cardinality": "ZeroOrOne",
			"refType": "Group",
			"final": true,
			"external": false
		},
		"certificate": {
			"name": "certificate",
			"since": 22,
			"type": "ELEMENT_ASSOCIATION",
			"cardinality": "ZeroOrOne",
			"refType": "SslCertificate",
			"final": true,
			"external": false
		},
		"theme": {
			"name": "theme",
			"since": 22,
			"type": "ELEMENT_ASSOCIATION",
			"cardinality": "ZeroOrOne",
			"refType": "BrandingTheme",
			"final": true,
			"external": false
		}
	},
	"app": "sys",
	"version": "25"
}

export function createDomainInfo(): DomainInfo {
	return create(_TypeModel)
}
