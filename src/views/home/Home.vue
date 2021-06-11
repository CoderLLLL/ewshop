<!--  -->
<template>
    <div id="home">
        <NavBar>
            <template v-slot:left>
                <img src="~assets/images/left.png" alt="">
            </template>
            <template v-slot:default>图书商城</template>
        </NavBar>   

        <tab-control ref="tabC1" v-show="isTabFixed" :titles="['畅销','新书','精选']" @tabClick="tabClick"></tab-control>

        <div class="wrapper">
           <div class="content">
                <div ref="banref">
                    <home-swiper :banners="banners"></home-swiper>
                    <RecommendView :recommends="recommends"></RecommendView>
                </div>
                <tab-control ref="tabC2" :titles="['畅销','新书','精选']" @tabClick="tabClick"></tab-control>
                <good-list :goods="ShowGoods"></good-list>
           </div>
        </div>
        <back-top @bTop="bTop" v-show="isShowBackTop"></back-top>
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import BackTop from 'components/common/backtop/BackTop'

    import RecommendView from 'views/home/ChildComps/RecommendView'
    import HomeSwiper from 'views/home/ChildComps/HomeSwiper'

    import TabControl from 'components/content/tabcontrol/TabControl'
    import GoodList from 'components/content/good/GoodList'

    import { getHomeAllData,getHomeGoods } from 'network/home'
    import{ onMounted,ref,reactive,toRefs,computed,watchEffect,nextTick } from 'vue'
    import { Toast } from 'vant'

    import BScroll from 'better-scroll'

    export default {
        name:'',
        setup(){
            let currentType = ref('sales')
            let bscroll = reactive({});
            let isTabFixed = ref(false);
            let isShowBackTop = ref(false);
            let banref = ref(null);
            let banners = ref([]);
            let tabC1 = ref(null);
            let tabC2 = ref(null);

            const recommends = ref([]);
            const goods = reactive({
                sales:{page:1,list:[]},
                recommends:{page:1,list:[]},
                new:{page:1,list:[]},
            });
            const ShowGoods = computed(()=>{
                return goods[currentType.value].list;
            })

            onMounted(()=>{
                Toast.loading("加载中")

                getHomeAllData().then(res=>{
                    recommends.value = res.goods.data
                    banners.value = res.slides
                }).catch(err=>{

                })
                
                getHomeGoods('sales').then(res=>{
                    goods.sales.list = res.goods.data;
                }).catch(err=>{

                })

                getHomeGoods('recommend').then(res=>{
                    goods.recommends.list = res.goods.data;
                }).catch(err=>{

                })

                getHomeGoods('new').then(res=>{
                    goods.new.list = res.goods.data;
                }).catch(err=>{

                })

                //创建BScroll
                bscroll = new BScroll(document.querySelector('.wrapper'),{
                    probeType: 3,   //0,1,2,3  3只要在滚动，就会触发scroll事件
                    click: true, //是否允许点击
                    pullUpLoad: true,  //上拉加载,默认false
                })

                //触发滚动事件
                bscroll.on('scroll',(position)=>{
                    isShowBackTop.value= isTabFixed.value = (-position.y) > banref.value.offsetHeight;
                })

                //上拉加载数据
                bscroll.on('pullingUp',()=>{
                    console.log('上拉加载更多');
                    bscroll.refresh();

                    const page = goods[currentType.value].page + 1;

                    getHomeGoods(currentType.value,page).then(res=>{
                        goods[currentType.value].list.push(...res.goods.data);
                        goods[currentType.value].page += 1;
                    }).catch(err=>{});

                    //完成上拉，等数据请求完成，要将新数据展示出来
                    bscroll.finishPullUp();

                    //console.log('当前类型'+currentType.value+'当前页'+page);

                    //console.log(banref.value);
                })

                watchEffect(()=>{
                    nextTick(()=>{
                        bscroll && bscroll.refresh();   
                        console.log("重新计算高度");
                    })
                })

                Toast.clear();
            })

            const tabClick = (index) =>{
                let type = ['sales','new','recommends'];
                currentType.value = type[index]

                tabC1.value.currentindex = index;
                tabC2.value.currentindex = index;

                nextTick(()=>{
                    bscroll && bscroll.refresh();   
                    console.log("重新计算高度");
                })
            }

            const bTop = () =>{
                bscroll.scrollTo(0,0,500)
            }

            return { recommends,tabClick,goods,ShowGoods,isTabFixed,banref,isShowBackTop,bTop,banners,tabC1,tabC2}
        },  

        components:{
            NavBar,
            RecommendView,
            TabControl,
            GoodList,
            BackTop,
            HomeSwiper
        },
    }
</script>

<style  scoped>
    .left img{
        width: 45px;
        padding: 12px;
    }
    /* .banners img{
        width: 100%;
        height: auto;
        /* margin-top: 45px; 
    } */
    #home{
        height: 100vh;
        position: relative;
    }
    .wrapper{
        position: absolute;
        top:45px;
        bottom: 50px;
        left: 0;
        right: 0;
        overflow: hidden;
    }
</style>
