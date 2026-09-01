const recipesData = require('../../data/recipes.js')

Page({
  data: {
    list: []
  },

  onShow: function() {
    this.loadLikedRecipes()
  },

  loadLikedRecipes: function() {
    const likedIds = wx.getStorageSync('likedRecipes') || []
    const allRecipes = recipesData.recipes || []
    const likedRecipes = allRecipes.filter(item => likedIds.includes(item._id))
    this.setData({ list: likedRecipes })
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