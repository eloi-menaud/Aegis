const primitive_types = [
	"string",
	"number",
	"boolean",
	"bigint",
	"symbol",
	"undefined",
	"null"
];

export class Aegis<T> {
	public name = "";
	constructor(public readonly schema: any) {
		if(schema['__name__']){
			this.name = schema['__name__'];
		}
	}

	static newReason(): AegisReason  {
		return { info: '' };
	}
	newReason(): AegisReason {
		return { info: '' };
	}

	is(obj: any, reason ?: AegisReason ): obj is T {
		const res = this.is_generic('.',obj, this.schema, 0);
		if (reason) {
			if (!res.is) res.info = `Failed to typeGard value ${this.name? `to '${this.name}' type`:''}` + res.info
			Object.assign(reason, { info:res.info });
		}
		return res.is;
	}

	private is_generic(key:string,obj: any, schema: any, depth: number): {is:boolean, info:string} {
		const schemaType = schema.constructor.name;
		if (schemaType === 'String')
			return this.is_primitif(key,obj, schema, depth);
		if (schemaType === 'Object'){
			return (obj && obj.constructor.name == 'Object')
				?	this.is_object(obj, schema, depth)
				:	{is: false,info: `└ ${key} Should be an Object`}
		}
		if (schemaType === 'Array'){
			return (obj && obj.constructor.name == 'Array')
			?	this.is_array(key,obj, schema, depth)
			:	{is: false,info: `└ Should be an Object`}
		}
		return {is:true,info:''}
	}

	private is_primitif(key:string, obj: any, schema: string, depth: number): {is:boolean, info:string} {
		if(!primitive_types.includes(schema)){ // specify a 'OtherType'
			return { is: true, info: '' }
		}
		return (schema == 'any' || typeof obj == schema)
		?	{ is: true, info: '' }
		:	{is: false,info: `└ '${key}' is of type '${typeof obj}' instead of '${schema}'`}
	}

	private is_object(obj: any, schema: any, depth: number): {is:boolean, info:string} {
		const without_sufix = (str: string) => str.replace(/_$/gm, '');
		const unsufixed_shema_keys = Object.keys(schema).map(without_sufix);
		for (let key_ in schema) {
			let key = without_sufix(key_);
			if(key_ == "__name__") continue;
			if (obj[key] === undefined) {
				if (key_.endsWith('_')) continue;
				return {
					is: false,
					info: `└ Don't have the mandatory attribute '${key}'`
				};
			}
			const { is, info } = this.is_generic(
				key,
				obj[key],
				schema[key_],
				depth + 1
				);
			if (!is) return {
				is: false,
				info: `└ Failed at attribute '${key}'\n${info}`
			};
		}
		for (let obj_key in obj)
			if (!unsufixed_shema_keys.includes(obj_key)) return {
				is: false,
				info: `└ Attribute '${obj_key}' shouldn't be present`
			};
		return { is: true, info: '' };
	}

	private is_array(key:string, obj: any, schema: any, depth: number): {is:boolean, info:string} {
		for (let idx = 0; idx < obj.length; idx++) {
			const { is, info } = this.is_generic(
				`${key}[${idx}]`,
				obj[idx],
				schema[0],
				depth
			);
			if (!is)
				return {
					is: false,
					info: `└ Failed at '${key}[${idx}]'\n${info}`
				};
		}
		return { is: true, info: '' };
	}
}
export type AegisReason = { info: string };



