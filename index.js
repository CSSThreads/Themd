var hljs = require('highlight.js');

var MarkdownIt = require('markdown-it')
var converter = new MarkdownIt({
    html: true,
    linkify: true
}).use(require('markdown-it-attrs'), {
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
  
const md = "::: warning\nspoiler click me\n**content**\n:::\n"

console.log(converter.render(md))
