
Page({ 
  data:{
node:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this; 
    wx.redirectTo({
      url: '/detail/detail?id=' + (options.scene || options.id),
    })
  },
})


