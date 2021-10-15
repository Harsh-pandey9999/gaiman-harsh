(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.gaiman = factory());
})(this, (function () { 'use strict';

  function peg$subclass(child, parent) {
    function C() { this.constructor = child; }
    C.prototype = parent.prototype;
    child.prototype = new C();
  }

  function peg$SyntaxError(message, expected, found, location) {
    var self = Error.call(this, message);
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(self, peg$SyntaxError.prototype);
    }
    self.expected = expected;
    self.found = found;
    self.location = location;
    self.name = "SyntaxError";
    return self;
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$padEnd(str, targetLength, padString) {
    padString = padString || " ";
    if (str.length > targetLength) { return str; }
    targetLength -= str.length;
    padString += padString.repeat(targetLength);
    return str + padString.slice(0, targetLength);
  }

  peg$SyntaxError.prototype.format = function(sources) {
    var str = "Error: " + this.message;
    if (this.location) {
      var src = null;
      var k;
      for (k = 0; k < sources.length; k++) {
        if (sources[k].source === this.location.source) {
          src = sources[k].text.split(/\r\n|\n|\r/g);
          break;
        }
      }
      var s = this.location.start;
      var loc = this.location.source + ":" + s.line + ":" + s.column;
      if (src) {
        var e = this.location.end;
        var filler = peg$padEnd("", s.line.toString().length);
        var line = src[s.line - 1];
        var last = s.line === e.line ? e.column : line.length + 1;
        str += "\n --> " + loc + "\n"
            + filler + " |\n"
            + s.line + " | " + line + "\n"
            + filler + " | " + peg$padEnd("", s.column - 1)
            + peg$padEnd("", last - s.column, "^");
      } else {
        str += "\n at " + loc;
      }
    }
    return str;
  };

  peg$SyntaxError.buildMessage = function(expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
      literal: function(expectation) {
        return "\"" + literalEscape(expectation.text) + "\"";
      },

      class: function(expectation) {
        var escapedParts = expectation.parts.map(function(part) {
          return Array.isArray(part)
            ? classEscape(part[0]) + "-" + classEscape(part[1])
            : classEscape(part);
        });

        return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
      },

      any: function() {
        return "any character";
      },

      end: function() {
        return "end of input";
      },

      other: function(expectation) {
        return expectation.description;
      }
    };

    function hex(ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s) {
      return s
        .replace(/\\/g, "\\\\")
        .replace(/"/g,  "\\\"")
        .replace(/\0/g, "\\0")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/[\x00-\x0F]/g,          function(ch) { return "\\x0" + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return "\\x"  + hex(ch); });
    }

    function classEscape(s) {
      return s
        .replace(/\\/g, "\\\\")
        .replace(/\]/g, "\\]")
        .replace(/\^/g, "\\^")
        .replace(/-/g,  "\\-")
        .replace(/\0/g, "\\0")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/[\x00-\x0F]/g,          function(ch) { return "\\x0" + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return "\\x"  + hex(ch); });
    }

    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
      var descriptions = expected.map(describeExpectation);
      var i, j;

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found) {
      return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  };

  function peg$parse(input, options) {
    options = options !== undefined ? options : {};

    var peg$FAILED = {};
    var peg$source = options.grammarSource;

    var peg$startRuleFunctions = { Start: peg$parseStart };
    var peg$startRuleFunction = peg$parseStart;

    var peg$c0 = "end";
    var peg$c1 = "if";
    var peg$c2 = "then";
    var peg$c3 = "else";
    var peg$c4 = "(";
    var peg$c5 = ",";
    var peg$c6 = ")";
    var peg$c7 = "def";
    var peg$c8 = "return";
    var peg$c9 = "let";
    var peg$c10 = "=";
    var peg$c11 = "\"";
    var peg$c12 = "\\\\\"";
    var peg$c13 = "true";
    var peg$c14 = "false";
    var peg$c15 = "get";
    var peg$c16 = "post";
    var peg$c17 = "ask";
    var peg$c18 = "echo";
    var peg$c19 = " ";
    var peg$c20 = "~=";
    var peg$c24 = "/";
    var peg$c25 = "\\\\/";
    var peg$c26 = ".";
    var peg$c27 = "+";
    var peg$c28 = "-";
    var peg$c29 = "*";
    var peg$c30 = "cookie";
    var peg$c31 = "location";
    var peg$c32 = "argv";
    var peg$c33 = "node";
    var peg$c34 = "cookie.";
    var peg$c35 = "$";
    var peg$c36 = "<<<";
    var peg$c37 = "\n";
    var peg$c38 = "#";

    var peg$r0 = /^[^"]/;
    var peg$r1 = /^[^\/]/;
    var peg$r2 = /^[igsu]/;
    var peg$r3 = /^[^\n]/;
    var peg$r4 = /^[0-9]/;
    var peg$r5 = /^[A-Z_$a-z]/;
    var peg$r6 = /^[A-Z_a-z0-9]/;
    var peg$r7 = /^[ \t\n\r]/;

    var peg$e0 = peg$literalExpectation("end", false);
    var peg$e1 = peg$literalExpectation("if", false);
    var peg$e2 = peg$literalExpectation("then", false);
    var peg$e3 = peg$literalExpectation("else", false);
    var peg$e4 = peg$literalExpectation("(", false);
    var peg$e5 = peg$literalExpectation(",", false);
    var peg$e6 = peg$literalExpectation(")", false);
    var peg$e7 = peg$literalExpectation("def", false);
    var peg$e8 = peg$literalExpectation("return", false);
    var peg$e9 = peg$literalExpectation("let", false);
    var peg$e10 = peg$literalExpectation("=", false);
    var peg$e11 = peg$literalExpectation("\"", false);
    var peg$e12 = peg$classExpectation(["\""], true, false);
    var peg$e13 = peg$literalExpectation("\\\\\"", false);
    var peg$e14 = peg$literalExpectation("true", false);
    var peg$e15 = peg$literalExpectation("false", false);
    var peg$e16 = peg$literalExpectation("get", false);
    var peg$e17 = peg$literalExpectation("post", false);
    var peg$e18 = peg$literalExpectation("ask", false);
    var peg$e19 = peg$literalExpectation("echo", false);
    var peg$e20 = peg$literalExpectation(" ", false);
    var peg$e21 = peg$literalExpectation("~=", false);
    var peg$e25 = peg$literalExpectation("/", false);
    var peg$e26 = peg$classExpectation(["/"], true, false);
    var peg$e27 = peg$literalExpectation("\\\\/", false);
    var peg$e28 = peg$classExpectation(["i", "g", "s", "u"], false, false);
    var peg$e29 = peg$literalExpectation(".", false);
    var peg$e30 = peg$literalExpectation("+", false);
    var peg$e31 = peg$literalExpectation("-", false);
    var peg$e32 = peg$literalExpectation("*", false);
    var peg$e33 = peg$literalExpectation("cookie", false);
    var peg$e34 = peg$literalExpectation("location", false);
    var peg$e35 = peg$literalExpectation("argv", false);
    var peg$e36 = peg$literalExpectation("node", false);
    var peg$e37 = peg$literalExpectation("cookie.", false);
    var peg$e38 = peg$literalExpectation("$", false);
    var peg$e39 = peg$literalExpectation("<<<", false);
    var peg$e40 = peg$literalExpectation("\n", false);
    var peg$e41 = peg$anyExpectation();
    var peg$e42 = peg$otherExpectation("Marker");
    var peg$e43 = peg$literalExpectation("#", false);
    var peg$e44 = peg$classExpectation(["\n"], true, false);
    var peg$e45 = peg$classExpectation([["0", "9"]], false, false);
    var peg$e46 = peg$classExpectation([["A", "Z"], "_", "$", ["a", "z"]], false, false);
    var peg$e47 = peg$classExpectation([["A", "Z"], "_", ["a", "z"], ["0", "9"]], false, false);
    var peg$e48 = peg$otherExpectation("whitespace");
    var peg$e49 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false);

    var peg$f0 = function(statements) {
        return {
            "type": "Program",
            "body": [{
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "FunctionExpression",
                        "id": null,
                        "async": true,
                        "params": [],
                        "body": {
                            "type": "BlockStatement",
                            "body": statements[2].filter(Boolean)
                        }
                    },
                    "arguments": []
                }
            }]
        };
    };
    var peg$f1 = function(statement) {
       return statement;
    };
    var peg$f2 = function(expression) {
        return  {
          "type": "ExpressionStatement",
          "expression": expression
        };
    };
    var peg$f3 = function(expr) {
        return expr;
    };
    var peg$f4 = function() { return null; };
    var peg$f5 = function(cond, body, next) {
      return make_if(cond, body.filter(Boolean), next);
    };
    var peg$f6 = function(if_next) {
        return if_next;
    };
    var peg$f7 = function(body) {
        return {
            "type": "BlockStatement",
            "body": body.filter(Boolean)
        };
    };
    var peg$f8 = function(name, names) {
        return {
            "type": "AwaitExpression",
            "argument": call(name, ...names.map(name => name[0]))
        };
    };
    var peg$f9 = function(name, args, body) {
        const fn_name = name.name.replace(/\$_/, '');
        if (["echo", "ask", "get"].includes(fn_name)) {
            const error = new Error(`invalid function name, '${fn_name}' is reseved command`);
            error.location = move_location(location(), 4, fn_name.length + 1);
            throw error;
        }
        var args = args.map(function(arg) { return arg[0]; });
        return {
            "type": "FunctionDeclaration",
            "id": name,
            "params": args,
            "async": true,
            "body": {
                "type": "BlockStatement",
                "body": body
            }
        };
    };
    var peg$f10 = function(expression) {
        return {
            "type": "ReturnStatement",
            "argument": expression
        };
    };
    var peg$f11 = function(name, expression) {
        return {
            "type": "VariableDeclaration",
            "declarations": [{
                "type": "VariableDeclarator",
                "id": name,
                "init": expression
            }],
            "kind": "let"
        };
    };
    var peg$f12 = function() {  // "
      return create_template_literal(JSON.parse(text()));
    };
    var peg$f13 = function(value) {
       return {"type": "Literal", "value": value };
    };
    var peg$f14 = function(value) {
        return value === "true";
    };
    var peg$f15 = function(expression) {
        return expression;
    };
    var peg$f16 = function(command) {
        return command;
    };
    var peg$f17 = function() { return text(); };
    var peg$f18 = function(method, expr) {
        return  {
            "type": "AwaitExpression",
            "argument": call(property(make_identifier("term"),
                                      make_identifier(method)), expr)
        };
    };
    var peg$f19 = function(method, expr) {
        return  call(property(make_identifier("term"), make_identifier(method)), expr);
    };
    var peg$f20 = function(expression, re) {
        return {
            type: "AssignmentExpression",
            operator: "=",
            left: match_identifer,
            right: call(property(call(make_identifier('String'), expression), match_method), re)
        };
    };
    var peg$f23 = function(re, flags) {
        return {
            type: "Literal",
            value: {},
            regex: {
                pattern: re.join(''),
                flags: flags ? flags.join('') : ''
            }
        }
    };
    var peg$f24 = function(struct, rest) {
        rest = rest.map(arg => arg[1]);
        return property(struct, ...rest.map(make_identifier));
    };
    var peg$f25 = function(head, tail) {
          return tail.reduce(function(result, element) {
              return {
                "type": "BinaryExpression",
                "operator": element[1],
                "left": result,
                "right": element[3]
              };
          }, head);
        };
    var peg$f26 = function(expr) { return expr; };
    var peg$f27 = function(variable) {
      return make_identifier(variable_prefix + variable);
    };
    var peg$f28 = function(variable) {
        return make_identifier(variable);
    };
    var peg$f29 = function(name, expr) {
        return {
            "type": "AssignmentExpression",
            "operator": "=",
            "left": property(
                make_identifier('document'),
                make_identifier('cookie')
            ),
            "right": {
                "type": "BinaryExpression",
                "operator": "+",
                "left": {
                    "type": "Literal",
                    "value": name + "="
                },
                "right": call(make_identifier('String'), expr)
            }
        };
    };
    var peg$f30 = function(left, right) {
        return {
            "type": "AssignmentExpression",
            "operator": "=",
            "left": left,
            "right": right
        };
    };
    var peg$f31 = function(num) {
        return {
            type: "MemberExpression",
            computed: true,
            object: match_identifer,
            property: {
                type: "Literal",
                value: num
            }
        };
    };
    var peg$f32 = function(text) {
        const loc = location();
        const min = loc.start.column - 1;
        const re = new RegExp(`^ {${min}}`, 'mg');
        return {
            type: 'Literal',
            value: text.replace(re, '')
        };
    };
    var peg$f33 = function(m) { heredoc_begin = m; };
    var peg$f34 = function(end) { return heredoc_begin === end; };
    var peg$f35 = function() { return parseInt(text(), 10); };
    var peg$f36 = function() { return []; };

    var peg$currPos = 0;
    var peg$savedPos = 0;
    var peg$posDetailsCache = [{ line: 1, column: 1 }];
    var peg$maxFailPos = 0;
    var peg$maxFailExpected = [];
    var peg$silentFails = 0;

    var peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function peg$literalExpectation(text, ignoreCase) {
      return { type: "literal", text: text, ignoreCase: ignoreCase };
    }

    function peg$classExpectation(parts, inverted, ignoreCase) {
      return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }

    function peg$anyExpectation() {
      return { type: "any" };
    }

    function peg$endExpectation() {
      return { type: "end" };
    }

    function peg$otherExpectation(description) {
      return { type: "other", description: description };
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos];
      var p;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line: details.line,
          column: details.column
        };

        while (p < pos) {
          if (input.charCodeAt(p) === 10) {
            details.line++;
            details.column = 1;
          } else {
            details.column++;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;

        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos);
      var endPosDetails = peg$computePosDetails(endPos);

      return {
        source: peg$source,
        start: {
          offset: startPos,
          line: startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line: endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildStructuredError(expected, found, location) {
      return new peg$SyntaxError(
        peg$SyntaxError.buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parseStart() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$currPos;
      peg$silentFails++;
      if (input.substr(peg$currPos, 3) === peg$c0) {
        s3 = peg$c0;
        peg$currPos += 3;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e0); }
      }
      peg$silentFails--;
      if (s3 === peg$FAILED) {
        s2 = undefined;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        s4 = [];
        s5 = peg$parsestatement();
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parsestatement();
        }
        s2 = [s2, s3, s4];
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 === peg$FAILED) {
        s1 = peg$parse_();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f0(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsestatement() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (input.substr(peg$currPos, 3) === peg$c0) {
        s2 = peg$c0;
        peg$currPos += 3;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e0); }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = undefined;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        s3 = peg$parsecomment();
        if (s3 === peg$FAILED) {
          s3 = peg$parseif();
          if (s3 === peg$FAILED) {
            s3 = peg$parsereturn();
            if (s3 === peg$FAILED) {
              s3 = peg$parseexpression_statement();
              if (s3 === peg$FAILED) {
                s3 = peg$parsefunction_definition();
              }
            }
          }
        }
        if (s3 !== peg$FAILED) {
          peg$parse_();
          peg$savedPos = s0;
          s0 = peg$f1(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseexpression_statement() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$parsekeyword();
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = undefined;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseexpression_like();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f2(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseexpression_like() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseset();
      if (s1 === peg$FAILED) {
        s1 = peg$parsecommand();
        if (s1 === peg$FAILED) {
          s1 = peg$parseexpression();
          if (s1 === peg$FAILED) {
            s1 = peg$parsefunction_call();
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f3(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseend() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c0) {
        s1 = peg$c0;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e0); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f4();
      }
      s0 = s1;

      return s0;
    }

    function peg$parseif() {
      var s0, s2, s4, s6, s8, s9;

      s0 = peg$currPos;
      peg$parse_();
      if (input.substr(peg$currPos, 2) === peg$c1) {
        s2 = peg$c1;
        peg$currPos += 2;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e1); }
      }
      if (s2 !== peg$FAILED) {
        peg$parse_();
        s4 = peg$parseexpression_like();
        if (s4 !== peg$FAILED) {
          peg$parse_();
          if (input.substr(peg$currPos, 4) === peg$c2) {
            s6 = peg$c2;
            peg$currPos += 4;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e2); }
          }
          if (s6 !== peg$FAILED) {
            peg$parse_();
            s8 = [];
            s9 = peg$parsestatement();
            while (s9 !== peg$FAILED) {
              s8.push(s9);
              s9 = peg$parsestatement();
            }
            s9 = peg$parseend();
            if (s9 === peg$FAILED) {
              s9 = peg$parseif_next();
              if (s9 === peg$FAILED) {
                s9 = peg$parselast_else();
              }
            }
            if (s9 !== peg$FAILED) {
              peg$parse_();
              peg$savedPos = s0;
              s0 = peg$f5(s4, s8, s9);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseif_next() {
      var s0, s2, s4;

      s0 = peg$currPos;
      peg$parse_();
      if (input.substr(peg$currPos, 4) === peg$c3) {
        s2 = peg$c3;
        peg$currPos += 4;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e3); }
      }
      if (s2 !== peg$FAILED) {
        peg$parse_();
        s4 = peg$parseif();
        if (s4 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f6(s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parselast_else() {
      var s0, s2, s4, s5;

      s0 = peg$currPos;
      peg$parse_();
      if (input.substr(peg$currPos, 4) === peg$c3) {
        s2 = peg$c3;
        peg$currPos += 4;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e3); }
      }
      if (s2 !== peg$FAILED) {
        peg$parse_();
        s4 = [];
        s5 = peg$parsestatement();
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parsestatement();
        }
        if (input.substr(peg$currPos, 3) === peg$c0) {
          s5 = peg$c0;
          peg$currPos += 3;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e0); }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f7(s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsefunction_call() {
      var s0, s2, s3, s5, s6, s7, s8, s9, s10, s11;

      s0 = peg$currPos;
      peg$parse_();
      s2 = peg$currPos;
      peg$silentFails++;
      s3 = peg$parsekeyword();
      peg$silentFails--;
      if (s3 === peg$FAILED) {
        s2 = undefined;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsevariable();
        if (s3 !== peg$FAILED) {
          peg$parse_();
          if (input.charCodeAt(peg$currPos) === 40) {
            s5 = peg$c4;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e4); }
          }
          if (s5 !== peg$FAILED) {
            s6 = [];
            s7 = peg$currPos;
            s8 = peg$parseexpression_like();
            if (s8 === peg$FAILED) {
              s8 = peg$parsevariable();
            }
            if (s8 !== peg$FAILED) {
              s9 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 44) {
                s10 = peg$c5;
                peg$currPos++;
              } else {
                s10 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e5); }
              }
              if (s10 === peg$FAILED) {
                s10 = null;
              }
              s11 = peg$parse_();
              s8 = [s8, s9, s10, s11];
              s7 = s8;
            } else {
              peg$currPos = s7;
              s7 = peg$FAILED;
            }
            while (s7 !== peg$FAILED) {
              s6.push(s7);
              s7 = peg$currPos;
              s8 = peg$parseexpression_like();
              if (s8 === peg$FAILED) {
                s8 = peg$parsevariable();
              }
              if (s8 !== peg$FAILED) {
                s9 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 44) {
                  s10 = peg$c5;
                  peg$currPos++;
                } else {
                  s10 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e5); }
                }
                if (s10 === peg$FAILED) {
                  s10 = null;
                }
                s11 = peg$parse_();
                s8 = [s8, s9, s10, s11];
                s7 = s8;
              } else {
                peg$currPos = s7;
                s7 = peg$FAILED;
              }
            }
            if (input.charCodeAt(peg$currPos) === 41) {
              s7 = peg$c6;
              peg$currPos++;
            } else {
              s7 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e6); }
            }
            if (s7 !== peg$FAILED) {
              s8 = peg$parse_();
              peg$savedPos = s0;
              s0 = peg$f8(s3, s6);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsefunction_definition() {
      var s0, s2, s4, s6, s7, s8, s9, s10, s11, s12;

      s0 = peg$currPos;
      peg$parse_();
      if (input.substr(peg$currPos, 3) === peg$c7) {
        s2 = peg$c7;
        peg$currPos += 3;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s2 !== peg$FAILED) {
        peg$parse_();
        s4 = peg$parsevariable();
        if (s4 !== peg$FAILED) {
          peg$parse_();
          if (input.charCodeAt(peg$currPos) === 40) {
            s6 = peg$c4;
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e4); }
          }
          if (s6 !== peg$FAILED) {
            s7 = [];
            s8 = peg$currPos;
            s9 = peg$parsevariable();
            if (s9 !== peg$FAILED) {
              s10 = peg$parse_();
              if (input.charCodeAt(peg$currPos) === 44) {
                s11 = peg$c5;
                peg$currPos++;
              } else {
                s11 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e5); }
              }
              if (s11 === peg$FAILED) {
                s11 = null;
              }
              s12 = peg$parse_();
              s9 = [s9, s10, s11, s12];
              s8 = s9;
            } else {
              peg$currPos = s8;
              s8 = peg$FAILED;
            }
            while (s8 !== peg$FAILED) {
              s7.push(s8);
              s8 = peg$currPos;
              s9 = peg$parsevariable();
              if (s9 !== peg$FAILED) {
                s10 = peg$parse_();
                if (input.charCodeAt(peg$currPos) === 44) {
                  s11 = peg$c5;
                  peg$currPos++;
                } else {
                  s11 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e5); }
                }
                if (s11 === peg$FAILED) {
                  s11 = null;
                }
                s12 = peg$parse_();
                s9 = [s9, s10, s11, s12];
                s8 = s9;
              } else {
                peg$currPos = s8;
                s8 = peg$FAILED;
              }
            }
            if (input.charCodeAt(peg$currPos) === 41) {
              s8 = peg$c6;
              peg$currPos++;
            } else {
              s8 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e6); }
            }
            if (s8 !== peg$FAILED) {
              s9 = peg$parse_();
              s10 = [];
              s11 = peg$parsestatement();
              while (s11 !== peg$FAILED) {
                s10.push(s11);
                s11 = peg$parsestatement();
              }
              s11 = peg$parse_();
              if (input.substr(peg$currPos, 3) === peg$c0) {
                s12 = peg$c0;
                peg$currPos += 3;
              } else {
                s12 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e0); }
              }
              if (s12 !== peg$FAILED) {
                peg$parse_();
                peg$savedPos = s0;
                s0 = peg$f9(s4, s7, s10);
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsereturn() {
      var s0, s2, s4;

      s0 = peg$currPos;
      peg$parse_();
      if (input.substr(peg$currPos, 6) === peg$c8) {
        s2 = peg$c8;
        peg$currPos += 6;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e8); }
      }
      if (s2 !== peg$FAILED) {
        peg$parse_();
        s4 = peg$parseexpression_like();
        if (s4 !== peg$FAILED) {
          peg$parse_();
          peg$savedPos = s0;
          s0 = peg$f10(s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsevar() {
      var s0, s2, s4, s6, s8;

      s0 = peg$currPos;
      peg$parse_();
      if (input.substr(peg$currPos, 3) === peg$c9) {
        s2 = peg$c9;
        peg$currPos += 3;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e9); }
      }
      if (s2 !== peg$FAILED) {
        peg$parse_();
        s4 = peg$parsevariable();
        if (s4 !== peg$FAILED) {
          peg$parse_();
          if (input.charCodeAt(peg$currPos) === 61) {
            s6 = peg$c10;
            peg$currPos++;
          } else {
            s6 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e10); }
          }
          if (s6 !== peg$FAILED) {
            peg$parse_();
            s8 = peg$parseexpression_like();
            if (s8 !== peg$FAILED) {
              peg$parse_();
              peg$savedPos = s0;
              s0 = peg$f11(s4, s8);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsestring() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c11;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e11); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$r0.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e12); }
        }
        if (s3 === peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c12) {
            s3 = peg$c12;
            peg$currPos += 3;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e13); }
          }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$r0.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e12); }
          }
          if (s3 === peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c12) {
              s3 = peg$c12;
              peg$currPos += 3;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e13); }
            }
          }
        }
        if (input.charCodeAt(peg$currPos) === 34) {
          s3 = peg$c11;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e11); }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f12();
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseliteral() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseinteger();
      if (s1 === peg$FAILED) {
        s1 = peg$parseboolean();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f13(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseboolean() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c13) {
        s1 = peg$c13;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e14); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c14) {
          s1 = peg$c14;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e15); }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f14(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseexpression() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseheredoc();
      if (s1 === peg$FAILED) {
        s1 = peg$parseproperty();
        if (s1 === peg$FAILED) {
          s1 = peg$parsearithmetic();
          if (s1 === peg$FAILED) {
            s1 = peg$parsematch_var();
            if (s1 === peg$FAILED) {
              s1 = peg$parsefunction_call();
              if (s1 === peg$FAILED) {
                s1 = peg$parsename();
                if (s1 === peg$FAILED) {
                  s1 = peg$parsestring();
                  if (s1 === peg$FAILED) {
                    s1 = peg$parseliteral();
                  }
                }
              }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f15(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsecommand() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseadapter_command();
      if (s1 === peg$FAILED) {
        s1 = peg$parsematch();
        if (s1 === peg$FAILED) {
          s1 = peg$parsevar();
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f16(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseadapter_async_strings() {
      var s0, s1;

      if (input.substr(peg$currPos, 3) === peg$c15) {
        s0 = peg$c15;
        peg$currPos += 3;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e16); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c16) {
          s0 = peg$c16;
          peg$currPos += 4;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e17); }
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 3) === peg$c17) {
            s1 = peg$c17;
            peg$currPos += 3;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e18); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$f17();
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parseadapter_static_strings() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c18) {
        s1 = peg$c18;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e19); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f17();
      }
      s0 = s1;

      return s0;
    }

    function peg$parseadapter_command() {
      var s0;

      s0 = peg$parseasync_command();
      if (s0 === peg$FAILED) {
        s0 = peg$parsestatic_command();
      }

      return s0;
    }

    function peg$parseasync_command() {
      var s0, s2, s3, s5;

      s0 = peg$currPos;
      peg$parse_();
      s2 = peg$parseadapter_async_strings();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 32) {
          s3 = peg$c19;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e20); }
        }
        if (s3 !== peg$FAILED) {
          peg$parse_();
          s5 = peg$parseadapter_command();
          if (s5 === peg$FAILED) {
            s5 = peg$parseexpression();
          }
          if (s5 !== peg$FAILED) {
            peg$parse_();
            peg$savedPos = s0;
            s0 = peg$f18(s2, s5);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsestatic_command() {
      var s0, s2, s4;

      s0 = peg$currPos;
      peg$parse_();
      s2 = peg$parseadapter_static_strings();
      if (s2 !== peg$FAILED) {
        peg$parse_();
        s4 = peg$parseadapter_command();
        if (s4 === peg$FAILED) {
          s4 = peg$parseexpression();
        }
        if (s4 !== peg$FAILED) {
          peg$parse_();
          peg$savedPos = s0;
          s0 = peg$f19(s2, s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsematch() {
      var s0, s1, s3, s5;

      s0 = peg$currPos;
      s1 = peg$parsematch_var();
      if (s1 === peg$FAILED) {
        s1 = peg$parseproperty();
        if (s1 === peg$FAILED) {
          s1 = peg$parsevariable();
        }
      }
      if (s1 !== peg$FAILED) {
        peg$parse_();
        if (input.substr(peg$currPos, 2) === peg$c20) {
          s3 = peg$c20;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e21); }
        }
        if (s3 !== peg$FAILED) {
          peg$parse_();
          s5 = peg$parsere();
          if (s5 !== peg$FAILED) {
            peg$parse_();
            peg$savedPos = s0;
            s0 = peg$f20(s1, s5);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsere() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 47) {
        s1 = peg$c24;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e25); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$r1.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e26); }
        }
        if (s3 === peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c25) {
            s3 = peg$c25;
            peg$currPos += 3;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e27); }
          }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$r1.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e26); }
          }
          if (s3 === peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c25) {
              s3 = peg$c25;
              peg$currPos += 3;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e27); }
            }
          }
        }
        if (input.charCodeAt(peg$currPos) === 47) {
          s3 = peg$c24;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e25); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          if (peg$r2.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e28); }
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            if (peg$r2.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e28); }
            }
          }
          peg$savedPos = s0;
          s0 = peg$f23(s2, s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseproperty() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsevariable();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s4 = peg$c26;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e29); }
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parsename();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 46) {
              s4 = peg$c26;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e29); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsename();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f24(s1, s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsearithmetic() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseterm();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 43) {
          s5 = peg$c27;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e30); }
        }
        if (s5 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 45) {
            s5 = peg$c28;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e31); }
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseterm();
          if (s7 !== peg$FAILED) {
            s4 = [s4, s5, s6, s7];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 43) {
            s5 = peg$c27;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e30); }
          }
          if (s5 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 45) {
              s5 = peg$c28;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e31); }
            }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            s7 = peg$parseterm();
            if (s7 !== peg$FAILED) {
              s4 = [s4, s5, s6, s7];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        peg$savedPos = s0;
        s0 = peg$f25(s1, s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseterm() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsefactor();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 42) {
          s5 = peg$c29;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e32); }
        }
        if (s5 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 47) {
            s5 = peg$c24;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e25); }
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parsefactor();
          if (s7 !== peg$FAILED) {
            s4 = [s4, s5, s6, s7];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 42) {
            s5 = peg$c29;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e32); }
          }
          if (s5 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 47) {
              s5 = peg$c24;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e25); }
            }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            s7 = peg$parsefactor();
            if (s7 !== peg$FAILED) {
              s4 = [s4, s5, s6, s7];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        peg$savedPos = s0;
        s0 = peg$f25(s1, s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsefactor() {
      var s0, s1, s3, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c4;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e4); }
      }
      if (s1 !== peg$FAILED) {
        peg$parse_();
        s3 = peg$parsearithmetic();
        if (s3 !== peg$FAILED) {
          peg$parse_();
          if (input.charCodeAt(peg$currPos) === 41) {
            s5 = peg$c6;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e6); }
          }
          if (s5 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f26(s3);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parsefunction_call();
        if (s0 === peg$FAILED) {
          s0 = peg$parsestring();
          if (s0 === peg$FAILED) {
            s0 = peg$parseliteral();
            if (s0 === peg$FAILED) {
              s0 = peg$parsematch_var();
              if (s0 === peg$FAILED) {
                s0 = peg$parsevariable();
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsescoped() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$parsekeyword();
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = undefined;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsename();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f27(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseglobal() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$parsekeyword();
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = undefined;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6) === peg$c30) {
          s2 = peg$c30;
          peg$currPos += 6;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e33); }
        }
        if (s2 === peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c31) {
            s2 = peg$c31;
            peg$currPos += 8;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e34); }
          }
          if (s2 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c32) {
              s2 = peg$c32;
              peg$currPos += 4;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e35); }
            }
            if (s2 === peg$FAILED) {
              if (input.substr(peg$currPos, 4) === peg$c33) {
                s2 = peg$c33;
                peg$currPos += 4;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e36); }
              }
            }
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f28(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsevariable() {
      var s0;

      s0 = peg$parseglobal();
      if (s0 === peg$FAILED) {
        s0 = peg$parsescoped();
      }

      return s0;
    }

    function peg$parseset() {
      var s0;

      s0 = peg$parseset_cookie();
      if (s0 === peg$FAILED) {
        s0 = peg$parseset_local();
      }

      return s0;
    }

    function peg$parseset_cookie() {
      var s0, s1, s2, s4, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c34) {
        s1 = peg$c34;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e37); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsename();
        if (s2 !== peg$FAILED) {
          peg$parse_();
          if (input.charCodeAt(peg$currPos) === 61) {
            s4 = peg$c10;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e10); }
          }
          if (s4 !== peg$FAILED) {
            peg$parse_();
            s6 = peg$parseexpression();
            if (s6 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f29(s2, s6);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseset_local() {
      var s0, s1, s3, s5;

      s0 = peg$currPos;
      s1 = peg$parseproperty();
      if (s1 === peg$FAILED) {
        s1 = peg$parsescoped();
      }
      if (s1 !== peg$FAILED) {
        peg$parse_();
        if (input.charCodeAt(peg$currPos) === 61) {
          s3 = peg$c10;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e10); }
        }
        if (s3 !== peg$FAILED) {
          peg$parse_();
          s5 = peg$parseexpression();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f30(s1, s5);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsematch_var() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 36) {
        s1 = peg$c35;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e38); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseinteger();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f31(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseheredoc() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c36) {
        s1 = peg$c36;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e39); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsebeginMarker();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 10) {
            s3 = peg$c37;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e40); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsecontent();
            s5 = peg$parseendMarker();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f32(s4);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parse__() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 10) {
        s2 = peg$c37;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e40); }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = undefined;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 32) {
          s3 = peg$c19;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e20); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = undefined;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e41); }
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsemarker() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parse__();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse__();
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s0 = input.substring(s0, peg$currPos);
      } else {
        s0 = s1;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e42); }
      }

      return s0;
    }

    function peg$parsebeginMarker() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsemarker();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f33(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseendMarker() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 10) {
        s1 = peg$c37;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e40); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (input.charCodeAt(peg$currPos) === 32) {
          s3 = peg$c19;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e20); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (input.charCodeAt(peg$currPos) === 32) {
            s3 = peg$c19;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e20); }
          }
        }
        s3 = peg$parsemarker();
        if (s3 !== peg$FAILED) {
          peg$savedPos = peg$currPos;
          s4 = peg$f34(s3);
          if (s4) {
            s4 = undefined;
          } else {
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s1 = [s1, s2, s3, s4];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsecontent() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$currPos;
      peg$silentFails++;
      s4 = peg$parseendMarker();
      peg$silentFails--;
      if (s4 === peg$FAILED) {
        s3 = undefined;
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e41); }
        }
        if (s4 !== peg$FAILED) {
          s3 = [s3, s4];
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$currPos;
        s3 = peg$currPos;
        peg$silentFails++;
        s4 = peg$parseendMarker();
        peg$silentFails--;
        if (s4 === peg$FAILED) {
          s3 = undefined;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e41); }
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      }
      s0 = input.substring(s0, peg$currPos);

      return s0;
    }

    function peg$parsecomment() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 35) {
        s1 = peg$c38;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e43); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$r3.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e44); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$r3.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e44); }
          }
        }
        peg$savedPos = s0;
        s0 = peg$f4();
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseinteger() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$r4.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e45); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$r4.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e45); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f35();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsekeyword() {
      var s0;

      if (input.substr(peg$currPos, 2) === peg$c1) {
        s0 = peg$c1;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e1); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c2) {
          s0 = peg$c2;
          peg$currPos += 4;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e2); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c0) {
            s0 = peg$c0;
            peg$currPos += 3;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e0); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c3) {
              s0 = peg$c3;
              peg$currPos += 4;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e3); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 6) === peg$c8) {
                s0 = peg$c8;
                peg$currPos += 6;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$e8); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 3) === peg$c7) {
                  s0 = peg$c7;
                  peg$currPos += 3;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e7); }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsename() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (peg$r5.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e46); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$r6.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e47); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$r6.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e47); }
          }
        }
        peg$savedPos = s0;
        s0 = peg$f17();
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      if (peg$r7.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e49); }
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$r7.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e49); }
        }
      }
      peg$savedPos = s0;
      s1 = peg$f36();
      s0 = s1;
      peg$silentFails--;
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e48); }

      return s0;
    }



        var heredoc_begin = null;
        var variable_prefix = '$_';
        var match_identifer = make_identifier('$$__m');
        var match_method = make_identifier('match');

        function make_if(test, body, alternative) {
            return {
                "type": "IfStatement",
                "test": test,
                "consequent": make_block(body),
                "alternate": alternative
            };
        }
        function make_block(body) {
            return {
                "type": "BlockStatement",
                "body": body
            }
        }
        function make_identifier(name) {
            return {
                type: 'Identifier',
                name: name
            };
        }
        function property(...args) {
            return args.reduce(function(result, item) {
                return {
                    type: "MemberExpression",
                    computed: false,
                    object: result,
                    property: item
                };
            });
        }
        function call(callee, ...args) {
            return {
                type: "CallExpression",
                callee: callee,
                arguments: args
            };
        }
        function create_template_literal(string) {
            var re = /(\$[A-Z_$a-z][A-Z_a-z0-9]*)/;
            var expressions = [];
            var constants = [];
            string.split(re).map(token => {
                if (token.match(re)) {
                    expressions.push(make_identifier(token.replace(/^\$/, '$_')));
                } else {
                    constants.push({
                        "type": "TemplateElement",
                        "value": {
                            "raw": token
                        }
                    });
                }
            });
            return {
                type: "TemplateLiteral",
                expressions,
                quasis: constants
            };
        }
        // move error location without mutation
        function move_location(loc, start, end) {
            const { start: loc_start, end: loc_end } = loc;
            const new_loc = {
                ...loc,
                start: {
                    ...loc_start,
                    column: loc_start.column + start,
                    offset: loc_start.offset + start
                },
                end: {
                    ...loc_end,
                    column: loc_end.column + end,
                    offset: loc_end.offset + end
                }
            };
            return new_loc;
        }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail(peg$endExpectation());
      }

      throw peg$buildStructuredError(
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  var parser = {
    SyntaxError: peg$SyntaxError,
    parse: peg$parse
  };

  return parser;

}));