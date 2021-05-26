<!--  -->
<template>
    <div>
        <NavBar>
            <template v-slot:default>购物车</template>
        </NavBar>

        <h1>购物车</h1>
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'

    export default {
        name:'',
        data () {
            return {
            }
        },
        methods:{},
        components:{
            NavBar
        },
    }
</script>

<style  scoped>

</style>
