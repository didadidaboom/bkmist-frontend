// pages/login/login.js
const { profileURL } = require("../../config/api");
var api = require("../../config/api");
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:null,
        local:null,
        isGetUserInfo:false,
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
    fetchPhone:function(e){
        this.setData({
            phone:e.detail.value
        })
    },
    onClickLogin2:function(){
        var that = this;
        wx.login({
            success (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: api.openIDURL,
                        data:{
                            code: res.code,
                            phone: that.data.phone
                        },
                        method:"POST",
                        dataType:"json",
                        success (res_in) {
                            if(res_in.statusCode==400){
                                wx.showToast({
                                  title: '登陆失败 2'+res_in.errMsg,
                                  icon:"none"
                                });
                                return;
                            }
                            that.setData({
                                local: res_in.data
                            });
                            app.initUserInfo(res_in.data);
                            wx.navigateBack({});
                        }
                    })
                } else {
                    wx.showToast({
                      title: '登陆失败 1'+res.errMsg,
                      icon:"none"
                    })
                }
            }
        })
    },
    onClickLogin:function(){
        var that = this;
        var login = new Promise((resolve,reject)=>{
            wx.login({
                success:res=>{
                    resolve(res)
                }
            })
        });
        var profile = new Promise((resolve,reject)=>{
            wx.getUserProfile({
              desc: '登陆',
              success:res=>{
                  resolve(res)
              }
            })
        });
        Promise.all([login,profile]).then((res)=>{
            wx.showLoading({
              title: '登陆中，请稍后',
            })
            var phone = that.data.phone
            if(phone){
                if(phone.length!=11){
                    wx.showToast({
                        title: '手机号长度不正确',
                        icon: 'none'
                    })
                    return
                };
                var reg = /1[3|4|5|6|7|8|9]\d{9}$/;
                if(!reg.test(phone)){
                    wx.showToast({
                        title: '手机号格式不正确',
                        icon:'none'
                    })
                    return
                };
            }
            wx.request({
                url: api.openIDURL,
                data:{
                    code: res[0].code,
                    phone: phone,
                    real_nickName:res[1].userInfo.nickName,
                    real_avatarUrl:res[1].userInfo.avatarUrl,
                },
                method:"POST",
                dataType:"json",
                success (res_in) {
                    if(res_in.statusCode==400){
                        wx.hideLoading({})
                        wx.showToast({
                          title: '登陆失败 2'+res_in.errMsg,
                          icon:"none"
                        });
                        return;
                    }
                    that.setData({
                        local: res_in.data
                    });
                    app.initUserInfo(res_in.data);
                    setTimeout(() => {
                        wx.hideLoading({})
                        wx.navigateBack({})
                    }, 500)
                }
            })
        }).catch(err=>{
            wx.showToast({
                title: '登陆失败',
                icon:"none",
                duration:1000
            });
            wx.navigateBack({});
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