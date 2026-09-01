const recipesData = require('../../data/recipes.js')

Page({
  data: {
    list: []
  },

  onShow: function() {
    this.loadFavoriteRecipes()
  },

  loadFavoriteRecipes: function() {
    const favoriteIds = wx.getStorageSync('favorites') || []
    const allRecipes = recipesData.recipes || []
    const favoriteRecipes = allRecipes.filter(item => favoriteIds.includes(item._id))
    this.setData({ list: favoriteRecipes })
  },

  goBack: function() {
    wx.navigateBack()
  },

  goDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  }
})