// pages/shareTacit/shareTacit.js
var app = getApp();
var api = require("../../config/api");
var auth = require("../../utils/auth.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token:null,
        scene:null,
        flag:null,
        isCanDraw:false,
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
    handleClose() {
        this.setData({
          isCanDraw: !this.data.isCanDraw
        })
      },
    setFlag1:function(){
        this.setData({
            isCanDraw: !this.data.isCanDraw
        })
    },
    setFlag:function(){
        const promise = new Promise((resolve, reject)=>{
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
                url: api.getAccessTokenURL,
                data:{
                    tacitid:this.data.scene
                },
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
                wx.hideLoading({})
                wx.setStorageSync('code', res.data.base64_buffer);
                setTimeout(()=>{
                    this.setData({
                        isCanDraw: !this.data.isCanDraw
                    },500)
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
    getAccessToken1:function(e){
        wx.request({
            url: api.getAccessTokenURL,
            data:{
                tacitid:e
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'GET',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    wx.setStorageSync('code', res.data.base64_buffer);
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
    onClickSwitchToProfile:function(){
        app.globalData.classify_type = 1
        wx.switchTab({
            url: "/pages/profile/profile",
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
        var token = app.globalData.userInfo?app.globalData.userInfo.token:null;
        wx.removeStorageSync('code')
        if(token){
            this.setData({
                token:token,
                scene:options.scene,
                flag:options.flag,
            })
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
            this.setData({
                token:token,
            })
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

    },

    /**
     * 用户点击右上角分享
     */
    /*
    onShareAppMessage: function () {

    }*/
})