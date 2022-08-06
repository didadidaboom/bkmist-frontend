
//var root = "http://127.0.0.1:8000/api/";
var root = "https://mistapp.cn:8888/api/";

module.exports = {
    rootURL: root,
    messagecodeURL: root+"messageCode/",
    loginURL: root+"login/",
    openIDURL:root+"loginOpenid/",
    profileURL:root+"profile/",  //获取用户微信名字和头像
    publishURL:root+"publish/",
    momentURL: root+"moment/",  //瞬间页获取
    FocusMomentURL:root+"FocusMoment/",  //关注的瞬间
    focusMomentTopicURL:root+"FocusMomentTopic/", //关注的话题
    momentDetailURL: root+"momentDetail/",  //瞬间详细获取
    momentFavorURL:root+"momentFavor/",  //更新瞬间喜欢数
    submitCommentURL:root+"submitComment/",  //提交评论
    updateCommentURL:root+"updateComment/",  //下滑更新评论
    updateViewerURL:root+"updataViewer/",    //更新浏览量
    commentFavorURL:root+"commentFavor/",  //更新评论点赞数
    topicURL: root+"topic/",
    personalMomentURL:root+"personalMoment/",  //获取个人主页瞬间
    updatePersonalMomentURL:root+"updatePersonalMoment/", //对个人空间瞬间进行 修改
    delPersonalMomentURL:root+"delPersonalMoment/", //删除个人空间瞬间
    personalInfoURL:root+"personalInfo/",  // 获取个人信息
    updateNamePersonalURL:root+"updateNamePersonal/", //修改个人名字
    updateAvatarPersonalURL:root+"updateAvatarPersonal/", //修改性别，头像
    deletePersonalURL:root+"deletePersonal/", //删除个人信息
    personalViewerPage1URL:root+"personalViewerPage1/", //获取个人瞬间页流量记录
    personalViewerPage2URL:root+"personalViewerPage2/", //获取个人瞬间页流量记录
    personalViewerPage3URL:root+"personalViewerPage3/", //获取个人瞬间页流量记录
    personalViewerPage3ScanURL:root+"personalViewerPage3Scan/", //获取个人瞬间页流量记录
    personalViewerPage3SubmitURL:root+"personalViewerPage3Submit/", //获取个人瞬间页流量记录
    personalMomentViewerURL:root+"personalMomentViewer/", //获取个人瞬间页流量记录
    personalFocusListURL:root+"personalFocusList/", //获取个人瞬间页流量记录
    personalFocusedListURL:root+"personalFocusedList/", //获取个人瞬间页流量记录
    personalFriendListURL:root+"personalFriendList/", //获取好友记录
    otherDetailURL:root+"otherDetails/", //查看他人信息页
    otherMomentsURL:root+"otherMoments/", //查看他人信息页
    otherInviteSelfURL:root+"otherInviteSelf/", //他人我的独白页邀请
    focusUserURL:root+"focusUser/", //关注用户
    tacitURL:root+"tacit/", //好友默契题库获取
    tacitSaveURL:root+"tacitSave/", //好友默契提交
    tacitRandomOneURL:root+"tacitRandomOne/", //随机一换一个题
    personalTacitURL:root+"personalTacit/",  //获取个人主页默契测试
    updatePersonalTacitURL:root+"updatePersonalTacit/", //对个人空间默契测试进行 修改
    delPersonalTacitURL:root+"delPersonalTacit/", //删除个人空间瞬间
    otherTacitsURL:root+"otherTacits/", //查看他人信息页---默契测试
    replyTacitURL:root+"replyTacit/",  //获取回复默契问答题库
    replyTacitSaveURL:root+"replyTacitSave/", //回复默契问题 保存
    personalTacitReplyFavorURL:root+"personalTacitReplyFavor/", //个人页 点赞 默契测试回复
    personalTacitReplyURL:root+"personalTacitReply/", //获取个人主页他人眼里的默契测试
    otherTacitsReplyURL:root+"otherTacitsReply/", //查看他人信息页---默契测试回复
    getAccessTokenURL:root+"getAccessToken/", //获取access token
    topicMomentsTimeURL:root+"topicMomentTime/",  //获取话题下所有瞬间
    topicMomentsHotViewURL:root+"topicMomentHotView/",  //获取话题下所有瞬间
    topicMomentsHotCommentURL:root+"topicMomentHotComment/",  //获取话题下所有瞬间
    topicMomentsHotFavorURL:root+"topicMomentHotFavor/",  //获取话题下所有瞬间
    topicDetailURL:root+"topicDetail/",  //获取话题详情
    focusTopicURL:root+"focusTopic/", //获取话题关注
    addressDetailURL:root+"addressDetail/", //获取位置详情
    addressMomentsDistanceURL:root+"addressMomentsDistance/", //获取位置下瞬间--距离
    addressMomentsTimeURL:root+"addressMomentsTime/",//获取位置下瞬间--时间
    focusAddressURL:root+"focusAddress/", //关注位置
    focusMomentAddressURL:root+"focusMomentAddress/", //获取关注的位置
    notification_flagURL:root+"notification_flag/", //判断是否又最新消息
    notification_page1URL:root+"notification_page1/", //消息通知
    notification_statusURL:root+"notificationStatus/", //消息通知已读
    presystemnotification_flagURL:root+"presystemnotification_flag/", //判断是否又最新系统消息
    systemnotification_flagURL:root+"systemnotification_flag/", //判断是否又最新系统消息
    presystemnotificationURL:root+"presystemnotification/", //系统消息通知
    systemnotificationURL:root+"systemnotification/", //系统消息通知
    systemnotification_statusURL:root+"systemnotificationStatus/", //系统消息状态
    systemmessageURL:root+"systemmessage/", //管理员  系统消息发布
    presystemListURL:root+"presystemList/", //管理员  系统消息展示
    delPresystemURL:root+"delPresystem/", //管理员 系统消息删除
    getAllChongOpenidUsedListURL:root+"getAllChongOpenidUsedList/", //管理员 获取使用的所有openid
    getAllCHOpenidUsedListURL:root+"getAllCHOpenidUsedList/", //管理员 获取使用的所有openid
    updateOpenidURL:root+"updateOpenid/", //管理员 改变openid
    getAllDayOpenidUsedListURL:root+"getAllDayOpenidUsedList/", // 管理员 获取前几天 登陆用户记录
    getAllNDaysOpenidUsedListURL:root+"getAllNDaysOpenidUsedList/", // 管理员 获取前几天总和 登陆用户记录
    getPersonalDataListURL:root+"getPersonalDataList/", // 管理员 个人页浏览记录显示
    getPageDataListURL:root+"getPageDataList/", //管理员 页面浏览记录显示
}