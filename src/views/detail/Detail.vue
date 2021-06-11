<!--  -->
<template>
    <div>
        <NavBar>
            <template v-slot:default>商品详情</template>
        </NavBar>
        
        <van-image style="margin-top:50px"
            width="100%"
            lazy-laod
            :src="detail.cover_url"
        />

        <van-card style="text-align:left"
            :num="detail.stock"
            :price="detail.price+'.00'"
            :desc="detail.description"
            :title="detail.title"
        >
            <template #tags>
                <van-tag plain type="danger">新书</van-tag>
                <van-tag plain type="danger">推荐</van-tag>
            </template>
            <template #footer>
                <van-button type="warning" @click="handleAddCart">加入购物车</van-button>
                <van-button type="danger" @click="goToCart">立即购买</van-button>
            </template>
        </van-card>

        <van-tabs v-model="active">
            <van-tab title="概述">
                <div class="content" v-html="detail.details"></div>
            </van-tab>
            <van-tab title="热评">内容 2</van-tab>
            <van-tab title="相关图书">
                <good-list :goods="like_goods"></good-list>
            </van-tab>
        </van-tabs>

    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import GoodList from 'components/content/good/GoodList'
    import { useRoute } from 'vue-router'
    import { useStore } from 'vuex'
    import { Toast } from 'vant'

    import { getDetail } from 'network/detail'
    import { addCart } from 'network/cart'

    import { ref,toRefs,onMounted,reactive } from 'vue'

    export default {
        name:'Detail',
        setup(){
            const route = useRoute();
            const store = useStore();

            let id = ref(0)
            let active = ref(0)
            let book  = reactive({
                detail:{},
                like_goods:[],
                comments:[],
            })

            onMounted(()=>{
                id.value = route.query.id

                getDetail(id.value).then(res=>{
                    book.detail = res.goods;
                    book.like_goods = res.like_goods;
                    console.log(book.like_goods);
                }).catch(err=>{}) 
            })

            //添加购物车
            const handleAddCart = () =>{
                addCart({
                    goods_id:book.detail.id,
                    num:1,
                }).then(res=>{
                    if(res.status == '204' || res.status == '201'){
                        Toast.success('添加成功');
                        store.dispatch('updateCart');
                    }
                }).catch(err=>{})
            };


            //购买
            const goToCart = () =>{
                addCart({
                    goods_id:book.detail.id,
                    num:1,
                }).then(res=>{
                    store.dispatch('updateCart');
                    Toast.success('添加成功，显示购物车');

                    router.push({path:'/shopcart'});
                }).catch(err=>{})
            };

            return {id,...toRefs(book),active,handleAddCart,goToCart}
        },
        components:{
            NavBar,
            GoodList,
        },
    }
</script>

<style  scoped>
    .van-image{
        width: 100% !important;
    }
    .content{
        padding: 10px;
    }
    .content img{
        max-width: 100%;
        height: auto;
    }
</style>
