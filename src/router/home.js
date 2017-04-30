import Vue from 'vue'
import Router from 'vue-router'
import global_ from '../components/tool/global'

//
// // 首页
// import Home from '../components/home/index'
//
// // 招募信息
// import Posts from '../components/posts/posts'
// import Side from '../components/posts/side'
// import Step from '../components/posts/step'
// import Type from '../components/posts/type'
//
// // 用户模块
// import User from '../components/user/user'
// import Login from '../components/user/login'
// import Register from '../components/user/register'
// import ResetPassword from '../components/user/resetpassword'
// import My from '../components/user/my'
// import MySendList from '../components/user/mysendlist'
// import MyHistory from '../components/user/myhistory'
// import MyFeesWater from '../components/user/myfeeswater'
// import MyRecharge from '../components/user/myrecharge'


// 首页
const Home = r => require.ensure([], () => r(require('../components/home/index')), 'part_index');

// 招募信息
import Posts from '../components/posts/posts'
const Side = r => require.ensure([], () => r(require('../components/posts/side')), 'part_side');
const Step = r => require.ensure([], () => r(require('../components/posts/step')), 'part_step');
const Type = r => require.ensure([], () => r(require('../components/posts/type')), 'part_type');


// 用户模块
import User from '../components/user/user'
const Login = r => require.ensure([], () => r(require('../components/user/login')), 'part_login');
const Register = r => require.ensure([], () => r(require('../components/user/register')), 'part_login');
const ResetPassword = r => require.ensure([], () => r(require('../components/user/resetpassword')), 'part_login');
const My = r => require.ensure([], () => r(require('../components/user/my')), 'part_my');
const MySendList = r => require.ensure([], () => r(require('../components/user/mysendlist')), 'part_users');
const MyHistory = r => require.ensure([], () => r(require('../components/user/myhistory')), 'part_users');
const MyFeesWater = r => require.ensure([], () => r(require('../components/user/myfeeswater')), 'part_users');
const MyRecharge = r => require.ensure([], () => r(require('../components/user/myrecharge')), 'part_users');

// 404
import NotFoundComponent from '../components/common/404'

Vue.use(Router);

let router = new Router({
	mode: 'history',
	// base: '/new/home/',
	routes: [{
		path: '/',
		component: Home
	}, {
		path: '/p',
		component: Posts,
		children: [{
			path: 'side',
			component: Side
		}, {
			path: 'step',
			component: Step
		}, {
			path: 'type',
			component: Type
		}]
	}, {
		path: '/u',
		component: User,
		children: [{
			// 登录
			path: 'login',
			component: Login,
			meta: { userMustLogout: true }
		}, {
			// 注册
			path: 'register',
			component: Register,
			meta: { userMustLogout: true }
		}, {
			// 找回密码
			path: 'resetPassword',
			component: ResetPassword,
			meta: { userMustLogout: true }
		}, {
			// 我的
			path: 'my',
			component: My
		}, {
			// 我发布的
			path: 'mysendlist',
			component: MySendList,
			meta: { userMustLogin: true }
		}, {
			// 我看过的
			path: 'myhistory',
			component: MyHistory,
			meta: { userMustLogin: true }
		}, {
			// 我的消费记录
			path: 'myfeeswater',
			component: MyFeesWater,
			meta: { userMustLogin: true }
		}, {
			// 充值
			path: 'myrecharge',
			component: MyRecharge,
			meta: { userMustLogin: true }
		}]
	}, {
		path: '*',
		component: NotFoundComponent
	}]
});

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.userMustLogout)) {
		console.info("to.matched ~ userMustLogout");
		// 需要登录出才能访问
		if (global_.user) {
			console.info("〓〓〓 已登录用户，无法访问该页面，跳至个人中心！");
			next({ path: '/u/my' })
		} else {
			next()
		}
	} else if(to.matched.some(record => record.meta.userMustLogin)) {
		console.info("to.matched ~ userMustLogin");
		if (global_.user) {
			next()
		} else {
			console.info("〓〓〓 未登录，无法访问该页面，跳至个人中心！");
			next({ path: '/u/my' })
		}
	} else {
		next()
	}
});

export default router;




