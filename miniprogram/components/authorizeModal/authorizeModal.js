const app = getApp() 
Component({
  data: { shopimg: '' },
  methods: {
    getUserInfo(e) {
      if (e.detail.errMsg == 'getUserInfo:ok') { 
        wx.setStorageSync('userInfo', e.detail.userInfo);
        this.triggerEvent("hideAuthorizeModel")
      } else {  
        wx.showToast({
          title: '授权才能获得更好服务',
          icon: 'none'
        })
      }
    },  
  }
})