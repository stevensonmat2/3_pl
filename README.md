# CS 320, Summer 2022

# Assignment 3

Before we dig deeper into the other *phases* of our interpreter, we'll build our toy language into slightly more of a "programming language". To be specific, our language will become an *imperative* language.

In this assignment, we'll expand our language to include multiple *types* of data, and we'll add several different *statement* forms. We'll still be using the same code patterns from previous assignments, but at a somewhat larger scale and with more details to consider.

In order to support our growing language, we will see some new ways of structuring our existing TypeScript code patterns to reduce code duplication a little. This will involve a discussion of a couple new features of TypeScript's *type system*, foreshadowing our discussion of *static analysis* in the next assignment. Later in this course, we will also explore how *object-oriented programming* and *functional programming* can each offer potentially better ways to organize our code.

The overall goal of this assignment is to explore the structure of a slightly more realistic programming language than before, and specifically to explore the topic of *scope* and *control flow* in some depth.

Pay close attention to the similarities and differences between our toy language and various "real-world" programming languages: these exercises have you implementing some interpreter execution code, but the real goal is to clarify and deepen your understanding of how imperative features work in any programming language. One of the best things about an interpreter is that if you know how to read the interpreter code, then the code itself **explains** how the language works.

Since you'll be typing whole programs into the text boxes on the assignment page now, I recommend that you **save your code in an external editor** while you're testing your work on the assignment page. Refreshing your browser may sometimes delete the code that you've typed into the page. If you get sick of copying the code into your browser each time, try writing an automated test!

## Getting help

Before you ask a question, **re-read the comments in the part of the assignment that you're having trouble with**, and see if there's anything in the comments that isn't making sense to you. If you can point to a specific part of the text that you're confused about, it's much easier for me to help you!

## Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/assignment-3-cs-320-summer-2022/-/archive/main/assignment-3-cs-320-summer-2022-main.zip>.

If you're using macOS or a GUI file manager on Linux, make sure to turn on the "show hidden files" setting in your file manager when you extract the zip archive. There should be a folder called ".vscode" in the archive, which will be invisible in your file manager by default because its name begins with a dot.

In VSCode, open the "File" menu and click "Open Folder..." if that option is there; otherwise click "Open". Either way, you should open the **folder** that you just extracted: the folder that contains `README.md`, `package.json`, etc. This is important: **open the folder itself**, not any file **in** the folder. This is how VSCode knows where to find the project settings.

Alternatively, if you're working in a command line, navigate to this same folder in your terminal.

## Installing the dependencies, building, running, testing, submitting

This project is set up the same way as assignment 1, and all of the assignments in this course will have this same project structure.

Remember to run the `npm i` command once in the project folder before starting your work. This needs to be done once for each assignment.

Building, running, testing, and debugging the code works the same way as in assignment 1. Make sure to review the assignment 1 README if you need to.

Each assignment in this course will have you reading through comments in the `src/Main.ts` file. **After reading the rest of this README**, open that file to start the assignment.

The `src/Library.ts` file from assignment 1 has become the `src/Library` folder, but it still serves the same purpose. You're not expected to read or understand this code, and you shouldn't modify it, but you're welcome to ask about it if you're curious!

When you're finished with your code, submit it to the assignment 3 dropbox on Canvas with the same submission instructions as in assignment 1. The soft deadline for this assignment is listed on its Canvas dropbox page.

## Code requirements

The general code requirements that you're expected to follow are also the same as in assignment 1. Make sure to review the assignment 1 README if you need to!

## The webpage

The webpage for this assignment has two distinct components:

### Syntax analysis

In the *syntax analysis* section, you can type in the source code of a program in our toy language and get back a visual representation of the AST that your program corresponds to.

This work is done by the syntax analysis *phase* of the interpreter, which we'll explore in depth in assignment 4.

### Execution

In the *execution* section, you can type in the source code of a program in our toy language and see the results of running the program.

This work is done by the execution *phase* of the interpreter, which we'll be exploring in this assignment.

## The language

Our toy language has grown, so it deserves a new introduction from the ground up.

### Variables

The rules for variable names are the same as before: one uppercase or lowercase letter, followed by any combination of letters, digits, and underscores. Most of the presented examples will use single-letter variable names for convenience, but variable names can be **any length**.

### Values

Our language now supports two *types* of data *values*: floating-point numbers and booleans.

#### Floating-point numbers

Floating-point numbers are written like in assignment 2 (the same way you would most likely expect them to be written).

Keep in mind that floating-point arithmetic sometimes produces weird results: for example, `1 / 0` will evaluate to `Infinity`. There will also be rounding errors with some fractional numbers, and overflow/underflow behavior with very large or small numbers. These behaviors are all "correct" by the rules of floating-point arithmetic ([IEEE 754](https://en.wikipedia.org/wiki/IEEE_754)), even though they're very different from how we usually expect "numbers" to work in traditional arithmetic.

#### Booleans

Boolean values are written `true` and `false`, **always lowercase**. These are not valid variable names in the language.

### Expressions

Just like before, our language has *expressions*. Remember: an *expression* is a piece of code that produces a *value* when we interpret it.

Below is a list of **all of** the expression forms we have now - if something is not on this list, then it's not supported in this language.

This list also specifies the order of operations: the NOT operator in the list "comes first" when combining operators without parentheses. In each entry, the `e` names represent **any *expression***, not just any *variable* or *value*.

- logical NOT: `! e1`
- negation: `- e1`
- exponentiation: `e1 ^ e2`
- multiplication: `e1 * e2`, division: `e1 / e2`
- addition: `e1 + e2`, subtraction: `e1 - e2`
- less-than comparison: `e1 < e2`
- equality comparison: `e1 == e2`
- logical AND: `e1 && e2`
- logical OR: `e1 || e2`
- conditional: `e1 ? e2 : e3` (unimplemented)

The entry marked "(unimplemented)" will not work completely until you finish the corresponding exercise.

All of these operators should be familiar to you, except for possibly the *conditional operator*, also sometimes known as "the ternary operator".

(If you're familiar with Python, `e1 ? e2 : e3` is written `e2 if e1 else e3` in Python. Note the difference in the operand order!)

The *conditional operator* expects its first operand to evaluate to a boolean value, and uses it to choose **one** of the other operands to evaluate. The second operand is the "true" case and the third operand is the "false" case. For example, `1 + 1 == 2 ? 10 : 20` evaluates to `10`, and `1 + 1 == 3 ? 10 : 20` evaluates to `20`.

### Statements

Our language has several new features that take the form of *statements*. A *statement* is a piece of code that executes to produce some *side effect*: it **does not have a *value***, but instead produces some other kind of observable change in the *state* of the program.

Below is a list of **all of** the types of statements we have now - if something is not on this list, then it's not supported in this language.

In each entry , the `x` names represent *variable names*, the `e` names represent any *expression*, and the `s` names represent any *statement*.

- variable declaration: `declare x = e;`
- variable update: `x = e;`
- print: `print e;`
- assert: `assert e;` (unimplemented)
- block: `{ s1; s2; ... }` (may have any number of substatements, including zero)
- if: `if (e) s1`, `if (e) s1 else s2`
- for: `for (x = e1; e2; s1) s2` (unimplemented)

The entries marked "(unimplemented)" will not work completely until you finish the corresponding exercises.

Keep in mind that the input ont he assignment webpage expects a **single** statement, so if you want to run more than one statement, you have to wrap them all in a *block* statement. For example, `declare x = 1; print x;` (**two statements**) is an invalid input, but `{ declare x = 1; print x; }` (**one statement with two substatements**) is valid.

Whitespace is completely ignored by the language, so you can use spaces, tabs, and newlines to format your code in any style you want.

Some of the statement forms in this language may **behave slightly differently than you might expect**. Try out sample programs in the interpreter on the assignment webpage to get a feel for how they work. Here we'll cover the main points that might be non-obvious.

#### Scope

Recall the concept of *variable scope* from previous courses: a variable's scope is the part of the program it can be used in.

Our toy language now has the feature of *block scoping*. In general, this means that **a variable is only usable in the same AST subtree as its declaration**. Every use of a variable must also come after its declaration, in the array of sub-statements within a block statement.

This is the same way local variables work in nearly all modern languages. Don't let your existing intuition take over in this assignment, though: the point is to focus on the **precise details** of block scoping, which may be slightly different than you intuitively expect in some cases.

For example, consider this nested block statement written as source code in our toy language:

```
{
  declare x = 1;
  for (y = x; y < 10; y = y + x) {
    declare z = x + y;
    print x * z;
  }
  print x;
}
```

You can see a visual rendering of the AST for this program by pasting the source code into the syntax analysis section of the webpage.

In **TypeScript** code, the AST for this program is an object that looks like this:

```
{
  tag: "block",
  blockStmts: [
    {
      tag: "varDecl",
      name: "x",
      initialExpr: { tag: "num", value: 1 }
    },
    {
      tag: "for",
      name: "y",
      initialExpr: { tag: "var", name: "x" },
      condition: {
        tag: "lessThan",
        leftSubexpr: { tag: "var", name: "y" },
        rightSubexpr: { tag: "num", value: 10 }
      },
      update: {
        tag: "varUpdate",
        name: "y",
        newExpr: {
          tag: "plus",
          leftSubexpr: { tag: "var", name: "y" }
          rightSubexpr: { tag: "var", name: "x" }
        },
        body: {
          tag: "block",
          blockStmts: [
            {
              tag: "varDecl",
              name: "z",
              initialExpr: {
                tag: "plus",
                leftSubexpr: { tag: "var", name: "x" },
                rightSubexpr: { tag: "var", name: "y" }
              }
            },
            {
              tag: "print",
              printExpr: {
                tag: "times",
                leftSubexpr: { tag: "var", name: "x" },
                rightSubexpr: { tag: "var", name: "z" }
              }
            }
          ]
        }
      }
    },
    {
      tag: "print",
      printExpr: { tag: "var", name: "x" }
    }
  ]
}
```

Notice how the TypeScript code for the AST represents the same nested tree structure as the visual rendering that you can see on the webpage.

It is valid to use `x` in `for (y = x, ...)`, because the `varDecl(x)` node has the same parent block statement as the `for(y)` node, and the `for(y)` node comes **after** the `varDecl(x)` node: it appears to the right in the visual rendering of the tree, and it appears at a later index in the `blockStmts` array in the TypeScript AST object.

It is valid to use `y` in `declare z = x + y`, because the `varDecl(z)` node is a child of the `for(y)` node which declares `y`.

It is valid to use `x` in `print x`, because the `varDecl(x)` node has the same parent block statement node as the `print` node, and the `print` node comes **after** the `varDecl(x)` node.

It would be invalid to use `z` instead of `y` in `for (..., y < 10, ...)`, because the `varDecl(z)` node is **deeper than** the `lessThan` node in the tree.

It would be invalid to switch the order of the lines `declare z = x + y` and `x = x * z`, because then the `varDecl(z)` node would come **before** the `varUpdate(x)` node.

It would be invalid to use `z` instead of `x` in `print x`, because the `varDecl(z)` node is **deeper than** the `print` node in the tree.

It would also be invalid to use `y` instead of `x` in `print x`, which is explained below in the section covering `for` loops.

#### Variable statements

Variables must be *declared* before they may be *used* or *updated*. It is a *runtime scope error* to attempt to use or update a variable that has not been declared, or to declare a variable that has already been declared.

For example, `{ declare x = 1; print y; }`, `{ declare x = 1; y = 2 }`, and `{ declare x = 1; declare x = 2 }` will all produce runtime errors (if `y` is not defined in an outer block).

#### Assertion statements

An *assertion* evaluates its *condition* expression, which is expected to produce a boolean *value*, and throws a runtime error if the value is false or does nothing if the value is true.

If the value is not a boolean, a *runtime type error* is thrown.

#### Block statements

A *block statement* executes each of its substatements in order. When the block statement ends, **variables that were declared in the block *go out of scope***.

For example, `{ declare x = 1; print x; }` is valid, but `{ { declare x = 1; print x; }; print x; }` will print `1` once and then throw a runtime scope error on the second `print` statement.

#### If statements

An *if statement* has a condition *expression*, which is expected to produce a boolean value, and a *true branch* and an optional *false branch*, which are both *statements*.

The value of the condition expression is used to choose which branch to execute. If the value is `false` and there is no false branch, the if statement does nothing.

If the value is not a boolean, a *runtime type error* is thrown.

#### For statements

In this language, a *for statement* always *declares* a *loop variable*.

The first expression provides the *initial value* of the loop variable, which is set once at the start of the loop.

The second expression is the *termination condition*, which is checked once at the start of each loop iteration.

The first statement is the *update action*, which executes once at the end of each loop iteration.

The second statement is the *body*, which executes once at the start of each loop iteration if the termination condition evaluates to true.

In a for statement, the loop variable is in scope for the entire loop and **goes out of scope when the loop ends**. For example, note that `for (x = 1; x < 10; x = x + 1) print x;` is valid, but `{ declare x = 0; for (x = 1; x < 10; x = x + 1) print x; }` will throw a runtime scope error.

Any variables declared within a for loop *body* go out of scope at the end of **each iteration** of the loop, so that they can be declared again in the next iteration. For example, note that `for (x = 1; x < 10; x = x + 1) { declare y = x; print y; }` is valid instead of throwing a runtime scope error on the second iteration, and `{ for (x = 1; x < 10; x = x + 1) print x; print x; }` is invalid (the second `print` is outside the loop body).

## The code

Our interpreter code has a bit more high-level organization now, so it requires a bit of a guided tour.

You are not expected to read through the code in the `src/SyntaxAnalysis` folder in this assignment. We'll cover those modules in assignment 4.

You're also not expected to read through the code in the `src/Library` folder, which will be true for all assignments.

When you run the build script, it will create both a `build` folder and a `gen` folder. Both of these are compiled output that should not be modified by hand.

First, open the `src/AST.ts` file, which documents the organization of the AST modules. Read through the comments in each individual AST module to understand how our AST structure has grown.

The src/Execution folder is where we're focusing most of our attention this time. Open the `src/Execution.ts` file, which documents the organization of the execution phase code. Read through the comments in each individual execution phase module to understand how our execution code has grown to support our new expression and statement forms.

**After reading through all of this provided code**, open `src/Main.ts` to start the exercises.

## Grading

The first exercise is worth three points, the second exercise is worth seven, and the third exercise is worth ten. You will get partial credit for partially-correct answers, but not for answers that fail to compile.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your functions must work as specified for **all possible inputs** of the correct type, not just for the specific inputs that are tested in the automated tests. The tests also do not check the requirements described in the "Code requirements" section above.
