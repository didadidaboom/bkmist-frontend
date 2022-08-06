// pages/createtopic/createtopic.js
var app = getApp();
var api = require("../../config/api");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title:null,
        description:null
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
    /**
     * 生命周期函数--监听页面加载
     */
    onClickTitle:function(e){
        this.setData({
            title:e.detail.value
        })
    },
    onClickDescription:function(e){
        this.setData({
            description:e.detail.value
        })
    },
    onClickCreate:function(){
        var that = this;
        if(!this.data.title){
            wx.showToast({
              title: '话题名不能为空哟！',
              icon:"none",
              duration:1000
            })
            return;
        }
        if(!this.data.description){
            wx.showToast({
                title: '描述不能为空哟！',
                icon:"none",
                duration:1000
              })
              return;
        }
        wx.request({
            url: api.topicURL,
            data: {
                title: this.data.title,
                description: this.data.description
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'POST',
            dataType:"json",
            success (res) {
                    if(res.statusCode==400){
                        wx.showToast({
                            title: '话题已经存在'+res.errMsg,
                          });
                          return;
                    };
                    wx.showToast({
                        title:"话题创建成功",
                        icon:"none",
                        duration:1000
                    });
                    var prepage = getCurrentPages();
                    var obj = prepage[prepage.length-2];
                    obj.onClickUpdataTopic(res.data);
                    wx.navigateBack({});
                    
                }
        });
    },

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