// pages/otherDetails/otherDetails.js
var app = getApp();
var api = require("../../config/api");
var auth = require("../../utils/auth.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        otherInfo:[],
        momentList:[],
        momentList_flag:0,
        min_id:null,
        max_id:null,
        avatarUrl:null,
        nickName:null,
        user_id:null,
        classify_type:0, /*下半部分---分类 */
        classify_type1_type:0,
        classify_type2_type:0,
        tacitList:[],  /*关于我--默契测试*/
        tacitList_flag:0,
        tacit_min_id:null,
        tacit_max_id:null,
        tacitReplyList:[], /*朋友眼中的我--默契测试*/
        tacitReplyList_flag:0,
        tacitReply_min_id:null,
        tacitReply_max_id:null,
        inviteSelf: true,
        invitePage1:true,
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
    onClickInvitePage1:function(){
        if(!auth.is_login()){
            return;
        }
        if(!this.data.user_id){
            return
        }
        wx.request({
            url: api.otherInviteSelfURL,
            data:{
                notificationType:51,
                toUser:this.data.user_id,
                userHasChecked:true,
            },
            method:'POST',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==201){
                    wx.showToast({
                        title: '已发送邀请',
                        duration: 1000,
                        icon: "none",
                    });
                    this.setData({
                        invitePage1:false
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
    onClickInviteSelf:function(){
        if(!auth.is_login()){
            return;
        }
        if(!this.data.user_id){
            return
        }
        wx.request({
            url: api.otherInviteSelfURL,
            data:{
                notificationType:52,
                toUser:this.data.user_id,
                userHasChecked:true,
            },
            method:'POST',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==201){
                    wx.showToast({
                        title: '已发送邀请',
                        duration: 1000,
                        icon: "none",
                    });
                    this.setData({
                        inviteSelf:false
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
    getOtherMoment:function(roll){
        /**触底更新获取数据 */
        if(roll==1){
            if(!this.data.min_id){
                return
            }
            wx.request({
                url: api.otherMomentsURL,
                data:{
                    user_id:this.data.user_id,
                    min_id:this.data.min_id
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
                            min_id: min_id,
                            momentList: this.data.momentList.concat(res.data)
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
            url: api.otherMomentsURL,
            data:{
                user_id:this.data.user_id,
            },
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    if(!res.data.length){
                        this.setData({
                            momentList_flag:1
                        })
                        return;
                    }
                    var max_id = res.data[0].id;
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        max_id: max_id,
                        min_id: min_id,
                        momentList: res.data,
                        momentList_flag:2
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
    /** 获取个人信息 */
    getOtherInfo:function(user_id){
        //通过ID获取个人信息
        const promise = new Promise((resolve, reject)=>{
            wx.request({
                url: api.otherDetailURL+user_id+"/",
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                method:'GET',
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
                this.setData({
                    otherInfo: res.data
                })
            }else{
                wx.showToast({
                    title: '网络异常，请稍后',
                    duration: 1000,
                    icon: "none",
                });
            }
        },(err)=>{
            console.log(err)
        })
    },
    onClickFocusUser:function(){
        if(!auth.is_login()){
            return;
        }
        if(!this.data.otherInfo.id){
            return
        }
        var user_id = this.data.otherInfo.id
        wx.request({
            url: api.focusUserURL,
            data:{
                user: user_id
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'POST',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    wx.showToast({
                      title: '已取消关注',
                      icon:"none",
                      duration:1000
                    })
                    this.setData({
                        ["otherInfo.is_focused"]:false
                    })
                }else if(res.statusCode==201){
                    wx.showToast({
                      title: ' 关注成功哟',
                      icon:"none",
                      duration:1000
                    })
                    this.setData({
                        ["otherInfo.is_focused"]:true
                    })
                }
                else if(res.statusCode==204){
                    wx.showToast({
                        title: '不可以关注自己哟',
                        icon:"none"
                    });
                }else{
                    wx.showToast({
                      title: '网络异常，请稍后',
                    })
                }
            }
        })
    },
    onClickSwitch:function(){
        wx.switchTab({
            url: "/pages/index/index",
          })
    },
    /*  分类  */
    onClickClassify:function(e){
        var classify_type = e.currentTarget.dataset.value
        this.setData({
            classify_type:classify_type
        })
        if(classify_type==0){
            this.getOtherMoment(false);
        }else if(classify_type==1){
            this.getOtherTacit(false);
        }else if(classify_type==2){
            this.getOtherTacitReply(false);
        }
    },
    /*关于我--默契测试*/
    getOtherTacit:function(roll){
        /**触底更新获取数据 */
        if(roll==1){
            if(!this.data.tacit_min_id){
                return
            }
            wx.request({
                url: api.otherTacitsURL,
                data:{
                    user_id:this.data.user_id,
                    min_id:this.data.tacit_min_id
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
                                title: '已到达底线',
                                duration: 1000,
                                icon: "none",
                            });
                            return;
                        }
                        var tacit_min_id = res.data[res.data.length-1].id;
                        this.setData({
                            tacit_min_id: tacit_min_id,
                            tacitList: this.data.tacitList.concat(res.data)
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
            return;
        }
        /**第一次加载更新数据 */
        wx.request({
            url: api.otherTacitsURL,
            data:{
                user_id:this.data.user_id,
            },
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    if(!res.data.length){
                        this.setData({
                            tacitList_flag:1
                        })
                        return;
                    }
                    var max_id = res.data[0].id;
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        tacit_max_id: max_id,
                        tacit_min_id: min_id,
                        tacitList: res.data,
                        tacitList_flag:2
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
    /**朋友眼中的我--默契测试 */
    getOtherTacitReply:function(roll){
        /**触底更新获取数据 */
        if(roll==1){
            if(!this.data.tacitReply_min_id){
                return
            }
            wx.request({
                url: api.otherTacitsReplyURL,
                data:{
                    user_id:this.data.user_id,
                    min_id:this.data.tacitReply_min_id
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
                                title: '到达底线',
                                duration: 1000,
                                icon: "none",
                            });
                            return;
                        }
                        var min_id = res.data[res.data.length-1].id;
                        this.setData({
                            tacitReply_min_id: min_id,
                            tacitReplyList: this.data.tacitReplyList.concat(res.data)
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
            return;
        }
        /**第一次加载更新数据 */
        wx.request({
            url: api.otherTacitsReplyURL,
            data:{
                user_id:this.data.user_id,
            },
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    if(!res.data.length){
                        this.setData({
                            tacitReplyList_flag:1
                        })
                        return;
                    }
                    var max_id = res.data[0].id;
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        tacitReply_max_id: max_id,
                        tacitReply_min_id: min_id,
                        tacitReplyList: res.data,
                        tacitReplyList_flag:2
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
    onClickLikeTacitReply:function(e){
        if(!auth.is_login()){
            return;
        }
        var tacitReplyRecord_id = e.currentTarget.dataset.mid;
        var tacitindex = e.currentTarget.dataset.mtacitindex;
        var replyindex = e.currentTarget.dataset.mreplyindex;
        wx.request({
            url: api.personalTacitReplyFavorURL,
            data:{
                tacitReplyRecord: tacitReplyRecord_id,
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'POST',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    wx.showToast({
                        title: '取消赞哟',
                        icon:"none"
                    });
                    this.setData({
                        ["tacitReplyList["+tacitindex+"].replyList["+replyindex+"].is_favor"]: false,
                    });
                }else if(res.statusCode==201){
                    this.setData({
                        ["tacitReplyList["+tacitindex+"].replyList["+replyindex+"].is_favor"]: true,
                    });
                    wx.showToast({
                        title: '有品位哟~',
                        icon:"none"
                    });
                }else if(res.statusCode==204){
                    wx.showToast({
                        title: '不可以给自己点赞哟',
                        icon:"none"
                    });
                }else{
                    wx.showToast({
                        title: '系统遇到麻烦哟~',
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
        if(app.globalData.classify_type){
            this.setData({
                user_id:options.user_id,
                classify_type:app.globalData.classify_type
            });
            if(app.globalData.classify_type==2){
                this.getOtherTacitReply(false);
            }
            app.globalData.classify_type = null;
        }else{
            this.setData({
                user_id:options.user_id,
            });
        }
        this.getOtherInfo(options.user_id);
        this.getOtherMoment(false);
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
        if(this.data.classify_type==0){
            if(this.data.momentList_flag!=0){
                this.getOtherMoment(1);
            }
        }else if(this.data.classify_type==1){
            if(this.data.tacitList_flag!=0){
                this.getOtherTacit(1);
            }
        }else if(this.data.classify_type==2){
            if(this.data.tacitReplyList_flag!=0){
                this.getOtherTacitReply(1);
            }
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})