<!--  -->
<template>
    <div class="recommend">
        <div class="recommend-item" v-for="item in recommends.slice(0,4)" :key="item.id">
            <a @click.prevnet="goD(item.id)">
                <img :src="item.cover_url" alt="">
                <div>{{item.title}}</div>
            </a>
        </div>
    </div>
</template>

<script>
    import { useRouter } from 'vue-router'

    export default {
        name:'RecommendView',
        props:{
            recommends:{
                type:Array,
                default(){
                    return []
                }
            }
        },
        setup(){
            const router = useRouter();

            const goD = (id) =>{
                router.push({
                    path:'/Detail',
                    query:{
                        id:id,
                    }
                })
            }

            return {goD}
        },
        components:{},
    }
</script>

<style  scoped>
    .recommend{
        width: 100%;
        display: flex;
        text-align: center;
        padding: 15px 0 30px;
        border-bottom: 8px solid #eee;
        font-size: 12px;
    }
    .recommend-item{
        flex: 1;
    }
    .recommend-item img{
        width: 70px;
        height:70px;
        margin-bottom: 10px;
    }
</style>
