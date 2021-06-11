<!--  -->
<template>
    <NavBar>
        <template v-slot:left>
            <img src="~assets/images/left.png" alt="">
        </template>
        <template v-slot:default>商品分类</template>
    </NavBar>   


    <div id="mainbox">
        <div class="ordertab">
            <!-- <van-tabs v-model="active">
                <van-tab title="销量排序"></van-tab>
                <van-tab title="价格排序"></van-tab>
                <van-tab title="评论排序"></van-tab>
            </van-tabs> -->
            <van-tabs v-model="active"  @click="tabClick">
                <van-tab v-for="(item,index) in actives" :key="index" :title="item"></van-tab>
            </van-tabs>
        </div>

        <van-sidebar v-model="activeKey" class="leftmenu">
            <van-collapse v-model="activeName" accordion>
                <van-collapse-item v-for="item in categories" :title="item.name" :key="item.id" :name="item.name">
                        <van-sidebar-item v-for="sub in item.children" :title="sub.name" :key="sub.id" @click="getGoods(sub.id)" />
                </van-collapse-item>
            </van-collapse>
        </van-sidebar>  

        <div class="goodslist">
            <div class="content">
                <van-card
                    v-for="item in showGoods" :key="item.id"
                    @click="itemClick(item.id)"
                    :num="item.comments_count"
                    :tag="item.comments_count >=0 ? '流行' : '新品'"
                    :price="item.price"
                    :desc="item.updated_at"
                    :title="item.title"
                    :thumb="item.cover_url"
                    :lazy-load="true"
                />
            </div>
        </div>

        <back-top @bTop="bTop" v-show="isShowBackTop"></back-top>
    </div>
</template>

<script>
    import {ref,reactive,onMounted,computed,watchEffect,nextTick} from 'vue'
    import {useRouter} from 'vue-router'
    import { Toast } from 'vant';
    import BScroll from 'better-scroll'

    import NavBar from 'components/common/navbar/NavBar'
    import BackTop from 'components/common/backtop/BackTop'

    import {getCategory,getCategoryGoods} from 'network/categroy'

    export default {
        name:'',
        setup(){
            let activeKey = ref(0)
            let activeName = ref(1)
            let categories = ref([])  
            let active = ref(0)
            let bscroll = reactive({});
            let isShowBackTop = ref(false);
            //当前的排序条件
            let currentOrder = ref('sales');
            //id分类
            let currentCid = ref(0);

            //数据模型
            const actives = ["销量排序","价格排序","评论排序"];
            const router = useRouter();
            const goods = reactive({
                sales:{page:1,list:[]},
                price:{page:1,list:[]},
                comments_count:{page:1,list:[]}
            })
 
            const showGoods = computed(()=>{
                return goods[currentOrder.value].list
            })

            const init = () =>{
                getCategoryGoods('sales',currentCid.value).then(res=>{
                    goods.sales.list = res.goods.data
                }).catch(err=>{})

                getCategoryGoods('price',currentCid.value).then(res=>{
                    goods.price.list = res.goods.data
                }).catch(err=>{})

                getCategoryGoods('comments_count',currentCid.value).then(res=>{
                    goods.comments_count.list = res.goods.data
                }).catch(err=>{})
            }

            onMounted(()=>{
                Toast.loading("加载中")

                getCategoryGoods('sales',currentCid.value).then(res=>{
                    goods.sales.list = res.goods.data
                }).catch(err=>{})

                getCategory().then(res=>{
                    let data = [];
                    let i = 0;
                    //categories.value = res.categories;
                    
                    while(i < 5){
                        data[i] = res.categories[i];
                        i++;
                    }
                    categories.value = Object.assign({},data);
                    console.log(categories.value);
                }).catch(err=>{})

                bscroll = new BScroll(document.querySelector('.goodslist'),{
                    probeType: 3,   //0,1,2,3  3只要在滚动，就会触发scroll事件
                    click: true, //是否允许点击
                    pullUpLoad: true,  //上拉加载,默认false
                })

                //触发滚动事件
                bscroll.on('scroll',(position)=>{
                   isShowBackTop.value =  (-position.y) > 300 
                })
                
                //上拉加载数据
                bscroll.on('pullingUp',()=>{
                    console.log('上拉加载更多');

                    const page = goods[currentOrder.value].page + 1;
                    getCategoryGoods(currentOrder.value,currentCid.value,page).then(res=>{
                        goods[currentOrder.value].list.push(...res.goods.data)
                        goods[currentOrder.value].page +=1;
                    }).catch(err=>{})

                    //完成上拉，等数据请求完成，要将新数据展示出来
                    bscroll.finishPullUp();

                    nextTick(()=>{
                        bscroll && bscroll.refresh();   
                        console.log("重新计算高度");
                    })

                    console.log('当前类型'+currentOrder.value+'当前页'+page);
                })

                watchEffect(()=>{
                    nextTick(()=>{
                        bscroll && bscroll.refresh();   
                        console.log("重新计算高度");
                    })
                })

                Toast.clear()
            });

            const tabClick = (index) =>{
                Toast.loading("加载中")
                let orders = ['sales','price','comments_count'];
                currentOrder.value = orders[index]

                getCategoryGoods(currentOrder.value,currentCid.value).then(res=>{
                    goods[currentOrder.value].list = res.goods.data

                    nextTick(()=>{
                        bscroll && bscroll.refresh();   
                    }) 
                }).catch(err=>{})

                console.log("排序的序号："+orders[index]);
                console.log(currentCid.value);

                Toast.clear()
            }

            //通过分类得到商品
            const getGoods = (cid) =>{
                currentCid.value = cid;
                init();

                nextTick(()=>{
                    bscroll && bscroll.refresh();   
                })
            }

            const bTop = () =>{
                bscroll.scrollTo(0,0,500)
            }

            const itemClick = id =>{
                router.push({
                    path:'/detail',
                    query:{
                        id
                    },
                })
            }

            return {
                activeKey,actives,activeName,categories,active,tabClick,currentOrder
                ,currentCid,getGoods,goods,showGoods,bscroll,isShowBackTop,bTop,
                itemClick
            }
        },
        components:{
            NavBar,
            BackTop,
        },
    }
</script>

<style  scoped>

.left img{
    width: 45px;
    padding: 12px;
}
#mainbox{
    margin-top: 45px;
    display: flex;
}
#mainbox .ordertab{
    flex: 1;
    float: right;
    height: 50px;
    z-index: 9;
    position: fixed;
    top: 45px;
    right: 0;
    left: 130px;
}
#mainbox .leftmenu{
    position: fixed;
    top: 95px;
    left: 0;
    width: 130px;
    z-index: 10;
}
#mainbox .goodslist{
    flex: 1;
    position: absolute;
    top: 100px;
    left: 130px;
    right: 0;
    height: 100vh;
    padding: 10px;
    text-align: left !important;
}
</style>
