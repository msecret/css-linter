var postcss = require('postcss');

function LintError(msg, id, source, obj) {
  this.msg = msg;
  this.id = id;
  this.opts = {
    line: source.start.line,
    column: source.start.column
  };
  if (obj) this.opts.obj = obj;

  return this;
}

var ensureNoIndentSelectors = postcss.plugin('no-selector-indentation', function (opts) {
    opts = opts || {};

    return function(css, result) {
      css.eachRule(function(rule) {
        rule.selectors.forEach(function(selector, i) {
          if ( i === 0 ) return;
          var e = new LintError('Indent selector', rule.source, selector);
          result.warn(e.msg, e.opts);
        });
      });
    };
});

var ensureSpaceInRuleName = postcss.plugin('space-in-rule', function (opts) {
    opts = opts || {};

    return function(css, result) {
      var desiredBetween = ': ';
      css.walkDecls(function(decl) {
        var between = decl.raws.between,
            e;
        if (between === desiredBetween) return;
        e = new LintError('One space in rule declaration', decl.source, decl);
        result.warn(e.msg, e.opts);
      });
    };
});

var ensureNewLineBeforeRuleClosing = postcss.plugin('newline-after-last-declaration', function (opts) {
    opts = opts || {};

    return function(css) {
      css.eachRule(function(rule) {
        rule.after = '\n';
      });
    };
});

var ensureNewLinesAfterRule = postcss.plugin('newlines-after-rule', function (opts) {
    opts = opts || {};

    return function(css) {
      css.eachRule(function(rule) {
        rule.before = '\n\n';
      });

      css.first.before = '';
    };
});

var ensureEachPropertyOwnLine = postcss.plugin('property-on-own-line', function (opts) {
    opts = opts || {};

    return function(css) {
      css.eachDecl(function(decl) {
        decl.before = '\n  ';
      });
    };
});

var ensureSpaceInProperty = postcss.plugin('space-in-property', function (opts) {
    opts = opts || {};

    return function(css) {
      css.eachDecl(function(decl) {
        decl.between = ': ';
      });
    };
});

var SPC_SpaceBeforeBracket = postcss.plugin('SPC_SpaceBeforeBracket',
    function(opts) {
  opts = opts || {}; 

  return function(css, result) {
    var desired = ' ';
    css.walkDecls(function(decl) {
      var actual = decl.parent.raws.between;

      if (actual === desired) return;
      var e = new LintError('Put spaces before { in rule declarations.',
        'SPC', decl.source, decl);
      result.warn(e.msg, e.opts);
    });
  };
});

module.exports = [
  //ensureNoIndentSelectors,
  //ensureSpaceInRuleName,
  SPC_SpaceBeforeBracket
];
//   ensureEachPropertyOwnLine,
//   ensureSpaceInProperty,
//   ensureNewLineBeforeRuleClosing,
//   ensureNewLinesAfterRule
// ];
