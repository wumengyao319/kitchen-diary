const recipesData = require('../../data/recipes.js')

Page({
  data: {
    categories: [
      { name: '全部', icon: '🍳' },
      { name: '家常菜', icon: '🏠' },
      { name: '川菜', icon: '🌶️' },
      { name: '粤菜', icon: '🍤' },
      { name: '海鲜', icon: '🦐' },
      { name: '素菜', icon: '🥬' },
      { name: '湘菜', icon: '🔥' },
      { name: '汤羹', icon: '🥣' },
      { name: '主食', icon: '🍚' },
      { name: '甜点', icon: '🍰' }
    ],
    currentCategory: '全部',
    recipes: [],
    currentRecipes: []
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.updateTabBar('/pages/category/category')
  },

  updateTabBar(path) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selectedPath: path })
    }
  },

  loadData() {
    const recipes = recipesData.recipes || []
    this.setData({
      recipes: recipes,
      currentRecipes: recipes
    })
  },

  selectCategory(e) {
    const categoryName = e.currentTarget.dataset.name
    this.setData({
      currentCategory: categoryName
    })
    
    if (categoryName === '全部') {
      this.setData({
        currentRecipes: this.data.recipes
      })
    } else {
      const filtered = this.data.recipes.filter(item => item.category === categoryName)
      this.setData({
        currentRecipes: filtered
      })
    }
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  },

  goBack() {
    wx.navigateBack({
      fail: () => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    })
  }
})