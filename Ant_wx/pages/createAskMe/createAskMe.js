// pages/createAskMe/createAskMe.js
var app = getApp();
var api = require('../../config/api');
var auth = require("../../utils/auth.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        real_avatarUrl:null,
        tacitrecord_id:null,
        showstep2:false,
        showstep3:false,
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
    onClickCreateAskMe(){
        const promise = new Promise((resolve, reject)=>{
            wx.showLoading({
              title: '创建中',
            })
            wx.request({
                url: api.createAskAnythingURL,
                data:{
                    type:20001,
                    avatarUrlFlag: 1,
                    tacit_status:1
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
                this.setData({
                    tacitrecord_id:res.data.id,
                    user_id:res.data.user_id,
                    showstep2:true
                })
                wx.showToast({
                  title: '创建成功，请进行第二步',
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
        wx.navigateTo({
          url: '/pages/askMeDetails/askMeDetails?tacitrecord_id='+this.data.tacitrecord_id
        })
    },
    onClickSwitchToProfile:function(){
        app.globalData.classify_type = 1
        wx.switchTab({
            url: "/pages/profile/profile",
          })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            real_avatarUrl:wx.getStorageSync('userInfo').real_avatarUrl
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
        let tacitrecord_id = this.data.tacitrecord_id
        if(!tacitrecord_id){
            return{
                title:'创建失败，请先进行第一步"点击创建"',
                imageUrl:wx.getStorageSync('userInfo').real_avatarUrl,
            }
            return
        }
        this.setData({
            showstep3:true
        })
        return {
            title: '赶紧前往"条件匿名/公开"对我提问吧（Ask me anything），我发起了“坦白局”活动',
            path: '/pages/askme/askme?tacitrecord_id='+this.data.tacitrecord_id,
            imageUrl:wx.getStorageSync('userInfo').real_avatarUrl,
        }
    },
    onShareTimeline(res){
        let tacitrecord_id = this.data.tacitrecord_id
        if(!tacitrecord_id){
            return{
                title:'创建失败，请先进行第一步"点击创建"',
                imageUrl:wx.getStorageSync('userInfo').real_avatarUrl,
            }
            return
        }
        this.setData({
            showstep3:true
        })
        return{
            title:'赶紧前往"条件匿名/公开"对我提问吧（Ask me anything），我发起了“坦白局”活动',
            imageUrl:wx.getStorageSync('userInfo').real_avatarUrl,
            query: '/pages/askme/askme?tacitrecord_id='+tacitrecord_id,
        }
    }
})