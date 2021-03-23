 var audio = null;
 Page({
   /**
    * 页面的初始数据
    */
   data: {
     allCount: 2, 
     oldIndex: 0,
     leftOut: ['fadeOutRight', 'bounceOut', 'zoomOut', 'rotateOutDownLeft', 'lightSpeedOut', 'zoomOutDown', 'zoomOutRight', 'zoomOutUp'],
     rightOut: ['fadeOutLeft', 'bounceOut', 'zoomOut', 'rotateOutDownRight', 'lightSpeedOut1', 'zoomOutDown', 'zoomOutLeft', 'zoomOutUp'],
   },
   /**
    * 触摸开始
    * @param e
    */
   touchStart: function touchStart(e) {
     this.setData({
       startX: e.changedTouches[0].clientX
     });
   },
 
 
   /**
    * 展示动画
    */
   showAnimated: function showAnimated() {
     var that = this; 
       setTimeout(function() { 
           that.one_one= 'animated fadeIn',
           that.setData({
            one_two:'animated bounceIn' 
           }) 
       }, 1000);
       setTimeout(function() { 
           that.one_three='animated bounceIn' 
       }, 1500);
       setTimeout(function() { 
          that.setData({
           one_four:'animated bounceIn' 
          }) 
       }, 1800);
       setTimeout(function() {
           that.one_five= 'animated lightSpeedIn'
       }, 1900);
       setTimeout(function() {
           that.one_six= 'animated fadeIn'
       }, 2200);
       setTimeout(function() {
          that.setData({
            one_sev :'animated fadeIn',
           one_eig:'animated fadeIn',
          })
        }, 1300);
       setTimeout(function() {
        that.setData({
           one_sev:'two-sev-scale'
          })

       }, 2300);
       setTimeout(function() {
           that.one_six='indexMove'
       }, 3200); 
   },

   /**
    * 清除动画
    */
   cleanAnimated: function cleanAnimated() {
     var that = this;
     // one
     if (this.data.oldIndex === 0) {
         that.one_one= 'animated lightSpeedIn';  
         that.one_three= 'animated lightSpeedIn'; 
         that.one_five= 'animated lightSpeedIn';
         that.one_six= 'animated lightSpeedIn'; 
         that.one_nin= 'animated fadeOut' 
         that.setData({
          one_two:'animated lightSpeedIn' ,
          one_four:'animated lightSpeedIn' ,
          one_sev:'animated lightSpeedIn' ,
         }) 

     } else if (this.data.oldIndex === 1) {
         that.two_one= 'animated lightSpeedIn';
         that.two_two= 'animated lightSpeedIn';
         that.two_three= 'animated lightSpeedIn';
         that.two_four= 'animated lightSpeedIn';
         that.two_five= 'animated lightSpeedIn';
         that.two_six= 'animated lightSpeedIn';
         that.two_sev= 'animated lightSpeedIn';
       setTimeout(function() {
           that.one_nin_hide=false
       }, 1000);
     }
   }, 
   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function onShow() {
     // TODO: onShow
     var that = this;
     this.showAnimated();

     // bottom
     if (that.data.bottomStatus !== 0) {
       that.setData({
         bottomStatus: 0
       });
       setTimeout(function() {
         that.setData({
           bottom: 'animated slideInUp'
         });
       }, 2000);
       setTimeout(function() {
         that.setData({
           bottom_one: 'animated slideInUp'
         });
       }, 2100);
       setTimeout(function() {
         that.setData({
           bottom_two: 'animated slideInUp'
         });
       }, 2200);
       setTimeout(function() {
         that.setData({
           bottom_three: 'animated slideInUp'
         });
       }, 2300);
       setTimeout(function() {
         that.setData({
           bottom_four: 'animated slideInUp'
         });
       }, 2400);
       setTimeout(function() {
         that.setData({
           bottom_one: 'bottom-4s-move'
         });
       }, 3100);
       setTimeout(function() {
         that.setData({
           bottom_two: 'bottom-3s-move'
         });
       }, 3200);
       setTimeout(function() {
         that.setData({
           bottom_three: 'bottom-2s-move'
         });
       }, 3300);
       setTimeout(function() {
         that.setData({
           bottom_four: 'bottom-1s-move'
         });
       }, 3400);
     }
   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function onHide() {
     this.cleanAnimated();
   },
   getAuthorize: function getAuthorize() {
     let _that = this;
     wx.switchTab({
       url: '/pages/index/index',
     })
   },
   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function onUnload() {
     this.cleanAnimated();
   },
   onShareAppMessage: function onShareAppMessage() {
     return {
       title: '分享给你一个好玩的小程序哦～～',
       path: '/pages/loading/loading',
       success: function success(res) {
         // 分享成功
       },
       fail: function fail(res) {
         // 分享失败
       }
     };
   }
 });