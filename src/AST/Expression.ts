// The naming of our AST types has changed a little, since we now have both
// *expressions* and *statements* instead of just "nodes" in an AST, but this is
// effectively the same kind of AST type definition that we've been seeing in
// previous assignments.  Expr is short for "expression".
export type Expr =
  PlusExpr | MinusExpr | TimesExpr | DivideExpr | ExponentExpr |
  AndExpr | OrExpr | LessThanExpr | EqualExpr |
  NegateExpr | NotExpr |
  ConditionalExpr |
  NumLeaf | BoolLeaf | VarLeaf;

// The result of evaluating an Expr is either a number or a boolean.
export type Value = number | boolean;


// Since we have so many binary operators, we don't really want to have to type
// out this pattern for each individual node type. We use this BinaryExpr type
// along with the & operator to construct our AST node type definitions for
// binary operator expressions.
export type BinaryExpr = {
  readonly leftSubexpr: Expr;
  readonly rightSubexpr: Expr;
};

// Similarly, we have a couple unary operators, so we have an opportunity to
// reduce code duplication in their definitions.
export type UnaryExpr = {
  readonly subexpr: Expr;
};


// Our AST node type definitions for binary and unary expressions now become
// very concise. Make sure you can see how these definitions have the same
// meaning as the corresponding similar definitions in assignment 2, they just
// use a lot less space.
export type PlusExpr = { readonly tag: "plus" } & BinaryExpr;
export type MinusExpr = { readonly tag: "minus" } & BinaryExpr;
export type TimesExpr = { readonly tag: "times" } & BinaryExpr;
export type DivideExpr = { readonly tag: "divide" } & BinaryExpr;
export type ExponentExpr = { readonly tag: "exponent" } & BinaryExpr;
export type AndExpr = { readonly tag: "and" } & BinaryExpr;
export type OrExpr = { readonly tag: "or" } & BinaryExpr;
export type LessThanExpr = { readonly tag: "lessThan" } & BinaryExpr;
export type EqualExpr = { readonly tag: "equal" } & BinaryExpr;
export type NegateExpr = { readonly tag: "negate" } & UnaryExpr;
export type NotExpr = { readonly tag: "not" } & UnaryExpr;

// We have one type of leaf for each type of value, and one more leaf type for
// variable uses, as in assignment 2.
export type NumLeaf = { readonly tag: "num", readonly value: number };
export type BoolLeaf = { readonly tag: "bool", readonly value: boolean };
export type VarLeaf = { readonly tag: "var", readonly name: string };

// The conditional expression is syntactically special: it is our only
// *ternary* operator. It is sometimes referred to as "the ternary operator",
// but the word *ternary* literally just means that it has three operands, and
// there are also other "ternary operators" in the broader world of programming
// languages. If we had more than one ternary operator in our language, we would
// benefit from defining a TernaryExpr type, but since we just have this one, we
// don't bother with it.
export type ConditionalExpr = {
  readonly tag: "conditional";
  readonly condition: Expr;
  readonly trueExpr: Expr;
  readonly falseExpr: Expr;
};