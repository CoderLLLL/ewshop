<!--  -->
<template>
    <div>
        <NavBar>
            <template v-slot:left>
                <img src="~assets/images/left.png" alt="">
            </template>
            <template v-slot:default>图书商城</template>
        </NavBar>   

        <div class="banners">
            <img src="~assets/images/1.png" alt="">
        </div>

        <RecommendView :recommends="recommends"></RecommendView>
        <tab-control :titles="['畅销','新书','精选']" @tabClick="tabClick"></tab-control>

        <good-list></good-list>
        
        {{temid}}
        <p v-for="item in 100" :key="item">{{item}}</p>
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import RecommendView from 'views/home/ChildComps/RecommendView'

    import TabControl from 'components/content/tabcontrol/TabControl'
    import GoodList from 'components/content/good/GoodList'

    import { getHomeAllData,getHomeGoodList } from 'network/home'
    import{ onMounted,ref,reactive,toRefs } from 'vue'

    export default {
        name:'',
        setup(){
            let temid = ref(0);

            const recommends = ref([]);
            const goods = reactive({});

            onMounted(()=>{
                getHomeAllData().then(res=>{
                    //console.log(res.goods);
                    recommends.value = res.goods.data
                }).catch(err=>{

                })

                getHomeGoodList().then(res=>{
                    goods = res;
                    console.log(goods);
                }).catch(err=>{

                })
            })
            const tabClick = (index) =>{
                temid.value = index
            }


            return { recommends,temid,tabClick }
        },  
        components:{
            NavBar,
            RecommendView,
            TabControl,
            GoodList
        },
    }
</script>

<style  scoped>
    .left img{
        width: 45px;
        padding: 12px;
    }
    .banners img{
        width: 100%;
        height: auto;
        margin-top: 45px;
    }
    
</style>
