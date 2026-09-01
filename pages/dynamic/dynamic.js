// pages/dynamic/dynamic.js - 美食动态（官方菜谱号 + 我的做菜记录）
const recipesData = require('../../data/recipes.js')

Page({
  data: {
    dynamicList: [],
    showModal: false,
    publishContent: '',
    uploadImages: [],
    showCommentModal: false,
    commentContent: '',
    currentDynamicId: null,
    comments: {}
  },

  onShow: function() {
    this.loadData()
    this.updateTabBar('/pages/dynamic/dynamic')
  },

  updateTabBar: function(path) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selectedPath: path })
    }
  },

  // 动态流 = 官方菜谱号（真实菜谱数据生成）+ 我的做菜记录（本地持久化）
  loadData: function() {
    const likedIds = wx.getStorageSync('likedDynamics') || []
    const collectedIds = wx.getStorageSync('collectedDynamics') || []
    const myDynamics = wx.getStorageSync('myDynamics') || []
    const comments = wx.getStorageSync('dynamicComments') || {}

    const officialFeed = (recipesData.recipes || recipesData).slice(0, 12).map(r => ({
      id: 'recipe_' + r._id,
      avatar: '👨‍🍳',
      avatarColor: '#ff6b6b',
      userName: '美食食谱 · 官方号',
      time: '官方推荐',
      content: '【' + r.name + '】' + r.desc + '（' + r.cookTime + ' · ' + r.difficulty + '）' + r.ingredients.join('、') + '。点击收藏查看完整步骤！',
      likes: 60 + (Number(r._id) * 13) % 200,
      comments: 0,
      isRecipe: true,
      recipeId: r._id,
      recipeName: r.name
    }))

    // 我的做菜记录（本地持久化，置顶显示）
    const mine = myDynamics.map(m => ({
      ...m,
      isMine: true
    }))

    const dynamicList = mine.concat(officialFeed).map(item => ({
      ...item,
      isCollected: collectedIds.includes(item.id),
      isLiked: likedIds.includes(item.id)
    }))

    this.setData({
      dynamicList: dynamicList,
      comments: comments
    })
  },

  like: function(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.dynamicList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isLiked: !item.isLiked,
          likes: item.isLiked ? item.likes - 1 : item.likes + 1
        }
      }
      return item
    })
    this.setData({ dynamicList: list })

    const likedIds = list.filter(item => item.isLiked).map(item => item.id)
    wx.setStorageSync('likedDynamics', likedIds)
  },

  collect: function(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.dynamicList.map(item => {
      if (item.id === id) {
        return { ...item, isCollected: !item.isCollected }
      }
      return item
    })
    this.setData({ dynamicList: list })

    const collectedIds = list.filter(item => item.isCollected).map(item => item.id)
    wx.setStorageSync('collectedDynamics', collectedIds)

    wx.showToast({
      title: list.find(item => item.id === id).isCollected ? '收藏成功' : '取消收藏',
      icon: 'none'
    })
  },

  goRecipe: function(e) {
    const id = e.currentTarget.dataset.rid
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
      fail: function() {
        wx.showToast({ title: '可在菜类页查看该菜谱', icon: 'none' })
      }
    })
  },

  // 删除我的做菜记录
  deleteMine: function(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除这条记录',
      content: '确定删除这条做菜记录吗？',
      confirmText: '删除',
      confirmColor: '#8a3b2e',
      success: (res) => {
        if (res.confirm) {
          const myDynamics = (wx.getStorageSync('myDynamics') || []).filter(m => m.id !== id)
          wx.setStorageSync('myDynamics', myDynamics)
          this.loadData()
        }
      }
    })
  },

  showComment: function(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      showCommentModal: true,
      currentDynamicId: id,
      commentContent: ''
    })
  },

  hideCommentModal: function() {
    this.setData({
      showCommentModal: false,
      commentContent: '',
      currentDynamicId: null
    })
  },

  onCommentInput: function(e) {
    this.setData({ commentContent: e.detail.value })
  },

  submitComment: function() {
    if (!this.data.commentContent.trim()) {
      wx.showToast({ title: '请输入评论内容', icon: 'none' })
      return
    }

    // 评论持久化（本地存储，刷新不丢失）
    const newComment = {
      id: Date.now().toString(),
      userName: '我',
      content: this.data.commentContent,
      time: '刚刚'
    }

    const comments = { ...this.data.comments }
    if (!comments[this.data.currentDynamicId]) {
      comments[this.data.currentDynamicId] = []
    }
    comments[this.data.currentDynamicId].unshift(newComment)
    wx.setStorageSync('dynamicComments', comments)

    const dynamicList = this.data.dynamicList.map(item => {
      if (item.id === this.data.currentDynamicId) {
        return { ...item, comments: (item.comments || 0) + 1 }
      }
      return item
    })

    this.setData({
      comments,
      dynamicList,
      showCommentModal: false,
      commentContent: ''
    })

    wx.showToast({ title: '笔记已记录', icon: 'success' })
  },

  showPublishModal: function() {
    this.setData({ showModal: true })
  },

  hidePublishModal: function() {
    this.setData({ showModal: false, publishContent: '' })
  },

  stopPropagation: function() {},

  onPublishInput: function(e) {
    this.setData({ publishContent: e.detail.value })
  },

  // 发布做菜记录：本地持久化（刷新不丢失）
  publish: function() {
    if (!this.data.publishContent.trim()) {
      wx.showToast({ title: '记录点什么吧', icon: 'none' })
      return
    }

    const newDynamic = {
      id: 'my_' + Date.now().toString(),
      avatar: '👤',
      avatarColor: '#999',
      userName: '我',
      time: '刚刚',
      content: this.data.publishContent,
      images: this.data.uploadImages.slice(),
      likes: 0,
      comments: 0,
      isLiked: false,
      isCollected: false
    }

    const myDynamics = wx.getStorageSync('myDynamics') || []
    myDynamics.unshift(newDynamic)
    wx.setStorageSync('myDynamics', myDynamics)

    this.setData({
      dynamicList: [newDynamic, ...this.data.dynamicList],
      showModal: false,
      publishContent: '',
      uploadImages: []
    })

    wx.showToast({ title: '记录成功', icon: 'success' })
  },

  chooseImage: function() {
    const that = this
    wx.chooseImage({
      count: 9 - this.data.uploadImages.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const newImages = that.data.uploadImages.concat(res.tempFilePaths)
        that.setData({ uploadImages: newImages })
      }
    })
  },

  deleteImage: function(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.uploadImages.filter((_, i) => i !== index)
    this.setData({ uploadImages: images })
  }
})
