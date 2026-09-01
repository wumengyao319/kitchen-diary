// pages/shopping/shopping.js - 购物清单（买菜时勾选）
Page({
  data: {
    items: [],
    leftCount: 0,
    doneCount: 0
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const items = wx.getStorageSync('shoppingList') || []
    this.setData({
      items,
      leftCount: items.filter(i => !i.checked).length,
      doneCount: items.filter(i => i.checked).length
    })
  },

  toggleItem(e) {
    const id = e.currentTarget.dataset.id
    const items = this.data.items.map(i => (i.id === id ? { ...i, checked: !i.checked } : i))
    wx.setStorageSync('shoppingList', items)
    this.refresh()
  },

  addItem() {
    wx.showModal({
      title: '添加食材',
      editable: true,
      placeholderText: '如：番茄 2 个',
      success: (res) => {
        if (!res.confirm || !res.content || !res.content.trim()) return
        const items = wx.getStorageSync('shoppingList') || []
        items.unshift({ id: Date.now().toString(), name: res.content.trim(), checked: false })
        wx.setStorageSync('shoppingList', items)
        this.refresh()
      }
    })
  },

  removeItem(e) {
    const id = e.currentTarget.dataset.id
    const items = this.data.items.filter(i => i.id !== id)
    wx.setStorageSync('shoppingList', items)
    this.refresh()
  },

  clearDone() {
    const items = this.data.items.filter(i => !i.checked)
    wx.setStorageSync('shoppingList', items)
    this.refresh()
  }
})
