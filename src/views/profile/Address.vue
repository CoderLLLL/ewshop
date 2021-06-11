<!--  -->
<template>
    <div class="address-box">
        <nav-bar class="nav-bar">
            <template v-slot:default>
                地址管理
            </template>
        </nav-bar>

        <div v-show="list.length == 0" style="margin-top:200px;text-align: center;">
            还没有地址信息，快去添加吧!
        </div>

        <div class="address-item">
            <van-address-list 
            v-model="chosenAddressId"
            :list="list"
            default-tag-text="默认"
            @add="onAdd"
            @edit="onEdit"
            />
        </div>
    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";

    import { reactive,toRefs,onMounted } from 'vue'
    import{ getAddressList} from 'network/address'
    import { useRouter,useRoute } from 'vue-router'
    import { Toast } from 'vant'



    export default {
        name:'Address',
        setup(){
            const router = useRouter()
            const route = useRoute()

            const state = reactive({
                chosenAddressId:'1',
                list:[],
            })

           onMounted(()=>{
            Toast.loading('加载中');

            getAddressList().then(res=>{
                if(res.data.length == 0){
                    state.list = [];
                }
                else{
                    state.list = res.data.map(item=>{
                        return {
                            id:item.id,
                            name:item.name,
                            tel:item.phone,
                            address:`${item.province} ${item.city} ${item.county} ${item.address}`,
                            isDefault: !!item.is_default,
                        }
                    })
                    
                    setTimeout(()=>{
                        Toast.clear();
                    },100)
                }
            }).catch(err=>{})
           });

            const onAdd = () =>{
                router.push({
                    path:'/addressedit',
                    query:{
                        type:'add'
                    }
                })
            }

            const onEdit = (item) =>{
                router.push({
                    path:'/addressedit',
                    query:{
                        type:'edit',
                        addressId:item.id
                    }
                })
            }

            return {...toRefs(state),onAdd,onEdit}
        },
        components:{
            NavBar
        },
    }
</script>

<style>
    .address-box{
        height: 300px;
    }
    .van-radio__icon{
        display: none;
    }
    .address-item{
        margin-top: 45px;
    }
    /* .van-button__content{
        background: var(--color-tint);
        border-color: var(--color-tint);
    } */
    .van-address-list__bottom{
        bottom: 100px !important;
        background-color: rgba(255, 255, 255, 0) !important;
    }
    .van-address-list__bottom button{
        background: var(--color-tint);
        border-color: var(--color-tint);
        
    }
</style>
