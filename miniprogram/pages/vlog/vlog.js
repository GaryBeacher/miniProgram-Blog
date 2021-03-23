const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar, 
    openid: app.globalData.openid,
    tishi:"",
    vlogList: [],   
    vlogsrc: '',
    showLoading: true 
  },
  // 去播放
  toplay(e) {
    wx.navigateTo({
      url: './vlogplay/vlogplay?vlogsrc=' + e.currentTarget.dataset.src,
    })
  },
  // 下拉刷新
  onPullDownRefresh: async function () {
    var that = this;
    wx.showToast({
      title: '正在加载中',
      icon: "none"
    })
    if (that.data.vlogshow) { 
      let vloglist = await api.getVlogList(1)//获取列表
      that.setData({
        vlogList: vloglist.data,
        page: 1
      })
    } 
    wx.hideToast()
    wx.stopPullDownRefresh()
  },
  // 上啦加载
  onReachBottom: async function () {
    let vloglist = await api.getVlogList(this.data.page + 1);
    if ((vloglist.data).length == 0) {
      return
    } else {
      this.setData({
        // weiboData: this.data.weiboData,
        page: this.data.page + 1
      })
    }
    wx.stopPullDownRefresh();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var that = this;
    var vlogshow = await api.checkVlogShow();
    this.setData({
      showLoading:false
    })
    that.setData({
      vlogshow: vlogshow.result
    }) 
    if (vlogshow.result){
      let vloglist = await api.getVlogList(that.data.page) 
      that.setData({
        vlogList: vloglist.data, 
          showLoading: true 
      })
    }else{
      that.setData({
        tishi:'因为视频服务违反社区规定，现在特意将VLOG板块下架，稍后企业主体小程序申请完成后再展示，谢谢关注！', 
        showLoading: true 
      })
    }  
  }, 
  //模拟页面双击返回顶部
  doubleClick(e) {
    if (e.timeStamp - this.touchStartTime < 300) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
    this.touchStartTime = e.timeStamp;
  }
})