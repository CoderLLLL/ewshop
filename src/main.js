import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Grid,GridItem,ContactCard,Popup,AddressEdit,AddressList,Icon,SubmitBar,CheckboxGroup,SwipeCell,Stepper,Checkbox,Field,Form,Card,Tab, Tabs,Swipe, SwipeItem, Lazyload,Badge,Sidebar,SidebarItem,Collapse, CollapseItem,Image as VanImage,Tag,Button } from 'vant';

//如果网页刷新，重新获取购物车数量获取购物车数量
store.dispatch('updateCart');

createApp(App)
.use(Swipe).use(SwipeItem).use(Lazyload,{
    loading:require('./assets/images/default.png')
}).use(Badge).use(Sidebar).use(SidebarItem).use(Collapse).use(CollapseItem).use(Tab)
.use(Tabs).use(Card).use(VanImage).use(Tag).use(Button).use(Form).use(Field).use(Checkbox)
.use(Stepper).use(SwipeCell).use(CheckboxGroup).use(SubmitBar).use(Icon).use(AddressList)
.use(AddressEdit).use(Popup).use(ContactCard).use(GridItem).use(Grid)
.use(store).use(router).mount('#app')
