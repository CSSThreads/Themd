var hljs = require('highlight.js');
const string = require('string')
const slugify = s => string(s).slugify().toString()

mir = require('markdown-it-replace-it');
mir.replacements.push({ name: '©', re: /\([c|C]\)/g, html: true, sub: function (s) { return '©'; }, default: true });
mir.replacements.push({ name: '®', re: /\([r|R]\)/g, html: true, sub: function (s) { return '®'; }, default: true });
mir.replacements.push({ name: '™', re: /\([t|T][m|M]\)/g, html: true, sub: function (s) { return '™'; }, default: true });
mir.replacements.push({ name: '℗', re: /\([p|P]\)/g, html: true, sub: function (s) { return '℗'; }, default: true });

mir.replacements.push({ name: '±', re: /\+-/g, html: true, sub: function (s) { return '±'; }, default: true });
mir.replacements.push({ name: '→', re: /->/g, html: true, sub: function (s) { return '→'; }, default: true });
mir.replacements.push({ name: '⇒', re: /=>/g, html: true, sub: function (s) { return '⇒'; }, default: true });
mir.replacements.push({ name: '←', re: /<-/g, html: true, sub: function (s) { return '←'; }, default: true });
mir.replacements.push({ name: '⇐', re: /<=/g, html: true, sub: function (s) { return '⇐'; }, default: true });

var MarkdownIt = require('markdown-it')
var converter = new MarkdownIt({
    html: true,
    linkify: true
}).use(mir).use(require('markdown-it-anchor'), { slugify }).use(require('markdown-it-attrs'), {
    allowedAttributes: ['id', 'class', 'style']
}).use(require('markdown-it-emoji')).use(require('markdown-it-sub')).use(require('markdown-it-sup')).use(require('markdown-it-task-lists')).use(require('markdown-it-container'), 'dropdown', {
    validate: function(params) {
        return params.trim().match(/^dropdown\s+(.*)$/);
    },
    
    render: function(tokens, idx) {
        var m = tokens[idx].info.trim().match(/^dropdown\s+(.*)$/);
    
        if (tokens[idx].nesting === 1 && m[0].startsWith('dropdown')) {
          return '<details><summary>' + m[0].slice(9) + '</summary>\n';
    
        } else {
          // closing tag
          return '</details>\n';
        }
    }
}).use(require('markdown-it-container'), 'decorate', {
    validate: function(params) {
        return params.trim().match(/^(.*)$/);
    },
    
    render: function(tokens, idx) {
        var m = tokens[idx].info.trim().match(/^(.*)$/);
    
        if (tokens[idx].nesting === 1) {
          return '<div ' + m[0] + '>\n';
    
        } else {
          // closing tag
          return '</div>\n';
        }
    }
})
  
const md = "---\n__Hi :)__\n\n---\n::: warning\nspoiler => ->  +-fsdsfd(c)(tm) (c) (C) click me\n**content**\n:::\n# dfsdfs\n"

console.log(converter.render(md))
