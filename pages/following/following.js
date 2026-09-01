Page({
  data: {
    list: []
  },

  onShow: function() {
    this.loadFollowing()
  },

  loadFollowing: function() {
    const allUsers = [
      { id: '1', name: '美食达人', avatar: '👨‍🍳', avatarColor: '#ff6b6b', desc: '分享各种美食做法' },
      { id: '2', name: '小厨娘', avatar: '👩‍🍳', avatarColor: '#4d96ff', desc: '家常菜爱好者' },
      { id: '3', name: '川菜大师', avatar: '👨‍🍳', avatarColor: '#fd79a8', desc: '专注川菜30年' },
      { id: '4', name: '烘焙小王子', avatar: '🧑‍🍳', avatarColor: '#ffa502', desc: '甜品制作分享' },
      { id: '5', name: '健康生活', avatar: '🧘', avatarColor: '#55efc4', desc: '健康饮食倡导者' },
      { id: '6', name: '吃货小王', avatar: '👦', avatarColor: '#4d96ff', desc: '刚关注' },
      { id: '7', name: '美食探索者', avatar: '🧑', avatarColor: '#fd79a8', desc: '3天前关注' },
      { id: '8', name: '菜谱收集者', avatar: '👩', avatarColor: '#ffa502', desc: '1周前关注' },
      { id: '9', name: '厨房新手', avatar: '👧', avatarColor: '#55efc4', desc: '2周前关注' },
      { id: '10', name: '爱做饭的猫', avatar: '🐱', avatarColor: '#a29bfe', desc: '3周前关注' },
      { id: '11', name: '烘焙爱好者', avatar: '👩‍🍳', avatarColor: '#ff6b6b', desc: '1个月前关注' },
      { id: '12', name: '素食主义者', avatar: '🥬', avatarColor: '#00b894', desc: '1个月前关注' },
      { id: '13', name: '川菜迷', avatar: '🌶️', avatarColor: '#e17055', desc: '2个月前关注' }
    ]
    
    const followingIds = wx.getStorageSync('followingIds') || ['1', '2', '3', '4', '5']
    
    const followingList = allUsers.filter(item => followingIds.includes(item.id)).map(item => ({
      ...item,
      isFollowed: true
    }))
    this.setData({ list: followingList })
  },

  toggleFollow: function(e) {
    const id = e.currentTarget.dataset.id
    let followingIds = wx.getStorageSync('followingIds') || ['1', '2', '3', '4', '5']
    
    followingIds = followingIds.filter(item => item !== id)
    wx.setStorageSync('followingIds', followingIds)
    
    this.loadFollowing()
    
    wx.showToast({
      title: '已取消关注',
      icon: 'none'
    })
  },

  goBack: function() {
    wx.navigateBack()
  }
})