// pages/momentDetailViewer/momentDetailViewer.js
var app = getApp();
var api = require("../../config/api");
var auth = require("../../utils/auth.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ViewerList:null,
        moment_id:null,
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
    getmomentViewerList:function(){
        if(!this.data.moment_id){
            wx.navigateBack({})
        }
        /** 通过TOKEN获取个人信息*/
        wx.request({
            url: api.personalMomentViewerURL,
            method:'GET',
            data:{
                moment_id:this.data.moment_id
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    this.setData({
                        ViewerList: res.data
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(!auth.is_login()){
            return;
        }
        this.setData({
            moment_id:options.moment_id
        })
        this.getmomentViewerList()
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