<!--  -->
<template>
    <div class="goods-item"  @click="itemClick">
        <img v-lazy="product.cover_url" alt=""> 
        <div class="goods-info">
            <p>{{product.description ? product.description : product.title}}</p>
            <span class="price"><small>￥</small>{{product.price}}</span>
            <span class="collect">{{product.sales}}</span>
        </div>
    </div>
</template>

<script>
    import {useRouter} from 'vue-router'

    export default {
        name:'GoodListItem',
        props:{
            product:{
                type:Object,
                default(){
                    return {}
                }
            }
        },
        setup(props){
            const router = useRouter();

            const itemClick = () =>{
                router.push({
                    path:'/detail',
                    query:{
                        id:props.product.id
                    },
                })
            }

            return{
                itemClick
            }
        },
        components:{},
    }
</script>

<style  scoped>
    .goods-item{
        width: 46%;
        padding-bottom: 40px;
        position: relative;
        
    }   
    .goods-item img{
        width: 100%;
        border-radius: 5px;

    }
    .goods-info{
        font-size: 12px;
        position: absolute;
        bottom: 5px;
        left: 0;
        right: 0;
        overflow: hidden;
        text-align: center;
    }
    .goods-info p{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 3px;
    }
    .goods-info .price{
        color: red;
        margin-right: 20px;
        
    }
    .goods-info .collect{
        position: relative;
    }
    .collect::before{
        content: '';
        position: absolute;
        left: -15px;
        width: 14px;
        height: 14px;
        top: -1px;
        background: url('~assets/images/collect.png') 0 0 /14px 14px;
    }
</style>
