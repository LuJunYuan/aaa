<template>
  <div>
    <!-- <button open-type="openSetting">打开授权</button>
    <button @click="getUserLocation">获取用户定位</button> -->
    <!-- 1.0 用户基本信息 -->
    <view class="user">
      <view v-if="userInfo" class="user-avatar-bg">
        <image :src="userInfo.avatarUrl" class="user-avatar-bg-img"/>
      </view>
      <view class="user-head">
        <span class="iconfont-tap icon-setting icon-shezhi"></span>
        <div class="user-avatar">
          <image class="user-avatar-img" :src="(userInfo && userInfo.avatarUrl) ? userInfo.avatarUrl : '/static/img/user_avator_default@2x.png'"/>
        </div>
        <span class="iconfont-tap icon-message icon-xiaoxi"></span>
      </view>
      <block v-if="userInfo && userInfo.nickName">
        <text class="user-name">{{userInfo.nickName}}</text>
      </block>
      <block v-if="!token">
        <button class="mini-btn" @getuserinfo="wxLogin2" open-type="getUserInfo" size="mini">授权登录</button>
      </block>
    </view>
    <!-- 2.0 收藏相关 -->
    <view class="user-bottom">
      <view class="item">
        <view class="item-number">0</view>
        <view class="item-note">收藏的店铺</view>
      </view>
      <view class="item">
        <view class="item-number">0</view>
        <view class="item-note">收藏的商品</view>
      </view>
      <view class="item">
        <view class="item-number">0</view>
        <view class="item-note">关注的商品</view>
      </view>
      <view class="item">
        <view class="item-number">0</view>
        <view class="item-note">我的足迹</view>
      </view>
    </view>
    <!-- 3.0 我的订单 -->
    <view v-if="token" class="order">
      <view class="order-head">我的订单</view>
      <view class="order-body">
        <navigator
          url="/pages/orders/main?type=1"
          class="item"
        >
          <view class="iconfont icon-dingdan"></view>
          <view class="item-note">全部订单</view>
        </navigator>
        <navigator
          url="/pages/orders/main?type=2"
          class="item"
        >
          <view class="iconfont icon-daifukuan"></view>
          <view class="item-note">待付款</view>
        </navigator>
        <navigator
          url="/pages/orders/main?type=3"
          class="item"
        >
          <view class="iconfont icon-daishouhuo"></view>
          <view class="item-note">待收货</view>
        </navigator>
        <navigator
          url="/pages/orders/main?type=4"
          class="item"
        >
          <view class="iconfont icon-tuikuan"></view>
          <view class="item-note">退款/退货</view>
        </navigator>
      </view>
    </view>
    <!-- 4.0 收获地址相关 -->
    <view class="cell">
      <view class="cell-item icon-arrow-right">
        <text class="cell-text">收货地址管理</text>
      </view>
    </view>
    <view class="cell">
      <view class="cell-item">
        <text class="cell-text">联系客服</text>
        <!-- <button open-type="contact">联系客服</button> -->
        <text
          class="phone"
          @click="callPhone"
        >400-618-4000</text>
      </view>
      <view class="cell-item icon-arrow-right">
        <text class="cell-text">意见反馈</text>
      </view>
      <view class="cell-item icon-arrow-right">
        <text class="cell-text">关于我们</text>
      </view>
      <view class="bottom-space"></view>
    </view>
  </div>
</template>
<script>
import wxLogin from '../../mixins/wxLogin'
export default {
  mixins:[wxLogin],
  data(){
    return {
      userInfo:null // 用户的信息
    }
  },
  onLoad(){
    if (wx.getStorageSync('userInfo')){
      this.userInfo = wx.getStorageSync('userInfo')
    }

    if (wx.getStorageSync('token')){
      this.token = wx.getStorageSync('token')
    }
  },
  methods:{
    // getUserLocation(){
    //   wx.getLocation({
    //     success:res => {
    //       console.log(res)
    //     }
    //   })
    // }
    wxLogin2(e){
      // wxLogin就是从混入中来的
      this.wxLogin(e,() => {
        this.userInfo = e.mp.detail.userInfo
      })
    },
    // 打电话
    callPhone(){
      wx.makePhoneCall({ phoneNumber: '13812345678' })
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  height: 410rpx;
  position: relative;
  display: flex;
  background-color: #ff2d4a;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-avatar-bg {
    width: 750rpx;
    height: 410rpx;
    display: flex;
    position: absolute;
    overflow: hidden;
    &-img {
      width: 1000rpx;
      height: 1000rpx;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      filter: blur(50rpx);
    }
  }
  &-avatar {
    width: 128rpx;
    height: 128rpx;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    &-img {
      position: absolute;
      left: -2rpx;
      top: -2rpx;
      width: 132rpx;
      height: 132rpx;
    }
  }
  &-name {
    color: #fff;
    font-size: 35rpx;
    margin-top: 20rpx;
    z-index: 1;
  }
  &-head {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    .iconfont-tap {
      color: #fff;
      position: absolute;
    }
    .icon-setting {
      margin-left: -150rpx;
    }
    .icon-message {
      margin-left: 150rpx;
    }
    .iconfont-tap:after {
      width: 32rpx;
      height: 32rpx;
    }
  }
  &-bottom {
    margin: -26rpx 16rpx 0;
    height: 120rpx;
    background-color: #fff;
    display: flex;
    position: relative;
    z-index: 2;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &-number {
        color: #999;
        font-size:24rpx;
      }
      &-note {
        color: #666;
        margin-top: 10rpx;
        font-size:24rpx;
      }
    }
  }
}

.iconfont-tap {
  font-family: 'iconfont' !important;
  font-size: 32rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;

  min-width: 88rpx;
  min-height: 88rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cell {
  overflow: hidden;
  &-item {
    padding: 28rpx 30rpx 28rpx 0;
    margin-left: 30rpx;
    border-top: 1rpx solid #ddd;
    margin-top: -1rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .phone {
    color: #999;
  }
  .icon-arrow-right:after {
    font-family: 'iconfont';
    content: '\e60e';
    width: 20rpx;
    height: 26rpx;
    font-size: 26rpx;
    line-height: 1;
    color: #ccc;
  }
}
// 微信登录按钮
.wx-login-btn {
  width: 128rpx;
  height: 180rpx;
}
.order,
.cell {
  margin: 20rpx 16rpx;
  background-color: #fff;
  font-size: 32rpx;
}
.order {
  &-head {
    padding-left: 30rpx;
    line-height: 88rpx;
  }
  &-body {
    display: flex;
    border-top: 1rpx solid #ddd;
    .item {
      flex: 1;
      display: flex;
      padding: 30rpx 0;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &-note {
        font-size: 28rpx;
        margin-top: 24rpx;
      }
    }
  }
  .iconfont {
    width: 64rpx;
    height: 64rpx;
    color: #ff2d4a;
    font-size: 64rpx;
  }
}
.mini-btn {
  margin-top: 20rpx;
}
</style>

