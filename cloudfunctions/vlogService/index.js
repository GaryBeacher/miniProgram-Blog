// 云函数入口文件 
const cloud = require('wx-server-sdk')
cloud.init({
  env: process.env.Env
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {  
  switch (event.action) {
    case 'uploadVlog':
      {
        return uploadVlog(event)
      }
    case 'deleteVlogById':
      {
        return deleteVlogById(event)
      }
    case 'checkVlogShow':
      {
        return checkVlogShow()
      }
    case 'checkResume':
      {
        return checkResume()
      }
  }


  /**
   * 上传vlog信息
   * @param {} event 
   */
  async function uploadVlog(event) {
    try {
      let collection = "mini_vlog"
      await db.collection(collection).add({
        data: event.data
      });
      return true; 
    } catch (e) {
      console.error(e)
      return false; 
    }
  }

  /**
   * 删除vlog
   * @param {} event 
   */
  async function deleteVlogById(event) {
    try {
      await db.collection('mini_vlog').doc(event.id).remove()
      return true;
    } catch (e) {
      console.error(e)
      return false;
    }
  }

  /**
 * 验证vlog是否展示
 * @param {} event 
 */
  async function checkVlogShow() {
    let checkVlogShow = process.env.vlogshow;
    if (checkVlogShow == "true") {
      return true;
    } else {
      return false;
    }
  }
  /**
  * 验证简历口令是否正确
  * @param {} event 
  */
  async function checkResume() {
    let resumePassword = process.env.resumePassword; 
    if (resumePassword == event.password) {
      return true;
    } else {
      return false;
    }
  }
  
}