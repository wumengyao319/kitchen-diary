Page({
  data: {
    hotList: [],
    quickCategories: [
      { name: '家常菜', icon: '🍳' },
      { name: '川菜', icon: '🌶️' },
      { name: '粤菜', icon: '🦐' },
      { name: '海鲜', icon: '🦞' },
      { name: '素菜', icon: '🥬' },
      { name: '主食', icon: '🍚' },
      { name: '甜点', icon: '🍰' },
      { name: '汤羹', icon: '🥣' }
    ]
  },

  onShow: function() {
    if (this.data.hotList.length === 0) {
      this.loadData()
    }
    this.updateTabBar('/pages/index/index')
  },

  updateTabBar: function(path) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selectedPath: path })
    }
  },

  loadData: function() {
    this.setData({
      hotList: this.getHotRecipes()
    })
  },

  getHotRecipes: function() {
    return [
      { _id: '1', name: '番茄炒蛋', desc: '经典家常菜，简单美味', color: '#ffd93d', emoji: '🍅', category: '家常菜' },
      { _id: '2', name: '红烧肉', desc: '肥而不腻，入口即化', color: '#ff6b6b', emoji: '🍖', category: '家常菜' },
      { _id: '8', name: '麻婆豆腐', desc: '麻辣鲜香，川味经典', color: '#ff9ff3', emoji: '🧈', category: '川菜' },
      { _id: '43', name: '清蒸鲈鱼', desc: '鲜嫩爽滑，原汁原味', color: '#87ceeb', emoji: '🐟', category: '粤菜' }
    ]
  },

  goDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  },

  goCategory: function() {
    wx.switchTab({
      url: '/pages/category/category'
    })
  },

  goLucky: function() {
    wx.navigateTo({
      url: '/pages/lucky/lucky'
    })
  }
})