// This code is all new, so read through it carefully!

import { Stmt, Value } from "../AST";

// To implement our print statement, we pull in a function from our *runtime*,
// which provides primitive operations for interacting with the host platform
// our code is running on. In this case, it gives us a way to write values out
// to a section of the webpage.
import { printLine } from "../Library/Runtime";

// Some of our statements modify the current scope.
import {
  ProgramScope,
  declare, update, pushLocalScope, popLocalScope
} from "./Scope";

// Some of our statements contain expressions.
import { executeExpr } from "./Expression";

// This is the error type for when an "assert" condition fails.
export class AssertionError extends Error { }


// This function is similar to executeExpr, but note one very important
// difference: it has a void return type instead of Value. This is the defining
// difference between an *expression* and a *statement*, and the reason why we
// separate them into two AST types.
export function executeStmt(
  scope: ProgramScope,
  stmt: Stmt
): void {
  switch (stmt.tag) {
    case "varDecl": {
      // To declare a variable, we have to interpret the provided expression in
      // order to obtain the initial value of the variable.
      const initialValue: Value = executeExpr(scope, stmt.initialExpr);
      declare(stmt.name, initialValue, scope);
      break;
    }

    case "varUpdate": {
      // Similarly, to update a variable, we have to interpret the provided
      // expression in order to obtain the new value of the variable.
      const initialValue: Value = executeExpr(scope, stmt.newExpr);
      update(stmt.name, initialValue, scope);
      break;
    }

    case "print": {
      const printValue: Value = executeExpr(scope, stmt.printExpr);
      printLine(printValue);
      break;
    }

    case "assert": {
      throw new Error("unimplemented");
    }

    case "block": {
      // **This is a very important pattern to pay attention to!**

      // Before we enter the block, we push a new local scope to keep track of
      // this block's local variables.
      pushLocalScope(scope);

      // Now we execute each statement of the array, which might add new
      // variable names into scope.
      for (const blockStmt of stmt.blockStmts)
        executeStmt(scope, blockStmt);

      // After we exit the block, we pop the local scope that held the block's
      // local variables.
      popLocalScope(scope);

      break;
    }

    case "if": {
      // The same pattern of pushing and popping a local scope occurs here,
      // because the variables within either branch of an if statement go out of
      // scope at the end of the if statement.
      pushLocalScope(scope);

      const conditionValue: Value = executeExpr(scope, stmt.condition);
      if (conditionValue)
        executeStmt(scope, stmt.trueBranch);
      else if (stmt.falseBranch != null)
        executeStmt(scope, stmt.falseBranch);

      popLocalScope(scope);

      break;
    }

    case "for": {
      throw new Error("unimplemented");
    }
  }
}