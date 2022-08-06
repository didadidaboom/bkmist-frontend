// pages/inviteFillAskMe/inviteFillAskMe.js
var app = getApp();
var api = require('../../config/api');
var auth = require("../../utils/auth.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_id:null,
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
    handlerGohomeClick() {
        wx.switchTab({
          url: '/pages/index/index',
        })
    },
    onClickAskMeRecord(){
        wx.navigateTo({
          url: '/pages/askMeDetails/askMeDetails?tacitrecord_id='+this.data.tacitrecord_id
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            real_avatarUrl:wx.getStorageSync('userInfo').real_avatarUrl,
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
            title: '赶紧前往进行"条件匿名/公开"对我提问哟（Ask me anything），我发起了“坦白局”活动',
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
            title:'赶紧前往进行"条件匿名/公开"对我提问哟（Ask me anything），我发起了“坦白局”活动',
            imageUrl:wx.getStorageSync('userInfo').real_avatarUrl,
            query: '/pages/askme/askme?tacitrecord_id='+tacitrecord_id,
        }
    }
})