<!--  -->
<template>
    <div>
        <NavBar>
            <template v-slot:default>商品详情</template>
        </NavBar>
        
        <h1>分类页面</h1>
        <h1>{{id}}</h1>

    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import { useRoute } from 'vue-router'
    import {ref} from 'vue'

    export default {
        name:'Detail',
        setup(){
            const route = useRoute();
            let id = ref(0)
            id.value = route.query.id

            return {id}
        },
        components:{
            NavBar
        },
    }
</script>

<style  scoped>

</style>
