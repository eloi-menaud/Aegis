class Aegis<T>{
	constructor(public readonly schema:any){}

	private indent = (nb:number):string => {return (nb < 1) ? '' : '  '.repeat((nb-1 >= 0)? nb-1 : 0) + '└'}
	static newStore() : AegisStore {return {is:false,info:''}}

	is(obj:any,store?:AegisStore): obj is T{
		const res = this.is_generic(obj,this.schema,0);
		if(store){ Object.assign(store, res); }
		return res.is
	}

	private is_generic(obj: any, schema: any, depth:number): AegisStore {
		const schemaType = schema.constructor.name;
		if (schemaType === 'String') return this.is_primitif(obj, schema, depth);
		if (schemaType === 'Object') return obj.constructor.name !== 'Object' ? { is: false, info: `${this.indent(depth)} Should be an Object` } : this.is_object(obj, schema, depth);
		if (schemaType === 'Array')  return obj.constructor.name !== 'Array'  ? { is: false, info: `${this.indent(depth)} Should be an Array`  } : this.is_array(obj, schema, depth);
		return { is: true, info: '' };
	}

	private is_primitif(obj: any, schema: string, depth:number): AegisStore {
		return typeof obj !== schema ? { is: false, info: `${this.indent(depth)} is of type '${typeof obj}' instead of '${schema}'` } : { is: true, info: '' };
	}

	private is_object(obj: any, schema: any, depth:number): AegisStore {
		const without_prefix = (str: string) => str.replace(/_$/gm, '');
		const unprefixed_shema_keys = Object.keys(schema).map(without_prefix);
		for (let obj_key in obj) if (!unprefixed_shema_keys.includes(obj_key)) return { is: false, info: `${this.indent(depth)}Attribute '${obj_key}' shouldn't be present` };
		for (let _key in schema) {
			let key = without_prefix(_key);
			if (!obj[key]) {
				if (_key.endsWith('_')) continue;
				return { is: false, info: `${this.indent(depth)} don't have mandatory attribute '${key}'` };
			}
			const { is, info } = this.is_generic(obj[key], schema[_key],depth+1);
			if (!is) return { is: false, info: `${this.indent(depth)} Failed at attribute '${key}'\n${info}` };
		}
		return { is: true, info: '' };
	}

	private is_array(obj: any, schema: any, depth:number): AegisStore {
		for (let idx = 0; idx < obj.length; idx++) {
			const { is, info } = this.is_generic(obj[idx], schema[0],depth+1);
			if (!is) return { is: false, info: `${this.indent(depth)} Failed at array element of index '${idx}'\n${info}` };
		}
		return { is: true, info: '' };
	}
}

type AegisStore = {is:boolean, info:string}