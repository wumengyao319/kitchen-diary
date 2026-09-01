const recipesData = require('../../data/recipes.js')

Page({
  data: {
    wheelIcon: '🎲',
    wheelLabel: '点击开始抽签',
    isSpinning: false,
    showResult: false,
    resultRecipe: {},
    history: [],
    icons: ['🍳', '🌶️', '🦐', '🦞', '🥬', '🍚', '🍰', '🥣', '🍅', '🍖', '🍗', '🐟']
  },

  onLoad: function() {
    try {
      const history = wx.getStorageSync('lucky_history') || []
      this.setData({ history })
    } catch (e) {
      this.setData({ history: [] })
    }
  },

  spin: function() {
    if (this.data.isSpinning) return

    this.setData({
      isSpinning: true,
      showResult: false
    })

    let count = 0
    const maxCount = 25
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.data.icons.length)
      this.setData({
        wheelIcon: this.data.icons[randomIndex],
        wheelLabel: '抽签中...'
      })
      count++
      if (count >= maxCount) {
        clearInterval(interval)
        setTimeout(() => {
          this.setData({
            isSpinning: false
          })
          this.showResult()
        }, 300)
      }
    }, 80)
  },

  showResult: function() {
    const recipes = recipesData.recipes || []
    const randomIndex = Math.floor(Math.random() * recipes.length)
    const recipe = recipes[randomIndex]

    const resultRecipe = {
      ...recipe,
      time: this.getCurrentTime()
    }

    this.setData({
      showResult: true,
      resultRecipe: resultRecipe,
      wheelIcon: recipe.emoji,
      wheelLabel: recipe.name
    })

    try {
      const history = [resultRecipe, ...this.data.history.slice(0, 4)]
      this.setData({ history })
      wx.setStorageSync('lucky_history', history)
    } catch (e) {
      console.log('Storage error')
    }
  },

  getCurrentTime: function() {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  },

  spinAgain: function() {
    this.setData({
      showResult: false,
      wheelIcon: '🎲',
      wheelLabel: '点击开始抽签'
    })
    setTimeout(() => {
      this.spin()
    }, 300)
  },

  goDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  },

  clearHistory: function() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有抽签记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ history: [] })
          try {
            wx.setStorageSync('lucky_history', [])
          } catch (e) {
            console.log('Storage error')
          }
        }
      }
    })
  }
})