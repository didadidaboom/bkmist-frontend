// pages/manageuser/manageuser.js
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
        selectedUser:0,
        chonglist:null,
        min_id_chong:null,
        chongselected:{
            id:null,
            openid:"用户为CHONG",
            index: null,
            name:null,
        },
        chongselectedfinal:{
            id:null,
            openid:"用户为CHONG",
            index: null,
            name:null,
        },
        chlist:null,
        min_id_ch:null,
        chselected:{
            id:null,
            openid:"用户为CH",
            index: null,
            name:null,
        },
        chselectedfinal:{
            id:null,
            openid:"用户为CH",
            index: null,
            name:null,
        },
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
    onClickChooseUser(e){
        let value = e.detail.value
        this.setData({
            selectedUser:value
        })
        if(value==0){
            this.getAllChongOpenidUsed(false)
        }
        if(value==1){
            this.getAllCHOpenidUsed(false)
        }
    },
    onClickSelectChongUser(e){
        this.setData({
            ['chongselected.id']: e.currentTarget.dataset.id,
            ['chongselected.openid']: e.currentTarget.dataset.openid,
            ['chongselected.index']: e.currentTarget.dataset.index,
            ['chongselected.name']: e.currentTarget.dataset.name,
        })
    },
    onClickSelectCHUser(e){
        this.setData({
            ['chselected.id']: e.currentTarget.dataset.id,
            ['chselected.openid']: e.currentTarget.dataset.openid,
            ['chselected.index']: e.currentTarget.dataset.index,
            ['chselected.name']: e.currentTarget.dataset.name,
        })
    },
    onClickChongInput(e){
        let openid = e.detail.value;
        this.setData({
            ['chongselectedfinal.id']: this.data.chongselected.id,
            ['chongselectedfinal.openid']: openid,
            ['chongselectedfinal.index']: this.data.chongselected.index,
            ['chongselectedfinal.name']: this.data.chongselected.name,
        })
    },
    onClickCHInput(e){
        let openid = e.detail.value;
        this.setData({
            ['chselectedfinal.id']: this.data.chselected.id,
            ['chselectedfinal.openid']: openid,
            ['chselectedfinal.index']: this.data.chselected.index,
            ['chselectedfinal.name']: this.data.chselected.name,
        })
    },
    getAllChongOpenidUsed(roll){
        /**触底更新获取数据 */
        if(roll==1){
            if(!this.data.min_id_chong){
                return
            }
            wx.request({
                url: api.getAllChongOpenidUsedListURL,
                data:{
                    min_id:this.data.min_id_chong
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
                        min_id_chong: min_id,
                        chonglist: this.data.chonglist.concat(res.data)
                    })
                }
            })
            return;
        }
        /**第一次加载更新数据 */
        wx.request({
            url: api.getAllChongOpenidUsedListURL,
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
                    min_id_chong: min_id,
                    chonglist: res.data,
                })
            }
        })
    },
    getAllCHOpenidUsed(roll){
        /**触底更新获取数据 */
        if(roll==1){
            console.log("ch bottom 1111")
            if(!this.data.min_id_ch){
                return
            }
            wx.request({
                url: api.getAllCHOpenidUsedListURL,
                data:{
                    min_id:this.data.min_id_ch
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
                        min_id_ch: min_id,
                        chlist: this.data.chlist.concat(res.data)
                    })
                }
            })
            return;
        }
        /**第一次加载更新数据 */
        wx.request({
            url: api.getAllCHOpenidUsedListURL,
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
                    min_id_ch: min_id,
                    chlist: res.data,
                })
            }
        })
    },
    onClickUpdateOpenid:function(e){
        let id = this.data.chongselectedfinal.id;
        let openid = this.data.chongselectedfinal.openid;
        if(this.data.selectedUser==1){
            id = this.data.chselectedfinal.id;
            openid = this.data.chselectedfinal.openid;
        }
        if(!id){
            wx.showToast({
              title: '未选择用户id',
            })
        }
        if(!openid){
            wx.showToast({
              title: '未选择用户openid',
            })
        }
        wx.showLoading({
          title: '修改中',
        })
        wx.request({
            url: api.updateOpenidURL+id+"/",
            data:{
                openID: openid,
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'PUT',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    wx.hideLoading({})
                    wx.showToast({
                        title: '修改成功',
                        icon:"none"
                    });
                }else{
                    wx.hideLoading({})
                    wx.showToast({
                        title: '修改失败',
                        icon:"none"
                    });
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAllChongOpenidUsed(false)
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
        if(this.data.selectedUser==0){
            this.getAllChongOpenidUsed(1)
        }
        if(this.data.selectedUser==1){
            this.getAllCHOpenidUsed(1)
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})