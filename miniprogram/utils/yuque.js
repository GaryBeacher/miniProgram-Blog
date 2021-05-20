/*
 * @Description: 语雀基本api
 * @Author: GaryChiu
 * @Date: 2021-04-25 16:33:03
 * @LastEditTime: 2021-04-25 16:57:53
 * @LastEditors: GaryChiu
 */
const url = "https://www.yuque.com/api/v2"; 
export const getRepos=()=>{
    wx.request({
        url: url+`/repos/garychiu/haw9ih/docs`,
        data: {},
        header: { "content-type": "application/json" ,"X-Auth-Token": "xtTh5pEPr0i5IHHxv59G2UN9kmeLSCaGpvI50Dhu"},
        method: "GET",
        dataType: "json", 
        success: (result) => {
            console.log(result)
        },
        fail: () => { },
        complete: () => { },
    });
}  
export const getDocApi=(docId)=>{ 
    return new Promise((resolve,reject) => {
        wx.request({
            url: url+`/repos/garychiu/haw9ih/docs/${docId}`,
            data: {},
            header: { "content-type": "application/json" ,"X-Auth-Token": "xtTh5pEPr0i5IHHxv59G2UN9kmeLSCaGpvI50Dhu"},
            method: "GET",
            dataType: "json", 
            success: (result) => { 
                resolve(result)
            },
            fail: () => { },
            complete: () => { },
        });
      })  
}  
export const getUser=()=>{
    wx.request({
        url: url+`/user`,
        data: {},
        header: { "content-type": "application/json" ,"X-Auth-Token": "xtTh5pEPr0i5IHHxv59G2UN9kmeLSCaGpvI50Dhu"},
        method: "GET",
        dataType: "json", 
        success: (result) => {
            console.log(result)
        },
        fail: () => { },
        complete: () => { },
    });
} 