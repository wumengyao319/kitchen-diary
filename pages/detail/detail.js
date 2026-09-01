const recipesData = require('../../data/recipes.js')

Page({
  data: {
    recipe: {},
    isFavorite: false,
    isLiked: false
  },

  onLoad: function(options) {
    const id = options.id
    if (id) {
      this.setData({ recipe: {}, isFavorite: false, isLiked: false })
      this.loadRecipe(id)
      this.checkFavorite(id)
      this.checkLiked(id)
    }
  },

  onShow: function() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    if (currentPage.options && currentPage.options.id) {
      this.loadRecipe(currentPage.options.id)
    }
  },

  loadRecipe: function(id) {
    const recipes = recipesData.recipes || []
    // 使用 === 来处理字符串ID的精确匹配
    let recipe = recipes.find(r => String(r._id) === String(id))
    
    if (recipe) {
      const formattedRecipe = {
        ...recipe,
        ingredients: recipe.ingredients.map(item => {
          const match = item.match(/^(.+?)(\d.*)$/)
          if (match) {
            return { name: match[1].trim(), amount: match[2].trim() }
          }
          return { name: item.trim(), amount: '' }
        }),
        steps: (typeof recipe.steps === 'string') 
          ? recipe.steps.split('\n').map((step, idx) => ({ 
              index: idx + 1,
              desc: step.trim()
            }))
          : recipe.steps.map((step, index) => ({ 
              index: index + 1,
              desc: typeof step === 'string' ? step : (step.desc || step)
            })),
        servings: recipe.servings || 2,
        tips: recipe.tips || '小贴士：根据个人口味调整调料用量'
      }
      this.setData({
        recipe: formattedRecipe
      })
      // 保存到缓存
      wx.setStorageSync('currentRecipe', recipe)
      wx.setStorageSync('currentRecipeId', recipe._id)
      wx.setNavigationBarTitle({ title: recipe.name })
    }
  },

  checkFavorite: function(id) {
    const favorites = wx.getStorageSync('favorites') || []
    this.setData({
      isFavorite: favorites.some(item => String(item) === String(id))
    })
  },

  checkLiked: function(id) {
    const likedRecipes = wx.getStorageSync('likedRecipes') || []
    this.setData({
      isLiked: likedRecipes.some(item => String(item) === String(id))
    })
  },

  toggleLike: function() {
    const id = this.data.recipe._id
    let likedRecipes = wx.getStorageSync('likedRecipes') || []
    
    // 检查是否已经点赞（使用字符串比较）
    const idStr = String(id)
    const isAlreadyLiked = likedRecipes.some(item => String(item) === idStr)
    
    if (isAlreadyLiked) {
      likedRecipes = likedRecipes.filter(item => String(item) !== idStr)
    } else {
      likedRecipes.push(id)
    }
    
    wx.setStorageSync('likedRecipes', likedRecipes)
    this.setData({
      isLiked: !isAlreadyLiked
    })
    
    wx.showToast({
      title: !isAlreadyLiked ? '点赞成功' : '取消点赞',
      icon: 'none'
    })
  },

  toggleFavorite: function() {
    const id = this.data.recipe._id
    let favorites = wx.getStorageSync('favorites') || []
    
    // 检查是否已经收藏（使用字符串比较）
    const idStr = String(id)
    const isAlreadyFavorited = favorites.some(item => String(item) === idStr)
    
    if (isAlreadyFavorited) {
      favorites = favorites.filter(item => String(item) !== idStr)
    } else {
      favorites.push(id)
    }
    
    wx.setStorageSync('favorites', favorites)
    this.setData({
      isFavorite: !isAlreadyFavorited
    })
    
    wx.showToast({
      title: !isAlreadyFavorited ? '已收藏' : '取消收藏',
      icon: 'none'
    })
  },

  shareRecipe: function() {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    })
  },

  startCooking: function() {
    wx.showToast({
      title: '开始烹饪',
      icon: 'success'
    })
  }
})