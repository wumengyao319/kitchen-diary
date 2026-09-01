Page({
  data: {
    list: []
  },

  onShow: function() {
    this.loadLikedDynamics()
  },

  loadLikedDynamics: function() {
    const likedIds = wx.getStorageSync('likedDynamics') || []
    const allDynamics = this.getAllDynamics()
    const likedDynamics = allDynamics.filter(item => likedIds.includes(item.id))
    this.setData({ list: likedDynamics })
  },

  getAllDynamics: function() {
    return [
      { id: '1', title: '红烧肉做法分享', author: '美食达人', time: '2小时前', color: '#FF6B6B', emoji: '🍖' },
      { id: '2', title: '麻婆豆腐成功体验', author: '厨房新手', time: '5小时前', color: '#E15554', emoji: '🌶️' },
      { id: '3', title: '自制提拉米苏', author: '甜品控', time: '1天前', color: '#FD79A8', emoji: '�' },
      { id: '4', title: '减脂餐分享', author: '健康生活', time: '2天前', color: '#55EFC4', emoji: '🥗' },
      { id: '5', title: '水煮鱼制作', author: '川菜爱好者', time: '2天前', color: '#74B9FF', emoji: '🐟' },
      { id: '6', title: '戚风蛋糕首秀', author: '烘焙新手', time: '3天前', color: '#FFEAA7', emoji: '�' },
      { id: '7', title: '番茄炒蛋秘诀', author: '家常菜高手', time: '2天前', color: '#FD79A8', emoji: '🍅' },
      { id: '8', title: '地三鲜分享', author: '素食主义者', time: '3天前', color: '#00CEC9', emoji: '🥬' },
      { id: '9', title: '白切鸡做法', author: '粤菜厨师', time: '3天前', color: '#FFEAA7', emoji: '🐔' },
      { id: '10', title: '蒜蓉粉丝蒸扇贝', author: '海鲜达人', time: '4天前', color: '#74B9FF', emoji: '🦐' }
    ]
  },

  goBack: function() {
    wx.navigateBack()
  },

  goDetail: function() {
    wx.showToast({ title: '查看详情', icon: 'none' })
  }
})