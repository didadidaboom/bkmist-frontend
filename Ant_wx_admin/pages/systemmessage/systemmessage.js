// pages/systemmessage/systemmessage.js
var app = getApp();
var api = require("../../config/api");
var COS = require('../../utils/cos-wx-sdk-v5.js');
var cos = new COS({
    // 必选参数
    getAuthorization: function (options, callback) {
        // 服务端 JS 和 PHP 示例：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
        // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
        // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048
        wx.request({
            url: api.rootURL+'credential/',
            data: {
                // 可从 options 取需要的参数
            },
            success: function (result) {
                var data = result.data;
                var credentials = data && data.credentials;
                if (!data || !credentials) return console.error('credentials invalid');
                callback({
                    TmpSecretId: credentials.tmpSecretId,
                    TmpSecretKey: credentials.tmpSecretKey,
                    XCosSecurityToken: credentials.sessionToken,
                    // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                    StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
                    ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
                });
            }
        });
    }
});
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content:null,
        type:null,
        presystemlist:null,
    },
    handlerGobackClick() {
        const pages = getCurrentPages();
        if (pages.length >= 2) {
            wx.navigateBack({
              delta: 1
            });
        } else {
            wx.navigateTo({
              url: '/pages/index/index'
            });
        }
    },
    onClickContent:function(e){
        this.setData({
            content: e.detail.value,
        })
    },
    onClickType:function(e){
        this.setData({
            type: e.detail.value,
        })
    },
    onClickPublish:function(){
        if(!this.data.content){
            wx.showToast({
              title: '内容不能为空',
            })
            return
        }
        if(!this.data.type){
            wx.showToast({
              title: '必须填写类型',
            })
            return
        }
        wx.showLoading({
          title: '发布中',
        })
        wx.request({
            url: api.systemmessageURL,
            data: {
                content:this.data.content,
                type: this.data.type,
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'POST',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==201){
                    setTimeout(() => {
                        wx.hideLoading();
                        wx.showToast({
                            title: '发布成功',
                        })
                    }, 1500)
                }else if(res.statusCode==500){
                    setTimeout(() => {
                        wx.hideLoading();
                        wx.showToast({
                            title: '修改成功',
                        })
                    }, 1500)
                }
                else{
                    wx.hideLoading();
                    wx.showToast({
                      title: '发布失败，请稍后尝试',
                      icon:"none",
                      duration:1000
                    })
                }
            }
        });

    },
    getAllTyleUsed:function(){
        wx.request({
            url: api.presystemListURL,
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'GET',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    var list = res.data
                    this.setData({
                        presystemlist: list,
                    })
                }
                else{
                    wx.showToast({
                      title: '网络异常，请稍后',
                      icon:"none",
                      duration:1000
                    })
                }
            }
        });

    },
    onClickTypeDel:function(e){
        var type_id = e.currentTarget.dataset.type_id;
        var index = e.currentTarget.dataset.index;
        if(!type_id){
            wx.showToast({
              title: 'type id 不存在',
            })
            return
        }
        if(!index){
            wx.showToast({
              title: 'index 不存在',
            })
            return
        }
        wx.request({
            url: api.delPresystemURL+type_id+"/",
            method:'DELETE',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                console.log(res)
                if(res.statusCode==204){
                    wx.showToast({
                      title: '删除成功',
                      duration: 1000,
                      icon: "none",
                    });
                    var presystemlist = this.data.presystemlist;
                    presystemlist.splice(index,1)
                    this.setData({
                        presystemlist: presystemlist,
                    });
                }else{
                    wx.showToast({
                        title: '网络错误，修改失败',
                        duration: 1000,
                        icon: "none",
                      });
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAllTyleUsed()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})