// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: process.env.Env })
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  return sendTemplateMessage(event)
}

//小程序模版消息推送
async function sendTemplateMessage(event) {
  const {
    OPENID
  } = cloud.getWXContext()  
 
  const addResult = await cloud.openapi.templateMessage.addTemplate({
    id: 'SMd_1mVruPjfXmFcr4fp95DcAVNKYYS-jlgvGU9pOSI',
    keywordIdList: [3, 4, 5]
  })

  const templateId = addResult.templateId //新增的模版id

  const sendResult = await cloud.openapi.templateMessage.send({
    touser: OPENID,
    templateId,
    formId: event.formId,
    page: 'pages/index/index',
    data: {
      keyword1: {
        value: '云开发实现推送',
      },
      keyword2: {
        value: '2019 年 5 月 24 日',
      },
      keyword3: {
        value: '编程小石头',
      },
    }
  })
 

  return sendResult
}