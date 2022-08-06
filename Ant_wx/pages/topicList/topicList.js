// pages/topicList/topicList.js
var app = getApp();
var api = require("../../config/api")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        topics:null,
        topicinput:null,
        createtopic:null,
        createuserid:null,
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
    onClickInputTopic:function(e){
        this.setData({
            topicinput:e.detail.value,
        })
    },
    onClickSearchTopic:function(){
        /**
         * 1. 输入话题（验证话题）
         * 2. 搜索话题
         * 3. 返回结果 是否存在话题
         * 4. 存在 赋值并显示； 不存在 提醒话题不存在 同时赋值去创建话题 
         */
        var that = this;
        if(!this.data.topicinput){
            wx.showToast({
              title: '请输入要搜索话题',
              duration: 0,
              icon:"none",
              duration:1000
            });
            return;
        };
        wx.request({
            url: api.topicURL,
            data: {
                title: this.data.topicinput
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'GET',
            dataType:"json",
            success (res) {
                console.log(res)
                if(res.statusCode==204){
                    wx.showToast({
                      title: '话题不存在哟,请前往创建',
                      icon:"none",
                      duration:1000
                    })
                }else if(res.statusCode==200){
                    that.setData({
                        topics:res.data,
                    });
                }else{
                    wx.showToast({
                      title: '网络错误，请稍后',
                      icon:"none",
                      duration:1000
                    })
                }
                
                
            }
        })
    },
    getAllTopics:function(){
        var that = this;
        wx.request({
            url: api.topicURL,
            method:'GET',
            dataType:"json",
            success (res) {
                    that.setData({
                        topics:res.data
                    })
                }
        });
    },
    onClickChooseTopic:function(e){
        var pages = getCurrentPages();
        var prevpage = pages[pages.length-2];
        var temp_pub_topicList = prevpage.data.pub_topicList;
        var temp_pub_topicIDList = prevpage.data.pub_topicIDList;
        if(prevpage.data.pub_topicIDList.length>2){
            wx.showToast({
              title: '最多三个话题哟',
              icon:"none",
              duration:1000
            })
            return;
        }
        temp_pub_topicList.push(e.currentTarget.dataset.topicitem);
        temp_pub_topicIDList.push(e.currentTarget.dataset.topicitem.id);
        prevpage.setData({
            pub_topicList:temp_pub_topicList,
            pub_topicIDList:temp_pub_topicIDList
        });
        wx.navigateBack({});
    },
    onClickUpdataTopic:function(e){
        var data = this.data.topics;
        data.splice(0,0,e)
        this.setData({
            topics: data
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAllTopics();
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