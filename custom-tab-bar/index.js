Component({
  data: {
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: '🏠' },
      { pagePath: '/pages/category/category', text: '菜类', icon: '📚' },
      { pagePath: '/pages/dynamic/dynamic', text: '动态', icon: '💬' },
      { pagePath: '/pages/search/search', text: '搜菜', icon: '🔍' },
      { pagePath: '/pages/profile/profile', text: '个人', icon: '👤' }
    ],
    selectedPath: ''
  },

  attached: function() {
    const pages = getCurrentPages()
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      this.setData({
        selectedPath: '/' + currentPage.route
      })
    }
  },

  methods: {
    switchTab: function(e) {
      const path = e.currentTarget.dataset.path
      this.setData({ selectedPath: path })
      wx.switchTab({ url: path })
    }
  }
})