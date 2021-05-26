import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import('../views/home/Home') 
const Categroy = () => import('../views/category/Categroy') 
const Detail = () => import('../views/detail/Detail')
const Shopcart = () => import('../views/shopcart/ShopCart') 
const Profile = () => import('../views/profile/Profile') 

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
    }
  },
  {
    path:'/profile',
    name:'profile',
    component:Profile,
    meta:{
      title:'图书兄弟-个人中心',
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next)=>{
  document.title = to.meta.title;
  next();
})

export default router
