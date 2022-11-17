# Themd 

Themd is a static page generator for GitHub pages. You can initialize your project with `npm i @lightwindcss/themd`. It will create a environement for you to work.

## How to work with themd

First of all install a themd theme with `npm run themd <theme_name>`. All themes can be published on [themd page](themdpm.gitproject.ch).

## Files organisation 

### /pages

Inside this path you put all the folders which names are uri components. You can bind your Markdown files with values inside of `{{}}`. The values should be inside the .json file. Each name is a language shorter which is get from browser. In case the language don't exist it will use the default.json file.

### /themes

The destination directory of installed themes. Each file name is the theme name.

### /dist 

The destination directory of generated website.

```
|
|\__ /pages
|   \__ /<page>
|    |__ page.mdx
|    |__ <lang>.json
|    |__ default.json
|\__ /themes
| |__ <theme>.css
\__ /dist
 |__ *.*
```
