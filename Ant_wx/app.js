var api = require("./config/api");
App({

    /**
    * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
    */
    onLaunch: function () {
        this.globalData.userInfo = wx.getStorageSync("userInfo");
        //wx.removeStorageSync('userInfo')
    },
    globalData:{
        userInfo:null
    },
    initUserInfo:function(local){
        var info = {
            token: local.token,
            nickName: local.nickName,
            avatarUrl: local.avatarUrl,
            real_avatarUrl: local.real_avatarUrl,
            real_nickName: local.real_nickName,
        }
        this.globalData.userInfo = info;
        wx.setStorageSync('userInfo', info);
    },
    updateNameUserInfo:function(e){
        this.globalData.userInfo.nickName = e;
        wx.setStorageSync('userInfo', this.globalData.userInfo);
    },
    updateAvatarUserInfo:function(e){
        this.globalData.userInfo.avatarUrl = e;
        wx.setStorageSync('userInfo', this.globalData.userInfo);
    },
    logOutUserInfo(){
        wx.removeStorageSync('userInfo');
        this.globalData.userInfo = null;
    },
})

