var converter = window.markdownit({
  html: true,
  linkify: true
}).use(window.markdownItAttrs, {
  allowedAttributes: ['id', 'class', 'style']
}).use(window.markdownitEmoji).use(window.markdownitSub).use(window.markdownitSup).use(taskListModule).use(headersId).use(containerModule, 'dropdown', {
  validate: function(params) {
    return params.trim().match(/^(.*)$/);
  },

  render: function(tokens, idx) {
    var m = tokens[idx].info.trim().match(/^(.*)$/);

    if (tokens[idx].nesting === 1 && m[0].startsWith('dropdown')) {
      return '<details><summary>' + m[0] + '</summary>\n';

    } else {
      // closing tag
      return '</details>\n';
    }
  }
}).use(containerModule, 'decorate', {
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

var contentHttpReq = new XMLHttpRequest();
var contentPath = window.location.search.slice(1).split('/')[0] == '' ? window.location.origin + '/pages/index.themd' : window.location.origin + '/pages/' + window.location.search.slice(1).split('/')[0] + '.themd';
contentHttpReq.open("GET", contentPath, false);
contentHttpReq.send(null);

var md = contentHttpReq.responseText
var themeName = md.split('\n').shift();

var styleHttpReq = new XMLHttpRequest();
var styleURL = `${window.location.origin}/themes/${themeName.toLowerCase()}.css`;
styleHttpReq.open("GET", styleURL, false);
styleHttpReq.send(null);

// appending style
document.head.innerHTML += `<style>${styleHttpReq.responseText}</style>`

md = md.split('\n').splice(1, md.length - 1).join('\n')

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#content').innerHTML = converter.render(md)
})

hljs.highlightAll();
