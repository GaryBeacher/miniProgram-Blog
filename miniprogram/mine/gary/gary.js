const api = require('../../utils/api.js');
const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    text1: '我是Gary，1990年中国制造，目前任职五八同城高级前端工程师，主要工作是把谷歌百度到的代码到项目中的搬运，天天在办公室听音乐，划水。',
    text2: '这个平台是个人的博客平台，我会不定时更新公众号文章，分享技术文章，游记，摄影图片，甚至音乐视频等。', 
  },
  onload(){
    
  },
  previewImg: function (e) { 
    wx.previewImage({
      current: 'cloud://zbq-ev6l9.7a62-zbq-ev6l9-1300157766/garyimg.jpeg', // 当前显示图片的http链接
      urls: ['cloud://zbq-ev6l9.7a62-zbq-ev6l9-1300157766/garyimg.jpeg'] // 需要预览的图片http链接列表
    })
  },
  previewImg2: function (e) {
    wx.previewImage({
      current: 'cloud://zbq-ev6l9.7a62-zbq-ev6l9-1300157766/WechatIMG142.jpeg', // 当前显示图片的http链接
      urls: ['cloud://zbq-ev6l9.7a62-zbq-ev6l9-1300157766/WechatIMG142.jpeg'] // 需要预览的图片http链接列表
    })
  }
})