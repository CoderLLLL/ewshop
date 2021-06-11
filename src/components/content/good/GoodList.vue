<!--  -->
<template>
    <div class="goods">
        <good-list-item v-for="item in goods" :product="item" :key="item.id"></good-list-item>

    </div>
</template>

<script>
    import GoodListItem from 'components/content/good/GoodListItem'

    import { onMounted } from 'vue'

    export default {
        name:'GoodList',
        props:{
            goods:{
                type:Array,
                default(){
                    return []
                }
            }
        },
        methods:{
            
        },
        components:{
            GoodListItem
        },
        mounted(){
               
        }
    }
</script>

<style  scoped>
    .goods{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding:5px;
        z-index: 2;
    }
</style>
