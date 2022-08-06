// pages/settings/settings.js
var app = getApp();
var api = require("../../config/api");
var auth = require("../../utils/auth.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {

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
    onClickLogout:function(){
        if(!auth.is_login()){
            return;
        }
        app.logOutUserInfo();
        var page = getCurrentPages();
        var prepage = page[page.length-2]
        prepage.setData({
            token:null,
            momentList:[],
            tacitList:[],
            tacitReplyList:[],
            min_id:null,
            max_id:null
        });
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    onClickDelAccount(){
        if(!auth.is_login()){
            return;
        }
        wx.request({
            url: api.deletePersonalURL,
            method:'DELETE',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==204){
                    wx.showToast({
                      title: '已注销，欢迎再回来',
                      icon:"none",
                      duration:1000
                    });
                    this.onClickLogout()
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
    /*
    onShareAppMessage: function () {

    }*/
})