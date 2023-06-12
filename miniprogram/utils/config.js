/**
 * 打赏二维码
 */
var moneyUrl = "cloud://zbq-ev6l9.7a62-zbq-ev6l9/icon/WechatIMG156.jpeg"

/**
 * 公众号二维码
 */
var wechatUrl = "https://7a62-zbq-ev6l9-1300157766.tcb.qcloud.la/WechatIMG142.jpeg?sign=e395c80db0cdaf7baaab55dd9564479f&t=1568774777"

/**
 * 云开发环境
 */
var env = "zbq-9g0ul2nyace7ff02"
/**
 * 个人文章操作枚举
 */
var postRelatedType = {
     COLLECTION: 1,
     ZAN: 2,
     properties: {
          1: {
               desc: "收藏"
          },
          2: {
               desc: "点赞"
          }
     }
};

module.exports = {
     postRelatedType: postRelatedType,
     moneyUrl: moneyUrl,
     wechatUrl: wechatUrl,
     env: env
}