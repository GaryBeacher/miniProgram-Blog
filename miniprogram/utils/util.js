const formatTime = date => {
  var date = new Date()//一定要记得写这个，不然会报date.getFullYear is not a function
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function uploadimg(data, cb) { //单图or多张图片上传
  var that = this,
    i = data.i ? data.i : 0, //当前上传的哪张图片
    success = data.success ? data.success : 0, //上传成功的个数
    fail = data.fail ? data.fail : 0; //上传失败的个数
  wx.uploadFile({
    url: config.HTTP_BASE_URL + data.url, //上传图片的接口
    filePath: data.path[i], //图片本地路径
    name: 'image', //这里根据自己的实际情况改
    formData: data.param[i], //这里是上传图片时一起上传的数据
    header: {
      "Content-Type": "multipart/form-data"
    },
    success: (resp) => {
      console.log(resp);
      success++; //图片上传成功，图片上传成功的变量+1
    },
    fail: (res) => {
      fail++; //图片上传失败，图片上传失败的变量+1
    },
    complete: () => {
      i++; //这个图片执行完上传后，开始上传下一张
      if (i == data.path.length) { //当图片传完时，停止调用
        typeof cb == "function" && cb(i);
      } else { //若图片还没有传完，则继续调用函数
        data.i = i;
        data.success = success;
        data.fail = fail;
        that.uploadimg(data, cb);
      }
    }
  })
}

function js_date_time(unixtime) {
  var dateTime = new Date(parseInt(unixtime) * 1000)
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString()); //typescript转换写法
  var milliseconds = now_new - dateTime;
  var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  return timeSpanStr;
} 
module.exports = {
  formatTime: formatTime,
  uploadimg: uploadimg

}