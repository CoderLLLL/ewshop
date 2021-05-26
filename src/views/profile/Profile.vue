<!--  -->
<template>
    <div>
        <NavBar>
            <template v-slot:default>个人中心</template>
        </NavBar>

        <h1>个人页面</h1>
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
