import Vue from 'vue'
import App from './app/Home'
import VueResource from 'vue-resource';
Vue.use(VueResource);

// 引入zepto
import $ from 'n-zepto'

// 引入mint-ui通用组件
import { MessageBox, Toast, Indicator } from 'mint-ui';
var myMessageBox = MessageBox;
var myToast = Toast;
var myIndicator = Indicator;
Vue.prototype.MessageBox = myMessageBox;
Vue.prototype.Toast = myToast;
Vue.prototype.Indicator = myIndicator;

// 引入mint-ui组件
import { Swipe, SwipeItem, Popup, Loadmore, Spinner, InfiniteScroll  } from 'mint-ui';

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Popup.name, Popup);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Spinner.name, Spinner);
Vue.use(InfiniteScroll);

// 引入依赖css
import './static/css/base.css'
import './static/css/home.css'
import './static/css/myindex.css'
import './static/css/user.css'

// 引入util函数
import './static/script/util'

// 引入全局变量
import global_ from './components/tool/global'
Vue.prototype.$global = global_;

// 引入前端配置文件
import config_ from './components/tool/config.json';
Vue.prototype.$config = config_;

// router
import router from './router/home'

new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
});