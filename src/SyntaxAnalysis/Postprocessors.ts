import { Token } from "moo";

import {
  Expr, Stmt,
  BinaryExpr, UnaryExpr,
  PlusExpr, MinusExpr, TimesExpr, DivideExpr, ExponentExpr,
  AndExpr, OrExpr, LessThanExpr, EqualExpr,
  NegateExpr, NotExpr,
  ConditionalExpr,
  NumLeaf, BoolLeaf, VarLeaf,
  BlockStmt, IfStmt, ForStmt,
  VarDeclStmt, VarUpdateStmt, PrintStmt, AssertStmt
} from "../AST";

import { postprocessWithTag } from "../Library/Parsing";

export function buildConditionalExpr(
  conditionExpr: Expr,
  question: Token,
  trueExpr: Expr,
  colon: Token,
  falseExpr: Expr
): ConditionalExpr {
  return {
    tag: "conditional",
    condition: conditionExpr,
    trueExpr: trueExpr,
    falseExpr: falseExpr
  };
}

function buildBinaryExpr(
  leftExpr: Expr,
  operator: Token,
  rightExpr: Expr
): BinaryExpr {
  return {
    leftSubexpr: leftExpr,
    rightSubexpr: rightExpr
  };
}

function buildUnaryExpr(
  operator: Token,
  expr: Expr
): UnaryExpr {
  return { subexpr: expr };
}

type InfixBuilder<TreeType> = (args: [Expr, Token, Expr]) => TreeType;
type PrefixBuilder<TreeType> = (args: [Token, Expr]) => TreeType;

export const buildPlusExpr: InfixBuilder<PlusExpr> =
  postprocessWithTag("plus", buildBinaryExpr);

export const buildMinusExpr: InfixBuilder<MinusExpr> =
  postprocessWithTag("minus", buildBinaryExpr);

export const buildTimesExpr: InfixBuilder<TimesExpr> =
  postprocessWithTag("times", buildBinaryExpr);

export const buildDivideExpr: InfixBuilder<DivideExpr> =
  postprocessWithTag("divide", buildBinaryExpr);

export const buildExponentExpr: InfixBuilder<ExponentExpr> =
  postprocessWithTag("exponent", buildBinaryExpr);

export const buildAndExpr: InfixBuilder<AndExpr> =
  postprocessWithTag("and", buildBinaryExpr);

export const buildOrExpr: InfixBuilder<OrExpr> =
  postprocessWithTag("or", buildBinaryExpr);

export const buildLessThanExpr: InfixBuilder<LessThanExpr> =
  postprocessWithTag("lessThan", buildBinaryExpr);

export const buildEqualExpr: InfixBuilder<EqualExpr> =
  postprocessWithTag("equal", buildBinaryExpr);

export const buildNegateExpr: PrefixBuilder<NegateExpr> =
  postprocessWithTag("negate", buildUnaryExpr);

export const buildNotExpr: PrefixBuilder<NotExpr> =
  postprocessWithTag("not", buildUnaryExpr);

export function buildNumLeaf(
  numToken: Token
) {
  return {
    tag: "num",
    value: Number.parseFloat(numToken.text)
  };
}

export function buildBoolLeaf(
  boolToken: Token
) {
  return {
    tag: "bool",
    value: boolToken.text == "true"
  };
}

export function buildVarLeaf(
  nameToken: Token
): VarLeaf {
  return {
    tag: "var",
    name: nameToken.text
  };
}

export function unparenthesize(
  leftParen: Token,
  tree: Expr,
  rightParen: Token
): Expr {
  return tree;
}

export function buildCommandStmt(
  stmt: Stmt,
  semicolon: Token
): Stmt {
  return stmt;
}

export function buildVarDeclStmt(
  let_: Token,
  varName: Token,
  equal: Token,
  expr: Expr,
): VarDeclStmt {
  return {
    tag: "varDecl",
    name: varName.text,
    initialExpr: expr
  }
}

export function buildVarUpdateStmt(
  varName: Token,
  equal: Token,
  expr: Expr,
): VarUpdateStmt {
  return {
    tag: "varUpdate",
    name: varName.text,
    newExpr: expr
  }
}

export function buildPrintStmt(
  print: Token,
  expr: Expr,
): PrintStmt {
  return {
    tag: "print",
    printExpr: expr
  }
}

export function buildAssertStmt(
  print: Token,
  expr: Expr,
): AssertStmt {
  return {
    tag: "assert",
    condition: expr
  }
}

export function buildBlockStmt(
  curlyL: Token,
  stmts: Stmt[],
  curlyR: Token
): BlockStmt {
  return {
    tag: "block",
    blockStmts: stmts
  }
}

export function buildIfStmt(
  if_: Token,
  parenL: Token,
  condition: Expr,
  parenR: Token,
  trueBranch: Stmt,
  else_: [Token, Stmt] | null
): IfStmt {
  return {
    tag: "if",
    condition: condition,
    trueBranch: trueBranch,
    falseBranch: else_ == null ? null : else_[1]
  }
}

export function buildForStmt(
  for_: Token,
  parenL: Token,
  name: Token,
  assign: Token,
  initialExpr: Expr,
  semicolon1: Token,
  condition: Expr,
  semicolon2: Token,
  update: Stmt,
  parenR: Token,
  body: Stmt
): ForStmt {
  return {
    tag: "for",
    name: name.text,
    initialExpr: initialExpr,
    condition: condition,
    update: update,
    body: body
  }
}
