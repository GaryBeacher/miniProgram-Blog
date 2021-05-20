/*
 * @Description: 基本工具函数
 * @Author: GaryChiu
 * @Date: 2021-04-19 19:19:12
 * @LastEditTime: 2021-04-25 16:37:23
 * @LastEditors: GaryChiu
 */
// 格式化时间
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
// 格式化数字
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
} 

module.exports = {
  formatTime: formatTime, 
}