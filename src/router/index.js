import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const Home = () => import('../views/home/Home') 
const Categroy = () => import('../views/category/Categroy') 
const Detail = () => import('../views/detail/Detail')
const Shopcart = () => import('../views/shopcart/ShopCart') 
const Profile = () => import('../views/profile/Profile') 
const Register = () => import('../views/profile/Register')
const Login = () => import('../views/profile/Login')
const Address = () => import('../views/profile/Address')
const AddressEdits = () => import('../views/profile/AddressEdit')
const CreateOrder = () => import('../views/order/CreateOrder')
const OrderDetail = () => import('../views/order/OrderDetail')

import { AddressEdit, Notify,Toast } from 'vant';

const routes = [
  {
    path: '',
    name: 'DefaultHome',
    component: Home,
    meta:{
      title:'图书兄弟',
    }
  },
  {
    path:'/home',
    name:'home',
    component:Home,
    meta:{
      title:'图书兄弟',
    }
  },
  {
    path:'/categroy',
    name:'categroy',
    component:Categroy,
    meta:{
      title:'图书兄弟-商品分类',
    }
  },
  {
    path:'/detail',
    name:'detail',
    component:Detail,
    meta:{
      title:'图书兄弟-商品详情',
    }
  },
  {
    path:'/shopcart',
    name:'shopcart',
    component:Shopcart,
    meta:{
      title:'图书兄弟-购物车',
      isAuthRequired:true,
    }
  },
  {
    path:'/profile',
    name:'profile',
    component:Profile,
    meta:{
      title:'图书兄弟-购物车',
    }
  },
  {
    path:'/register',
    name:'register',
    component:Register, //  window.localStorage.getItem('token') ? Register : Login
    meta:{
      title:'图书兄弟-个人中心',
      isAuthRequired:true,
    }
  },
  {
    path:'/login',
    name:'login',
    component:Login,
    meta:{
      title:'图书兄弟-登录',
    }
  },
  {
    path:'/address',
    name:'address',
    component:Address,
    meta:{
      title:'图书兄弟-地址管理',
      isAuthRequired:true,
    }
  },
  {
    path:'/addressedit',
    name:'addressedit',
    component:AddressEdits,
    meta:{
      title:'图书兄弟-地址编辑',
      isAuthRequired:true,
    }
  },
  {
    path:'/createorder',
    name:'createorder',
    component:CreateOrder,
    meta:{
      title:'图书兄弟-支付页面'
    }
  },
  {
    path:'/orderdetail',
    name:'orderdetail',
    component:OrderDetail,
    meta:{
      title:'图书兄弟-订单状态'
    }
  } 
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next)=>{
  //判断需要授权登录和检查账号状态
  if(to.meta.isAuthRequired && store.state.user.isLogin === false ){
    Notify('您还没有登录，请先登录')
    return next('/login');
  }
  else{
    next();
  }

  document.title = to.meta.title;
})

export default router
