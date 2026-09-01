// pages/fridge/fridge.js - 冰箱食材匹配菜谱（「有什么就做什么」）
const recipesData = require('../../data/recipes.js')

// 常用食材清单（分 5 类，与 data/recipes.js 的食材命名对齐）
const INGREDIENT_GROUPS = [
  {
    group: '肉禽', items: ['五花肉', '猪里脊', '肉末', '排骨', '肋排', '鸡胸肉', '鸡腿肉', '鸡翅', '牛肉', '鸡蛋', '蛋清']
  },
  {
    group: '海鲜', items: ['草鱼', '鲈鱼', '扇贝', '虾仁', '三黄鸡']
  },
  {
    group: '蔬果', items: ['番茄', '土豆', '青椒', '茄子', '胡萝卜', '黄瓜', '娃娃菜', '四季豆', '豆芽', '酸菜', '木耳', '青蒜', '豆腐', '豆皮', '粉丝', '葱', '姜', '蒜']
  },
  {
    group: '主食辅料', items: ['面粉', '淀粉', '米粉', '面包糠']
  },
  {
    group: '调味', items: ['盐', '糖', '冰糖', '生抽', '老抽', '醋', '料酒', '豆瓣酱', '甜面酱', '番茄酱', '蒸鱼豉油', '可乐', '花椒', '干辣椒', '八角']
  }
]

// 从菜谱食材字符串提取「是否包含某食材」的判断
function hasIngredient(ingStr, name) {
  return ingStr.indexOf(name) !== -1
}

Page({
  data: {
    groups: [],
    selectedNames: [],
    matched: [],
    hasSearched: false,
    // 厨房手账摘要（与财富江湖差异化的「记录向」留存设计）
    stoveDays: 0,          // 灶火：连续做菜打卡天数
    cuisineMap: [],        // 味觉版图：菜系分布
    cookedCount: 0
  },

  onLoad() {
    this.buildGroups()
    this.refreshStats()
  },

  onShow() {
    this.refreshStats()
    if (this.data.selectedNames.length) this.rematch()
  },

  buildGroups() {
    const groups = INGREDIENT_GROUPS.map(g => ({
      group: g.group,
      items: g.items.map(name => ({ name, on: this.data.selectedNames.indexOf(name) !== -1 }))
    }))
    this.setData({ groups })
  },

  toggleIngredient(e) {
    const name = e.currentTarget.dataset.name
    let selected = this.data.selectedNames.slice()
    const idx = selected.indexOf(name)
    if (idx === -1) selected.push(name)
    else selected.splice(idx, 1)
    this.setData({ selectedNames: selected })
    this.buildGroups()
    this.rematch()
  },

  clearAll() {
    this.setData({ selectedNames: [], matched: [], hasSearched: false })
    this.buildGroups()
  },

  rematch() {
    const selected = this.data.selectedNames
    if (!selected.length) {
      this.setData({ matched: [], hasSearched: false })
      return
    }
    const matched = (recipesData.recipes || recipesData)
      .map(r => {
        const owned = []
        const missing = []
        ;(r.ingredients || []).forEach(ing => {
          const hit = selected.some(s => hasIngredient(ing, s))
          ;(hit ? owned : missing).push(ing)
        })
        const rate = r.ingredients.length ? Math.round(owned.length / r.ingredients.length * 100) : 0
        return {
          id: r._id,
          name: r.name,
          desc: r.desc,
          category: r.category,
          emoji: r.emoji || '🍳',
          color: r.color || '#ffd93d',
          cookTime: r.cookTime,
          difficulty: r.difficulty,
          ownedCount: owned.length,
          totalCount: r.ingredients.length,
          matchRate: rate,
          ownedText: owned.join('、'),
          missingText: missing.join('、') || '全部齐了'
        }
      })
      .filter(x => x.ownedCount > 0)
      .sort((a, b) => b.matchRate - a.matchRate || b.ownedCount - a.ownedCount)
      .slice(0, 12)
    this.setData({ matched, hasSearched: true })
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id })
  },

  // ===== 厨房手账摘要（灶火 + 味觉版图）=====
  refreshStats() {
    const log = wx.getStorageSync('cookedLog') || []
    // 灶火：连续做菜天数（按打卡日期连续计数）
    const days = []
    log.forEach(item => { if (days.indexOf(item.date) === -1) days.push(item.date) })
    days.sort()
    let stove = 0
    let prev = null
    days.forEach(d => {
      if (prev === null) stove = 1
      else {
        const gap = (new Date(d) - new Date(prev)) / 86400000
        stove = gap === 1 ? stove + 1 : 1
      }
      prev = d
    })
    // 味觉版图：按菜系统计做过的菜
    const cuisineCount = {}
    log.forEach(item => {
      const cat = item.category || '其他'
      cuisineCount[cat] = (cuisineCount[cat] || 0) + 1
    })
    const cuisineMap = Object.keys(cuisineCount)
      .map(k => ({ name: k, count: cuisineCount[k] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
    const total = log.length
    this.setData({
      stoveDays: stove,
      cuisineMap: cuisineMap.map(c => ({ ...c, pct: total ? Math.round(c.count / total * 100) : 0 })),
      cookedCount: total
    })
  },

  // 打卡入口引导（实际打卡在菜谱详情页）
  goLucky() {
    wx.switchTab({ url: '/pages/lucky/lucky' })
  }
})
