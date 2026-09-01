const recipesData = require('../../data/recipes.js')

Page({
  data: {
    searchKey: '',
    selectedTags: [],
    hotTags: ['鸡蛋', '猪肉', '牛肉', '鸡', '鱼', '虾', '豆腐', '番茄', '土豆', '青椒', '排骨', '葱'],
    recipes: [],
    searchHistory: [],
    dailyRecommend: [],
    hotRecipes: [
      { _id: '2', name: '红烧肉', color: '#ff6b6b', emoji: '🍖', rank: 1 },
      { _id: '1', name: '番茄炒蛋', color: '#ffd93d', emoji: '🍅', rank: 2 },
      { _id: '7', name: '宫保鸡丁', color: '#fd79a8', emoji: '🍗', rank: 3 }
    ]
  },

  onShow: function() {
    if (this.data.searchHistory.length === 0) {
      try {
        const history = wx.getStorageSync('search_history') || []
        this.setData({ searchHistory: history })
      } catch (e) {
        this.setData({ searchHistory: [] })
      }
    }
    const today = this.getTodayString()
    const lastDate = wx.getStorageSync('recommend_date') || ''
    const cachedRecommend = wx.getStorageSync('daily_recommend') || []
    
    if (this.data.dailyRecommend.length === 0) {
      if (lastDate === today && cachedRecommend.length > 0) {
        this.setData({ dailyRecommend: cachedRecommend })
      } else {
        this.initDailyRecommend()
        wx.setStorageSync('recommend_date', today)
      }
    }
    this.updateTabBar('/pages/search/search')
  },

  getTodayString: function() {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  },

  initDailyRecommend: function() {
    const mockRecipes = [
      { _id: '1', name: '番茄炒蛋', color: '#ffd93d', emoji: '🍅' },
      { _id: '2', name: '红烧肉', color: '#ff6b6b', emoji: '🍖' },
      { _id: '3', name: '可乐鸡翅', color: '#8b4513', emoji: '�' },
      { _id: '4', name: '酸辣土豆丝', color: '#f0e68c', emoji: '🥔' },
      { _id: '6', name: '鱼香肉丝', color: '#cd853f', emoji: '🥩' },
      { _id: '7', name: '宫保鸡丁', color: '#fd79a8', emoji: '🍗' },
      { _id: '8', name: '麻婆豆腐', color: '#ff9ff3', emoji: '�' },
      { _id: '9', name: '回锅肉', color: '#ff4500', emoji: '🥓' },
      { _id: '11', name: '糖醋里脊', color: '#ffa500', emoji: '�' },
      { _id: '19', name: '西红柿鸡蛋汤', color: '#ff6347', emoji: '�' },
      { _id: '43', name: '清蒸鲈鱼', color: '#87ceeb', emoji: '🐟' },
      { _id: '55', name: '白灼虾', color: '#ff6347', emoji: '�' },
      { _id: '77', name: '蚝油生菜', color: '#228b22', emoji: '🥬' },
      { _id: '84', name: '拔丝地瓜', color: '#ffd700', emoji: '🍠' },
      { _id: '97', name: '剁椒鱼头', color: '#ff6347', emoji: '🐟' }
    ]
    
    const shuffled = mockRecipes.sort(() => Math.random() - 0.5)
    const recommend = shuffled.slice(0, 1)
    this.setData({ dailyRecommend: recommend })
    wx.setStorageSync('daily_recommend', recommend)
this.updateTabBar('/pages/search/search')
  },

  updateTabBar: function(path) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selectedPath: path })
    }
  },

  onSearch: function(e) {
    const key = e.detail.value
    this.setData({ searchKey: key })
    this.doSearch()
  },

  doSearch: function() {
    const key = this.data.searchKey
    const tags = this.data.selectedTags
    
    this.setData({
      recipes: this.mockSearch(key, tags)
    })

    if (key && !this.data.searchHistory.includes(key)) {
      const history = [key, ...this.data.searchHistory.slice(0, 9)]
      this.setData({ searchHistory: history })
      try {
        wx.setStorageSync('search_history', history)
      } catch (e) {
        console.log('Storage error')
      }
    }
  },

  mockSearch: function(key, tags) {
    const mockRecipes = recipesData.recipes.map(r => ({
      _id: r._id,
      name: r.name,
      desc: r.desc,
      color: r.color,
      emoji: r.emoji,
      ingredients: r.ingredients,
      category: r.category,
      cookTime: r.cookTime,
      difficulty: r.difficulty
    }))

    const lowerKey = key ? key.toLowerCase() : ''
    
    return mockRecipes.filter(recipe => {
      const matchKey = !lowerKey || 
        recipe.name.toLowerCase().includes(lowerKey) || 
        recipe.desc.toLowerCase().includes(lowerKey) || 
        recipe.category.toLowerCase().includes(lowerKey) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerKey)) ||
        recipe.name.includes(key) || 
        recipe.desc.includes(key) || 
        recipe.category.includes(key) ||
        recipe.ingredients.some(ing => ing.includes(key))
      
      const matchTags = tags.length === 0 || 
        tags.some(tag => recipe.ingredients.some(ing => ing.includes(tag) || ing.toLowerCase().includes(tag.toLowerCase())))
      
      return matchKey && matchTags
    })
  },

  toggleTag: function(e) {
    const tag = e.currentTarget.dataset.tag
    const tags = this.data.selectedTags.includes(tag)
      ? this.data.selectedTags.filter(t => t !== tag)
      : [...this.data.selectedTags, tag]
    this.setData({ selectedTags: tags })
    this.doSearch()
  },

  removeTag: function(e) {
    const index = e.currentTarget.dataset.index
    const tags = this.data.selectedTags.filter((_, i) => i !== index)
    this.setData({ selectedTags: tags })
    this.doSearch()
  },

  clearTags: function() {
    this.setData({ selectedTags: [] })
    this.doSearch()
  },

  clearSearch: function() {
    this.setData({
      searchKey: '',
      selectedTags: [],
      recipes: []
    })
  },

  clearHistory: function() {
    this.setData({ searchHistory: [] })
    try {
      wx.setStorageSync('search_history', [])
    } catch (e) {
      console.log('Storage error')
    }
  },

  searchHistoryItem: function(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ searchKey: key })
    this.doSearch()
  },

  goDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  }
})