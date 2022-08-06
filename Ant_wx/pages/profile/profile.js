// pages/profile/profile.js
var app = getApp();
var api = require("../../config/api");
var auth = require("../../utils/auth.js");
var COS = require('../../utils/cos-wx-sdk-v5.js');
var cos = new COS({
    // 必选参数
    getAuthorization: function (options, callback) {
        // 服务端 JS 和 PHP 示例：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
        // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
        // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048
        wx.request({
            url: app.rootURL+'credential/',
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
        personalInfo:[],
        momentList:[],
        momentList_flag:0,
        moment_status:{
            id:null,
            index:null,
            value:null,
        },
        currentMoment:[],
        min_id:null,
        max_id:null,
        avatarUrl:null,
        real_avatarUrl:null,
        nickName:null,
        token:null,
        bottom_window:false,
        classify_type:0, /*下半部分---分类 */
        classify_type1_type:0,
        classify_type2_type:0,
        tacitList:[],  /*我的独白--默契测试*/
        tacitList_flag:0,
        tacit_min_id:null,
        tacit_max_id:null,
        bottom_window_tacit:false,
        tacit_status:{
            id:null,
            index:null,
            value:null,
        },
        tacitReplyList:[], /*朋友眼中的我--默契测试*/
        tacitReplyList_flag:0,
        tacitReply_min_id:null,
        tacitReply_max_id:null,
        bottom_window_tacit_reply:false,
        tacit_reply_status:{
            id:null,
            index:null,
            value:null,
        },
    },
    onClickLogin:function(){
        wx.navigateTo({
          url: '/pages/login/login',
        })
    },
    getMoment:function(roll){
        /**触底更新获取数据 */
        if(roll==1){
            wx.request({
                url: api.personalMomentURL,
                data:{
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
            url: api.personalMomentURL,
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
    onClickUpdateStatus(e){
        this.setData({
            moment_status:e.currentTarget.dataset.value,
        });
    },
    onClickCancelStatus:function(){
        this.setData({
            bottom_window:false,
        })
    },
    onClickChangeStatus(e){
        var index = this.data.moment_status.index;
        var moment_status = e.detail.value
        this.setData({
            ["momentList["+index+"].moment_status"]: moment_status,
            bottom_window:false,
        });
        var moment_id = this.data.moment_status.id;
        wx.request({
            url: api.updatePersonalMomentURL+moment_id+"/",
            data:{
                moment_status:moment_status,
            },
            method:'PUT',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    wx.showToast({
                      title: '修改成功',
                      duration: 1000,
                      icon: "none",
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
    onClickPopupWindow:function(e){
        this.setData({
            ["moment_status.id"]:e.currentTarget.dataset.moment_id,
            ["moment_status.index"]:e.currentTarget.dataset.index,
            bottom_window:true,
        });
    },
    onClickDelCurrentMoment:function(e){
        var index = this.data.moment_status.index
        var momentList = this.data.momentList;
        var currentMoment = momentList[index];
        var imageList = currentMoment.imageList
        if(imageList.length==0){
            this.onClickDelMoment()
            return;
        }
        for(let i=0; i<imageList.length; i++){
            var path = imageList[i].path
            var filename = path.substr(path.lastIndexOf('/') + 1);
            cos.deleteObject({
                Bucket: 'mini-1257058751',
                Region: 'ap-chengdu',
                Key: 'publish/'+filename,
            }, function (err, data) {
                console.log(err || data);
            });
        }
        this.onClickDelMoment()

    },
    onClickDelMoment:function(){
        var index = this.data.moment_status.index
        this.setData({
            bottom_window:false,
        });
        var moment_id = this.data.moment_status.id;
        wx.request({
            url: api.delPersonalMomentURL+moment_id+"/",
            method:'DELETE',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==204){
                    wx.showToast({
                      title: '删除成功',
                      duration: 1000,
                      icon: "none",
                    });
                    var momentList = this.data.momentList;
                    momentList.splice(index,1)
                    this.setData({
                        momentList: momentList,
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
    /** 获取个人信息 */
    getPersonalInfo:function(){
        /** 通过TOKEN获取个人信息*/
        wx.request({
            url: api.personalInfoURL,
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    this.setData({
                        personalInfo: res.data
                    })
                }else{
                    wx.showToast({
                      title: '数据被吃掉了，请稍后刷新',
                      duration: 1000,
                      icon: "none",
                    });
                }
            }
        })
    },
    /*  分类  */
    onClickClassify:function(e){
        var classify_type = e.currentTarget.dataset.value
        this.setData({
            classify_type:classify_type
        })
        if(this.data.token){
            if(classify_type==0){
                this.setData({
                    bottom_window:false,
                    bottom_window_tacit:false,
                    bottom_window_tacit_reply:false
                })
                this.getMoment(false);
            }
            else if(classify_type==1){
                this.setData({
                    bottom_window:false,
                    bottom_window_tacit:false,
                    bottom_window_tacit_reply:false
                })
                this.getTacit(false);
            }else if(classify_type==2){
                this.setData({
                    bottom_window:false,
                    bottom_window_tacit:false,
                    bottom_window_tacit_reply:false
                })
                this.getTacitReply(false);
            }
        }
    },
    /*我的独白--默契测试*/
    onClickPopupWindowTacit:function(e){
        this.setData({
            ["tacit_status.id"]:e.currentTarget.dataset.tacit_id,
            ["tacit_status.index"]:e.currentTarget.dataset.index,
            bottom_window_tacit:true,
        });
    },
    onClickCancelStatusTacit:function(){
        this.setData({
            bottom_window_tacit:false,
        })
    },
    onClickChangeStatusTacit(e){
        var index = this.data.tacit_status.index;
        var tacit_status = e.detail.value
        this.setData({
            ["tacitList["+index+"].tacit_status"]: tacit_status,
            bottom_window_tacit:false,
        });
        var tacit_id = this.data.tacit_status.id;
        wx.request({
            url: api.updatePersonalTacitURL+tacit_id+"/",
            data:{
                tacit_status:tacit_status,
            },
            method:'PUT',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    wx.showToast({
                      title: '修改成功',
                      duration: 1000,
                      icon: "none",
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
    onClickDelTacit:function(){
        var index = this.data.tacit_status.index
        this.setData({
            bottom_window_tacit:false,
        });
        var tacit_id = this.data.tacit_status.id;
        wx.request({
            url: api.delPersonalTacitURL+tacit_id+"/",
            method:'DELETE',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==204){
                    wx.showToast({
                      title: '删除成功',
                      duration: 1000,
                      icon: "none",
                    });
                    var tacitList = this.data.tacitList;
                    tacitList.splice(index,1)
                    this.setData({
                        tacitList: tacitList,
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
    getTacit:function(roll){
        /**触底更新获取数据 */
        if(roll==1){
            wx.request({
                url: api.personalTacitURL,
                data:{
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
            url: api.personalTacitURL,
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    if(!res.data.length){
                        this.setData({
                            tacitList_flag: 1,
                        })
                        return;
                    }
                    var max_id = res.data[0].id;
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        tacit_max_id: max_id,
                        tacit_min_id: min_id,
                        tacitList: res.data,
                        tacitList_flag: 2
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
    getTacitReply:function(roll){
        /**触底更新获取数据 */
        if(roll==1){
            var min_id = this.data.tacitReply_min_id
            if(!min_id){
                return
            }
            wx.request({
                url: api.personalTacitReplyURL,
                data:{
                    min_id:min_id
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
            url: api.personalTacitReplyURL,
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
    onClickPopupWindowTacitReply:function(e){
        this.setData({
            ["tacit_reply_status.id"]:e.currentTarget.dataset.tacit_id,
            ["tacit_reply_status.index"]:e.currentTarget.dataset.index,
            bottom_window_tacit_reply:true,
        });
    },
    onClickCancelStatusTacitReply:function(){
        this.setData({
            bottom_window_tacit_reply:false,
        })
    },
    onClickChangeStatusTacitReply(e){
        var index = this.data.tacit_reply_status.index;
        var tacit_reply_status = e.detail.value
        this.setData({
            ["tacitReplyList["+index+"].tacit_reply_status"]: tacit_reply_status,
            bottom_window_tacit_reply:false,
        });
        var tacit_id = this.data.tacit_reply_status.id;
        wx.request({
            url: api.updatePersonalTacitURL+tacit_id+"/",
            data:{
                tacit_reply_status:tacit_reply_status,
            },
            method:'PUT',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    wx.showToast({
                      title: '修改成功',
                      duration: 1000,
                      icon: "none",
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
    onClickAskMeRecord(e){
        let tacitrecord_id = e.currentTarget.dataset.tacitrecordid
        wx.navigateTo({
          url: '/pages/askMeDetails/askMeDetails?tacitrecord_id='+tacitrecord_id
        })
    },
    onClickInitiateAskMe(){
        if(!auth.is_login()){
            return;
        }
        wx.navigateTo({
            url: '/pages/createAskMe/createAskMe',
        })
    },
    onClickInitialteTacit(){
        if(!auth.is_login()){
            return;
        }
        wx.navigateTo({
            url: '/pages/tacitTest/tacitTest',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var token = app.globalData.userInfo?app.globalData.userInfo.token:null;
        if(token){
            if(app.globalData.classify_type){
                this.setData({
                    avatarUrl: app.globalData.userInfo.avatarUrl,
                    nickName: app.globalData.userInfo.nickName,
                    token: token,
                    classify_type:app.globalData.classify_type,
                });
                if(app.globalData.classify_type==1){
                    this.getTacit(false);
                }
                app.globalData.classify_type = null;
            }else{
                this.setData({
                    avatarUrl: app.globalData.userInfo.avatarUrl,
                    nickName: app.globalData.userInfo.nickName,
                    token: token,
                });
                this.getMoment(false);
            }
            this.getPersonalInfo();
            //this.getTacit(false);
            //this.getTacitReply(false);
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
        var token = app.globalData.userInfo?app.globalData.userInfo.token:null;
        if(token){
            if(app.globalData.classify_type){
                this.setData({
                    avatarUrl: app.globalData.userInfo.avatarUrl,
                    nickName: app.globalData.userInfo.nickName,
                    token: token,
                    classify_type:app.globalData.classify_type,
                });
                if(app.globalData.classify_type==1){
                    this.getTacit(false);
                }
                app.globalData.classify_type = null;
            }else{
                this.setData({
                    avatarUrl: app.globalData.userInfo.avatarUrl,
                    nickName: app.globalData.userInfo.nickName,
                    token: token,
                });
                this.getMoment(false);
            }
            this.getPersonalInfo();
            //this.getTacit(false);
            //this.getTacitReply(false);
        }
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
        var token = app.globalData.userInfo?app.globalData.userInfo.token:null;
        if(token){
            if(this.data.classify_type==0){
                if(this.data.momentList_flag!=0){
                    this.getMoment(1);
                }
            }else if(this.data.classify_type==1){
                if(this.data.tacitList_flag!=0){
                    this.getTacit(1);
                }
            }else if(this.data.classify_type!=0){
                this.getTacitReply(1)
            }
        }else{
            wx.showToast({
                title: '请登录哟',
                icon:"none",
                duration:1000,
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    /*
    onShareAppMessage: function () {

    }*/
})