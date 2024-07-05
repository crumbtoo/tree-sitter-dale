/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const whitespace = /[ \r\n\t\f\v\p{Zs}\p{Zl}\p{Zp}]/

module.exports = grammar
  ({ name: "dale"
   , rules:
     { source_file: $ => seq(optional($.shebang), repeat($._token))
     , shebang: $ => /#!.*/
     , _token: $ => choice( $._intertoken
                          , $._datum )
     , _intertoken: $ => choice( token(repeat1(whitespace))
                               , $.comment
                               , $.block_comment )

     , comment: $ => /;.*/
     , block_comment: $ =>
       seq( "#|"
          , repeat(
              choice( prec(100, $.block_comment)
                    , /.|[\r\n\u{85}\u{2028}\u{2029}]/ ))
          , prec(100, "|#") )

     , _datum: $ => choice( $.boolean
                          , $.number
                          , $.list
                          , $.character
                          , $.string
                          , $.symbol
                          )
     , boolean: $ => choice("true", "false")

     , number: $ => choice( /-?0x[0-9a-fA-F]+/
                          , /-?\d+(\.\d+)?/ )

     , character: $ => /#\\(SPACE|TAB|NEWLINE|CARRIAGE|NULL|EOF|.)/
     , string: $ => token(
       seq( "\""
          , repeat(/[^"\\]/)
          , repeat(seq( "\\"
                      , /./
                      , repeat(/[^"\\]/)))
          , "\""))
     // field definitions seem to be non-commutative. `symbol` must be defined
     // after `number` lest e.g. "-123" is recognised as symbol.
     , symbol: $ =>
       // printable, non-delimiter, non-whitespace, non-numeric
       // + printable, non-delimiter, non-whitespace
       new RegExp( "[-!#$%&'*+,./:<=>?@A-Z^_`a-z|~]"
                 + "[-!#$%&'*+,./:<=>?@A-Z^_`a-z|~0-9]*" )

     , list: $ => seq( "("
                     , repeat($._token)
                     , ")" )
     }
   }
  );

