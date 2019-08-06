<template>
  <div>
    <div v-if="loginState == 'new' && !isRegister" class="accreditBox txtC font_12">
      <p><img src="/static/images/wxIcon.png" alt=""></p>
      <p class="title gray">银通融征信风控管理中心</p>
      <p>获得你的公开信息（昵称，头像等）</p>
      <p class="btnBox">
        <button class="btn font_14 green_bg white" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfo">授权登录</button>
      </p>
    </div>
    <div v-if="isRegister">
      <div class="newForm white_bg">
        <p class="radioBox">
          <radio-group class="radio-group" @change="radioChange">
            <label class="radio" v-for="(item, index) in radioList" :key="index">
              <radio :value="item.value" :checked="item.checked" /> {{item.name}}
            </label>
          </radio-group>
        </p>
        <i-panel>
          <i-input type='text' title="姓名" maxlength='11' right autofocus placeholder='请输入姓名' @change="nameChange" />
          <i-input type='number' title="手机号" maxlength='11' right placeholder='请输入手机号' @change="mobileChange" />
          <i-input type='number' title="身份证号码" right maxlength='8' placeholder='请输入身份证号码' @change="idNoChange" />
          <i-input type='text' title="机构名称" maxlength='11' right placeholder='请输入机构名称' @change="organizationChange" />
          <i-input type='password' title="职务" right maxlength='8' placeholder='请输入职务' @change="dutyChange" />
          <p class="authBox">
            <i-input type='text' title="验证码" maxlength='11' right placeholder='请输入验证码' @change="authChange" />
            <GetVerCode @getCodeFn="getCodeFn" ref="getCode"></GetVerCode>
          </p>
        </i-panel>
        <p class="idBox primary bordr_bt">
          <span @click="upload(1)">请上传身份证正面</span>
          <span @click="upload(2)">请上传身份证反面</span>
        </p>
        <p class="idBox primary" v-if="organizationVip == 3">
          <span @click="upload(3)">请上传营业执照</span>
        </p>
      </div>
      <div class="footer">
        <i-button @click="newFormSubmit" type="primary" shape="circle" size="small">确认提交</i-button>
      </div>

    </div>
    <!-- modal -->
    <!-- 注册选择modal -->
    <i-modal title="注册方式" :visible="visible1" :actions="actions1" @click="handleClose1">
      <p class="registerType">
        <span @click="goRegister(0)">老用户绑定</span>
        <span @click="goRegister(1)">新用户注册</span>
      </p>
    </i-modal>
    <!-- 老用户绑定modal -->
    <i-modal title="老用户绑定" :visible="visible2" @ok="submit" @cancel="handleClose2">
      <div>
        <i-panel>
          <i-input type='text' title="手机号" maxlength='11' right autofocus placeholder='请输入手机号' @change="mobileChange" />
          <i-input type='password' title="密码" right maxlength='8' placeholder='请输入密码' @change="psdformChange" />
        </i-panel>
      </div>
    </i-modal>
  </div>
</template>

<script>
  import GetVerCode from '../../components/getVerCode';
  export default {
    data() {
      return {
        loginState: '',
        isRegister: '',
        visible1: false,
          visible2: false,
        actions1: [{
          name: '取消'
        }],
        globalForm: {
          name: '',
          mobile: '',
          idNo: '',
        },
        form: {
          psd: '',
          organization: '',
          duty: '',
          idNoFrontHash: '',
          idNoReverseHash: '',
          licenseHash: '',
          auth: '',
        },
        radioList: [{
            value: 2,
            name: '风控人员',
            checked: 'true'
          },
          {
            value: 3,
            name: '机构用户'
          },
        ],
        organizationVip: 2,
      }
    },
    mounted() {
      // 查询用户是否授权过
      this.wxLogin();
    },
    methods: {
      newFormSubmit() {
        const form = this.form;
        const global = this.globalForm;
        var params = {
          name: global.name,
          account: global.mobile,
          id_number: global.idNo,
          role_id: this.organizationVip,
          id_img_positive_hash: form.idNoFrontHash,
          id_img_negative_hash: form.idNoReverseHash,
          business_license_hash: form.licenseHash,
          code: form.auth
        };
        var tag = this.$util.checkNull(params);
        if (tag) {
          this.$http.post('wx/reg', params)
            .then((res) => {
              console.log(res)

            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          wx.showToast({
            title: '请正确填写表单项',
            icon: 'none'
          })
        }
      },
      /**
       * 图片上传获取hash
       */
      upload(tag) {
        var _this = this;
        wx.chooseImage({
          success(res) {
            const tempFilePaths = res.tempFilePaths
            wx.uploadFile({
              url: 'http://develop.ytr98.com//api/oss/upload',
              filePath: tempFilePaths[0],
              header: {
                'content-type': 'multipart/form-data'
              },
              name: 'upload',
              method: 'POST',
              success(res) {
                var hash = JSON.parse(res.data).hash;
                if (tag == 1) {
                  _this.form.idNoFrontHash = hash;
                };
                if (tag == 2) {
                  _this.form.idNoReverseHash = hash;
                };
                if (tag == 3) {
                  _this.form.licenseHash = hash;
                };
              }
            })
          }
        })
      },
      /**
       * 注册用户radio
       */
      radioChange(e) {
        this.organizationVip = e.target.value;
      },
      goRegister(index) {
        if (index) {
          console.log('新用户注册');
          this.isRegister = true;
        } else {
          console.log('老用户绑定');
          this.visible2 = true;
        }
      },
      nameChange(e) {
        this.globalForm.name = e.target.detail.value;
      },
      mobileChange(e) {
        this.globalForm.mobile = e.target.detail.value;
      },
      idNoChange(e) {
        this.globalForm.idNo = e.target.detail.value;
      },
      organizationChange(e) {
        this.form.organization = e.target.detail.value;
      },
      dutyChange(e) {
        this.form.duty = e.target.detail.value;
      },
      authChange(e) {
        this.form.auth = e.target.detail.value;
      },
      psdformChange(e) {
        this.form.psd = e.target.detail.value;
      },
      goHome() {
        wx.switchTab({
          url: '../index/main'
        })
      },
      // login
      wxLogin() {
        var _this = this;
        wx.login({
          success(res) {
            if (res.code) {
              _this.$http.post('wx/login', {
                  'code': res.code
                })
                .then(res => {
                  _this.loginState = res.data.state;
                  if (_this.loginState != 'new') {
                    _this.goHome();
                  }
                })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      },
      getUserInfo() {
        // 判断小程序的API，回调，参数，组件等是否在当前版本可用。  为false 提醒用户升级微信版本
        // console.log(wx.canIUse('button.open-type.getUserInfo'))
        if (wx.canIUse('button.open-type.getUserInfo')) {
          console.log('用户版本可用')
        } else {
          console.log('请升级微信版本')
        }
      },
      bindGetUserInfo(e) {
        console.log(e.mp.detail.userInfo)
        if (e.mp.detail.rawData) {
          console.log('用户按了允许授权按钮');
          this.visible1 = true;
        } else {
          console.log('用户按了拒绝按钮')
        }
      },
      handleClose1() {
        this.visible1 = false;
      },
      handleClose2() {
        this.visible2 = false;
      },
      submit() {
        var params = {
          account: this.globalForm.mobile,
          password: this.form.psd
        };
        this.$http.post('wx/bind', params)
          .then(res => {
            console.lolg(res)
            this.visible2 = false;
            this.goHome();

          })
      },
      getCodeFn() {
        // 对手机号框单独验证
        var mobile = this.globalForm.mobile;
        if (this.$util.checkMobile(mobile)) {
          this.$refs.getCode.start(this.globalForm.mobile);
          wx.showToast({
            title: '验证码已发送',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '手机号输入错误',
            icon: 'none'
          })
        }
      }

    },
    components: {
      GetVerCode
    }
  }

</script>

<style lang='scss' scoped>
  @import '../../common/style/mixin.scss';

  .newForm {
    padding-top: px2rpx(10);
    .authBox {
      display: flex;
      align-items: center;
      align-content: space-between;
      span {
        height: px2rpx(25);
        line-height: px2rpx(25);
        padding: 0 px2rpx(10);
        border-radius: 4px;
      }
    }

    .radioBox {
      padding: px2rpx(10) 0 0 px2rpx(20);
      text-align: center;
      .radio-group {
        .radio:first-of-type {
          margin-right: px2rpx(40);
        }
      }
    }

    .idBox {
      padding: px2rpx(12) px2rpx(25);
      display: flex;
      justify-content: space-around;

      span {
        border: 1px solid #dcdee2;
        padding: px2rpx(3) px2rpx(10);
        border-radius: 4px;
      }
    }

  }

  .footer {
    width: 80%;
    margin: 20px auto;
  }

  .registerType {
    span {
      margin: 0 px2rpx(25);

      &:hover {
        color: #009dff;
      }
    }

  }

  .accreditBox {
    padding-top: 20%;

    img {
      width: px2rpx(50);
      height: px2rpx(50);
    }

    .title {
      margin: px2rpx(10) 0 px2rpx(40) 0;
    }

    .btnBox {
      width: 70%;
      margin: 0 auto;
      margin-top: px2rpx(15);

      .btn {
        height: px2rpx(35);
        line-height: px2rpx(35);
      }
    }
  }

</style>
