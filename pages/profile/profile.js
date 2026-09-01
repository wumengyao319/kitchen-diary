Page({
  data: {
    userInfo: {
      nickname: '美食爱好者',
      avatar: '👤',
      signature: '热爱美食，热爱生活',
      location: '北京',
      followers: 156,
      following: 89,
      gender: '',
      backgroundColor: '#FF6B6B',
      bgPrimaryColor: '#FF6B6B',
      bgSecondaryColor: '#FF8E8E'
    },
    bgColors: [
      { name: '热情红', value: '#FF6B6B' },
      { name: '清新绿', value: '#55EFC4' },
      { name: '天空蓝', value: '#4D96FF' },
      { name: '梦幻紫', value: '#A29BFE' },
      { name: '阳光橙', value: '#FFA502' },
      { name: '玫瑰红', value: '#E15554' },
      { name: '薄荷绿', value: '#00CEC9' },
      { name: '海洋蓝', value: '#2980B9' }
    ],
    stats: {
      recipes: 12,
      favorites: 28,
      followers: 156,
      dynamicLikes: 3,
      dynamicFavorites: 5,
      recipeLikes: 8,
      recipeFavorites: 12
    },
    activeTab: '',
    favorites: [],
    dynamicLikes: [],
    dynamicFavorites: [],
    recipeLikes: [],
    recipeFavorites: [],
    showEditModal: false
  },

  onLoad: function() {
    this.loadUserInfo()
    this.loadFavorites()
    this.ensureBgColors()
  },

  ensureBgColors: function() {
    const userInfo = this.data.userInfo
    if (!userInfo.backgroundColor) {
      this.setData({
        'userInfo.backgroundColor': '#FF6B6B'
      })
    }
  },

  onShow() {
    this.updateTabBar('/pages/profile/profile')
    this.updateStats()
  },

  updateStats: function() {
    const likedDynamics = wx.getStorageSync('likedDynamics') || []
    const collectedDynamics = wx.getStorageSync('collectedDynamics') || []
    const likedRecipes = wx.getStorageSync('likedRecipes') || []
    const favorites = wx.getStorageSync('favorites') || []
    
    this.setData({
      stats: {
        ...this.data.stats,
        dynamicLikes: likedDynamics.length,
        dynamicFavorites: collectedDynamics.length,
        recipeLikes: likedRecipes.length,
        recipeFavorites: favorites.length
      }
    })
    this.updateTabBar('/pages/profile/profile')
  },

  updateTabBar(path) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selectedPath: path })
    }
  },

  loadUserInfo: function() {
    try {
      const saved = wx.getStorageSync('userInfo')
      if (saved) {
        this.setData({ 
          userInfo: {
            ...this.data.userInfo,
            ...saved,
            backgroundColor: saved.backgroundColor || saved.bgPrimaryColor || this.data.userInfo.backgroundColor || '#FF6B6B'
          }
        })
      }
    } catch (e) {
      console.log('Load user info error')
    }
  },

  onAvatarError: function() {
    const userInfo = { ...this.data.userInfo, avatar: '👤' }
    this.setData({ userInfo })
  },

  loadFavorites: function() {
    const recipesData = require('../data/recipes.js')
    const favoriteIds = wx.getStorageSync('favorites') || []
    const allRecipes = recipesData.recipes || []
    
    // 根据收藏的 id 查找对应的菜谱详情（使用字符串比较）
    const userFavorites = favoriteIds.map(favId => {
      return allRecipes.find(recipe => String(recipe._id) === String(favId))
    }).filter(item => item) // 过滤掉找不到的
    
    this.setData({
      favorites: userFavorites
    })
  },

  goToFavorites: function() {
    this.loadFavorites()
    this.setData({ activeTab: 'favorites' })
  },

  goToDynamicLikes: function() {
    wx.navigateTo({ url: '/pages/dynamic-likes/dynamic-likes' })
  },

  goToDynamicFavorites: function() {
    wx.navigateTo({ url: '/pages/dynamic-favorites/dynamic-favorites' })
  },

  goToRecipeLikes: function() {
    wx.navigateTo({ url: '/pages/recipe-likes/recipe-likes' })
  },

  goToRecipeFavorites: function() {
    wx.navigateTo({ url: '/pages/recipe-favorites/recipe-favorites' })
  },

  goToFollowing: function() {
    wx.navigateTo({ url: '/pages/following/following' })
  },

  goToFollowers: function() {
    wx.navigateTo({ url: '/pages/followers/followers' })
  },

  chooseAvatar: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        this.setData({
          'userInfo.avatar': tempFilePath,
          showEditModal: false
        })
        this.saveUserInfoToStorage()
        wx.showToast({ title: '头像更换成功', icon: 'success' })
      },
      fail: () => {
        wx.showToast({ title: '选择图片失败', icon: 'none' })
      }
    })
  },

  selectBackgroundColor: function(e) {
    const color = e.currentTarget.dataset.color
    this.setData({
      'userInfo.backgroundColor': color
    })
  },

  saveUserInfoToStorage: function() {
    try {
      wx.setStorageSync('userInfo', this.data.userInfo)
    } catch (e) {
      console.log('Save user info error')
    }
  },

  goToAbout: function() {
    wx.showToast({ title: '美食食谱 v1.0.0', icon: 'none' })
  },

  logout: function() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录并切换账号吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('userInfo')
            wx.removeStorageSync('rememberedUser')
          } catch (e) {
            console.log('Clear storage error')
          }
          wx.showToast({ title: '已退出登录', icon: 'success' })
          setTimeout(() => {
            wx.redirectTo({ url: '/pages/login/login' })
          }, 1500)
        }
      }
    })
  },

  backToProfile: function() {
    this.setData({ activeTab: '' })
  },

  goDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  },

  openEditModal: function() {
    this.setData({ showEditModal: true })
  },

  hideEditModal: function() {
    this.setData({ showEditModal: false })
  },

  stopPropagation: function() {},

  onEditInput: function(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`userInfo.${field}`]: e.detail.value
    })
    this.autoSave()
  },

  selectGender: function(e) {
    const gender = e.currentTarget.dataset.gender
    this.setData({
      'userInfo.gender': gender
    })
    this.autoSave()
  },

  autoSave: function() {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer)
    }
    this.autoSaveTimer = setTimeout(() => {
      this.saveUserInfoToStorage()
      wx.showToast({ title: '已自动保存', icon: 'success', duration: 1000 })
    }, 500)
  }
})