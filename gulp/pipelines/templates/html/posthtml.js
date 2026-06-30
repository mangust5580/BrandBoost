import fs from 'node:fs'
import path from 'node:path'

import { env } from '#gulp/utils/env.js'
import { paths } from '#config/paths.js'
import { templates } from '#config/templates.js'
import { expressionsPlugin } from '#gulp/pipelines/templates/html/expressions.js'

// Replaces <link href="styles/critical.css"> with an inline <style> block.
// Styles task always runs before templates, so the file already exists in paths.out.
const inlineCriticalCssPlugin = () => {
  const cssPath = path.join(paths.out, paths.styles.dest, 'critical.css')

  return tree => {
    let cssContent

    tree.match({ tag: 'link', attrs: { href: /critical\.css$/ } }, () => {
      if (cssContent === undefined) {
        cssContent = fs.readFileSync(cssPath, 'utf8')
      }

      return { tag: 'style', content: [cssContent] }
    })

    return tree
  }
}

const removeDevAttrsPlugin = () => tree => {
  tree.match({ attrs: true }, node => {
    if (!node.attrs) return node
    delete node.attrs['data-dev']
    delete node.attrs['data-debug']
    return node
  })

  return tree
}

export const getPosthtmlPlugins = ({ locals = {}, enableExpressions = false } = {}) => {
  const cfg = templates.html
  const p = []

  if (env.isProd) {
    p.push(inlineCriticalCssPlugin())
  }

  if (cfg.posthtml.enabled && cfg.posthtml.prodOnlyTransforms) {
    p.push(removeDevAttrsPlugin())
  }

  if (enableExpressions && cfg.expressions?.enabled) {
    p.push(
      expressionsPlugin({
        ...locals,
        isProd: env.isProd,
        isDev: env.isDev,
      }),
    )
  }

  return p
}