// pages/addressMoment/addressMoment.js
var app = getApp();
var api = require("../../config/api.js");
var auth = require("../../utils/auth.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        momentList_distance:[],
        momentList_time:[],
        address_id:null,
        min_id_distance:null,
        max_id_distance:null,
        min_id_time:null,
        max_id_time:null,
        addressDetail:null,
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
    onClickClassify:function(e){
        var classify_type = e.currentTarget.dataset.value
        this.setData({
            classify_type:classify_type
        })
        if(classify_type==0){
            this.getaddressMoment_distance(false)
        }else if(classify_type==1){
            this.getaddressMoment_time(false)
        }
    },
    getAddressDetail:function(address_id){
        //通过ID获取个人信息
        wx.request({
            url: api.addressDetailURL+address_id+"/",
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'GET',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    this.setData({
                        addressDetail: res.data
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
    getaddressMoment_distance:function(roll){
        /**触底更新获取数据 */
        if(roll==1){
            if(!this.data.min_id_time){
                return
            }
            wx.request({
                url: api.addressMomentsDistanceURL,
                data:{
                    address_id:this.data.address_id,
                    min_id:this.data.min_id_distance
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
                            min_id_distance: min_id,
                            momentList_distance: this.data.momentList_distance.concat(res.data)
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
            url: api.addressMomentsDistanceURL,
            data:{
                address_id:this.data.address_id,
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
                        max_id_distance: max_id,
                        min_id_distance: min_id,
                        momentList_distance: res.data,
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
    getaddressMoment_time:function(roll){
        /**触底更新获取数据 */
        if(roll==1){
            wx.request({
                url: api.addressMomentsTimeURL,
                data:{
                    address_id:this.data.address_id,
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
            url: api.addressMomentsTimeURL,
            data:{
                address_id:this.data.address_id,
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
    onClickLikeMoment_0:function(e){
        if(!auth.is_login()){
            return;
        }
        var moment_id = e.currentTarget.dataset.mid;
        var favor_count = e.currentTarget.dataset.mfavor;
        var index = e.currentTarget.dataset.index;
        var subindex = e.currentTarget.dataset.subindex;
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
                        ["momentList_distance["+index+"].moment_list["+subindex+"].is_favor"]: false,
                        ["momentList_distance["+index+"].moment_list["+subindex+"].favor_count"]:favor_count-1
                    });
                }else if(res.statusCode==201){
                    this.setData({
                        ["momentList_distance["+index+"].moment_list["+subindex+"].is_favor"]: true,
                        ["momentList_distance["+index+"].moment_list["+subindex+"].favor_count"]:favor_count+1
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
    onClickFocusAddress:function(e){
        if(!auth.is_login()){
            return;
        }
        var address_id = e.currentTarget.dataset.address_id
        if(!address_id){
            return
        }
        wx.request({
            url: api.focusAddressURL,
            data:{
                address: address_id
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
                        ["addressDetail.is_focused"]:false
                    })
                }else if(res.statusCode==201){
                    wx.showToast({
                      title: ' 关注成功哟',
                      icon:"none",
                      duration:1000
                    })
                    this.setData({
                        ["addressDetail.is_focused"]:true
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
            address_id:options.address_id
        })
        this.getAddressDetail(options.address_id)
        this.getaddressMoment_distance(false)
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
            this.getaddressMoment_distance(1);
        }else if(this.data.classify_type==1){
            this.getaddressMoment_time(1);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})