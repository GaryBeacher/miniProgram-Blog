const config = require('../../utils/config.js')
const api = require('../../utils/api.js');
const yuque = require('../../utils/yuque.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    iconList: [{
        icon: 'favor',
        color: 'red',
        badge: 120,
        name: '我的收藏',
        bindtap: 'bindCollect'
      }, {
        icon: 'appreciate',
        color: 'yellow',
        badge: 1,
        name: '我的点赞',
        bindtap: 'bindZan'
      },
      {
        icon: 'github',
        color: 'blue',
        badge: 0,
        name: 'GitHub',
        bindtap: 'bindNotice'
      },
      {
        icon: 'moneybag',
        color: 'olive',
        badge: 22,
        name: '打赏支持',
        bindtap: 'showQrcode'
      }, {
        icon: 'people',
        color: 'cyan',
        badge: 0,
        name: '关于Gary',
        bindtap: "showWechatCode"
      },  
      {
        icon: 'explore',
        color: 'cyan',
        badge: 0,
        name: '更新日志',
        bindtap: "showRelease"
      }, {
        icon: 'copy',
        color: 'red',
        badge: 0,
        name: '留言联系',
        bindtap: ""
      },  {
        icon: 'similar',
        color: 'brown',
        badge: 0,
        name: '意见反馈',
        bindtap: ""
      }, {
        icon: 'selection',
        color: 'cyan',
        badge: 0,
        name: '查看简历',
        bindtap: "showResume"
      }
    ],
    userInfo: {},
    showLogin: false,
    isAuthor: false,
    showRedDot: '',
    isShowInfo: false,
    isAuthoried: false,
    isLabelModelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let i = 0;
    numDH(); 
    function numDH() {
      if (i < 20) {
        setTimeout(function () {
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          })
          i++
          numDH();
        }, 20)
      } else {
        that.setData({
          starCount: that.coutNum(120),
          forksCount: that.coutNum(214),
          visitTotal: that.coutNum(1633)
        })
      }
    }
    app.checkUserInfo(function (userInfo, isLogin) {
      if (!isLogin) {
        that.setData({
          isAuthoried: true
        })
      } else {
        that.setData({
          userInfo: userInfo
        });
      }
    });
    let showRedDot = wx.getStorageSync('showRedDot');
    that.setData({
      isShowInfo: true,
      showRedDot: showRedDot,
    });
    await that.checkAuthor();


    wx.hideLoading()
  },
  coutNum(e) {
    if (e > 1000 && e < 10000) {
      e = (e / 1000).toFixed(1) + 'k'
    }
    if (e > 10000) {
      e = (e / 10000).toFixed(1) + 'W'
    }
    return e
  },
  // 关闭授权弹窗
  hideAuthorizeModel: function () {
    var that = this;
    app.checkUserInfo(function (userInfo, isLogin) {
      that.setData({
        isAuthoried: false,
        userInfo: userInfo
      });
    });
  },
  /**
   * 返回
   */
  navigateBack: function (e) {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }, 
  /**
   * 展示打赏二维码
   * @param {} e 
   */
  showQrcode: async function (e) {
    wx.previewImage({
      urls: [config.moneyUrl],
      current: config.moneyUrl
    })
  },
  /**
   * 展示微信二维码
   * @param {*} e 
   */
  showWechatCode: async function (e) {
    wx.navigateTo({
      url: '/mine/gary/gary',
    })
    // wx.previewImage({
    //   urls: [config.wechatUrl],
    //   current: config.wechatUrl
    // })
  },
  /**
   * 跳转我的收藏
   * @param {*} e 
   */
  bindCollect: async function (e) {
    wx.navigateTo({
      url: '/mine/collection/collection?type=1'
    })
  },
  /**
   * 跳转我的微博
   * @param {*} e 
   */
  showWeibo: async function (e) {
    var vlogshow = await api.checkVlogShow();
    if (vlogshow.result) {
      wx.navigateTo({
        url: '/mine/faweibo/faweibo'
      })
    } else {
      wx.showToast({
        title: '微圈暂时下架，请使用其他功能～～～',
        icon: "none"
      })
    }
  },
  /**
   * 跳转我的点赞 
   * @param {*} e 
   */
  bindZan: async function (e) {
    wx.navigateTo({
      url: '/mine/collection/collection?type=2'
    })
  },

  /**
   * 后台设置
   * @param {} e 
   */
  showAdmin: async function (e) {
    wx.navigateTo({
      url: '/admin/index'
    })
  },

  /**
   * 历史版本
   * @param {} e 
   */
  showRelease: async function (e) {
    wx.navigateTo({
      url: '/mine/release/release'
    })
  },

  /**
   * 我的消息
   * @param {*} e 
   */
  bindNotice: async function (e) {
    wx.setClipboardData({
      data: "https://github.com/GaryBeacher",
      success: function (res) {
        wx.showToast({
          title: 'github地址已经复制成功',
          icon: "none"
        });
      }
    });

  },
  /**
   * 查看简历
   */
  showResume() {
    this.setData({
      isLabelModelShow: true
    })
  },
  /**
   * 隐藏简历弹窗入口
   * @param {*} e 
   */
  hideLabelModal(e) {
    this.setData({
      isLabelModelShow: false
    })
  },
  /**
   * 验证是否是管理员
   */
  checkAuthor: async function (e) {
    let that = this;
    const value = wx.getStorageSync('isAuthor')
    if (value) {
      that.setData({
        isAuthor: value
      })
    } else {
      let res = await api.checkAuthor(); 
      wx.setStorageSync('isAuthor', res.result)
      that.setData({
        isAuthor: res.result
      })
    }
  },

  /**
   * 发送简历口令
   */
  formLabelSubmit: async function (e) { 
    const {
      password
    } = e.detail.value; 
    const checkoutResume=await api.checkResume(password);
    console.log(checkoutResume.result)
    if (!checkoutResume.result) {
      wx.showToast({
        title: '请联系Gary获取正确口令哦~',
        icon: 'none',
        duration: 1500
      })
    } else {
      this.hideLabelModal();
      wx.downloadFile({
        url: 'https://7a62-zbq-ev6l9-1300157766.tcb.qcloud.la/FE-Gary.pdf',
        success: function (res) {
          var filePath = res.tempFilePath
          wx.openDocument({
            showMenu:true,
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        }
      })
    }
  },
})