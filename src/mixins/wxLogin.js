export default {
  data(){
    return {
      token:null, // 登录之后获取到的token值
    }
  },
  onLoad(){
    // 提前进行 wx.login  避免刷新登录态
    wx.login({
      success: res => {}
    })
  },
  methods:{
    // 微信登录
    wxLogin(e,callback){
      // 如果用户拒绝了，就没有必要再往下走了
      if (e.mp.detail.errMsg === 'getUserInfo:fail auth deny') return

      // 把用户信息存起来，我的页面中要使用到
      wx.setStorageSync('userInfo',e.mp.detail.userInfo)

      callback && callback()

      wx.login({
        success: async res => {
          // 获取的用户信息
          const {encryptedData,iv,rawData,signature} = e.mp.detail
          // 进行微信登录
          const res2 = await this.$axios.post('users/wxlogin',{
            code:res.code,
            encryptedData,
            iv,
            rawData,
            signature
          })

          // 登录成功之后
          if (res2.statusCode === 200){
            // 赋值token给模型
            this.token = res2.data.message.token

            // 保存起来
            wx.setStorageSync('token',res2.data.message.token)
          }
        }
      })
    }
  }
}
