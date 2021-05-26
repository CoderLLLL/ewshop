<!--  -->
<template>
    <div class="nav-bar">
        <div class="left" @click="goback"><slot name="left"></slot></div>
        <div class="center"><slot>EWShop</slot></div>
        <div class="right"><slot name="right"></slot></div>
    </div>
</template>

<script>
    import {useRouter} from 'vue-router'

    export default {
        name:'NavBar',
        setup(){
            const router = useRouter();

            const goback = () =>{
                router.go(-1)
            }

            return {goback}
        },
        components:{},
    }
</script>

<style  scoped>
    .nav-bar{
        display: flex;
        background-color: var(--color-tint);
        color: white;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 9;
        height: 45px;
        line-height: 45px;
        text-align: center;
        box-shadow: 0 2px 0 rgba(100, 100, 100, .1);
    }
    .left,.right{
        width:60px;
    }
    
    .nav-bar .center{
        flex: 1;
    }
    
</style>
