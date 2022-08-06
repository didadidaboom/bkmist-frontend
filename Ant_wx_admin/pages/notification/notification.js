// pages/notification/notification.js
var app = getApp();
var api = require("../../config/api.js");
var auth = require("../../utils/auth.js");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        token:null,
        classify_type:0,
        notification_page1:null,
        min_id_page1:null,
        max_id_page1:null,
        notification_page2:null,
        min_id_page2:null,
        max_id_page2:null,
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
    /*  分类  */
    onClickClassify:function(e){
        var classify_type = e.currentTarget.dataset.value
        this.setData({
            classify_type:classify_type
        })
        if(classify_type==0){
            this.getNotification_page1(false)
        }else if(classify_type==1){
            this.getNotification_page2(false)
        }
    },
    changeNotificationStatus_user:function(e){
        var notification_id = e.currentTarget.dataset.notify_id;
        var user_id = e.currentTarget.dataset.user_id;
        var userhaschecked = e.currentTarget.dataset.userhaschecked
        var index = e.currentTarget.dataset.index
        if(userhaschecked){
        const promise = new Promise((resolve, reject)=>{
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
                url: api.notification_statusURL+notification_id+"/",
                data:{
                    userHasChecked:false
                },
                method:'PUT',
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                dataType:"json",
                success: (res)=>{
                    resolve(res)
                },
                fail:(err)=>{
                    reject(err)
                }
            })
        });
        promise.then((res)=>{
            if(res.statusCode==200){
                wx.hideLoading({})
                this.setData({
                    ["notification_page1["+index+"].userHasChecked"]:false
                })
                wx.navigateTo({
                  url: '/pages/otherDetails/otherDetails?user_id='+user_id,
                })
            }else{
                wx.showToast({
                  title: '网络异常，请稍后',
                  duration: 1000,
                  icon: "none",
                });
            }
        })
        }else{
            wx.navigateTo({
                url: '/pages/otherDetails/otherDetails?user_id='+user_id,
            })
        }
    },
    changeNotificationStatus_moment:function(e){
        var notification_id = e.currentTarget.dataset.notify_id;
        var moment_id = e.currentTarget.dataset.moment_id;
        var userhaschecked = e.currentTarget.dataset.userhaschecked
        var index = e.currentTarget.dataset.index
        if(userhaschecked){
        const promise = new Promise((resolve, reject)=>{
            wx.showLoading({
                title: '加载中',
            })
            wx.request({
                url: api.notification_statusURL+notification_id+"/",
                data:{
                    userHasChecked:false
                },
                method:'PUT',
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                dataType:"json",
                success: (res)=>{
                    resolve(res)
                },
                fail:(err)=>{
                    reject(err)
                }
            })
        });
        promise.then((res)=>{
            if(res.statusCode==200){
                wx.hideLoading({})
                this.setData({
                    ["notification_page1["+index+"].userHasChecked"]:false
                })
                wx.navigateTo({
                  url: '/pages/momentDetails/momentDetails?moment_id='+moment_id,
                })
            }else{
                wx.showToast({
                  title: '网络异常，请稍后',
                  duration: 1000,
                  icon: "none",
                });
            }
        })
        }else{
            wx.navigateTo({
                url: '/pages/momentDetails/momentDetails?moment_id='+moment_id,
            })
        }
    },
    getNotification_page1:function(roll){
        if(!auth.is_login()){
            return;
        }
        /**触底更新获取数据 */
        if(roll==1){
            if(!this.data.min_id_page1){
                return
            }
            wx.request({
                url: api.notification_page1URL,
                data:{
                    min_id:this.data.min_id_page1
                },
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                method:'GET',
                dataType:"json",
                success: (res)=>{
                    if(res.statusCode==200){
                        if(!res.data.length){
                            wx.showToast({
                                title: '已没有底线',
                                duration: 1000,
                                icon: "none",
                            });
                            return;
                        }
                        var min_id = res.data[res.data.length-1].id;
                        this.setData({
                            min_id_page1: min_id,
                            notification_page1: this.data.notification_page1.concat(res.data)
                        })
                    }else{
                        wx.showToast({
                          title: '已到达底线',
                          duration: 1000,
                          icon: "none",
                        });
                    }
                }
            })
            return;
        }
        /**第一次加载更新数据 */
        wx.request({
            url: api.notification_page1URL,
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    if(!res.data.length){
                        wx.showToast({
                            title: '没有更多内容',
                            duration: 1000,
                            icon: "none",
                        });
                        return;
                    }
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        min_id_page1: min_id,
                        notification_page1: res.data,
                    })
                }else{
                    wx.showToast({
                      title: '网络异常，请稍后',
                      duration: 1000,
                      icon: "none",
                    });
                }
            }
        })
    },
    getNotification_page2:function(roll){
        if(this.data.token){
            this.getNotification_system2(roll)
        }else{
            this.getNotification_presystem2(roll)
        }
    },
    getNotification_presystem2:function(roll){
        /**触底更新获取数据 */
        if(roll==1){
            if(!this.data.min_id_page2){
                return
            }
            wx.request({
                url: api.presystemnotificationURL,
                data:{
                    min_id:this.data.min_id_page2
                },
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                method:'GET',
                dataType:"json",
                success: (res)=>{
                    if(res.statusCode==200){
                        if(!res.data.length){
                            wx.showToast({
                                title: '已没有底线',
                                duration: 1000,
                                icon: "none",
                            });
                            return;
                        }
                        var min_id = res.data[res.data.length-1].id;
                        this.setData({
                            min_id_page2: min_id,
                            notification_page2: this.data.notification_page2.concat(res.data)
                        })
                    }else{
                        wx.showToast({
                          title: '已到达底线',
                          duration: 1000,
                          icon: "none",
                        });
                    }
                }
            })
            return;
        }
        /**第一次加载更新数据 */
        wx.request({
            url: api.presystemnotificationURL,
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    if(!res.data.length){
                        wx.showToast({
                            title: '没有更多内容',
                            duration: 1000,
                            icon: "none",
                        });
                        return;
                    }
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        min_id_page2: min_id,
                        notification_page2: res.data,
                    })
                }else{
                    wx.showToast({
                      title: '网络异常，请稍后',
                      duration: 1000,
                      icon: "none",
                    });
                }
            }
        })
    },
    getNotification_system2:function(roll){
        if(!auth.is_login()){
            return;
        }
        /**触底更新获取数据 */
        if(roll==1){
            if(!this.data.min_id_page2){
                return
            }
            wx.request({
                url: api.systemnotificationURL,
                data:{
                    min_id:this.data.min_id_page2
                },
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                method:'GET',
                dataType:"json",
                success: (res)=>{
                    if(res.statusCode==200){
                        if(!res.data.length){
                            wx.showToast({
                                title: '已没有底线',
                                duration: 1000,
                                icon: "none",
                            });
                            return;
                        }
                        var min_id = res.data[res.data.length-1].id;
                        this.setData({
                            min_id_page2: min_id,
                            notification_page2: this.data.notification_page2.concat(res.data)
                        })
                    }else{
                        wx.showToast({
                          title: '已到达底线',
                          duration: 1000,
                          icon: "none",
                        });
                    }
                }
            })
            return;
        }
        /**第一次加载更新数据 */
        wx.request({
            url: api.systemnotificationURL,
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    if(!res.data.length){
                        wx.showToast({
                            title: '没有更多内容',
                            duration: 1000,
                            icon: "none",
                        });
                        return;
                    }
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        min_id_page2: min_id,
                        notification_page2: res.data,
                    })
                }else{
                    wx.showToast({
                      title: '网络异常，请稍后',
                      duration: 1000,
                      icon: "none",
                    });
                }
            }
        })
    },
    changeNotificationStatus_system:function(e){
        var systemnotify_id = e.currentTarget.dataset.systemnotify_id;
        var userhaschecked = e.currentTarget.dataset.userhaschecked
        var index = e.currentTarget.dataset.index
        if(userhaschecked){
        const promise = new Promise((resolve, reject)=>{
            wx.showLoading({
                title: '加载中',
            })
            wx.request({
                url: api.systemnotification_statusURL+systemnotify_id+"/",
                data:{
                    userHasChecked:false
                },
                method:'PUT',
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                dataType:"json",
                success: (res)=>{
                    resolve(res)
                },
                fail:(err)=>{
                    reject(err)
                }
            })
        });
        promise.then((res)=>{
            if(res.statusCode==200){
                wx.hideLoading({})
                this.setData({
                    ["notification_page2["+index+"].userHasChecked"]:false
                })
            }else{
                wx.showToast({
                  title: '网络异常，请稍后',
                  duration: 1000,
                  icon: "none",
                });
            }
        })
        }else{
            wx.navigateTo({
                url: '/pages/momentDetails/momentDetails?moment_id='+moment_id,
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            classify_type:options.type
        })
        var token = app.globalData.userInfo?app.globalData.userInfo.token:null;
        if(token){
            this.setData({
                token:token
            })
        }
        if(options.type==0){
            this.getNotification_page1(false)
        }else{
            this.getNotification_page2(false)
        }
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
        if(this.data.classify_type==0){
            this.getNotification_page1(1);
        }
        if(this.data.classify_type==1){
            this.getNotification_page2(1);
        }
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