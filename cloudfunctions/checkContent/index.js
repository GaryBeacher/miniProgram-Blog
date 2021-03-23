 // 云函数入口文件
 const cloud = require('wx-server-sdk')
 cloud.init({
   env: process.env.Env
 }) 
exports.main = async (event, context) => {
  console.log(event.txt);
  const { value, txt } = event;
  try {
    let msgR = false;
    let imageR = false;
    //检查 文字内容是否违规
    if (txt) {
      msgR = await cloud.openapi.security.msgSecCheck({
        content: txt
      })
      console.log(msgR)
    }
    //检查 图片内容是否违规
    if (value) {
      imageR = await cloud.openapi.security.imgSecCheck({
        media: {
          header: { 'Content-Type': 'application/octet-stream' },
          contentType: 'image/png',
          value: Buffer.from(value)
        }
      })
    }
    return {
      msgR,   //内容检查返回值
      imageR   //图片检查返回值
    };
  } catch (err) {
    // 错误处理
    // err.errCode !== 0
    return err
  }
}