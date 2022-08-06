// pages/askme/askme.js
var app = getApp();
var api = require('../../config/api');
var auth = require("../../utils/auth.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show_ask:false,
        show_ask_fail:false,
        show_results:false,
        ask_content:null,
        tacitrecord_id:null,
        user_id:null,
        ask_status:null,
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
    onClickAskStart(){
        const promise = new Promise((resolve, reject)=>{
            if(!auth.is_login()){
                return;
            }
            wx.showLoading({
              title: '打开中',
            })
            wx.request({
                url: api.scanAskAnythingURL+this.data.tacitrecord_id+"/",
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
            if(res.statusCode==404){
                wx.hideLoading({})
                this.setData({
                    show_ask_fail:true
                })
                return
            }
            wx.hideLoading({})
            this.setData({
                show_ask:true
            })
        },(err)=>{
            wx.hideLoading({})
            console.log(err)
        })
    },
    onClickAskStatus(e){
        let ask_status = e.detail.value
        this.setData({
            ask_status:ask_status
        })
    },
    onClickContent(e){
        let ask_content = e.detail.value
        this.setData({
            ask_content:ask_content
        })
    },
    onClickAskSubmit(){
        const promise = new Promise((resolve, reject)=>{
            if(!auth.is_login()){
                return;
            }
            if(!this.data.ask_status){
                wx.showToast({
                  title: '必须选择显示状态',
                  icon:"none",
                  duration:1000
                });
                return;
            };
            if(!this.data.ask_content){
                wx.showToast({
                  title: '提问不可以为空',
                  icon:"none",
                  duration:1000
                });
                return;
            };
            wx.showLoading({
              title: '提交中',
            })
            wx.request({
                url: api.replyAskAnythingURL,
                data:{
                    tacitrecord:this.data.tacitrecord_id,
                    content: this.data.ask_content,
                    comment_status:this.data.ask_status,
                },
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                method:'POST',
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
            if(res.statusCode==201){
                wx.hideLoading({})
                wx.showToast({
                  title: '提问成功',
                })
            }else{
                wx.hideLoading({})
                wx.showToast({
                  title: '网络异常，请稍后',
                  duration: 1000,
                  icon: "none",
                });
            }
        },(err)=>{
            wx.hideLoading({})
            console.log(err)
        })
    },
    onClickAskMeRecord(){
        if(!auth.is_login()){
            return;
        }
        wx.navigateTo({
          url: '/pages/askMeDetails/askMeDetails?tacitrecord_id='+this.data.tacitrecord_id
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
    onClickExploreCommunity(){
        wx.switchTab({
          url: '/pages/index/index',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            tacitrecord_id:options.tacitrecord_id
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        if(!auth.is_login()){
            return;
        }
        let tacitrecord_id = this.data.tacitrecord_id
        if(!tacitrecord_id){
            return{
                title:'创建失败，请先登陆',
                imageUrl:wx.getStorageSync('userInfo').real_avatarUrl,
            }
            return
        }
        return {
            title: '赶紧前往"条件匿名/公开"对我提问吧（Ask me anything），我发起了“坦白局”活动',
            path: '/pages/askme/askme?tacitrecord_id='+this.data.tacitrecord_id,
            imageUrl:wx.getStorageSync('userInfo').real_avatarUrl,
        }
    },
    onShareTimeline(res){
        if(!auth.is_login()){
            return;
        }
        let tacitrecord_id = this.data.tacitrecord_id
        if(!tacitrecord_id){
            return{
                title:'创建失败，请先登陆',
                imageUrl:wx.getStorageSync('userInfo').real_avatarUrl,
            }
            return
        }
        return{
            title:'赶紧前往"条件匿名/公开"对我提问吧（Ask me anything），我发起了“坦白局”活动',
            imageUrl:wx.getStorageSync('userInfo').real_avatarUrl,
            query: '/pages/askme/askme?tacitrecord_id='+tacitrecord_id,
        }
    }
})