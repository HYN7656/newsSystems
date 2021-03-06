import Vue from 'vue';
import Router from 'vue-router';
// 网页
import Login from '@/views/login/index';
// 后台
import Backstage from '@/views/backstage/app';
import BackstageIndex from '@/views/backstage/children/index/list';
import BackstageNews from '@/views/backstage/children/news/list';
import BackstageNewsDetai from '@/views/backstage/children/news/details';
import BackstageNotice from '@/views/backstage/children/notice/list';
import BackstageNoticeDetail from '@/views/backstage/children/notice/details';
import BackstageMeeting from '@/views/backstage/children/meeting/list';
import BackstageMeetingDetail from '@/views/backstage/children/meeting/details';

// 空域规划
import BackstagePlan from '@/views/backstage/children/plan/list';
import BackstagePlanDetail from '@/views/backstage/children/plan/details';
// 空域管理
import BackstageManage from '@/views/backstage/children/manage/list';
import BackstageManageDetail from '@/views/backstage/children/manage/details';
// 程序设计
import BackstageDesign from '@/views/backstage/children/design/list';
import BackstageDesignDetail from '@/views/backstage/children/design/details';
// 节能减排
import BackstageEnergy from '@/views/backstage/children/energy/list';
import BackstageEnergyDetail from '@/views/backstage/children/energy/details';

import BackstageUser from '@/views/backstage/children/user/list';
import BackstageClassify from '@/views/backstage/children/classify/list';
Vue.use(Router);

export default new Router({
  // mode: 'history',
  mode: 'hash',
  base: '/yiTownWebApp/',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        auth: true
      }
    },
    {
      path: '/',
      name: 'home',
      component: Backstage,
      redirect: '/index',
      meta: {
        auth: true,
        hideLeft:true
      },
      children:[
        {
          path: 'index',
          name: 'backstage.index',
          component: BackstageIndex,
          meta: {
            auth: true
          }
        },
        {
          path: 'news',
          name: 'backstage.news',
          component: BackstageNews,
          meta: {
            auth: true
          }
        },
        {
          path:'news/detail',
          name:'backstage.news.detail',
          component:BackstageNewsDetai,
          meta: {
            auth: true,
            title:"详情"
          }
        },
        {
          path: 'notice',
          name: 'backstage.notice',
          component: BackstageNotice,
          meta: {
            auth: true
          }
        },
        {
          path: 'notice/detail',
          name: 'backstage.notice.detail',
          component: BackstageNoticeDetail,
          meta: {
            auth: true
          }
        },
        {
          path: 'meeting',
          name: 'backstage.meeting',
          component: BackstageMeeting,
          meta: {
            auth: true,
          }
        },
        {
          path: 'meeting/detail',
          name: 'backstage.meeting.detail',
          component: BackstageMeetingDetail,
          meta: {
            auth: true,
          }
        },
        {
          path: 'plan',
          name: 'backstage.plan',
          component: BackstagePlan,
          meta: {
            auth: true,
          }
        },
        {
          path: 'plan/detail',
          name: 'backstage.plan.detail',
          component: BackstagePlanDetail,
          meta: {
            auth: true,
          }
        },
        {
          path: 'manage',
          name: 'backstage.manage',
          component: BackstageManage,
          meta: {
            auth: true,
          }
        },
        {
          path: 'manage/detail',
          name: 'backstage.manage.detail',
          component: BackstageManageDetail,
          meta: {
            auth: true,
          }
        },
        {
          path: 'design',
          name: 'backstage.design',
          component: BackstageDesign,
          meta: {
            auth: true,
          }
        },
        {
          path: 'design/detail',
          name: 'backstage.design.detail',
          component: BackstageDesignDetail,
          meta: {
            auth: true,
          }
        },
        {
          path: 'energy',
          name: 'backstage.energy',
          component: BackstageEnergy,
          meta: {
            auth: true,
          }
        },
        {
          path: 'energy/detail',
          name: 'backstage.energy.detail',
          component: BackstageEnergyDetail,
          meta: {
            auth: true,
          }
        },
        {
          path: 'user',
          name: 'backstage.user',
          component: BackstageUser,
          meta: {
            auth: true,
          }
        },
        {
          path: 'classify',
          name: 'backstage.classify',
          component: BackstageClassify,
          meta: {
            auth: true,
          }
        }
      ]
    },
  ]
});
