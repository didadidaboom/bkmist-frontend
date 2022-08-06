// pages/replyTacit/replyTacit.js
var app = getApp();
var api = require("../../config/api");
var auth = require("../../utils/auth.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tacitList:[],  /*关于发布者的--默契测试*/
        tacitRecord:null,
        tacitindex:0,
        is_not_preview:0,
        correct_answer:[],
        avatarUrlFlag:1,
        real_avatarUrl:null,
        avatarUrl:null,
        token:null,
        checked:true,
        if_status:0,
        match_count:null,
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
    getTacit:function(){
        if(!auth.is_login()){
            return;
        }
        wx.showLoading({
          title: '加载中',
        })
        var tacitRecord = this.data.tacitRecord;
        /**第一次加载更新数据 */
        wx.request({
            url: api.replyTacitURL+tacitRecord+"/",
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    setTimeout(()=>{
                        wx.hideLoading({})
                        this.setData({
                            tacitList: res.data,
                        })
                    },500)
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
    onClickNextPage:function(e){
        var answerindex = e.currentTarget.dataset.answerindex;
        var index = e.currentTarget.dataset.index;
        var tacitindex = index+1;
        var tmpanswer = this.data.correct_answer;
        tmpanswer.splice(index,0,answerindex)
        if(tacitindex==10){
            if(tmpanswer.length>10){
                tmpanswer.splice(index+1,1)
            }
            this.setData({
                correct_answer:tmpanswer,
                ["tacitList.tacitDataList["+index+"].selected_answer"]:answerindex

            });
            return;
        }
        this.setData({
            tacitindex: tacitindex,
            correct_answer:tmpanswer,
            ["tacitList.tacitDataList["+index+"].selected_answer"]:answerindex
        })
    },
    onClickPreviouPage(e){
        if(this.data.tacitindex==0){
            wx.showToast({
              title: '已经在第一页哟',
              icon:"none",
              duration:1000
            })
            return;
        }
        var index = this.data.tacitindex;
        var tmpanswer = this.data.correct_answer;
        tmpanswer.splice(index-1,1)
        this.setData({
            tacitindex:this.data.tacitindex-1,
            tmpanswer:tmpanswer
        })
    },
    onClickPreview:function(){
        this.setData({
            is_not_preview:1,
        })
    },
    onClickCancel:function(){
        this.setData({
            is_not_preview:0,
        })
    },
    onClickComplete:function(){
        if(!auth.is_login()){
            return;
        }
        this.setData({
            is_not_preview:2,
        })
    },
    onClickWXGetImage:function(e){
        var flag=e.currentTarget.dataset.flag
        this.setData({
            avatarUrlFlag:flag
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //var scene = options.scene
        const scene = decodeURIComponent(options.scene)
        this.setData({
            tacitRecord:scene,
        })
        if(!auth.is_login()){
            return;
        }
        var token = app.globalData.userInfo?app.globalData.userInfo.token:null;
        if(token){
            this.setData({
                token:token,
                avatarUrl:app.globalData.userInfo.avatarUrl,
                real_avatarUrl:app.globalData.userInfo.real_avatarUrl
            })
        }
    },
    /**complete part */
    onClickCompleteCancel:function(){
        this.setData({
            is_not_preview:1,
        })
    },
    onClickGetStatus:function(e){
        this.setData({
            if_status:e.detail.value
        })
    },
    onClickSubmit:function(){
        if(!auth.is_login()){
            return;
        }
        var tacitList = this.data.tacitList;
        var tacitListdata = [];
        var match_count = 0;
        for (let i=0;i<tacitList.tacitDataList.length;i++){
            var info={};
            info["selected_answer"] = tacitList.tacitDataList[i].selected_answer;
            tacitListdata.push(info);
            if(tacitList.tacitDataList[i].selected_answer==tacitList.tacitDataList[i].selected_answer_ref){
                match_count = match_count+1
            }
        }
        wx.request({
            url: api.replyTacitSaveURL,
            data:{
                tacitRecord: this.data.tacitList.id,
                avatarUrlFlag: this.data.avatarUrlFlag,
                bonus: this.data.tacitList.bonus,
                match_count:match_count,
                if_status: this.data.if_status,
                tacitList: tacitListdata,
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'POST',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==201){
                    app.globalData.classify_type = 2
                    wx.navigateTo({
                      url: '/pages/otherDetails/otherDetails?user_id='+tacitList.user,
                    })
                }else if(res.statusCode==226){
                    wx.showToast({
                      title: '你已经参与过了哟',
                      icon:"none",
                      duration:1000
                    })
                }else if(res.statusCode==204){
                    wx.showToast({
                      title: '不可以填自己的哟',
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
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getTacit()
        var token = app.globalData.userInfo?app.globalData.userInfo.token:null;
        if(token){
            this.setData({
                token:token,
                avatarUrl:app.globalData.userInfo.avatarUrl,
                real_avatarUrl:app.globalData.userInfo.real_avatarUrl
            })
        }
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