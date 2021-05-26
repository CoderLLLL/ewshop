<!--  -->
<template>
    <div class="goods">
        <good-list-item></good-list-item>
        <good-list-item></good-list-item>
        <good-list-item></good-list-item>
        <good-list-item></good-list-item>
        <good-list-item></good-list-item>
        <good-list-item></good-list-item>
    </div>
</template>

<script>
    import GoodListItem from 'components/content/good/GoodListItem'

    export default {
        name:'GoodList',
        data () {
            return {
            }
        },
        methods:{},
        components:{
            GoodListItem
        },
    }
</script>

<style  scoped>
    .goods{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding:5px;
    }
</style>
