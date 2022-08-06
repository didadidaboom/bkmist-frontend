// pages/playaround/playaround.js
var app = getApp();
var api = require("../../config/api");
var auth = require("../../utils/auth.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token:null
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
    onClickPublishTacit:function(){
        if(this.data.token){
            wx.navigateTo({
                url: '/pages/tacitTest/tacitTest',
            })
        }else{
            if(!auth.is_login()){
                return;
            }
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var token = app.globalData.userInfo?app.globalData.userInfo.token:null;
        if(token){
            this.setData({
                token:token
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
                token:token
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
    onShareAppMessage: function () {

    }
})