// WXML 标签配对检查器：栈式检查 view/scroll-view 等容器标签的开闭配对
'use strict'
const fs = require('fs')
const path = require('path')

const ROOT = process.argv[2]
let issues = 0

// 仅显式 /> 视为自闭；<image></image> 等显式闭合走正常配对
// const SELF_CLOSING 不再使用

function checkWxml(file) {
  const src = fs.readFileSync(file, 'utf8')
  // 去掉注释
  const clean = src.replace(/<!--[\s\S]*?-->/g, '')
  const stack = []
  const re = /<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>])*?)(\/?)>/g
  let m
  let count = 0
  while ((m = re.exec(clean)) !== null) {
    count++
    const isClose = m[1] === '/'
    const tag = m[2].toLowerCase()
    const selfClosed = m[4] === '/'
    if (isClose) {
      // 闭合标签：栈顶必须是同名
      if (stack.length === 0) {
        console.log('❌ ' + path.relative(ROOT, file) + ' 多余闭合 </' + tag + '>')
        issues++
      } else if (stack[stack.length - 1].tag !== tag) {
        const top = stack.pop()
        console.log('❌ ' + path.relative(ROOT, file) + ' 标签交叉: 期待 </' + top.tag + '>（开于第' + top.line + '行）却遇到 </' + tag + '>')
        issues++
      } else {
        stack.pop()
      }
    } else if (!selfClosed) {
      stack.push({ tag, line: clean.slice(0, m.index).split('\n').length })
    }
  }
  stack.forEach(s => {
    console.log('❌ ' + path.relative(ROOT, file) + ' 未闭合 <' + s.tag + '>（开于第' + s.line + '行）')
    issues++
  })
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) {
      if (['node_modules', '.git', '.backup-20260825'].includes(name)) continue
      walk(p)
    } else if (name.endsWith('.wxml')) checkWxml(p)
  }
}

walk(ROOT)
console.log(issues === 0 ? '✅ 全部 WXML 标签配对正确' : '❌ 共 ' + issues + ' 处标签配对问题')
process.exit(issues ? 1 : 0)
