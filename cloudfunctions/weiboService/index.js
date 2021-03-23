 // 云函数入口文件
 const cloud = require('wx-server-sdk')
 cloud.init({
   env: process.env.Env
 })
 const db = cloud.database()
 const _ = db.command 
 // 云函数入口函数
 exports.main = async(event, context) => {
   console.log(event)
   switch (event.action) {
     case 'addWeibo':
       {
         return addWeibo(event)
       } 
     case 'weiboGetlike':
        { 
         return weiboGetlike(event)
       } 
   }
 }

 /**
  * 新增微博话题
  * @param {} event 
  */
 async function addWeibo(event) {
   try { 
     let collection = "mini_weibo" 
     await db.collection(collection).add({
       data: event
     }); 
   } catch (e) {
     console.error(e) 
   }
 } 

 /**
  * 点赞，取消点赞
  */
async function weiboGetlike(event){
  try {
    let collection = "mini_weibo"
    await db.collection(collection).doc(event.data.weiboId).update({
      data:{
        like: _.push(event.data)
      }
    }); 
  } catch (e) {
    console.error(e) 
  }
}