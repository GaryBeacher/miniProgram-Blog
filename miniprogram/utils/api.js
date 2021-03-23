const util = require('util.js');

const db = wx.cloud.database()
const _ = db.command

/**
 * 获取评论列表
 */
function getCommentsList(page, flag) {
  return db.collection('mini_comments')
    .where({
      flag: flag
    })
    .orderBy('timestamp', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}
/**
 * 根据id获取文章明细
 * @param {*} page 
 */
function getPostsById(id) {
  return db.collection('mini_posts')
    .doc(id)
    .get()
}
/**
 * 获取消息列表
 * @param {*} page 
 */
function getNoticeLogsList(page, openId) {
  return db.collection('mini_logs')
    .orderBy('timestamp', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}

/**
 * 获取版本发布日志
 * @param {*} page 
 */
function getReleaseLogsList(page) {
  return db.collection('mini_logs')
    .where({
      key: 'releaseLogKey'
    })
    .orderBy('timestamp', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}

function getNewPostsList(page, filter, orderBy) {
  let where = {}
  if (filter.title != undefined) {
    where.title = db.RegExp({
      regexp: filter.title,
      options: 'i',
    })
  }
  if (filter.isShow != undefined) {
    where.isShow = filter.isShow
  }
  if (filter.classify != undefined) {
    where.classify = filter.classify
  }

  if (filter.hasClassify == 1) {
    where.classify = _.nin(["", 0, undefined])
  }

  if (filter.hasClassify == 2) {
    where.classify = _.in(["", 0, undefined])
  }

  if (orderBy == undefined || orderBy == "") {
    orderBy = "createTime"
  }

  if (filter.hasLabel == 1) {
    where.label = _.neq([])
  }

  if (filter.hasLabel == 2) {
    where.label = _.eq([])
  }

  //不包含某个标签
  if (filter.containLabel == 2) {
    where.label = _.nin([filter.label])
  }

  //包含某个标签
  if (filter.containLabel == 1) {
    where.label = db.RegExp({
      regexp: filter.label,
      options: 'i',
    })
  }

  //不包含某个主题
  if (filter.containClassify == 2) {
    where.classify = _.neq(filter.classify)
  }

  //包含某个主题
  if (filter.containClassify == 1) {
    where.classify = _.eq(filter.classify)
  }


  return db.collection('mini_posts')
    .where(where)
    .orderBy(orderBy, 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .field({
      _id: true,
      author: true,
      createTime: true,
      defaultImageUrl: true,
      title: true,
      totalComments: true,
      totalVisits: true,
      totalZans: true,
      isShow: true,
      classify: true,
      label: true,
      digest: true
    }).get()
}
/**
 * 获取文章列表
 * @param {} page 
 */
function getPostsList(page, filter, isShow, orderBy, label) {
  let where = {}
  if (filter !== '') {
    where.title = db.RegExp({
      regexp: filter,
      options: 'i',
    })
  }
  if (isShow !== -1) {
    where.isShow = isShow
  }

  if (orderBy == undefined || orderBy == "") {
    orderBy = "createTime"
  }

  if (label != undefined && label != "") {
    where.label = db.RegExp({
      regexp: label,
      options: 'i',
    })
  }

  return db.collection('mini_posts')
    .where(where)
    .orderBy(orderBy, 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .field({
      _id: true,
      author: true,
      createTime: true,
      defaultImageUrl: true,
      title: true,
      totalComments: true,
      totalVisits: true,
      totalZans: true,
      isShow: true,
      classify: true,
      label: true,
      digest: true
    }).get()

}

/**
 * 获取评论列表
 * @param {} page 
 * @param {*} postId 
 */
function getPostComments(page, postId) {
  return db.collection('mini_comments')
    .where({
      postId: postId,
      flag: 0
    })
    .orderBy('timestamp', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}

/**
 * 获取收藏、点赞列表
 * @param {} page 
 */
function getPostRelated(where, page) {
  return db.collection('mini_posts_related')
    .where(where)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}
/**
 * 获取文章详情
 * @param {} id 
 */
function getPostDetail(id) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "getPostsDetail",
      id: id
    }
  })
}

/**
 * 新增用户收藏文章
 */
function addPostCollection(data) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "addPostCollection",
      postId: data.postId,
      postTitle: data.postTitle,
      postUrl: data.postUrl,
      postDigest: data.postDigest,
      type: data.type
    }
  })
}

/**
 * 取消喜欢或收藏
 */
function deletePostCollectionOrZan(postId, type) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "deletePostCollectionOrZan",
      postId: postId,
      type: type
    }
  })
}
/**
 * 文字敏感词查询
 */
function msgSecCheck(data){ 
  var msgSecCheck = new Promise(function(resolve,reject){
    wx.cloud.callFunction({
      name: 'checkContent',
      data: {
        txt: data
      },
      success(_res) { 
        resolve(_res)
      },
      fail(_res) {
        reject(_res)
      }
    }) 
  })
  return msgSecCheck
}
/**
 * 新增评论
 */
function addPostComment(commentContent) {
  msgSecCheck(commentContent.comment).then(res=>{
    if(res.result.errCode=='87014'){
      wx.showToast({
        title: '内容中含有违规内容，请删除重试',
        icon: 'none',
      })
    }else{
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1500
      })
      return wx.cloud.callFunction({
        name: 'postsService',
        data: {
          action: "addPostComment",
          commentContent: commentContent
        }
      })
    } 
  })  
}

/**
 * 新增用户点赞
 * @param {} data 
 */
function addPostZan(data) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "addPostZan",
      postId: data.postId,
      postTitle: data.postTitle,
      postUrl: data.postUrl,
      postDigest: data.postDigest,
      type: data.type
    }
  })
}

/**
 * 新增子评论
 * @param {} id 
 * @param {*} comments 
 */
function addPostChildComment(id, postId, comments) { 
  msgSecCheck(comments[0].comment).then(res => { 
    if (res.result.errCode == '87014') {
      wx.showToast({
        title: '内容中含有违规内容，请删除重试',
        icon: 'none',
      })
    } else {
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1500
      })
      return wx.cloud.callFunction({
        name: 'postsService',
        data: {
          action: "addPostChildComment",
          id: id,
          comments: comments,
          postId: postId
        }
      })
    }
  })  
  
}

/**
 * 新增文章二维码并返回临时url
 * @param {*} id 
 * @param {*} postId 
 * @param {*} comments 
 */
function addPostQrCode(postId, timestamp) {
  console.log(postId)
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "addPostQrCode",
      timestamp: timestamp,
      postId: postId
    }
  })
}
/**
 * 获取打赏码
 */
function getQrCode() {
  return wx.cloud.getTempFileURL({
    fileList: [{
      fileID: 'cloud://test-91f3af.54ec-test-91f3af/common/1556347401340.jpg'
    }]
  })
}

/**
 * 获取海报的文章二维码url
 * @param {*} id 
 */
function getReportQrCodeUrl(id) {
  return wx.cloud.getTempFileURL({
    fileList: [{
      fileID: id,
      maxAge: 60 * 60, // one hour
    }]
  })
}

/**
 * 验证是否是管理员
 */
function checkAuthor() {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "checkAuthor"
    }
  })
}

/**
 * 查询可用的formId数量
 */
function queryFormIds() {
  return wx.cloud.callFunction({
    name: 'messageService',
    data: {
      action: "queryFormIds"
    }
  })
}

/**
 * 查询可用的formId数量
 */
function addFormIds(formIds) {
  return wx.cloud.callFunction({
    name: 'messageService',
    data: {
      action: "addFormIds",
      formIds: formIds
    }
  })
}

/**
 * 发送评论通知
 * @param {} nickName 
 * @param {*} comment 
 * @param {*} blogId 
 */
function sendTemplateMessage(nickName, comment, blogId) {
  return wx.cloud.callFunction({
    name: 'messageService',
    data: {
      action: "sendTemplateMessage",
      nickName: nickName,
      message: comment,
      blogId: blogId,
      tOpenId: ""
    }
  })
}

/**
 * 新增版本日志
 * @param {} log 
 */
function addReleaseLog(log, title) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "addReleaseLog",
      log: log,
      title: title
    }
  })
}

/**
 * 更新文章状态
 * @param {*} id 
 * @param {*} isShow 
 */
function updatePostsShowStatus(id, isShow) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "updatePostsShowStatus",
      id: id,
      isShow: isShow
    }
  })
}

/**
 * 更新文章专题
 * @param {*} id 
 * @param {*} isShow 
 */
function updatePostsClassify(id, classify) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "updatePostsClassify",
      id: id,
      classify: classify
    }
  })
}

/**
 * 更新文章标签
 * @param {*} id 
 * @param {*} isShow 
 */
function updatePostsLabel(id, label) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "updatePostsLabel",
      id: id,
      label: label
    }
  })
}

/**
 * 更新文章标签
 * @param {*} id 
 * @param {*} isShow 
 */
function upsertPosts(id, data) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "upsertPosts",
      id: id,
      post: data
    }
  })
}

/**
 * 新增基础标签
 */
function addBaseLabel(labelName) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "addBaseLabel",
      labelName: labelName
    }
  })
}

/**
 * 新增基础主题
 */
function addBaseClassify(classifyName, classifyDesc) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "addBaseClassify",
      classifyName: classifyName,
      classifyDesc: classifyDesc
    }
  })
}

/**
 * 新增基础主题
 */
function deleteConfigById(id) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "deleteConfigById",
      id: id
    }
  })
}

function deletePostById(id) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "deletePostById",
      id: id
    }
  })
}

/**
 * 更新评论状态
 * @param {*} id 
 * @param {*} flag 
 */
function changeCommentFlagById(id, flag, postId, count) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "changeCommentFlagById",
      id: id,
      flag: flag,
      postId: postId,
      count: count
    }
  })
}

/**
 * 获取label集合
 */
function getLabelList() {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "getLabelList"
    }
  })
}

/**
 * 获取label集合
 */
function getClassifyList() {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "getClassifyList"
    }
  })
}

/**
 * 获取label集合
 */
function updateBatchPostsClassify(classify, operate, posts) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "updateBatchPostsClassify",
      posts: posts,
      operate: operate,
      classify: classify
    }
  })
}

/**
 * 获取label集合
 */
function updateBatchPostsLabel(label, operate, posts) {
  return wx.cloud.callFunction({
    name: 'adminService',
    data: {
      action: "updateBatchPostsLabel",
      posts: posts,
      operate: operate,
      label: label
    }
  })
}

/**
 * 上传文件
 */
function uploadFile(cloudPath, filePath) {
  return wx.cloud.uploadFile({
    cloudPath: cloudPath,
    filePath: filePath, // 文件路径
  })
}

/**
 * 获取打赏码
 */
function getTempUrl(fileID) {
  return wx.cloud.getTempFileURL({
    fileList: [{
      fileID: fileID
    }]
  })
}

/**
 * 获取朋友圈列表
 * @param {} page 
 * @param {*} postId 
 */
function getWeiboList(page) { 
  return db.collection('mini_weibo')
    .orderBy('timestamp', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}


/**
 * 朋友圈点赞
 */
function weibolike(data) { 
  return wx.cloud.callFunction({
    name: 'weiboService',
    data: {
      action: "weiboGetlike",
      data: data, 
    }
  })
}
/**
 * 评论push通知
 */
function commentPush(formid) {
  return wx.cloud.callFunction({
    name: 'commentpush',
    data: {
      formId: formid, 
    }
  })
}

/**
 * 发表微博
 */
function addWeibo(data) {
  return wx.cloud.callFunction({
    name: 'weiboService',
    data: {
      wbmsg: data.value,
      wbtype: data.type,
      wbvideo: data.video,
      wbimgurls: data.imgurls,
      videourl: data.videourl,
      maddr: data.maddr,
      action: "addWeibo",
      userInfos: data.userInfos,
      timestamp: util.formatTime(Date.now(), 'Y/M/D h:m:s'),
    }
  })
}

/**
 * 上传vlog地址
 */
function uploadVlog(data) {
  return wx.cloud.callFunction({
    name: 'vlogService',
    data: {
      action: "uploadVlog",
      data: data, 
    }
  })
}

/**
 * 获取VLOG列表
 * @param {} page 
 */
function getVlogList(page) {
  return db.collection('mini_vlog')
    .orderBy('timestamp', 'desc') 
    .get()
} 
/**
 * 删除VLOG
 * @param {} page 
 */
function deleteVlogById(id) {
  return wx.cloud.callFunction({
    name: 'vlogService',
    data: {
      action: "deleteVlogById",
      id: id
    }
  })
} 
/**
 * 验证vlog是否展示
 * @param {} page 
 */
function checkVlogShow() {
  return wx.cloud.callFunction({
    name: 'vlogService',
    data: {
      action: "checkVlogShow", 
    }
  })
} 

/**
 * 验证简历口令
 * @param {} page 
 */
function checkResume(password) {
  return wx.cloud.callFunction({
    name: 'vlogService',
    data: {
      action: "checkResume", 
      password:password
    }
  })
} 

 
module.exports = {
  getPostsList: getPostsList,
  getPostDetail: getPostDetail,
  getPostRelated: getPostRelated,
  getQrCode: getQrCode,
  addPostCollection: addPostCollection,
  addPostZan: addPostZan,
  deletePostCollectionOrZan: deletePostCollectionOrZan,
  addPostComment: addPostComment,
  getPostComments: getPostComments,
  addPostChildComment: addPostChildComment,
  getReportQrCodeUrl: getReportQrCodeUrl,
  addPostQrCode: addPostQrCode,
  checkAuthor: checkAuthor,
  addFormIds: addFormIds,
  queryFormIds: queryFormIds,
  sendTemplateMessage: sendTemplateMessage,
  addReleaseLog: addReleaseLog,
  getReleaseLogsList: getReleaseLogsList,
  getNoticeLogsList: getNoticeLogsList,
  getPostsById: getPostsById,
  deleteConfigById: deleteConfigById,
  addBaseClassify: addBaseClassify,
  addBaseLabel: addBaseLabel,
  upsertPosts: upsertPosts,
  updatePostsLabel: updatePostsLabel,
  updatePostsClassify: updatePostsClassify,
  updatePostsShowStatus: updatePostsShowStatus,
  getCommentsList: getCommentsList,
  changeCommentFlagById: changeCommentFlagById,
  getLabelList: getLabelList,
  getClassifyList: getClassifyList,
  getNewPostsList: getNewPostsList,
  deletePostById: deletePostById,
  uploadFile: uploadFile,
  getTempUrl: getTempUrl,
  updateBatchPostsLabel: updateBatchPostsLabel,
  updateBatchPostsClassify: updateBatchPostsClassify,
  getWeiboList: getWeiboList,
  addWeibo: addWeibo,
  weibolike: weibolike,
  msgSecCheck: msgSecCheck,
  commentPush: commentPush,
  uploadVlog: uploadVlog,
  getVlogList: getVlogList,
  deleteVlogById: deleteVlogById,
  checkVlogShow: checkVlogShow,
  checkResume:checkResume, 
}