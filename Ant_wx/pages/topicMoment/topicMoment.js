// pages/topicMoment/topicMoment.js
var app = getApp();
var api = require("../../config/api.js");
var auth = require("../../utils/auth.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        momentList_time:[],
        momentList_hotview:[],
        momentList_hotcited:[],
        momentList_hotfavor:[],
        topic_id:null,
        min_id_time:null,
        max_id_time:null,
        min_id_hotview:null,
        max_id_hotview:null,
        min_id_hotcomment:null,
        max_id_hotcomment:null,
        min_id_hotfavor:null,
        max_id_hotfavor:null,
        topicDetail:null,
        classify_type:0,
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
    /*  分类  */
    onClickClassify:function(e){
        var classify_type = e.currentTarget.dataset.value
        this.setData({
            classify_type:classify_type
        })
        if(classify_type==0){
            this.getTopicMoment_time(false)
        }else if(classify_type==1){
            this.getTopicMoment_hotview(false)
        }else if(classify_type==2){
            this.getTopicMoment_hotcomment(false)
        }else if(classify_type==3){
            this.getTopicMoment_hotfavor(false)
        }
    },
    getTopicDetail:function(topic_id){
        //通过ID获取个人信息
        wx.request({
            url: api.topicDetailURL+topic_id+"/",
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'GET',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    this.setData({
                        topicDetail: res.data
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
    getTopicMoment_time:function(roll){
        /**触底更新获取数据 */
        if(roll==1){
            if(!this.data.min_id_time){
                return
            }
            wx.request({
                url: api.topicMomentsTimeURL,
                data:{
                    topic_id:this.data.topic_id,
                    min_id:this.data.min_id_time
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
                            min_id_time: min_id,
                            momentList_time: this.data.momentList_time.concat(res.data)
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
            url: api.topicMomentsTimeURL,
            data:{
                topic_id:this.data.topic_id,
            },
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
                    var max_id = res.data[0].id;
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        max_id_time: max_id,
                        min_id_time: min_id,
                        momentList_time: res.data,
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
    getTopicMoment_hotview:function(roll){
        /**触底更新获取数据 */
        if(roll==1){
            wx.request({
                url: api.topicMomentsHotViewURL,
                data:{
                    topic_id:this.data.topic_id,
                    min_id:this.data.min_id_hotview
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
                            min_id_hotview: min_id,
                            momentList_hotview: this.data.momentList_hotview.concat(res.data)
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
            url: api.topicMomentsHotViewURL,
            data:{
                topic_id:this.data.topic_id,
            },
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
                    var max_id = res.data[0].id;
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        max_id_hotview: max_id,
                        min_id_hotview: min_id,
                        momentList_hotview: res.data,
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
    getTopicMoment_hotcomment:function(roll){
        /**触底更新获取数据 */
        if(roll==1){
            wx.request({
                url: api.topicMomentsHotCommentURL,
                data:{
                    topic_id:this.data.topic_id,
                    min_id:this.data.min_id_hotcomment
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
                            min_id_hotcomment: min_id,
                            momentList_hotcomment: this.data.momentList_hotcomment.concat(res.data)
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
            url: api.topicMomentsHotCommentURL,
            data:{
                topic_id:this.data.topic_id,
            },
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
                    var max_id = res.data[0].id;
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        max_id_hotcomment: max_id,
                        min_id_hotcomment: min_id,
                        momentList_hotcomment: res.data,
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
    getTopicMoment_hotfavor:function(roll){
        /**触底更新获取数据 */
        if(roll==1){
            wx.request({
                url: api.topicMomentsHotFavorURL,
                data:{
                    topic_id:this.data.topic_id,
                    min_id:this.data.min_id_hotfavor
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
                            min_id_hotfavor: min_id,
                            momentList_hotfavor: this.data.momentList_hotfavor.concat(res.data)
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
            url: api.topicMomentsHotFavorURL,
            data:{
                topic_id:this.data.topic_id,
            },
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
                    var max_id = res.data[0].id;
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        max_id_hotfavor: max_id,
                        min_id_hotfavor: min_id,
                        momentList_hotfavor: res.data,
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
    onClickLikeMoment_0:function(e){
        if(!auth.is_login()){
            return;
        }
        var moment_id = e.currentTarget.dataset.mid;
        var favor_count = e.currentTarget.dataset.mfavor;
        var index = e.currentTarget.dataset.index;
        wx.request({
            url: api.momentFavorURL,
            data:{
                moment: moment_id,
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
                        ["momentList_time["+index+"].is_favor"]: false,
                        ["momentList_time["+index+"].favor_count"]:favor_count-1
                    });
                }else if(res.statusCode==201){
                    this.setData({
                        ["momentList_time["+index+"].is_favor"]: true,
                        ["momentList_time["+index+"].favor_count"]:favor_count+1
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
                        title: '瞬间已经吃掉',
                        icon:"none"
                    });
                }
            }
        })
    },
    onClickLikeMoment_1:function(e){
        if(!auth.is_login()){
            return;
        }
        var moment_id = e.currentTarget.dataset.mid;
        var favor_count = e.currentTarget.dataset.mfavor;
        var index = e.currentTarget.dataset.index;
        wx.request({
            url: api.momentFavorURL,
            data:{
                moment: moment_id,
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
                        ["momentList_hotview["+index+"].is_favor"]: false,
                        ["momentList_hotview["+index+"].favor_count"]:favor_count-1
                    });
                }else if(res.statusCode==201){
                    this.setData({
                        ["momentList_hotview["+index+"].is_favor"]: true,
                        ["momentList_hotview["+index+"].favor_count"]:favor_count+1
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
                        title: '瞬间已经吃掉',
                        icon:"none"
                    });
                }
            }
        })
    },
    onClickLikeMoment_2:function(e){
        if(!auth.is_login()){
            return;
        }
        var moment_id = e.currentTarget.dataset.mid;
        var favor_count = e.currentTarget.dataset.mfavor;
        var index = e.currentTarget.dataset.index;
        wx.request({
            url: api.momentFavorURL,
            data:{
                moment: moment_id,
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
                        ["momentList_hotcomment["+index+"].is_favor"]: false,
                        ["momentList_hotcomment["+index+"].favor_count"]:favor_count-1
                    });
                }else if(res.statusCode==201){
                    this.setData({
                        ["momentList_hotcomment["+index+"].is_favor"]: true,
                        ["momentList_hotcomment["+index+"].favor_count"]:favor_count+1
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
                        title: '瞬间已经吃掉',
                        icon:"none"
                    });
                }
            }
        })
    },
    onClickLikeMoment_3:function(e){
        if(!auth.is_login()){
            return;
        }
        var moment_id = e.currentTarget.dataset.mid;
        var favor_count = e.currentTarget.dataset.mfavor;
        var index = e.currentTarget.dataset.index;
        wx.request({
            url: api.momentFavorURL,
            data:{
                moment: moment_id,
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
                        ["momentList_hotfavor["+index+"].is_favor"]: false,
                        ["momentList_hotfavor["+index+"].favor_count"]:favor_count-1
                    });
                }else if(res.statusCode==201){
                    this.setData({
                        ["momentList_hotfavor["+index+"].is_favor"]: true,
                        ["momentList_hotfavor["+index+"].favor_count"]:favor_count+1
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
                        title: '瞬间已经吃掉',
                        icon:"none"
                    });
                }
            }
        })
    },
    onClickFocusTopic:function(e){
        if(!auth.is_login()){
            return;
        }
        var topic_id = e.currentTarget.dataset.topic_id
        if(!topic_id){
            return
        }
        wx.request({
            url: api.focusTopicURL,
            data:{
                topic: topic_id
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
                        ["topicDetail.is_focused"]:false
                    })
                }else if(res.statusCode==201){
                    wx.showToast({
                      title: ' 关注成功哟',
                      icon:"none",
                      duration:1000
                    })
                    this.setData({
                        ["topicDetail.is_focused"]:true
                    })
                }
                else{
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            topic_id:options.topic_id
        })
        this.getTopicDetail(options.topic_id)
        this.getTopicMoment_time(false)
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
            this.getTopicMoment_time(1);
        }else if(this.data.classify_type==1){
            this.getTopicMoment_hotview(1);
        }else if(this.data.classify_type==2){
            this.getTopicMoment_hotcomment(1);
        }else if(this.data.classify_type==3){
            this.getTopicMoment_hotfavor(1);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})