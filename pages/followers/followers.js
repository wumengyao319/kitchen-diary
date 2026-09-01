Page({
  data: {
    list: []
  },

  onLoad: function() {
    this.loadFollowers()
  },

  loadFollowers: function() {
    const followers = wx.getStorageSync('followers') || [
      { id: '1', name: '吃货小王', avatar: '👦', avatarColor: '#4d96ff', desc: '刚关注' },
      { id: '2', name: '美食探索者', avatar: '🧑', avatarColor: '#fd79a8', desc: '3天前关注' },
      { id: '3', name: '菜谱收集者', avatar: '👩', avatarColor: '#ffa502', desc: '1周前关注' },
      { id: '4', name: '厨房新手', avatar: '👧', avatarColor: '#55efc4', desc: '2周前关注' },
      { id: '5', name: '爱做饭的猫', avatar: '🐱', avatarColor: '#a29bfe', desc: '3周前关注' },
      { id: '6', name: '烘焙爱好者', avatar: '👩‍🍳', avatarColor: '#ff6b6b', desc: '1个月前关注' },
      { id: '7', name: '素食主义者', avatar: '🥬', avatarColor: '#00b894', desc: '1个月前关注' },
      { id: '8', name: '川菜迷', avatar: '🌶️', avatarColor: '#e17055', desc: '2个月前关注' }
    ]
    
    const followingIds = wx.getStorageSync('followingIds') || []
    
    const followersWithStatus = followers.map(item => ({
      ...item,
      isFollowed: followingIds.includes(item.id)
    }))
    
    this.setData({ list: followersWithStatus })
  },

  toggleFollow: function(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.list.map(item => {
      if (item.id === id) {
        return { ...item, isFollowed: !item.isFollowed }
      }
      return item
    })
    this.setData({ list: list })
    
    const followingIds = list.filter(item => item.isFollowed).map(item => item.id)
    wx.setStorageSync('followingIds', followingIds)
    
    const followedItem = list.find(item => item.id === id)
    wx.showToast({
      title: followedItem.isFollowed ? '关注成功' : '已取消关注',
      icon: 'none'
    })
  },

  goBack: function() {
    wx.navigateBack()
  }
})