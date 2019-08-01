export default {
  methods: {
    // 支付
    // order_number订单号，successCallback成功的回调函数，failCallback失败的回调函数
    async pay (order_number, successCallback, failCallback) {
      const res = await this.$axios.post('my/orders/req_unifiedorder', {
        order_number
      })

      // 唤起微信支付
      wx.requestPayment({
        timeStamp: res.data.message.pay.timeStamp,
        nonceStr: res.data.message.pay.nonceStr,
        package: res.data.message.pay.package,
        signType: res.data.message.pay.signType,
        paySign: res.data.message.pay.paySign,
        success: async res => {
          // success
          // 调用后台的接口，更改订单状态为已支付
          const res2 = await this.$axios.post('my/orders/chkOrder', {
            order_number
          })

          // 跳转到订单列表页面，type = 3
          if (res2.data.meta.status === 200) {
            // 支付成功之后的提示
            wx.showToast({
              title: '支付成功', //提示的内容,
              icon: 'none', //图标,
              image: '/static/img/duigou.png',
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            })
            // 如果有传successCallback就执行successCallback函数
            successCallback && successCallback()
          }
        },
        fail: ({
          errMsg
        }) => {
          // fail
          if (errMsg === 'requestPayment:fail cancel') {
            wx.showToast({
              title: '您取消了支付', //提示的内容,
              icon: 'none', //图标,
              image: '/static/img/error2.png',
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            })
            // 如果有传failCallback就执行failCallback函数
            failCallback && failCallback()
          }
        },
        complete: function () {
          // complete
        }
      })
    }
  }
}
