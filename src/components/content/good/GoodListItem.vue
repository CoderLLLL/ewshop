<!--  -->
<template>
    <div class="goods-item">
        <img src="~assets/images/11.png" alt="">
        <div class="goods-info">
            <p>标题</p>
            <span class="price"><small>￥</small>100</span>
            <span class="collect">3</span>
        </div>
    </div>
</template>

<script>
    export default {
        name:'GoodListItem',
        
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
        background-image: url('');
    }
</style>
