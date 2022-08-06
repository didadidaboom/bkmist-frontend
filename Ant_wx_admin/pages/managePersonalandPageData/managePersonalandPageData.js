// pages/managePersonalandPageData/managePersonalandPageData.js
var app = getApp();
var api = require("../../config/api");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        personalData:null,
        pageData:null,
        user_id:null,
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
    getPernalData(){
        let user_id = this.data.user_id
        if(!user_id){
            wx.showToast({
              title: '用户名不存在',
            })
        }
        wx.request({
            url: api.getPersonalDataListURL,
            data:{
                user_id:user_id
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'GET',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    this.setData({
                        personalData:res.data
                    });
                }else{
                    wx.showToast({
                      title: '瞬间已被吃掉',
                      duration:1000
                    })
                }
                
            }
        })
    },
    getPageData(){
        let user_id = this.data.user_id
        if(!user_id){
            wx.showToast({
              title: '用户名不存在',
            })
        }
        wx.request({
            url: api.getPageDataListURL,
            data:{
                user_id:user_id
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'GET',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    this.setData({
                        pageData:res.data
                    });
                }else{
                    wx.showToast({
                      title: '瞬间已被吃掉',
                      duration:1000
                    })
                }
                
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var user_id = options.user_id
        this.setData({
            user_id:user_id
        })
        this.getPernalData()
        this.getPageData()
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

    }
})