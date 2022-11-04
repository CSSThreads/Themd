module.exports = class themd {
    constructor() {
        var hljs = require('highlight.js');
        const string = require('string')
        const slugify = s => string(s).slugify().toString()

        var mir = require('markdown-it-replace-it');
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
        this.converter = new MarkdownIt({
            html: true,
            linkify: true
        }).use(mir).use(require('markdown-it-github-headings'), { prefixHeadingIds: false, enableHeadingLinkIcons: false }).use(require('markdown-it-attrs'), {
            allowedAttributes: ['id', 'class', 'style']
        }).use(require('markdown-it-emoji')).use(require('markdown-it-sub')).use(require('markdown-it-sup')).use(require('markdown-it-task-lists')).use(require('markdown-it-ins')).use(require('markdown-it-abbr')).use(require('markdown-it-footnote')).use(require('markdown-it-deflist')).use(require('markdown-it-mark')).use(require('markdown-it-container'), 'dropdown', {
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
    }
    render() {
        const readline = require('readline');
        const fs = require('fs');
        fs.readdir('./pages/', (err, files) => {
            const start = Date.now();
            files.forEach(file => {
                var data = (fs.readFileSync(`./pages/${file}`)).toString().split('\n');
                const styleFileName = data.shift();

                data = data.join('\n')

                data = this.converter.render(data);

                const html = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${file.slice(0, file.length - 3)}</title>
                
                    <link rel="stylesheet" href="../style/${styleFileName}.css">
                </head>
                <body>
                    ${data}
                </body>
                </html>`

                fs.writeFile(`./dist/${file.slice(0, file.length - 3)}.html`, html, err => {
                    if (err) {
                      console.error(err);
                    }
                });
            });
            console.log(`Themd build in /dist in ${Date.now() - start} ms`)
        });
    }
}
