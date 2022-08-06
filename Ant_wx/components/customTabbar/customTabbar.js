// components/customTabbar/customTabbar.js
var auth = require("../../utils/auth.js");
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        selected:{
            type:Number,
            value:0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        color: "#7A7E83",
        selectedColor: "#60d1cf",
        list: [{
            pagePath: "/pages/index/index",
            iconPath: "/static/tabbar/icons8-topic-50.png",
            selectedIconPath: "/static/tabbar/icons8-topic-50.png",
            text: "广场"
        }, {
            iconPath: "/static/tabbar/icons8-publish-50.png",
            text: "发布",
        },{
            pagePath: "/pages/profile/profile",
            iconPath: "/static/tabbar/icons8-edvard-munch-50.png",
            selectedIconPath: "/static/tabbar/icons8-edvard-munch-50.png",
            text: "我的"
        }]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset;
            const url = data.path;
            if(url){
                wx.switchTab({url});
            }
            else{
                if(!auth.is_login()){
                    wx.navigateTo({
                      url: '/pages/login/login',
                    })
                    return;
                }
                wx.navigateTo({
                  url: "/pages/publish/publish",
                })
            }
          }
    }
})
