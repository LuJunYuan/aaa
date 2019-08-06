import Vue from 'vue';
import Router from 'vue-router';
import store from '@/vueX';
import iView from 'iview';

const home = () => import('@/container/home')
const notFound = () => import(/* webpackChunkName: "notFound" */ '@/container/notFound');
const protocolPage = () => import(/* webpackChunkName: "protocol" */ '@/container/protocol');
const personalProtocol = () => import(/* webpackChunkName: "protocol" */ '@/container/protocol/personalProtocol');
const enterpriseProtocol = () => import(/* webpackChunkName: "protocol" */ '@/container/protocol/enterpriseProtocol');
const personal = () => import(/* webpackChunkName: "personal" */ '@/container/personal');
const baseInfo = () => import(/* webpackChunkName: "personal" */ '@/container/personal/baseInfo');
const folkQuery = () => import(/* webpackChunkName: "personal" */ '@/container/personal/folkQuery');
const creditManage = () => import(/* webpackChunkName: "personal" */ '@/container/personal/creditManage');
const financialManage = () => import(/* webpackChunkName: "personal" */ '@/container/personal/financialManage');
const blackList = () => import(/* webpackChunkName: "personal" */ '@/container/personal/blackList');
const eContract = () => import(/* webpackChunkName: "personal" */ '@/container/personal/eContract');
const arbitration = () => import(/* webpackChunkName: "personal" */ '@/container/personal/arbitration');
const bountyMission = () => import(/* webpackChunkName: "personal" */ '@/container/personal/bountyMission');
const cooperationList = () => import(/* webpackChunkName: "personal" */ '@/container/personal/cooperationList');
const communityComment = () => import(/* webpackChunkName: "personal" */ '@/container/personal/communityComment');
const customManager = () => import(/* webpackChunkName: "customManager" */ '@/container/customManager');
const customList = () => import(/* webpackChunkName: "customManager" */ '@/container/customManager/customList');

Vue.use(Router);

const router = new Router({
  // 路由地址中不出现"#"
  mode: 'history',
  // 设置它的的滚动行为
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  routes: [
    // 默认跳转到home   
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/personal',
      name: 'personal',
      component: personal,
      // 多级路由redirect 重定向的问题
      redirect: to => {
        return { name: 'baseInfo' }
      },
      children: [
        {
          path: 'baseinfo',
          name: 'baseInfo',
          component: baseInfo,
          meta: {
            requireAuth: true
          },
        },
        {
          path: 'folkquery',
          name: 'folkQuery',
          component: folkQuery,
          // 将开启页面路由守卫
          meta: {
            requireAuth: true
          },
        },
        {
          path: 'creditmanage',
          name: 'creditManage',
          component: creditManage,
          meta: {
            requireAuth: true
          },
        },
        {
          path: 'financialmanage',
          name: 'financialManage',
          component: financialManage,
          meta: {
            requireAuth: true
          },
        },
        {
          path: 'blacklist',
          name: 'blackList',
          component: blackList,
          meta: {
            requireAuth: true
          },
        },
        {
          path: 'econtract',
          name: 'eContract',
          component: eContract,
          meta: {
            requireAuth: true
          },
        },
        {
          path: 'arbitration',
          name: 'arbitration',
          component: arbitration,
          meta: {
            requireAuth: true
          },
        },
        {
          path: 'bountymission',
          name: 'bountyMission',
          component: bountyMission,
          meta: {
            requireAuth: true
          },
        },
        {
          path: 'cooperationlist',
          name: 'cooperationList',
          component: cooperationList,
          meta: {
            requireAuth: true
          },
        },
        {
          path: 'communitycomment',
          name: 'communityComment',
          component: communityComment,
          meta: {
            requireAuth: true
          },
        },
      ]
    },
    {
      path: '/custommanager',
      name: 'customManager',
      component: customManager,
      meta: {
        requireAuth: true
      },
      redirect: to => {
        return { name: 'customList' }
      },
      children: [
        {
          path: 'customlist',
          name: 'customList',
          component: customList,
          meta: {
            requireAuth: true
          },
        }
      ]
    },
    {
      path: '/protocolpage',
      name: 'protocolPage',
      component: protocolPage,
      redirect: to => {
        return { name: 'personalProtocol' }
      },
      children: [
        {
          path: 'personalprotocol',
          name: 'personalProtocol',
          component: personalProtocol
        },
        {
          path: 'enterpriseprotocol',
          name: 'enterpriseProtocol',
          component: enterpriseProtocol
        }
      ]
    },
    {
      path: '*',
      name: 'notFound',
      component: notFound
    }
  ]
})

let firstFlag = true;

/* 路由拦截器 */
router.beforeEach((to, from, next) => {
  //  开始显示LoadingBar
  iView.LoadingBar.start();
  if (firstFlag) {   // 第一次进入获取用户信息
    firstFlag = false;
    // store.dispatch与store.commit相似
    // 调用vuex中的getMineInfo
    store.dispatch('getMineInfo').then(user => {
      next();   // 已登录
    }).catch(err => {
      if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        next({
          name: 'home',
          replace: true,
          // 返回到上级页面
          query: { redirect: to.fullPath },
        })
      } else {    // 不需要登录权限
        next();
      }
    });
  } else {
    if (!store.state.loginStatus) {   // 未登录的
      if (to.meta.requireAuth) {  // 需要登录权限
        next({
          name: 'home',
          replace: true,
          query: { redirect: to.fullPath },
        });
      } else {    // 不需要登录权限
        next();
      }
    } else {  // 已登录的
      next();
    }
  }
});

router.afterEach(route => {
  // 结束进度条，自动补全剩余进度
  iView.LoadingBar.finish();
});

export default router;
