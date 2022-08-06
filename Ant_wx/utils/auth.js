var app = getApp();

function is_login(){
    if(!app.globalData.userInfo){
        wx.navigateTo({
          //url: '/pages/autho/autho',
          url: '/pages/login/login',
        })
        return false
    }
    return true
};
module.exports={
    is_login:is_login
}