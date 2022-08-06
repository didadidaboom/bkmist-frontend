// pages/momentDetails/momentDetails.js
var app = getApp();
var api = require("../../config/api.js");
var auth = require("../../utils/auth.js");
const { filter } = require("../../utils/cos-wx-sdk-v5.js");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        moment_id:null,
        moment:[],
        min_comment_id:null,
        min_comment_flag:false,
        BV_reply_avatarUrl:null,
        BV_comment:null,
        BV_user_id:null,
        BV_reply_id:null,
        BV_depth:null,
        BV_root_id:null,
        BV_comment_status:0,
        windowHeight: 0,//记录界面高度
        containerHeight: 0,//记录未固定整体滚动界面的高度
        containerBottomHeight: 0,//记录未固定整体滚动界面距离底部高度
        keyboardHeight: 0,//键盘高度
        isIphone: false//是否为苹果手机，因苹果手机效果与Android有冲突，所以需要特殊处理
    },
    /**
     * 评论回复
     */
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
    onClickChangeCommentStatus:function(e){
        this.setData({
            BV_comment_status:e.currentTarget.dataset.status
        })
    },
    onClickReply:function(e){
        if(e.currentTarget.dataset.cdepth==1){
            this.setData({
                BV_reply_id:e.currentTarget.dataset.cid,
                BV_depth:e.currentTarget.dataset.cdepth+1,
                BV_root_id:e.currentTarget.dataset.cid,
                BV_reply_avatarUrl:e.currentTarget.dataset.cuser_avatar
            });
            return
        };
        this.setData({
            BV_reply_id:e.currentTarget.dataset.cid,
            BV_depth:e.currentTarget.dataset.cdepth+1,
            BV_root_id:e.currentTarget.dataset.croot_id,
            BV_reply_avatarUrl:e.currentTarget.dataset.cuser_avatar
        });
    },
    onClickCancel:function(){
        this.setData({
            BV_reply_id:null,
            BV_depth:1,
            BV_root_id:null,
            BV_reply_avatarUrl:this.data.moment.user.avatarUrl
        });
    },
    onClickCommentInput:function(e){
        this.setData({
            BV_comment:e.detail.value
        })
    },
    onClickSubmitComment:function(){
        if(!auth.is_login()){
            return;
        }
        if(!this.data.BV_comment){
            wx.showToast({
              title: '评论不可以为空',
              icon:"none",
              duration:1000
            });
            return;
        };
        wx.showLoading({
          title: '评论中',
        })
        wx.request({
            url: api.submitCommentURL,
            data:{
                moment: this.data.moment_id,
                content: this.data.BV_comment,
                reply: this.data.BV_reply_id,
                depth: this.data.BV_depth,
                root: this.data.BV_root_id,
                comment_status:this.data.BV_comment_status,
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'POST',
            dataType:"json",
            success: (res)=>{
                if(!res.data.length==0){
                    wx.hideLoading({})
                    wx.showToast({
                      title: '数据被吃了',
                      duration: 1000,
                      icon:"none"
                    });
                    return;
                };
                var dictList = res.data;
                var commentRecord = this.data.moment.comment.commentRecord;
                //delete dictList["reply"];
                //delete dictList["moment"];
                //delete dictList["root"];
                commentRecord.unshift(dictList);
                var min_comment_flag=true;
                if(!commentRecord.length){
                    min_comment_flag = false;
                }
                this.setData({
                    ["moment.comment.commentRecord"]:commentRecord,
                    min_comment_flag:min_comment_flag,
                    ['moment.comment_count']:this.data.moment.comment_count+1,
                    BV_comment:null
                });
                setTimeout(() => {
                    wx.hideLoading({})
                    wx.showToast({
                        title: '评论成功哟~',
                        icon:"none"
                      });
                }, 500)
            }
        })

    },
    onClickLikeComment:function(e){
        if(!auth.is_login()){
            return;
        }
        var comment_id = e.currentTarget.dataset.cid;
        var favor_count = e.currentTarget.dataset.cfavor;
        var index = e.currentTarget.dataset.cidx;
        wx.request({
            url: api.commentFavorURL,
            data:{
                commentRecord: comment_id
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'POST',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    this.setData({
                        ["moment.comment.commentRecord["+index+"].is_favor"]: false,
                        ["moment.comment.commentRecord["+index+"].favor_count"]:favor_count-1
                    });
                }else if(res.statusCode==201){
                    this.setData({
                        ["moment.comment.commentRecord["+index+"].is_favor"]: true,
                        ["moment.comment.commentRecord["+index+"].favor_count"]:favor_count+1
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
    onClickLikeMoment:function(e){
        if(!auth.is_login()){
            return;
        }
        var moment_id = e.currentTarget.dataset.mid;
        var favor_count = e.currentTarget.dataset.mfavor;
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
                        ["moment.is_favor"]: false,
                        ["moment.favor_count"]:favor_count-1
                    });
                }else if(res.statusCode==201){
                    this.setData({
                        ["moment.is_favor"]: true,
                        ["moment.favor_count"]:favor_count+1
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
    onClickFocusUser:function(e){
        if(!auth.is_login()){
            return;
        }
        var user_id = e.currentTarget.dataset.user_id
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
                        ["moment.user.is_focused"]:false
                    })
                }else if(res.statusCode==201){
                    wx.showToast({
                      title: ' 关注成功哟',
                      icon:"none",
                      duration:1000
                    })
                    this.setData({
                        ["moment.user.is_focused"]:true
                    })
                }
                else if(res.statusCode==204){
                    wx.showToast({
                        title: '不可以关注自己哟',
                        icon:"none"
                    });
                }else{
                    wx.showToast({
                      title: '网络遇到麻烦哟，请稍后',
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取屏幕高度以及设备信息（是否为苹果手机）
        wx.getSystemInfo({
            success: (res)=>{
            this.data.windowHeight = res.windowHeight
            this.data.isIphone = res.model.indexOf("iphone") >= 0 || res.model.indexOf("iPhone") >= 0
            }
        });
        //传递瞬间信息
        var viewer_count = 1;
        this.setData({
            moment_id:options.moment_id
        });
        var moment_id = options.moment_id;
        wx.request({
            url: api.momentDetailURL+moment_id+'/',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'GET',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    var min_comment_flag = true;
                    if(!res.data.comment.commentRecord.length){
                        min_comment_flag = false;
                    };
                    this.setData({
                        moment: res.data,
                        BV_reply_avatarUrl:res.data.user.avatarUrl, //瞬间创作者头像
                        BV_reply_id: null, //瞬间创作者ID
                        BV_depth: 1, //瞬间创作者评论深度 默认1
                        BV_root_id: null,
                        min_comment_flag:min_comment_flag
                    });
                }else{
                    wx.showToast({
                      title: '瞬间已被吃掉',
                      duration:1000
                    })
                    setTimeout(() => {
                        wx.switchTab({
                            url: '/pages/index/index',
                        })
                    }, 1500)
                    return
                }
                
            }
        })
    },
    getMomentDetail:function(){
        /**第一次加载更新数据 */
        var moment_id = this.data.moment_id;
        wx.request({
            url: api.momentDetailURL+moment_id+'/',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'GET',
            dataType:"json",
            success: (res)=>{
                console.log(res.data)
            }
        })
    },
    updateComent:function(){
        if(!this.data.min_comment_flag){
            wx.showToast({
              title: '没有最新评论哟~',
              duration: 1000,
              icon: "none",
            });
            return
        };
        var commentRecord = this.data.moment.comment.commentRecord;
        var min_comment_id = commentRecord[commentRecord.length-1].id;
        wx.request({
            url: api.updateCommentURL,
            data:{
                min_id: min_comment_id,
                moment_id:this.data.moment_id
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
                      icon:"none"
                    });
                    return;
                };
                var dictList = res.data;
                var commentRecord = this.data.moment.comment.commentRecord.concat(dictList);
                var min_comment_flag=true;
                if(!commentRecord.length){
                    min_comment_flag = false;
                }
                this.setData({
                    ["moment.comment.commentRecord"]:commentRecord,
                    min_comment_flag:min_comment_flag
                });

            }
        })
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
        this.updateComent();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})