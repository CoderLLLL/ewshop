<!--  -->
<template>
    <div class="tab-control">
        <div v-for="(item,index) in titles" :key="index" class="tab-control-item" :class="{active:currentindex === index}" @click="itemClick(index)">
            <span>{{item}}</span>
        </div>
    </div>
</template>

<script>
    import {ref} from 'vue'
        
    export default {
        name:'TabControl',
        props:{
           titles:{
               type:Array,
               default(){
                   return []
               }
           }
        },
        setup(props,{emit}){
            let currentindex = ref(0);

            const itemClick = (index) =>{
                currentindex.value = index
                emit('tabClick',index);
            }

            return {currentindex,itemClick}
        },
        components:{},
    }
</script>

<style  scoped>
    .tab-control{
        display: flex;
        height: 40px;
        line-height: 40px;
        text-align: center;
        position: sticky;
        top:44px;
        background-color: white;
    }
    .tab-control-item{
        flex: 1;
    }
    .tab-control-item span{
        padding: 6px;
    }
    .active{
        color: var(--color-tint)
    }
    .active span {
        border-bottom:3px solid var(--color-tint)
    }
</style>
