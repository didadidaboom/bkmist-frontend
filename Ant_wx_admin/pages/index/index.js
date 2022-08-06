// pages/index/index.js
var app = getApp();
var api = require('../../config/api');
var auth = require("../../utils/auth.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token:null,
        momentList:[],
        momentList_flag:0,
        momentList_focus:[],
        momentList_focus_flag:0,
        focusTopic:[],
        focusAddress:[],
        max_id:null,
        min_id:null,
        max_id_focus:null,
        min_id_focus:null,
        classify_type:1,
        triggered: false,
        hidden:true,
        loadingData: false,
        scrollviewhigh:null,
        notification_flag:false,
        systemnotification_flag:false,
    },
    getSystemInfo:function(){
        var app = getApp();
        if (app.globalSystemInfo && !app.globalSystemInfo.ios) {
          return app.globalSystemInfo;
        } else {
          let systemInfo = wx.getSystemInfoSync();
          let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
          let windowHeight = systemInfo.windowHeight
          let rect;
          try {
            rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
            if (rect === null) {
              throw 'getMenuButtonBoundingClientRect error';
            }
            //取值为0的情况  有可能width不为0 top为0的情况
            if (!rect.width || !rect.top || !rect.left || !rect.height) {
              throw 'getMenuButtonBoundingClientRect error';
            }
          } catch (error) {
            let gap = ''; //胶囊按钮上下间距 使导航内容居中
            let width = 96; //胶囊的宽度
            if (systemInfo.platform === 'android') {
              gap = 8;
              width = 96;
            } else if (systemInfo.platform === 'devtools') {
              if (ios) {
                gap = 5.5; //开发工具中ios手机
              } else {
                gap = 7.5; //开发工具中android和其他手机
              }
            } else {
              gap = 4;
              width = 88;
            }
            if (!systemInfo.statusBarHeight) {
              //开启wifi的情况下修复statusBarHeight值获取不到
              systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
            }
            rect = {
              //获取不到胶囊信息就自定义重置一个
              bottom: systemInfo.statusBarHeight + gap + 32,
              height: 32,
              left: systemInfo.windowWidth - width - 10,
              right: systemInfo.windowWidth - 10,
              top: systemInfo.statusBarHeight + gap,
              width: width
            };
            console.log('error', error);
            console.log('rect', rect);
          }
  
          let navBarHeight = '';
          if (!systemInfo.statusBarHeight) {
            systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
            navBarHeight = (function() {
              let gap = rect.top - systemInfo.statusBarHeight;
              return 2 * gap + rect.height;
            })();
  
            systemInfo.statusBarHeight = 0;
            systemInfo.navBarExtendHeight = 0; //下方扩展4像素高度 防止下方边距太小
          } else {
            navBarHeight = (function() {
              let gap = rect.top - systemInfo.statusBarHeight;
              return systemInfo.statusBarHeight + 2 * gap + rect.height;
            })();
            if (ios) {
              systemInfo.navBarExtendHeight = 4; //下方扩展4像素高度 防止下方边距太小
            } else {
              systemInfo.navBarExtendHeight = 0;
            }
          }
          systemInfo.navBarHeight = navBarHeight; //导航栏高度不包括statusBarHeight
          systemInfo.capsulePosition = rect; //右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小
          systemInfo.ios = ios; //是否ios
  
          app.globalSystemInfo = systemInfo; //将信息保存到全局变量中,后边再用就不用重新异步获取了
  
          //console.log('systemInfo', systemInfo);
          return systemInfo;
        }
    },
    scrollToLower: function(e){
        var hidden = this.data.hidden,
            loadingData = this.data.loadingData;
        if(hidden){
          this.setData({
            hidden:false
          })
        }
        if(loadingData){
          return
        }
        this.setData({
          loadingData:true
        })
        setTimeout(()=>{
            if(this.data.classify_type==0){
                if(this.data.momentList_focus_flag!=0){
                    this.getFocusMoment(1);
                }
            }
            if(this.data.classify_type==1){
                if(this.data.momentList_flag!=0){
                    this.getMoment(1);
                }
            }else if(this.data.classify_type==2){
            }  
          this.setData({
            hidden:true,
            loadingData:false
          });
        },2000)
    },
    onScrollRefresh: function () {
        setTimeout(() => {
            if(this.data.classify_type==0){
                this.getFocusMomentTopic()
                this.getFocusMomentAddress()
                this.getFocusMoment(2);
            }else if(this.data.classify_type==1){
                // if(this.data.momentList.length>30){
                //     this.data.momentList.splice(this.data.momentList.length-10,10);
                //     this.setData({
                //         momentList:this.data.momentList
                //     })
                // };
                this.getMoment(2);
            }else if(this.data.classify_type==2){
            }
            this.setData({
                triggered: false,
            })
        },2000);
    },
    onClickClassify:function(e){
        var classify_type = e.currentTarget.dataset.value
        this.setData({
            classify_type:classify_type
        })
        if(classify_type==0){
            this.getFocusMomentTopic()
            this.getFocusMomentAddress()
            this.getFocusMoment(false)
        }else if(classify_type==1){
            this.getMoment(false)
            this.getNotification_flag()
        }else if(classify_type==2){
        }
    },
    getMoment:function(roll){
        /**下拉更新数据 */
        if(roll==2){
            if(!this.data.max_id){
                return
            }
            wx.request({
                url: api.momentURL,
                data:{
                    max_id:this.data.max_id
                },
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                method:'GET',
                success: (res)=>{
                    if(res.statusCode==200){
                        if(!res.data.length){
                        wx.showToast({
                            title: '已到达上限',
                            duration: 1000,
                            icon: "none",
                        });
                        return;
                        }
                        var dataList = res.data.reverse();
                        this.setData({
                            max_id: dataList[0].id,
                            momentList: dataList.concat(this.data.momentList)
                        });
                    }else{
                        wx.showToast({
                          title: '网络错误，请刷新哟',
                          icon:"none",
                          duration:1000
                        })
                    }
                }
            });
            return;
        }
        /**触底更新获取数据 */
        if(roll==1){
            if(!this.data.min_id){
                return
            }
            wx.request({
                url: api.momentURL,
                data:{
                    min_id:this.data.min_id
                },
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                method:'GET',
                dataType:"json",
                success: (res)=>{
                    if(!res.data.length){
                        wx:wx.showToast({
                          title: '已到达底线',
                          duration: 1000,
                          icon: "none",
                        });
                        return;
                    }
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        min_id: min_id,
                        momentList: this.data.momentList.concat(res.data)
                    })
                }
            })
            return;
        }
        /**第一次加载更新数据 */
        wx.request({
            url: api.momentURL,
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(!res.data.length){
                    this.setData({
                        momentList_flag:1
                    })
                    return;
                }
                var max_id = res.data[0].id;
                var min_id = res.data[res.data.length-1].id;
                this.setData({
                    max_id: max_id,
                    min_id: min_id,
                    momentList: res.data,
                    momentList_flag:2
                    //momentList: this.data.momentList.concat(res.data)
                })
            }
        })
    },
    getFocusMoment:function(roll){
        if(!auth.is_login()){
            this.setData({
                min_id_focus:null,
                max_id_focus:null,
                momentList_focus:[],
                classify_type:1
            })
            return;
        }
        /**下拉更新数据 */
        if(roll==2){
            if(!this.data.max_id_focus){
                return
            }
            wx.request({
                url: api.FocusMomentURL,
                data:{
                    max_id:this.data.max_id_focus
                },
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                method:'GET',
                success: (res)=>{
                    if(res.statusCode==200){
                        if(!res.data.length){
                        wx.showToast({
                            title: '已到达上限',
                            duration: 1000,
                            icon: "none",
                        });
                        return;
                        }
                        var dataList = res.data.reverse();
                        this.setData({
                            max_id_focus: dataList[0].id,
                            momentList_focus: dataList.concat(this.data.momentList_focus)
                        });
                    }else{
                        wx.showToast({
                          title: '网络错误，请刷新哟',
                          icon:"none",
                          duration:1000
                        })
                    }
                }
            });
            return;
        }
        /**触底更新获取数据 */
        if(roll==1){
            if(!this.data.min_id_focus){
                return
            }
            wx.request({
                url: api.FocusMomentURL,
                data:{
                    min_id:this.data.min_id_focus
                },
                header: {
                    "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
                },
                method:'GET',
                dataType:"json",
                success: (res)=>{
                    if(!res.data.length){
                        wx:wx.showToast({
                          title: '已到达底线',
                          duration: 1000,
                          icon: "none",
                        });
                        return;
                    }
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        min_id_focus: min_id,
                        momentList_focus: this.data.momentList_focus.concat(res.data)
                    })
                }
            })
            return;
        }
        /**第一次加载更新数据 */
        wx.request({
            url: api.FocusMomentURL,
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    if(!res.data.length){
                        this.setData({
                            momentList_focus_flag:1
                        })
                        return;
                    }
                    var max_id = res.data[0].id;
                    var min_id = res.data[res.data.length-1].id;
                    this.setData({
                        max_id_focus: max_id,
                        min_id_focus: min_id,
                        momentList_focus: res.data,
                        momentList_focus_flag:2
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
    onClickLikeMoment:function(e){
        if(!auth.is_login()){
            return;
        }
        var moment_id = e.currentTarget.dataset.mid;
        var favor_count = e.currentTarget.dataset.mfavor;
        var index = e.currentTarget.dataset.index;
        wx.request({
            url: api.momentFavorURL,
            data:{
                moment: moment_id,
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'POST',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    wx.showToast({
                        title: '取消赞哟',
                        icon:"none"
                    });
                    this.setData({
                        ["momentList["+index+"].is_favor"]: false,
                        ["momentList["+index+"].favor_count"]:favor_count-1
                    });
                }else if(res.statusCode==201){
                    this.setData({
                        ["momentList["+index+"].is_favor"]: true,
                        ["momentList["+index+"].favor_count"]:favor_count+1
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
                        title: '瞬间已经吃掉',
                        icon:"none"
                    });
                }
            }
        })
    },
    onClickLikeMoment_focus:function(e){
        if(!auth.is_login()){
            return;
        }
        var moment_id = e.currentTarget.dataset.mid;
        var favor_count = e.currentTarget.dataset.mfavor;
        var index = e.currentTarget.dataset.index;
        wx.request({
            url: api.momentFavorURL,
            data:{
                moment: moment_id,
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'POST',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    wx.showToast({
                        title: '取消赞哟',
                        icon:"none"
                    });
                    this.setData({
                        ["momentList_focus["+index+"].is_favor"]: false,
                        ["momentList_focus["+index+"].favor_count"]:favor_count-1
                    });
                }else if(res.statusCode==201){
                    this.setData({
                        ["momentList_focus["+index+"].is_favor"]: true,
                        ["momentList_focus["+index+"].favor_count"]:favor_count+1
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
                        title: '瞬间已经吃掉',
                        icon:"none"
                    });
                }
            }
        })
    },
    getFocusMomentTopic:function(){
        if(!auth.is_login()){
            this.setData({
                focusTopic:[],
                focusAddress:[],
                min_id_focus:null,
                max_id_focus:null,
                momentList_focus:[]
            })
            return;
        }
        //通过ID获取个人信息
        wx.request({
            url: api.focusMomentTopicURL,
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'GET',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    this.setData({
                        focusTopic: res.data
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
    getFocusMomentAddress:function(){
        if(!auth.is_login()){
            this.setData({
                focusAddress:[]
            })
            return;
        }
        //通过ID获取个人信息
        wx.request({
            url: api.focusMomentAddressURL,
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'GET',
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    this.setData({
                        focusAddress: res.data
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
    onClickGetFriends:function(){
        if(!auth.is_login()){
            return;
        }
    },
    getNotification_flag:function(){
        if(!auth.is_login()){
            return;
        }
        /**第一次加载更新数据 */
        wx.request({
            url: api.notification_flagURL,
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    let userHasChecked = true;
                    if(res.data.length==0){
                        userHasChecked = false;
                    }else{
                        userHasChecked = res.data[0].userHasChecked
                    }
                    this.setData({
                        notification_flag: userHasChecked,
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
    getPreSystemNotification_flag:function(){
        /**第一次加载更新数据 */
        wx.request({
            url: api.presystemnotification_flagURL,
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    let userHasChecked = true;
                    if(res.data.length==0){
                        userHasChecked = false;
                    }else{
                        userHasChecked = true;
                    }
                    this.setData({
                        presystemnotification_flag: userHasChecked,
                        systemnotification_flag:false,
                        notification_flag:false,
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
    getSystemNotification_flag:function(){
        if(!auth.is_login()){
            return;
        }
        /**第一次加载更新数据 */
        wx.request({
            url: api.systemnotification_flagURL,
            method:'GET',
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            dataType:"json",
            success: (res)=>{
                if(res.statusCode==200){
                    let userHasChecked = true;
                    if(res.data.length==0){
                        userHasChecked = false;
                    }else{
                        userHasChecked = res.data[0].userHasChecked
                    }
                    this.setData({
                        presystemnotification_flag: false,
                        systemnotification_flag: userHasChecked,
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getMoment(false);
        var token = app.globalData.userInfo?app.globalData.userInfo.token:null;
        if(token){
            this.setData({
                token:token
            })
        }
        const {
            statusBarHeight,
            navBarHeight,
            navBarExtendHeight,
            ios,
            windowWidth,
            windowHeight
        } = getApp().globalSystemInfo;
        let scrollviewhigh =windowHeight-navBarHeight-navBarExtendHeight-48;
        this.setData({
            scrollviewhigh:scrollviewhigh
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
        var token = app.globalData.userInfo?app.globalData.userInfo.token:null;
        this.setData({
        token:token
        })
        if(token){
            this.getSystemNotification_flag()
            this.getNotification_flag()
        }else{
            this.getPreSystemNotification_flag()
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
        if(this.data.classify_type==0){
            setTimeout(() => {
                wx.hideNavigationBarLoading()
                this.getFocusMoment(2);
                wx.hideNavigationBarLoading()
                wx.stopPullDownRefresh()
            }, 1500)
        }else if(this.data.classify_type==1){
            /**删除过多的内存 */
            // if(this.data.momentList.length>30){
            //     this.data.momentList.splice(this.data.momentList.length-10,10);
            //     this.setData({
            //         momentList:this.data.momentList
            //     })
            // };
            setTimeout(() => {
                wx.hideNavigationBarLoading()
                this.getMoment(2);
                wx.hideNavigationBarLoading()
                wx.stopPullDownRefresh()
            }, 500)
        }else if(this.data.classify_type==2){
            wx.stopPullDownRefresh();
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        /*
        if(this.data.classify_type==0){
            if(this.data.momentList_focus_flag!=0){
                this.getFocusMoment(1);
            }
        }
        if(this.data.classify_type==1){
            if(this.data.momentList_flag!=0){
                //if(this.data.momentList.length>30){
                //    this.data.momentList.splice(0,10);
                //    this.setData({
                //        momentList:this.data.momentList
                //    });
                //};
                this.getMoment(1);
            }
        }else if(this.data.classify_type==2){
        }
        */
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (share) {
    }
})