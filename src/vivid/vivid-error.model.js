// @flow
/** 
```
Error: {
  description:   Represents an operation error
  code:
    type:        string
    description: Machine-readable error code
  message:
    type:        string
    description: Human-readable error message
  hint:
    type:        string
    description: A hint to the user for correcting the error
}
```
*/
export type VividError = {
    code: string,
    message: string,
    hint: string,
};
