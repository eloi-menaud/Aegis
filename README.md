![](./rsc/banner.png)

### Aegis : A minimalist, schema-based, generic type guard tool with vanilla types

# Why Aegis:
- Light: 1 file, few lines of code
- Vanilla-like: Lets you use vanilla types
- Easy debug: Explanation on why the value is not parsable

# Get Started
## Intall it :
- copy/paste `./Aegis.ts` in yout project

## Quick example:
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
const A_human = Aegis<Human>(Human_);

const john = { /* some values */ }
if (A_human.is(my_variable)) {
    // my_variable is of type Human
    // and has been guarded with 'my_variable is Human' so the compiler knows it
}
```
<br><br>


# Debug Infos
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
Failed at attribute 'hobbies'
└ Failed at array element of index '2'
  └ Failed at attribute 'name'
    └ is of type 'number' instead of 'string'
```
## Get Message Using Store
```ts
const A_human = Aegis<Human>(Human_);
const alien = { /* some wrong values */ };

const store = Aegis.newStore(); // store.info empty

if (A_human.is(alien, store)) { ... }
else {
    console.log(store.info); // store.info = "Failed at attribute ..."
}
```
> TypeScript type guard functions must only return a boolean, so we can't just pass information through the return of the `.is()` method. Instead, we store information in an object.

<br><br>

# Reusable (Stock)
```ts
// Stock Aegis instances and reuse them
const AegisStock = {
    human: new Aegis<Human>(Human_),
    cat: new Aegis<Cat>(Cat_)
}

if (AegisStock.human.is(john)) {
    // john is of type Human
}
```
<br><br>

# Type -> Schema Syntax
### Primitive
```ts
// string
type  T  = { var: string }
const T_ = { var: 'string' }
// number
type  T  = { var: number }
const T_ = { var: 'number' }
// boolean
type  T  = { var: boolean }
const T_ = { var: 'boolean' }
// undefined
type  T  = { var: undefined }
const T_ = { var: 'undefined' }
```
### Optional
```ts
// optional: use _ in place of ?
type  T  = { var?: string }
const T_ = { var_: 'string' }
```
> Aegis is strict, meaning that it allows only one type at a time, but makes an exception for `undefined` to allow optional variables. If a variable is set as 'optional', its absence is accepted.

### Type in Type
```ts
// A first type/schema
type  T  = { ... }
const T_ = { ... }

// A type using T
type  U  = { var: T }
const U_ = { var: T_ }
```
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