const api = require('../../utils/api.js'); 
// const regeneratorRuntime = require('../../../utils/runtime.js');
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,   
    scrollLeft: 0, 
    curLabelName: "",
    labelList: [],
    isLabelModelShow: false,
    isLabelRelatedShow: false,
    nomore: false,
    nodata: false,
    page: 1, 
    filter: {},
    posts: [],
    checkedList: [],
    canOperate: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var that = this;
    let vloglist = await api.getVlogList(that.data.page) 
    that.setData({
      vlogList: vloglist.data
    })
  },
 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    let that = this;
    that.setData({
      labelList: []
    })
    await api.getVlogList(that.data.page)
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 获取label集合
   * @param {*} e 
   */
  getLabelList: async function () {
    let that = this
    let labelList = await api.getLabelList()
    console.info(labelList)
    that.setData({
      labelList: labelList.result.data
    })
  },

  /**
    * 显示
    * @param {} e 
  */
  showLabelModal(e) {
    this.setData({
      isLabelModelShow: true
    })
  },
  showLabelRelatedModal: async function (e) {
    let that = this
    let curLabelName = e.currentTarget.dataset.labelname
    let filter = {
      isShow: 1,
      containLabel: 2,
      label: curLabelName
    }

    that.setData({
      curLabelName: curLabelName,
      isLabelRelatedShow: true,
      filter: filter,
      nomore: false,
      nodata: false,
      page: 1,
      posts: [],
      checkedList: [],
      canOperate: true
    })

    await that.getPostsList(filter)
  },
  /**
    * 隐藏
    * @param {*} e 
  */
  hideLabelModal(e) {
    this.setData({
      isLabelModelShow: false
    })
  },
  hideLabelRelatedModal(e) {
    this.setData({
      isLabelRelatedShow: false,
      nomore: false,
      nodata: false,
      page: 1,
      posts: [],
      curLabelName: "",
      checkedList: [], 
      scrollLeft: 0
    })
  },
  /**
   * 保存标签
   * @param {*} e 
   */
  formLabelSubmit: async function (e) { 
    let that = this;
    const { vlogName, vlogdes, vlogimg, vlogsrc ,} = e.detail.value;
    let vlogdata ={
      vlogName, vlogdes, vlogimg, vlogsrc,
      timestamp: util.formatTime(Date.now(), 'Y/M/D h:m:s'),
    }; 
    if (vlogsrc === undefined || vlogsrc === "") {
      wx.showToast({
        title: '请填写正确的vlog地址',
        icon: 'none',
        duration: 1500
      })
    }
    else {
      wx.showLoading({
        title: '保存中...',
      })
      let res = await api.uploadVlog(vlogdata)
      wx.hideLoading()
      if (res.result) {
        that.setData({
          isLabelModelShow: false, 
        })
        that.onPullDownRefresh()
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 1500
        })
      }
      else {
        wx.showToast({
          title: '保存出错，请查看云函数日志',
          icon: 'none',
          duration: 1500
        })
      }
    }
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  /**
   * 返回上一页
   * @param {*} e 
   */
  goback: async function (e) {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   *  触发滚动底部事件
   */
  bindscrolltolower: async function () {
    let that = this;
    if(!that.data.canOperate)
    {
      return;
    }

    that.setData({
      canOperate: false
    })
    // that.getPostsList(that.data.filter)
  },
  deletevlog: async function (e){
    let that=this
    let vlogid = e.currentTarget.dataset.id; 
    let result = await api.deleteVlogById(vlogid);
    if(result.result){
      wx.showToast({
        title: '删除成功',
      })
      let vloglist = await api.getVlogList(that.data.page)
      that.setData({
        vlogList: vloglist.data
      })
    }
  }
})