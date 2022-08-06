// pages/askMeDetails/askMeDetails.js
var app = getApp();
var api = require("../../config/api.js");
var auth = require("../../utils/auth.js");
Page({
    /**
     * 页面的初始数据
     */
    data: {
      tacitrecord_id:null,
      real_avatarUrl:null,
      real_nickName:null,
      user_id:null,
      is_focused:false,
      is_author:false,
      comment:null,
      ask_content:null,
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
    onClickFocusUser:function(e){
      if(!auth.is_login()){
        return;
      }
      var user_id = e.currentTarget.dataset.user_id
      wx.request({
          url: api.focusUserURL,
          data:{
              user: user_id
          },
          header: {
              "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
          },
          method:'POST',
          dataType:"json",
          success: (res)=>{
              if(res.statusCode==200){
                  wx.showToast({
                    title: '已取消关注',
                    icon:"none",
                    duration:1000
                  })
                  this.setData({
                      is_focused:false
                  })
              }else if(res.statusCode==201){
                  wx.showToast({
                    title: ' 关注成功哟',
                    icon:"none",
                    duration:1000
                  })
                  this.setData({
                      is_focused:true
                  })
              }
              else if(res.statusCode==204){
                  wx.showToast({
                      title: '不可以关注自己哟',
                      icon:"none"
                  });
              }else{
                  wx.showToast({
                    title: '网络异常，请稍后',
                  })
              }
          }
      })
    },
    onClickFocusReplyUser:function(e){
      if(!auth.is_login()){
        return;
      }
      var user_id = e.currentTarget.dataset.user_id
      var index = e.currentTarget.dataset.index
      wx.request({
          url: api.focusUserURL,
          data:{
              user: user_id
          },
          header: {
              "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
          },
          method:'POST',
          dataType:"json",
          success: (res)=>{
              if(res.statusCode==200){
                  wx.showToast({
                    title: '已取消关注',
                    icon:"none",
                    duration:1000
                  })
                  this.setData({
                      ['comment['+index+'].status.is_focused']:false
                  })
              }else if(res.statusCode==201){
                  wx.showToast({
                    title: ' 关注成功哟',
                    icon:"none",
                    duration:1000
                  })
                  this.setData({
                    ['comment['+index+'].status.is_focused']:true
                  })
              }
              else if(res.statusCode==204){
                  wx.showToast({
                      title: '不可以关注自己哟',
                      icon:"none"
                  });
              }else{
                  wx.showToast({
                    title: '网络异常，请稍后',
                  })
              }
          }
      })
    },
    onClickLikeComment:function(e){
      if(!auth.is_login()){
          return;
      }
      var comment_id = e.currentTarget.dataset.cid;
      var favor_count = e.currentTarget.dataset.cfavor;
      var index = e.currentTarget.dataset.cidx;
      wx.request({
          url: api.askAnythingFavorURL,
          data:{
            askAnythingRecord: comment_id
          },
          header: {
              "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
          },
          method:'POST',
          dataType:"json",
          success: (res)=>{
              if(res.statusCode==200){
                  this.setData({
                      ["comment["+index+"].is_favor"]: false,
                      ["comment["+index+"].favor_count"]:favor_count-1
                  });
              }else if(res.statusCode==201){
                  this.setData({
                      ["comment["+index+"].is_favor"]: true,
                      ["comment["+index+"].favor_count"]:favor_count+1
                  });
                  wx.showToast({
                      title: '有品位哟~',
                      icon:"none"
                  });
              }else if(res.statusCode==204){
                  wx.showToast({
                      title: '不可以给自己点赞哟',
                      icon:"none"
                  });
              }else{
                  wx.showToast({
                      title: '网络异常，请稍后~',
                      icon:"none"
                  });
              }
          }
      })
    },
    onClickTurnOneRely(e){
      let index = e.currentTarget.dataset.index
      this.setData({
        ['comment['+index+'].show_reply']:false
      })
    },
    onClickAskCancel(e){
      let index = e.currentTarget.dataset.index
      this.setData({
        ['comment['+index+'].show_reply']:true
      })
    },
    onClickCommentContent(e){
      let ask_content = e.detail.value
      this.setData({
          ask_content:ask_content
      })
    },
    onClickAskSubmit(e){
      const promise = new Promise((resolve, reject)=>{
          if(!auth.is_login()){
              return;
          }
          if(!this.data.ask_content){
              wx.showToast({
                title: '提问不可以为空',
                icon:"none",
                duration:1000
              });
              return;
          };
          wx.showLoading({
            title: '提交中',
          })
          let cidx = e.currentTarget.dataset.cidx
          wx.request({
              url: api.submitAskAnythingURL,
              data:{
                  tacitrecord:this.data.tacitrecord_id,
                  content: this.data.ask_content,
                  reply: cidx,
                  depth: 2,
                  root: cidx,
                  comment_status:0,
              },
              header: {
                  "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
              },
              method:'POST',
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
          if(res.statusCode==201){
              wx.hideLoading({})
              wx.showToast({
                title: '回复成功',
              })
              let cindex = e.currentTarget.dataset.cindex
              let content = []
              content = this.data.comment[cindex].reply_comment
              let tmp={}
              tmp["id"]=1
              tmp["content"]=res.data.content
              tmp["create_date"]=res.data.create_date
              content.push(tmp)
              this.setData({
                  show_results:true,
                  ['comment['+cindex+'].reply_comment']:content,
                  ask_content:null,
                  ['comment['+cindex+'].show_reply']:true
              })
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
    onClickGetAskMeDetails(){
      const promise = new Promise((resolve, reject)=>{
          wx.showLoading({
            title: '加载中',
          })
          let tacitrecord_id = this.data.tacitrecord_id;
          if(!tacitrecord_id){
            return
          }
          wx.request({
              url: api.askMeAnythingDetailURL+tacitrecord_id+"/",
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
          if(res.statusCode==200){
              wx.hideLoading({})
              this.setData({
                real_avatarUrl:res.data.real_avatarUrl,
                real_nickName:res.data.real_nickName,
                user_id:res.data.user_id,
                create_date:res.data.create_date,
                is_focused:res.data.is_focused,
                is_author:res.data.is_author
              })
              
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
    onClickGetAskMeComment(){
      const promise = new Promise((resolve, reject)=>{
          let tacitrecord_id = this.data.tacitrecord_id;
          if(!tacitrecord_id){
            return
          }
          wx.request({
              url: api.askMeAnythingCommentURL,
              data:{
                tacitrecord:tacitrecord_id,
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
          if(res.statusCode==200){
              this.setData({
                comment:res.data
              })
          }else{
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
    onClickInitiateAskMe(){
      if(!auth.is_login()){
          return;
      }
      wx.navigateTo({
          url: '/pages/createAskMe/createAskMe',
      })
    },
    onClickExploreCommunity(){
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
      this.setData({
        tacitrecord_id:options.tacitrecord_id,
      })
      this.onClickGetAskMeDetails()
      this.onClickGetAskMeComment()
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