![](./rsc/banner.png)

### Aegis : A minimalist, schema-based, generic type guard tool with vanilla types

<br>

# ✨ Why Aegis:
- Light: 1 file, few lines of code
- Vanilla-like: Lets you use vanilla types
- Easy debug: Explanation on why the value is not parsable
- Easy schema syntax: only use few simple transposition rules

<br><br>


# 📥 Intall it :
- copy/paste `./Aegis.ts` in yout project
- import it with `import {Aegis} from 'path/to/Aegis'`

<br>

# ⚡ Quick example:
```ts
// Define a type as usual
type Human = {
    name: string,
    age: number
}
// Define the associated schema (by convention name it as {Type}_)
const Human_ = {
    name: 'string',
    age: 'number'
}

// Create a reusable Aegis guard for your type
const Ahuman = Aegis<Human>(Human_);

const john = { /* some values */ }
if (Ahuman.is(my_variable)) {
    // my_variable is of type Human
    // and has been guarded with 'my_variable is Human' so the compiler knows it
}
```
<br><br>


# 💬 Debug Infos
## Example of Aegis Message:
```json
{
  "hobbies": [
    {"name": "soccer"},
    {"name": "basketball"},
    {"name": 1209} // <= wrong value type
  ]
}
```
will give the error:
```
Failed to typeGard value to 'Human' type
└ Failed at attribute 'hobbies'
└ Failed at 'hobbies[2]'
└ Failed at attribute 'name'
└ 'name' is of type 'number' instead of 'string'
```
## Get Message Using AegisReason
```ts
const AHuman = Aegis<Human>(Human_);
const alien = { /* wrong values */ };

const reason = AHuman.newReason(); // reason.info = ""
// also staticly : const reason = Aegis.newReason()

if (AHuman.is(alien, reason)) { ... }
else {
    console.log(reason.info); // reason.info = "Failed at attribute ..."
}
```
> TypeScript type guard functions must only return a boolean, so we can't just pass information through the return of the `.is()` method. Instead, we store information in an object.

<br><br>

# ♻️ Reusable
```ts
// type.ts
export type Human = {...}
const Human_ = {...}
export const AHuman = Aegis<Human>(Human_);

// script.ts
import {type Human, AHuman}
AHuman.is(...)
```
<br><br>

# 💱 Type <─> Schema Syntax
### Primitive
```ts
// any
type  T  = { var: any   }
const T_ = { var: 'any' }
// string
type  T  = { var: string   }
const T_ = { var: 'string' }
// number
type  T  = { var: number   }
const T_ = { var: 'number' }
// boolean
type  T  = { var: boolean   }
const T_ = { var: 'boolean' }
// undefined
type  T  = { var: undefined   }
const T_ = { var: 'undefined' }
...
```

<br>

### Optional
```ts
// optional: use _ in place of ?
type  T  = { var?: string   }
const T_ = { var_: 'string' }
```
> Aegis is strict, meaning that it allows only one type at a time, but makes an exception for `undefined` to allow optional variables. If a variable is set as 'optional', its absence is accepted.

<br>

### Type in Type
Could use other custom `Aegis schematized` types
```ts
// A first type/schema
type  T  = { ... }
const T_ = { ... }

// A type using T
type  U  = { var: T }
const U_ = { var: T_ }
```
Could use other `UNschematized` types
```ts
// A first type/schema
type  T  = {
	hash : Hash //type from lib or other
}
const T_ = {
	hash : 'Hash' // Will be treated as 'any'
}
```
>Will be treated as 'any', so it will never trigger an error, but it's easier and clearer to keep the real type name rather than using 'any'.

<br>

### Array
> Aegis is strict, meaning all array elements must be of the same type.
```ts
// primitive
type  T  = { var: string[] } // same for all primitives
const T_ = { var: ['string'] } // same for all primitives

// Type
type  T  = { var: U }
const T_ = { var: [U_] }

// Array of arrays
type  T  = { var: U[][] }
const T_ = { var: [[U_]] } // same for [['string']] ...
```
<br>

### Custom schema key
#### Use `__name__` to add a name to your type
```ts
type Human = {
	name: string;
}
const Human_ = {
	__name__: 'Human', // will be ignored
	name: "string"
}
const AHuman = Aegis<Human>(Human_);

const myHuman = {name:"jhon"}
```

- Will be accessible through `AHuman.name`
- Will be displayed when a TypeGuard fails to provide clearer debug information
	```
	Failed to typeGuard value to 'Human' type
	                                ^
	```