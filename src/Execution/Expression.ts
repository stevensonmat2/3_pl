// Our expression evaluation code is almost the same as in assignment 2, just
// with some type assertions scattered throughout.

// Note that TypeScript will produce a static type error if some of these
// assertions are removed: review src/Execution/TypeAssertions for the
// explanation of how this works.

import { Expr, Value } from "../AST";

import { ProgramScope, lookup } from "./Scope";
import { assertBool, assertNum, assertSameType } from "./TypeAssertions";

export function executeExpr(
  scope: ProgramScope,
  expr: Expr
): Value {
  switch (expr.tag) {
    case "plus": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue + rightValue;
    }

    case "minus": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue - rightValue;
    }

    case "times": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue * rightValue;
    }

    case "divide": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue / rightValue;
    }

    case "exponent": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue ** rightValue;
    }

    case "and": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertBool(leftValue);
      assertBool(rightValue);
      return leftValue && rightValue;
    }

    case "or": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertBool(leftValue);
      assertBool(rightValue);
      return leftValue || rightValue;
    }

    case "lessThan": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue < rightValue;
    }

    case "equal": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertSameType(leftValue, rightValue);
      return leftValue == rightValue;
    }

    case "negate": {
      const value = executeExpr(scope, expr.subexpr);
      assertNum(value);
      return - value;
    }

    case "not": {
      const value = executeExpr(scope, expr.subexpr);
      assertBool(value);
      return ! value;
    }

    case "var":
      return lookup(expr.name, scope);

    case "num": // fallthrough
    case "bool":
      return expr.value;

    case "conditional": {
      throw new Error("unimplemented");
    }
  }
}