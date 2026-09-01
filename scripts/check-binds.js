// 绑定一致性检查：wxml 绑定的方法在 js 里必须存在
'use strict'
const fs = require('fs')
const path = require('path')
const BASE = 'C:/Users/17493/.openclaw-autoclaw/agents/auto-designer/workspace/.openclaw/tmp/recipe-work/pages'

const pages = fs.readdirSync(BASE).filter(d => fs.statSync(path.join(BASE, d)).isDirectory() && fs.existsSync(path.join(BASE, d, d + '.wxml')))

pages.forEach(page => {
  const js = fs.readFileSync(path.join(BASE, page, page + '.js'), 'utf8')
  const wxml = fs.readFileSync(path.join(BASE, page, page + '.wxml'), 'utf8')
  const binds = [...wxml.matchAll(/bind(?:tap|input|change|blur|confirm)="([A-Za-z_][\w]*)"/g)].map(m => m[1])
  const missing = binds.filter(b => !new RegExp('\\b' + b + '\\s*[:(]').test(js))
  if (missing.length) {
    console.log('❌ ' + page + ' 缺失方法: ' + missing.join(', '))
  } else {
    console.log('✅ ' + page + '（' + binds.length + ' 个绑定全部存在）')
  }
})
