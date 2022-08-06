const api = require("../../config/api");

// pages/autho/autho.js
var app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:"18801072898",
        code:"",
        token:null,
        local:null,
        isGetUserInfo:false
    },
    onClickInputPhone:function(e){
        this.setData({
            phone:e.detail.value
        })
    },
    onClickInputCode:function(e){
        this.setData({
            code:e.detail.value
        })
    },
    onClickGetCode:function(){
        if(this.data.phone.length!=11){
            wx.showToast({
                title: '手机号长度不正确',
                icon: 'none'
            })
            return
        };
        var reg = /1[3|4|5|6|7|8|9]\d{9}$/;
        if(!reg.test(this.data.phone)){
            wx.showToast({
                title: '手机号格式不正确',
                icon:'none'
            })
            return
        };
        wx.request({
            url: api.messagecodeURL,
            data: {
                phone:this.data.phone
            },
            method:"GET",
            dataType:"json",
            success (res) {
                console.log(res.data)
            }
        })
    },
    onClickGetProfile:function(){
        wx.getUserProfile({
            desc: '授权登陆',
            success:(res)=>{
                //保存返回数据到全局和缓存
                this.setData({
                    local:res,
                    isGetUserInfo:true
                });
            }
        });
    },
    onClickLogin:function(){
        if(!this.data.isGetUserInfo){
            wx.showToast({
              title: '请先授权',
              icon:"none"
            });
            return
        };
        if(!this.data.local){
            wx.showToast({
              title: '请稍等片刻再提交哟~',
            })
            return;
        }
        var local = this.data.local;
        wx.request({
            url: api.loginURL,
            data: {
                phone:this.data.phone,
                code:this.data.code,
                nickName:this.data.local.userInfo.nickName,
                avatarUrl:this.data.local.userInfo.avatarUrl
            },
            method:'POST',
            dataType:"json",
            success (res) {
                if(res.data.status){
                    app.initUserInfo(res.data.data, local.userInfo)
                    //登陆成功后，跳转到上一级页面
                    wx.navigateBack({})
                }
                else{
                    wx.showToast({
                      title: '登陆失败',
                      icon:"none"
                    })
                }
            }
        })
    },
    exampleonClickLogin:function(){
        wx.getUserProfile({
            desc: '用于完善用户资料',
            success:function(local){
                //保存返回数据到全局和缓存
                app.initUserInfo(res.data.data, local.userInfo)
            }
        }),
        wx.request({
            url: api.loginURL,
            data: {
                phone:this.data.phone,
                code:this.data.code
            },
            method:'POST',
            dataType:"json",
            success (res) {
                if(res.data.status){
                    wx.getUserProfile({
                        desc: '用于完善用户资料',
                        success:function(local){
                            //保存返回数据到全局和缓存
                            app.initUserInfo(res.data.data, local.userInfo)
                        }
                    }),
                    //登陆成功后，跳转到上一级页面
                    wx.navigateBack({})
                }
                else{
                    wx.showToast({
                      title: '登陆失败',
                      icon:"none"
                    })
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
        //wx.removeStorageSync('userInfo');
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