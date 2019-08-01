<template>
  <div>
    <!-- 1.0 头部 -->
    <view class="head">
      <view
        @click="toggleSelect(index)"
        :class="['head-item',currentIndex === index ? 'head-active':'']"
        v-for="(item,index) in menus"
        :key="index"
      >
        <text>{{item}}</text>
      </view>
    </view>
    <!-- 2.0 订单部分 -->
    <view class="order">
      <view class="order-item" v-for="item in orderList" :key="item.order_id">
        <view class="product-item" v-for="(subitem,index2) in item.goods" :key="subitem.id">
          <view class="product-left">
            <image class="product-img" :src="subitem.goods_small_logo" />
          </view>
          <view class="product-right">
            <view class="product-name">{{subitem.goods_name}}</view>
            <view class="product-price">
              <text class="product-price-symbol">￥</text>
              <text class="product-price-integer">{{ subitem.goods_price }}</text>
              <text class="product-price-decimal">.00</text>
            </view>
            <view class="product-count">x{{ subitem.goods_number }}</view>
          </view>
        </view>
        <!-- 2.2 统计信息 -->
        <view class="order-total">共{{item.total_count }}件商品 总计：¥{{item.total_price}} (含运费0.00)</view>
        <!-- 2.3 支付信息 -->
        <view class="order-item-pay">
          <view>订单号:{{item.order_number}}</view>
          <view
            @tap="goToPay(item.order_number)"
            v-if="item.pay_status==='0'"
            class="btn-line btn-color-main"
          >支付</view>
        </view>
      </view>
    </view>
    <view
      class="no_order"
      v-if="orderList && orderList.length === 0"
    >
      <view>
        <img
          src="/static/img/empty_data.png"
          alt=""
        >
      </view>
      <text>没有订单啦...</text>
    </view>
    <!-- 3.0 加载更多的视图 -->
    <view v-if="orderList && orderList.length > 0">
      <view class="loadMore loading" v-if="hasMore">
        正在加载中...
      </view>
      <view class="loadMore" wx:else>
        没有更多了
      </view>
    </view>
  </div>
</template>

<script>
// 导入逻辑文件
import wxPay from '../../mixins/wxPay'
export default {
  // 执行逻辑文件
  mixins:[wxPay],
  data() {
    return {
      type: 1, //1 全部  2 待付款  3 待收货  4 退货/退款
      menus: ["全部订单", "待付款", "待收货", "退货/退款"],
      currentIndex: 0,   //选中的下标
      orderList: null, // 订单列表数组
      pageIndex: 0, // 页码（当前显示了多少条信息）
      pageSize: 10, // 页容量
      hasMore:true // 是否还有更多
    };
  },
  onLoad(options) {
    // 给类型和当前的索引赋值
    this.type = options.type;
    this.currentIndex = parseInt(options.type) - 1;

    // 加载数据
    this.loadData();
  },
  // 下拉刷新
  onPullDownRefresh(){
      // 重新根据type去加载第一页的数据（type，pageSize不需要改变）
      this.orderList = null
      this.pageIndex = 0
      this.hasMore = true

      this.loadData()
  },
  // 上拉加载更多
  onReachBottom(){
    // 因为它本来有数据了，不需要重置数据
    this.loadData()
  },
  methods: {
    // 去支付
    // order_number 订单号
    goToPay(order_number){
      //  调用 wxPay中的 pay 方法 
      this.pay(order_number,() => {
        // 重新根据type去加载第一页的数据
        this.orderList = null
        this.pageIndex = 0
        this.hasMore = true

        this.loadData()
      },() => {
        console.log('---支付失败---')
      })
    },
    // 切换头部tab
    toggleSelect(index) {
      this.currentIndex = index;
      this.type = index + 1;

      // 重新根据type去加载第一页的数据
      this.orderList = null
      this.pageIndex = 0
      this.hasMore = true
        // 刷新数据
      this.loadData()
    },
    // 根据类别加载订单数据
    async loadData() {
  // 判断是否还有更多
      if (!this.hasMore) return
      // 有就页码++
      this.pageIndex ++
      const url = `my/orders/all?type=${this.type}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`
      const res = await this.$axios.get(url)
  console.log(res);
      // 停止下拉刷新
      wx.stopPullDownRefresh()

      // 赋值 （把之前的数据和当前数据放在一起，orderList在数据中是设置为null,要判断如果为null就设置为空数组）
      const newArray = [...(this.orderList || []),...res.data.message.orders]

      // 判断是否还有更多数据
      this.hasMore = newArray.length < res.data.message.count
      this.orderList = newArray
    }
  }
};
</script>

<style lang="less" scoped>
.head {
  display: flex;
  align-items: center;
  width: 750rpx;
  background-color: white;
  height: 100rpx;
  justify-content: space-between;
  &-item {
    flex: 1;
    text-align: center;
    position: relative;
    line-height: 100rpx;
  }
  &-active::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 5rpx;
    background-color: red;
  }
  &-active text {
    color: red;
  }
}
.order {
  // margin-bottom: 30rpx;
  &-item {
    background-color: #ffffff;
    margin-top: 30rpx;
    // background-color: yellow;
  }
}

.product-item {
  display: flex;
  padding: 30rpx 20rpx;
  position: relative;
}
.product-item::after {
  content: "";
  position: absolute;
  left: 20rpx;
  right: 0;
  bottom: 0;
  height: 1px;
  border-bottom: 1px solid #ddd;
}
// .product-item:first-child::after {
//   border-bottom: 0 none;
// }

.product-left {
  margin-right: 26rpx;
}
.product-left,
.product-left .product-img {
  width: 200rpx;
  height: 200rpx;
  background-color: #eee;
}
.product-right {
  width: 480rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
.product-name {
  height: 84rpx;
  font-size: 30rpx;
  line-height: 1.4;
  /* 多行文字隐藏省略号 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.product-price {
  color: #ff2d4a;
}
.product-price-symbol,
.product-price-decimal {
  font-size: 28rpx;
  color: #ff2d4a;
}
.product-price-integer {
  font-size: 44rpx;
  color: #ff2d4a;
}

.product-count {
  position: absolute;
  right: 0;
  bottom: 0;
  letter-spacing: 2rpx;
  color: #999;
}

.order-total {
  font-size: 14px;
  height: 88rpx;
  background-color: #fff;
  padding: 0 20rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  color: #999;
  &::after {
    content: "";
    position: absolute;
    left: 20rpx;
    right: 20rpx;
    right: 0;
    bottom: 0;
    border-bottom: 1rpx solid #ddd;
  }
}

.order-item-pay {
  display: flex;
  font-size: 12px;
  height: 88rpx;
  align-items: center;
  padding: 0rpx 20rpx;
  justify-content: space-between;
}

.btn-line {
  border: 2rpx solid #999;
  border-radius: 5rpx;
  width: 156rpx;
  height: 56rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 40rpx;
}
.btn-color-main {
  color: #ff2d4a;
}

.no_order {
  width: 750rpx;
  height: 500rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    width: 100rpx;
    height: 100rpx;
  }
  text {
    color: #999999;
    font-size: 30rpx;
    margin-top: 30rpx;
  }
}
text {
  font-size: 12px;
}

.loadMore {
  font-size: 30rpx;
  color: #888;
  text-align: center;
  line-height: 100rpx;
}

.loadMore.loading::before {
  content: "";
  width: 40rpx;
  height: 40rpx;
  display: inline-block;
  vertical-align: middle;
  margin-top: -5rpx;
  margin-right: 10rpx;
  animation: loading 1s steps(12) infinite;
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=)
    no-repeat;
  background-size: 100%;
}

@keyframes loading {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
}
</style>
