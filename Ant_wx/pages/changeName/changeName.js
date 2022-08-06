// pages/changeName/changeName.js
var app = getApp();
var api = require("../../config/api");
var auth = require("../../utils/auth.js");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        name:null
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
    onClickInputName:function(e){
        if(!auth.is_login()){
            return;
        }
        this.setData({
            name:e.detail.value
        })
    },
    onClickSubmit:function(){
        if(!auth.is_login()){
            return;
        }
        if(!this.data.name){
            wx.showToast({
              title: '名字不能为空哟',
              icon:"none",
              duration:1000
            })
            return;
        }
        wx.request({
            url: api.updateNamePersonalURL,
            data:{
                nickName:this.data.name
            },
            method:'PUT',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    var page = getCurrentPages();
                    var prepage = page[page.length-2];
                    prepage.setData({
                        nickName:this.data.name
                    });
                    app.updateNameUserInfo(this.data.name);
                    wx.navigateBack({});
                }else if(res.statusCode==226){
                    wx.showToast({
                      title: '名字已在用哟',
                      icon:"none",
                      duration:1000
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
    onClickCancel:function(){
        wx.navigateBack({})
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