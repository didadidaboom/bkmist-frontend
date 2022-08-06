// pages/manageUserRecord/manageUserRecord.js
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
        selectedMode:0,
        modelSelected:{
            day:null,
            ndays:null
        },
        daylist:null,
        min_id_day:null,
        ndayslist:null,
        min_id_ndays:null
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
    handlerGohomeClick() {
        wx.switchTab({
          url: '/pages/index/index',
        })
    },
    onClickInput(e){
        let value = e.detail.value;
        if(this.data.selectedMode==0){
            this.setData({
                ['modelSelected.day']: value
            })
        }
        if(this.data.selectedMode==1){
            this.setData({
                ['modelSelected.ndays']: value
            })
        }
    },
    onClickChooseModel(e){
        let value = e.detail.value
        this.setData({
            selectedMode:value
        })
        if(value==0){
            this.getAllDayOpenidUsed(false)
        }
        if(value==1){
            this.getAllNDaysOpenidUsed(false)
        }
    },
    getAllDayOpenidUsed(roll){
        /**触底更新获取数据 */
        let day = this.data.modelSelected.day
        if(!day){
            day = 0
        }
        if(roll==1){
            if(!this.data.min_id_day){
                return
            }
            wx.request({
                url: api.getAllDayOpenidUsedListURL,
                data:{
                    min_id:this.data.min_id_day,
                    day:day
                },
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                method:'GET',
                dataType:"json",
                success: (res)=>{
                    if(!res.data.length){
                        wx.showToast({
                          title: '已到达底线',
                          duration: 1000,
                          icon: "none",
                        });
                        return;
                    }
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        min_id_day: min_id,
                        daylist: this.data.daylist.concat(res.data)
                    })
                }
            })
            return;
        }
        /**第一次加载更新数据 */
        wx.request({
            url: api.getAllDayOpenidUsedListURL,
            data:{
                day:day
            },
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(!res.data.length){
                    wx.showToast({
                      title: '还没有任何相应用户哟',
                    })
                    return;
                }
                var min_id = res.data[res.data.length-1].id;
                this.setData({
                    min_id_day: min_id,
                    daylist: res.data,
                })
            }
        })
    },
    getAllNDaysOpenidUsed(roll){
        let ndays = this.data.modelSelected.ndays
        if(!ndays){
            ndays = 0
        }
        /**触底更新获取数据 */
        if(roll==1){
            if(!this.data.min_id_ndays){
                return
            }
            wx.request({
                url: api.getAllNDaysOpenidUsedListURL,
                data:{
                    min_id:this.data.min_id_ndays,
                    ndays:ndays
                },
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                method:'GET',
                dataType:"json",
                success: (res)=>{
                    if(!res.data.length){
                        wx.showToast({
                          title: '已到达底线',
                          duration: 1000,
                          icon: "none",
                        });
                        return;
                    }
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        min_id_ndays: min_id,
                        ndayslist: this.data.ndayslist.concat(res.data)
                    })
                }
            })
            return;
        }
        /**第一次加载更新数据 */
        wx.request({
            url: api.getAllNDaysOpenidUsedListURL,
            data:{
                ndays:ndays
            },
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(!res.data.length){
                    wx.showToast({
                      title: '还没有任何相应用户哟',
                    })
                    return;
                }
                var min_id = res.data[res.data.length-1].id;
                this.setData({
                    min_id_ndays: min_id,
                    ndayslist: res.data,
                })
            }
        })
    },
    onClickUpdateday:function(e){
        if(this.data.selectedMode==0){
            let day = this.data.modelSelected.day;
            if(!day){
                wx.showToast({
                    title: '未选择 day',
                })
            }    
            this.getAllDayOpenidUsed(false)
        }
        if(this.data.selectedMode==1){
            let ndays = this.data.modelSelected.ndays;
            if(!ndays){
                wx.showToast({
                    title: '未选择 ndays',
                })
            }
            this.getAllNDaysOpenidUsed(false)
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAllDayOpenidUsed(false)
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
        if(this.data.selectedMode==0){
            this.getAllDayOpenidUsed(1)
        }
        if(this.data.selectedMode==1){
            this.getAllNDaysOpenidUsed(1)
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})