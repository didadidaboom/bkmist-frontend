Component({
  properties: {
    //属性值可以在组件使用时指定
    isCanDraw: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        newVal && this.drawPic()
      }
    },
    flag:{
      type:Number,
      value:1
  }
  },
  data: {
    imgDraw: {}, //绘制图片的大对象
    sharePath: '', //生成的分享图
    visible: false
  },
  methods: {
    handleClose() {
      this.setData({
        visible: false
      })
      this.triggerEvent('close')
    },
    drawPic() {
      if (this.data.sharePath) { //如果已经绘制过了本地保存有图片不需要重新绘制
        this.setData({
          visible: true
        })
        this.triggerEvent('initData') 
        return
      }
      wx.showLoading({
        title: '生成中'
      })
      this.setData({
        imgDraw: {
          width: '750rpx',
          height: '1334rpx',
          background: 'https://mini-1257058751.cos.ap-chengdu.myqcloud.com/static/alvan-nee-1VgfQdCuX-4-unsplash.png',
          views: [
            {
              type: 'image',
              url: '',
              css: {
                top: '32rpx',
                left: '30rpx',
                right: '32rpx',
                width: '688rpx',
                height: '420rpx',
                borderRadius: '16rpx'
              },
            },
            {
              type: 'image',
              url: this.data.flag?wx.getStorageSync('userInfo').real_avatarUrl:wx.getStorageSync('userInfo').avatarUrl,
              css: {
                top: '34rpx',
                left: '328rpx',
                width: '96rpx',
                height: '96rpx',
                borderWidth: '6rpx',
                borderColor: '#FFF',
                borderRadius: '96rpx'
              }
            },
            {
              type: 'text',
              text: this.data.flag?wx.getStorageSync('userInfo').real_nickName :wx.getStorageSync('userInfo').nickName,
              css: {
                top: '132rpx',
                fontSize: '28rpx',
                left: '375rpx',
                align: 'center',
                color: '#3c3c3c'
              }
            },
            {
              type: 'text',
              text: this.data.flag?'您对 "'+wx.getStorageSync('userInfo').real_nickName+'"了解多少呢？': '您对 "'+wx.getStorageSync('userInfo').nickName+'"了解多少呢？',
              css: {
                top: '176rpx',
                left: '375rpx',
                align: 'center',
                fontSize: '28rpx',
                color: '#3c3c3c'
              }
            },
            {
              type: 'text',
              text: this.data.flag?'欢迎来参与回答关于"'+wx.getStorageSync('userInfo').real_nickName+'"的': '欢迎来参与回答"'+wx.getStorageSync('userInfo').nickName+'"的',
              css: {
                top: '244rpx',
                left: '375rpx',
                maxLines: 1,
                align: 'center',
                fontWeight: 'bold',
                fontSize: '44rpx',
                color: '#3c3c3c'
              }
            },
            {
              type: 'text',
              text: '十道“默契测试”问答哟！',
              css: {
                top: '312rpx',
                left: '375rpx',
                maxLines: 1,
                align: 'center',
                fontWeight: 'bold',
                fontSize: '44rpx',
                color: '#3c3c3c'
              }
            },
            {
              type: 'image',
              url: 'data:image/png;base64,'+wx.getStorageSync('code'),
              css: {
                top: '434rpx',
                left: '470rpx',
                width: '200rpx',
                height: '200rpx'
              }
            },
            {
              type: 'text',
              text: this.data.flag?`长按二维码与"`+ wx.getStorageSync('userInfo').real_nickName +'"互动哟': `长按二维码与"`+ wx.getStorageSync('userInfo').nickName +'"互动哟',
              css: {
                top: '464rpx',
                left: '255rpx',
                maxLines: 1,
                align: 'center',
                fontSize: '28rpx',
                color: '#3c3c3c'
              }
            },
            {
              type: 'image',
              url: this.data.flag?wx.getStorageSync('userInfo').real_avatarUrl :wx.getStorageSync('userInfo').avatarUrl,
              css: {
                top: '494rpx',
                left: '530rpx',
                width: '80rpx',
                height: '80rpx',
                borderWidth: '6rpx',
                borderColor: '#FFF',
                borderRadius: '80rpx'
              }
            }
          ]
        }
      })
    },
    onImgErr(e) {
      wx.hideLoading()
      wx.showToast({
        title: '生成分享图失败，请刷新页面重试'
      })
    },
    onImgOK(e) {
      wx.hideLoading()
      this.setData({
        sharePath: e.detail.path,
        visible: true,
      })
      //通知外部绘制完成，重置isCanDraw为false
      this.triggerEvent('initData') 
    },
    preventDefault() { },
    // 保存图片
    handleSavePhoto() {
      wx.showLoading({
        title: '正在保存...',
        mask: true
      })
      wx.saveImageToPhotosAlbum({
        filePath: this.data.sharePath,
        success: () => {
          wx.showToast({
            title: '保存成功'
          })
          setTimeout(() => {
            this.setData({
              visible: false
            })
            this.triggerEvent('close')
          }, 300)
        },
        fail: () => {
          wx.getSetting({
            success: res => {
              let authSetting = res.authSetting
              if (!authSetting['scope.writePhotosAlbum']) {
                wx.showModal({
                  title: '提示',
                  content: '您未开启保存图片到相册的权限，请点击确定去开启权限！',
                  success(res) {
                    if (res.confirm) {
                      wx.openSetting()
                    }
                  }
                })
              }
            }
          })
          setTimeout(() => {
            wx.hideLoading()
            this.setData({
              visible: false
            })
            this.triggerEvent('close')
          }, 300)
        }
      })
    }
  }
})
