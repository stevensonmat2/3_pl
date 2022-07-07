// Don't **copy** the code of these functions: **call** the functions instead!

import { Value } from "../AST";

// A LocalScope keeps track of the value of each variable within a single block
// of code.
export type LocalScope = Map<string, Value>;

// A ProgramScope is a *stack* of LocalScope values, implemented as an array
// with the top of the stack at index 0. We require that the stack must be
// non-empty by using an *intersection type* to specify that there must always
// be a value present at index 0 in the array.
export type ProgramScope = LocalScope[] & { 0: LocalScope };

// A ProgramScope keeps track of the value of each variable within **multiple**
// nested blocks of code. For example, consider this nested statement:

// {
//   declare y = 1;
//   { declare x = 2; print x; }
//   print y;
// }

// Both x and y are in scope within the inner block, but in the outer block only
// x is in scope. This is implemented by **pushing** a new LocalScope when
// execution enters the inner block, and **popping** that LocalScope when
// execution exits the inner block.


// The execution code will throw a ScopeError exception if it tries to access or
// update an undeclared variable, or if it tries to redeclare a variable that's
// already declared in the same LocalScope.
export class ScopeError extends Error { }


// When execution **enters** a nested statement, it pushes a new LocalScope onto
// the top of the ProgramScope stack.
export function pushLocalScope(programScope: ProgramScope): void {
  programScope.unshift(new Map());
}

// When execution **exits** a nested statement, it pops a LocalScope off of the
// top of the ProgramScope stack.
export function popLocalScope(programScope: ProgramScope): void {
  programScope.shift();
}

// When a variable is **used**, its value is located by looking through each
// nested LocalScope in order. If the variable is not declared in any
// LocalScope, there is a ScopeError.
export function lookup(
  name: string,
  programScope: ProgramScope
): Value {
  for (const nestedScope of programScope) {
    const value = nestedScope.get(name);
    if (value != null)
      return value;
  }
  throw new ScopeError("name is not in scope: " + name);
}

// When a variable is **created**, its value is stored in the LocalScope on top
// of the ProgramScope stack. If the same variable name is already declared in
// the top LocalScope, there is a ScopeError.
export function declare(
  name: string,
  value: Value,
  programScope: ProgramScope
): void {
  if (programScope[0].has(name))
    throw new ScopeError("duplicate variable definition: " + name);
  programScope[0].set(name, value);
}

// When a variable is **reassigned**, its value is updated by looking through
// each nested LocalScope in order. If the variable is not declared in any
// LocalScope, there is a ScopeError.
export function update(
  name: string,
  value: Value,
  programScope: ProgramScope
): void {
  for (const nestedScope of programScope) {
    if (nestedScope.has(name)) {
      nestedScope.set(name, value);
      return;
    }
  }
  throw new ScopeError("assignment to undeclared variable name: " + name);
}