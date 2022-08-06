// pages/tacitTest/tacitTest.js
var app = getApp();
var api = require("../../config/api");
var auth = require("../../utils/auth.js");
const { transferToTaskMethod } = require("../../utils/cos-wx-sdk-v5");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        real_avatarUrl:null,
        avatarUrl:null,
        token:null,
        tacitList:null,
        tacitindex:0,
        usedId:null,
        min_id:null,
        currentId:null,
        correct_answerid:[],
        correct_answer:[],
        is_not_preview:0,
        editFlag:false,
        editChanged:false,
        checked:true,
        avatarUrlFlag:1,
        bonus:0,
        correct_count:10,
        scene:null,
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
    getTacitRandomOne:function(e){
        if(!auth.is_login()){
            return;
        }
        var index = e.currentTarget.dataset.index;
        if(!this.data.min_id){
            return
        }
        wx.request({
            url: api.tacitRandomOneURL,
            data:{
                usedId:this.data.usedId,
                min_id:this.data.min_id
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'GET',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    var tacitList = this.data.tacitList;
                    tacitList.splice(index,1);
                    tacitList.splice(index,0,res.data);
                    //var usedId = this.data.usedId;
                    //usedId.push(res.data.id)
                    this.setData({
                        tacitList: tacitList,
                        //usedId:usedId
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
    onClickEditTacit:function(){
        if(!auth.is_login()){
            return;
        }
        this.setData({
            editFlag:true
        })
    },
    onClickEditTacitCancel:function(){
        this.setData({
            editFlag:false
        })
    },
    onClickEditTacitValue:function(e){
        var tacitList = this.data.tacitList
        var type = e.currentTarget.dataset.type;
        var index = e.currentTarget.dataset.index;
        var value = e.detail.value;
        if(type==0 & value !=tacitList[index].title){
            this.setData({
                editChanged:true,
                ["tacitList["+index+"].title"]:value
            })
        }else if(type==1 & value !=tacitList[index].answer1){
            this.setData({
                editChanged:true,
                ["tacitList["+index+"].answer1"]:value
            })
        }else if(type==2 & value !=tacitList[index].answer2){
            this.setData({
                editChanged:true,
                ["tacitList["+index+"].answer2"]:value
            })
        }else if(type==3 & value !=tacitList[index].answer3){
            this.setData({
                editChanged:true,
                ["tacitList["+index+"].answer3"]:value
            })
        }else if(type==4 & value !=tacitList[index].answer4){
            this.setData({
                editChanged:true,
                ["tacitList["+index+"].answer4"]:value
            })
        }else if(type==5 & value !=tacitList[index].answer5){
            this.setData({
                editChanged:true,
                ["tacitList["+index+"].answer5"]:value
            })
        }
    },
    onClickEditTacitSave:function(e){
        if(!auth.is_login()){
            return;
        }
        var index = e.currentTarget.dataset.index;
        var data = this.data.tacitList[index]
        wx.request({
            url: api.tacitURL,
            data:data,
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'POST',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==201){
                    var tacitList = this.data.tacitList;
                    tacitList.splice(index,1);
                    tacitList.splice(index,0,res.data);
                    var usedId = this.data.usedId;
                    usedId.push(res.data.id)
                    this.setData({
                        tacitList: tacitList,
                        usedId:usedId,
                        editFlag:false
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
    getTacit:function(){
        if(!auth.is_login()){
            return;
        }
        const promise = new Promise((resolve, reject)=>{
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
                url: api.tacitURL,
                data:{
                    limit:10
                },
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                method:'GET',
                dataType:"json",
                success: (res)=>{
                    resolve(res)
                },
                fail:(err)=>{
                    reject(err)
                }
            })
        });
        promise.then((res)=>{
            var usedId = []
            for(let i=0; i<res.data.length; i++){
                usedId.push(res.data[i].id)
            }
            var min_id = res.data[res.data.length-1].id;
            if(res.statusCode==200){
                setTimeout(()=>{
                    this.setData({
                        tacitList: res.data,
                        usedId:usedId,
                        min_id:min_id
                    })
                    wx.hideLoading({})
                },1000)
            }else{
                wx.hideLoading({})
                wx.showToast({
                  title: '网络异常，请稍后',
                  duration: 1000,
                  icon: "none",
                });
            }
        },(err)=>{
            wx.hideLoading({})
            console.log(err)
        })
    },
    onClickNextPage:function(e){
        if(!auth.is_login()){
            return;
        }
        var answerindex = e.currentTarget.dataset.answerindex;
        var index = e.currentTarget.dataset.index;
        var tacitindex = index+1;
        var tacitid = e.currentTarget.dataset.tacitid;
        var tmpanswer = this.data.correct_answer;
        var tmpanswerid = this.data.correct_answerid;
        // console.log("------index",index)
        // console.log("tmpanswer",tmpanswer)
        // console.log("id",tmpanswerid)
        tmpanswerid.splice(index,0,tacitid)
        tmpanswer.splice(index,0,answerindex)
        if(tacitindex==10){
            if(tmpanswerid.length>10){
                tmpanswerid.splice(index+1,1)
                tmpanswer.splice(index+1,1)
            }
            this.setData({
                correct_answerid:tmpanswerid,
                correct_answer:tmpanswer,
                ["tacitList["+index+"].selected_answer"]:answerindex

            });
            return;
        }
        this.setData({
            tacitindex: tacitindex,
            correct_answerid:tmpanswerid,
            correct_answer:tmpanswer,
            ["tacitList["+index+"].selected_answer"]:answerindex
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
        var tmpanswerid = this.data.correct_answerid;
        tmpanswerid.splice(index-1,1)
        tmpanswer.splice(index-1,1)
        this.setData({
            tacitindex:this.data.tacitindex-1,
            tmpanswerid:tmpanswerid,
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
        this.setData({
            is_not_preview:2,
        })
    },
    /**complete part */
    onClickCompleteCancel:function(){
        this.setData({
            is_not_preview:1,
        })
    },
    onClickWXGetImage:function(e){
        var flag=e.currentTarget.dataset.flag
        this.setData({
            avatarUrlFlag:flag,
        })
    },
    onClickGetBonus:function(e){
        this.setData({
            bonus:e.detail.value
        })
    },
    onClickGetCorrectCount:function(e){
        this.setData({
            correct_count:e.detail.value
        })
    },
    onClickFinish:function(){
        if(!auth.is_login()){
            return;
        }
        wx.showLoading({
          title: '保存中，请稍后',
        })
        if(this.data.scene){
            setTimeout(()=>{
                wx.hideLoading({})
                wx.navigateTo({
                    url: '/pages/shareTacit/shareTacit?scene='+this.data.scene+'&flag='+this.data.avatarUrlFlag,
                })
            },1000)
            return;
        }
        var tacitList = this.data.tacitList;
        var tacitListdata = [];
        for (let i=0;i<tacitList.length;i++){
            var info={};
            info["tacitTestDatabase"] = tacitList[i].id;
            info["selected_answer"] = tacitList[i].selected_answer;
            tacitListdata.push(info)
        }
        wx.request({
            url: api.tacitSaveURL,
            data:{
                // avatarUrlFlag: this.data.avatarUrlFlag,
                avatarUrlFlag: 1,
                bonus: this.data.bonus,
                correct_count: this.data.correct_count,
                tacitList:tacitListdata,
                tacit_status:1
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'POST',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==201){
                    let scene = res.data.id
                    this.setData({
                        scene:res.data.id
                    })
                    setTimeout(()=>{
                        wx.hideLoading({})
                        wx.navigateTo({
                            url: '/pages/shareTacit/shareTacit?scene='+scene+'&flag='+this.data.avatarUrlFlag,
                        })
                    },1000)
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
        var token = app.globalData.userInfo?app.globalData.userInfo.token:null;
        if(token){
            this.setData({
                token:token,
                avatarUrl:app.globalData.userInfo.avatarUrl,
                real_avatarUrl:app.globalData.userInfo.real_avatarUrl
            })
            app.globalData.classify_type =0
        }else{
            if(!auth.is_login()){
                return;
            }
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (e) {
        
        var token = app.globalData.userInfo?app.globalData.userInfo.token:null;
        if(token){
            this.setData({
                token:token,
                avatarUrl:app.globalData.userInfo.avatarUrl,
                real_avatarUrl:app.globalData.userInfo.real_avatarUrl
            })
            app.globalData.classify_type =0
            this.getTacit();
            // wx.showLoading({
            //     title: '加载中',
            //   })
            //   setTimeout(()=>{
            //       this.getTacit();
            //       wx.hideLoading({})
            // },1000)
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