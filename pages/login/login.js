// pages/login/login.js - 登录/注册（本地账号，密码哈希存储）
Page({
  data: {
    username: '',
    password: '',
    rememberMe: false,
    showRegister: false,
    registerUsername: '',
    registerPassword: '',
    registerConfirmPassword: '',
    registerNickname: ''
  },

  onLoad: function() {
    this.loadRememberedUser()
  },

  // 简单哈希：本地存储只存哈希值，不存明文密码
  hashPw: function(pw) {
    var hash = 5381
    var str = 'cj_salt_' + pw
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0
    }
    return 'h' + hash.toString(36)
  },

  loadRememberedUser: function() {
    try {
      const remembered = wx.getStorageSync('rememberedUser')
      if (remembered && remembered.username) {
        this.setData({
          username: remembered.username,
          rememberMe: true
        })
      }
    } catch (e) {
      console.log('Load remembered user error')
    }
  },

  onUsernameInput: function(e) {
    this.setData({ username: e.detail.value })
  },

  onPasswordInput: function(e) {
    this.setData({ password: e.detail.value })
  },

  toggleRemember: function(e) {
    this.setData({ rememberMe: e.detail.value.length > 0 })
  },

  onRegisterUsernameInput: function(e) {
    this.setData({ registerUsername: e.detail.value })
  },

  onRegisterPasswordInput: function(e) {
    this.setData({ registerPassword: e.detail.value })
  },

  onRegisterConfirmPasswordInput: function(e) {
    this.setData({ registerConfirmPassword: e.detail.value })
  },

  onRegisterNicknameInput: function(e) {
    this.setData({ registerNickname: e.detail.value })
  },

  toggleRemember: function() {
    this.setData({ rememberMe: !this.data.rememberMe })
  },

  showRegisterPage: function() {
    this.setData({ showRegister: true })
  },

  showLoginPage: function() {
    this.setData({ showRegister: false })
  },

  login: function() {
    const { username, password, rememberMe } = this.data

    if (!username.trim()) {
      wx.showToast({ title: '请输入账号', icon: 'none' })
      return
    }

    if (!password.trim()) {
      wx.showToast({ title: '请输入密码', icon: 'none' })
      return
    }

    try {
      const users = wx.getStorageSync('users') || []
      const user = users.find(u => u.username === username && u.passwordHash === this.hashPw(password))

      if (user) {
        const userInfo = {
          id: user.id,
          username: user.username,
          nickname: user.nickname || user.username,
          avatar: user.avatar || '',
          bgPrimaryColor: '#FF6B6B',
          bgSecondaryColor: '#FF8E8E'
        }

        wx.setStorageSync('userInfo', userInfo)

        // 「记住我」只记住账号，绝不存储密码（含哈希）
        if (rememberMe) {
          wx.setStorageSync('rememberedUser', { username: username })
        } else {
          wx.removeStorageSync('rememberedUser')
        }

        wx.showToast({ title: '登录成功', icon: 'success' })

        setTimeout(() => {
          wx.switchTab({ url: '/pages/index/index' })
        }, 1500)
      } else {
        wx.showToast({ title: '账号或密码错误', icon: 'none' })
      }
    } catch (e) {
      wx.showToast({ title: '登录失败', icon: 'none' })
    }
  },

  register: function() {
    const { registerUsername, registerPassword, registerConfirmPassword, registerNickname } = this.data

    if (!registerUsername.trim()) {
      wx.showToast({ title: '请输入账号', icon: 'none' })
      return
    }

    if (!registerPassword.trim() || registerPassword.length < 6) {
      wx.showToast({ title: '密码至少 6 位', icon: 'none' })
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      wx.showToast({ title: '两次输入的密码不一致', icon: 'none' })
      return
    }

    try {
      const users = wx.getStorageSync('users') || []
      const exists = users.find(u => u.username === registerUsername)

      if (exists) {
        wx.showToast({ title: '账号已存在', icon: 'none' })
        return
      }

      const newUser = {
        id: 'user_' + Date.now(),
        username: registerUsername,
        // 只存哈希，不存明文
        passwordHash: this.hashPw(registerPassword),
        nickname: registerNickname.trim() || registerUsername,
        avatar: '',
        isWxUser: false
      }

      users.push(newUser)
      wx.setStorageSync('users', users)

      wx.showToast({ title: '注册成功', icon: 'success' })

      setTimeout(() => {
        this.setData({
          showRegister: false,
          registerUsername: '',
          registerPassword: '',
          registerConfirmPassword: '',
          registerNickname: '',
          username: registerUsername,
          password: ''
        })
      }, 1500)
    } catch (e) {
      wx.showToast({ title: '注册失败', icon: 'none' })
    }
  }
})
