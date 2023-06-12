const api = require('../../utils/api.js');
// const regeneratorRuntime = require('../../utils/runtime.js');
const app = getApp();
const config = require('../../utils/config.js')

Page({

     /**
      * 页面的初始数据
      */
     data: {
          tmp: '',
          imagesrc: '',
          cond_txt: '',
          location: '',
          duanju: ["人间忽晚，山河已秋", "迷途漫漫，终有一归", "星海横流，岁月成碑", "家人闲坐，灯火可亲", "身着白衣，心有锦缎", "马行千里，不洗尘沙", "落花无言，人淡如菊", "心有猛虎，细嗅蔷薇", "十年饮冰，难凉热血", "靡不有初，鲜克有终", "一如既往，万事胜意", "但行好事，莫问前程", "既见君子，云胡不喜", "一别两宽，各生欢喜", "太阳强烈，水波温柔", "玻璃晴朗，橘子辉煌", "生而为人，我很抱歉", "浮生若梦，为欢几何", "不忘初心，方得始终", "无用之用，方为大用", "宁鸣而死，不默而生", "衣不如新，人不如故", "高山仰止，景行行止", "山不过来，我就过去", "坠欢莫拾，酒痕在衣", "前途似海，来日方长", "慧极必伤，情深不寿", "雾失楼台，月迷津渡", "夕阳已去，皓月方来", "道阻且长，行则将至", "得之我幸，不得我命", "未知苦处，不信神佛", "凡是过往，皆为序章", "来如风雨，去似微尘"],
          week: [
               'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
          ],
          collection: {
               status: false,
               text: "收藏",
               icon: "favor"
          },
          zan: {
               status: false,
               text: "点赞",
               icon: "appreciate"
          },
          weekNum: Number,
          posts: [],
          StatusBar: app.globalData.StatusBar,
          CustomBar: app.globalData.CustomBar,
          page: 1,
          nodata: false,
          nomore: false,
          tabCur: 1,
          tname: '', //下拉查询条件 
          isAuthoried: false,
          showpostmask: false,
          maskid: '',
          showLoading: true
     },
     /**
      * 抽屉显示隐藏
      */
     showModal(e) {
          this.setData({
               modalName: e.currentTarget.dataset.target
          })
     },
     hideModal(e) {
          this.setData({
               modalName: null
          })
     },
     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: async function (options) {
          var _this = this;
          await _this.getClassifyList();
          wx.getLocation({
               success: function (data) {
                    wx.request({
                         url: 'https://free-api.heweather.com/s6/weather/now?location=' + data.longitude + ',' + data.latitude + '&key=bbabbb66397f4582a25ea922b546e27a',
                         success: function (res) {
                              var now = new Date(),
                                   hour = now.getHours(),
                                   times = '';
                              if (hour < 6) {
                                   _this.setData({
                                        times: 'n'
                                   })
                              } else if (hour < 9) {
                                   _this.setData({
                                        times: 'd'
                                   })
                              } else if (hour < 12) {
                                   _this.setData({
                                        times: 'd'
                                   })
                              } else if (hour < 14) {
                                   _this.setData({
                                        times: 'd'
                                   })
                              } else if (hour < 17) {
                                   _this.setData({
                                        times: 'd'
                                   })
                              } else if (hour < 19) {
                                   _this.setData({
                                        times: 'n'
                                   })
                              } else if (hour < 21) {
                                   _this.setData({
                                        times: 'n'
                                   })
                              } else {
                                   _this.setData({
                                        times: 'n'
                                   })
                              }
                              var tmp = res.data.HeWeather6[0].now.tmp + "℃" //温度 
                              var imagesrc = 'https://7a62-zbq-ev6l9-1300157766.tcb.qcloud.la/weather/back_' + res.data.HeWeather6[0].now.cond_code + _this.data.times + '.png';
                              var cond_txt = res.data.HeWeather6[0].now.cond_txt; //天气文字
                              var location = res.data.HeWeather6[0].basic.location; //定位地址 
                              var date = new Date();
                              var weekNum = date.getDay();
                              _this.setData({
                                   tmp: tmp,
                                   imagesrc: imagesrc,
                                   cond_txt: cond_txt,
                                   location: location,
                                   weekNum: weekNum,
                                   whduan: parseInt(Math.random() * 22)
                              })
                         }
                    })

               }
          })
     },
     /**
      * 页面上拉触底事件的处理函数
      */
     onReachBottom: async function () {
          let tname = this.data.tname
          await this.getPostsList(tname)
     },

     /**
      * 用户点击右上角分享
      */
     onShareAppMessage: function () {

     },
     /**
      * 点击文章明细
      */
     bindPostDetail: function (e) {
          if (this.data.lock) {
               this.data.lock = false;
               return;
          }
          this.setData({
               collection: {
                    status: false,
                    text: "收藏",
                    icon: "favor"
               },
               zan: {
                    status: false,
                    text: "点赞",
                    icon: "appreciate"
               },
               maskid: '',
               postidx: '',
               showpostmask: false
          })
          let blogId = e.currentTarget.id;
          wx.navigateTo({
               url: '/detail/detail?id=' + blogId
          })
     },
     /**
      * 长按文章列表
      */
     longTap(e) {
          let blogId = e.currentTarget.id;
          let postidx = e.currentTarget.dataset.idx;
          this.setData({
               postidx: postidx,
               maskid: blogId,
               showpostmask: true
          })
          this.data.lock = true;
          this.getPostRelated(blogId)
     },
     hidepostmask() {
          this.setData({
               collection: {
                    status: false,
                    text: "收藏",
                    icon: "favor"
               },
               zan: {
                    status: false,
                    text: "点赞",
                    icon: "appreciate"
               },
               maskid: '',
               postidx: '',
               showpostmask: false
          })
     },
     /**
      * 获取收藏和喜欢的状态
      */
     getPostRelated: async function (blogId) {
          let where = {
               postId: blogId,
               openId: app.globalData.openid
          }
          let postRelated = await api.getPostRelated(where, 1);
          let that = this;
          for (var item of postRelated.data) {
               if (config.postRelatedType.COLLECTION === item.type) {
                    that.setData({
                         collection: {
                              status: true,
                              text: "已收藏",
                              icon: "favorfill"
                         }
                    })
                    continue;
               }
               if (config.postRelatedType.ZAN === item.type) {
                    that.setData({
                         zan: {
                              status: true,
                              text: "已赞",
                              icon: "appreciatefill"
                         }
                    })
                    continue;
               }
          }
     },
     /**
      * 收藏功能
      */
     postCollection: async function () {
          try {
               let that = this;
               let collection = that.data.collection;
               if (collection.status === true) {
                    let result = await api.deletePostCollectionOrZan(that.data.maskid, config.postRelatedType.COLLECTION)
                    that.setData({
                         collection: {
                              status: false,
                              text: "收藏",
                              icon: "favor"
                         }
                    })
                    wx.showToast({
                         title: '已取消收藏',
                         icon: 'none',
                         duration: 1500
                    })
               } else {
                    let data = {
                         postId: that.data.maskid,
                         postTitle: that.data.posts[that.data.postidx].title,
                         postUrl: that.data.posts[that.data.postidx].defaultImageUrl,
                         postDigest: that.data.posts[that.data.postidx].digest,
                         type: config.postRelatedType.COLLECTION
                    }
                    await api.addPostCollection(data)
                    that.setData({
                         collection: {
                              status: true,
                              text: "已收藏",
                              icon: "favorfill"
                         }
                    })
                    wx.showToast({
                         title: '已收藏',
                         icon: 'none',
                         duration: 1500
                    })
               }
          } catch (err) {
               wx.showToast({
                    title: '程序有一点点小异常，操作失败啦',
                    icon: 'none',
                    duration: 1500
               })
          } finally {
               wx.hideLoading()
          }

     },
     /**
      * 点赞功能
      */
     postZan: async function () {
          try {
               let that = this;
               let zan = that.data.zan;
               if (zan.status === true) {
                    let result = await api.deletePostCollectionOrZan(that.data.maskid, config.postRelatedType.ZAN)
                    that.setData({
                         zan: {
                              status: false,
                              text: "点赞",
                              icon: "appreciate"
                         }
                    })
                    wx.showToast({
                         title: '已取消点赞',
                         icon: 'none',
                         duration: 1500
                    })
               } else {
                    let data = {
                         postId: that.data.maskid,
                         postTitle: that.data.posts[that.data.postidx].title,
                         postUrl: that.data.posts[that.data.postidx].defaultImageUrl,
                         postDigest: that.data.posts[that.data.postidx].digest,
                         type: config.postRelatedType.ZAN
                    }
                    await api.addPostZan(data)
                    that.setData({
                         zan: {
                              status: true,
                              text: "已赞",
                              icon: "appreciatefill"
                         }
                    })

                    wx.showToast({
                         title: '已赞',
                         icon: 'none',
                         duration: 1500
                    })
               }
          } catch (err) {
               wx.showToast({
                    title: '程序有一点点小异常，操作失败啦',
                    icon: 'none',
                    duration: 1500
               })
          } finally {
               wx.hideLoading()
          }
     },
     /**
      * tab切换
      * @param {} e 
      */
     tabSelect: async function (e) {
          let that = this;
          let tabCur = e.currentTarget.dataset.id;
          let tname = e.currentTarget.dataset.tname;
          switch (tabCur) {
               case 0: {
                    that.setData({
                         posts: [],
                         tabCur: e.currentTarget.dataset.id,
                         page: 1,
                         nomore: false,
                         nodata: false,
                         tname: tname
                    })
                    await that.getPostsList(tname)
                    // await that.getPostsList("", "totalVisits")
                    break
               }
               case 1: {
                    that.setData({
                         tabCur: e.currentTarget.dataset.id,
                         nomore: false,
                         nodata: false,
                         posts: [],
                         page: 1,
                         tname: tname
                    })
                    await that.getPostsList(tname)

                    // await that.getPostsList("", 'createTime')
                    break
               }
               case 2: {
                    that.setData({
                         tabCur: e.currentTarget.dataset.id,
                         nomore: false,
                         nodata: false,
                         posts: [],
                         page: 1,
                         tname: tname
                    })
                    await that.getPostsList(tname)
                    // let task = that.getPostsList("", 'createTime')
                    let labelList = await api.getLabelList()
                    that.setData({
                         labelList: labelList.result.data
                    })
                    // await task
                    break
               }
          }
     },


     /**
      * 获取文章列表
      */
     getPostsList: async function (filter) {
          this.setData({
               showLoading: false
          })
          let that = this
          let page = that.data.page
          if (that.data.nomore) {
               wx.hideLoading()
               return
          }
          let where = {
               classify: filter,
               isShow: 1
          }
          let result = await api.getNewPostsList(page, where)
          if (result.data.length === 0) {
               that.setData({
                    nomore: true
               })
               if (page === 1) {
                    that.setData({
                         nodata: true
                    })
               }
          } else {
               that.setData({
                    page: page + 1,
                    posts: that.data.posts.concat(result.data),
               })
          }
          that.setData({
               showLoading: true
          })
     },


     /**
      * 获取专题集合
      * @param {*} e 
      */
     getClassifyList: async function () {
          let that = this
          let classifyList = await api.getClassifyList();

          that.setData({
               classifyList: classifyList.result.data
          })
          //     await that.getPostsList(classifyList.result.data[that.data.tabCur].value.classifyName); 
     },

     //去搜索
     toSearchPost() {
          wx.switchTab({
               url: '/pages/topic/topic?focus=true',
          })
     }
})