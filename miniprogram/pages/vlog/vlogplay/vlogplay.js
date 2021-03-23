const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar, 
    vlogsrc:'',
    vlogshow:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that=this;
    var vlogshow = await api.checkVlogShow();
    if(vlogshow){
      that.setData({
        vlogsrc:options.vlogsrc,
        vlogshow:true
      })
    }else{
      that.setData({ 
        vlogshow:false,
        showtest:'因为视频服务违反社区规定，现在特意将VLOG板块下架，稍后企业主体小程序申请完成后再展示，谢谢关注！'
      })
    }
    
  }, 
  videoTap: function () {
    //获取video
    this.videoContext = wx.createVideoContext('myVideo')
    if (this.data.play) {
      //开始播放
      this.videoContext.play()//开始播放
      this.setData({
        play: false
      })
    } else {
      //当play==false 显示图片 暂停
      this.videoContext.pause()//暂停播放
      this.setData({
        play: true
      })
    }
  },
})