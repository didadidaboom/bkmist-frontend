// pages/publish/publish.js
var app = getApp();
var api = require("../../config/api");
var COS = require('../../utils/cos-wx-sdk-v5.js');
var cos = new COS({
    // 必选参数
    getAuthorization: function (options, callback) {
        // 服务端 JS 和 PHP 示例：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
        // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
        // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048
        wx.request({
            url: api.rootURL+'credential/',
            data: {
                // 可从 options 取需要的参数
            },
            success: function (result) {
                var data = result.data;
                var credentials = data && data.credentials;
                if (!data || !credentials) return console.error('credentials invalid');
                callback({
                    TmpSecretId: credentials.tmpSecretId,
                    TmpSecretKey: credentials.tmpSecretKey,
                    XCosSecurityToken: credentials.sessionToken,
                    // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                    StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
                    ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
                });
            }
        });
    }
});

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pub_id:null,
        pub_content:null,
        pub_location:null,
        pub_location_name:null,
        pub_location_latitude:null,
        pub_location_longitude:null,
        pub_imageList:[],
        pub_friendList:[],
        pub_voice:null,
        pub_topicList:[],
        pub_topicIDList:[],
        pub_flag:null,
        pub_if_status:0, //公开0，条件隐身1
        pub_moment_status:0, //广场可见0，不可见1
        isShowLocationLayer:false,
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
    onClickContent:function(e){
        this.setData({
            pub_content: e.detail.value,
        })
    },
    chooseLocation:function(){
        wx.chooseLocation({
            success:(res)=>{
                this.setData({
                    pub_location: res.address,
                    pub_location_name:res.name,
                    pub_location_latitude:res.latitude,
                    pub_location_longitude:res.longitude,
                })
            }
        })
    },
    onClickLocation:function(e){
        wx.getSetting({
            success:(res)=>{
                if(res.authSetting['scope.userLocation']==undefined && !res.authSetting['scope.userLocation']){
                    this.chooseLocation()
                }else if(res.authSetting['scope.userLocation']==false){
                    wx.showModal({
                        title:"位置授权",
                        content: '需要打开您的地理设置，请确认授权哟',
                        success:(subres)=>{
                            if(subres.cancel){
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon:"none",
                                })
                            }else if(subres.confirm){
                                wx.openSetting({
                                    success:(conres)=>{
                                        if(conres.authSetting['scope.userLocation']){
                                            this.chooseLocation()
                                        }
                                    }
                                })
                            }
                        }
                    })
                }else{
                    this.chooseLocation()
                }
            }
        })
    },
    onClickControlStatus:function(){

    },
    onClickImage:function(){
        var that = this;
        var temp_imageList = [];
        var tmpindex = 0;
        wx.chooseImage({
            count: 4,
            sizeType: ['original', 'compressed'],
            sourceType:['album', 'camera'],
            success:(res)=>{
                for(var index in res.tempFilePaths){
                    (
                        function(imagePath){
                            var filePath = imagePath;
                            var filename = filePath.substr(filePath.lastIndexOf('/') + 1);
                            cos.postObject({
                                Bucket: 'mini-1257058751',
                                Region: 'ap-chengdu',
                                Key: 'publish/' + filename,
                                FilePath: filePath,
                                onProgress: function (info) {
                                    ///console.log("进度条",JSON.stringify(info));
                                    wx.showLoading({
                                        title: '上传中'
                                    })
                                }
                            }, function (err, data) {
                                if(data.statusCode!=200){
                                    wx.showToast({
                                      title: '网络有问题，图片上传失败',
                                      icon:"none",
                                      duration:1000
                                    })
                                    return
                                }
                                var info={};
                                info["path"]=data.headers.location;
                                info["path_key"]=data.headers.location.substr(data.headers.location.lastIndexOf('/') + 1);
                                tmpindex = tmpindex + 1;
                                //temp_imageList.push(data.headers.location);
                                temp_imageList.push(info);
                                if(tmpindex==res.tempFilePaths.length){
                                    that.setData({
                                        pub_imageList:that.data.pub_imageList.concat(temp_imageList),
                                    });
                                }
                                wx.hideLoading({})
                            });
                        }
                    )(res.tempFilePaths[index]);
                };
            }
        })
    },
    onClickUploadImage:function(){
        var that = this;
        var tmpindex = 0;
        var temp_imageList = [];
        var tempFilePaths = this.data.pub_imageList;
        for(var index in tempFilePaths){
            var filePath = tempFilePaths[index];
            var filename = filePath.substr(filePath.lastIndexOf('/') + 1);
            cos.postObject({
                Bucket: 'mini-1257058751',
                Region: 'ap-chengdu',
                Key: 'publish/' + filename,
                FilePath: filePath,
                onProgress: function (info) {
                    console.log("进度条",JSON.stringify(info));
                }
            }, function (err, data) {
                tmpindex = 1+tmpindex;
                temp_imageList.push(data.headers.location);
                if(tmpindex==(tempFilePaths.length)){
                    that.setData({
                        pub_imageList:temp_imageList,
                    });
                };
            });
        };
    },
    onClickPublish:function(){
        if(!this.data.pub_content){
            wx.showToast({
              title: '请填写发布内容',
              duration: 1000,
              icon: "none",
            });
            return;
        };
        wx.showLoading({
          title: '发布中，请稍后',
        })
        this.onClickPublishFinal()
    },
    onClickPublishFinal:function(){
        /**
         * 1. 验证内容  内容不能为空
         * 2. 发送到后台保持
         * 3. 返回状态：成功（查看发布内容/再次发布），失败（重新发布） 
         */
        var addressList = {}
        addressList["address"]=this.data.pub_location
        addressList["addressName"]=this.data.pub_location_name
        addressList["latitude"]=this.data.pub_location_latitude
        addressList["longitude"]=this.data.pub_location_longitude
        wx.request({
            url: api.publishURL,
            data: {
                content:this.data.pub_content,
                topic: this.data.pub_topicIDList,
                addressList: addressList,
                imageList:this.data.pub_imageList,
                moment_status:this.data.pub_moment_status,
                if_status:this.data.pub_if_status,
            },
            header: {
                "Authorization":app.globalData.userInfo?app.globalData.userInfo.token:null
            },
            method:'POST',
            dataType:"json",
            success (res) {
                if(res.statusCode==201){
                    // wx.showToast({
                    //     title: '发布成功',
                    //     duration: 1000,
                    //     icon: "none",
                    // })
                    var moment_id = res.data.id
                    setTimeout(() => {
                        wx.hideLoading();
                    }, 1500)
                    wx.navigateTo({
                        url: '/pages/completePublish/completePublish?moment_id='+moment_id,
                    })
                }else{
                    wx.hideLoading();
                    wx.showToast({
                      title: '发布失败，请稍后尝试',
                      icon:"none",
                      duration:1000
                    })
                }
            }
        });

    },
    onClickReviewImage:function(e){
        var imagesrc = e.currentTarget.dataset.imagesrc;
        var imageindex = e.currentTarget.dataset.imageindex;
        wx.navigateTo({
          url:"/pages/previewImage/previewImage?imagesrc="+imagesrc+"&imageindex="+imageindex,
        })
    },
    deleteReviewImage:function(index,e){
        var tmpImageList = this.data.pub_imageList;
        tmpImageList.splice(index,1);
        this.setData({
            pub_imageList:tmpImageList,
        });
        var filename = e.substr(e.lastIndexOf('/') + 1);
        cos.deleteObject({
            Bucket: 'mini-1257058751',
            Region: 'ap-chengdu',
            Key: 'publish/'+filename,
        }, function (err, data) {
            console.log(err || data);
        });
    },
    onClickDelCurrentImage:function(e){
        var index = e.currentTarget.dataset.imageindex;
        var path  = e.currentTarget.dataset.imagesrc;
        var tmpImageList = this.data.pub_imageList;
        tmpImageList.splice(index,1);
        this.setData({
            pub_imageList:tmpImageList,
        });
        var filename = path.substr(path.lastIndexOf('/') + 1);
        cos.deleteObject({
            Bucket: 'mini-1257058751',
            Region: 'ap-chengdu',
            Key: 'publish/'+filename,
        }, function (err, data) {
            if(data.statusCode==204){
                wx.showToast({
                  title: '删除成功',
                })
            }
        });
    },
    onClickDelImage:function(e){
        var filename = e.substr(e.lastIndexOf('/') + 1);
        cos.deleteObject({
            Bucket: 'mini-1257058751',
            Region: 'ap-chengdu',
            Key: 'publish/'+filename,
        }, function (err, data) {
            console.log(err || data);
        });
    },
    onClickTopics:function(){
        wx.navigateTo({
          url: '/pages/topicList/topicList',
        })
    },
    onClickDelTopic(e){
        var index = e.currentTarget.dataset.index;
        var temp_pub_topicList = this.data.pub_topicList;
        var temp_pub_topicIDList = this.data.pub_topicIDList;
        temp_pub_topicList.splice(index,1);
        temp_pub_topicIDList.splice(index,1);
        this.setData({
            pub_topicList:temp_pub_topicList,
            pub_topicIDList:temp_pub_topicIDList
        });
        wx.showToast({
          title: '删除成功',
        })
    },
    onClickDelPosition:function(){
        this.setData({
            pub_location:null,
            pub_location_name:null,
            pub_location_latitude:null,
            pub_location_longitude:null,
        })
        wx.showToast({
            title: '删除成功',
        })
    },
    onClickUpdataControlStatus(e){
        this.setData({
            pub_moment_status:e
        })
    },
    onClickUpdataIfStatus(e){
        this.setData({
            pub_if_status:e
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