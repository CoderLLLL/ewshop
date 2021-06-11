<!--  -->
<template>
    <div>
        <nav-bar>
            <template v-slot:default>
                {{title}}
            </template>
        </nav-bar>
        <!-- :area-list="areaList" -->
        <van-address-edit
            class="edit"
            :area-list="areaList"
            :address-info="addressInfo"
            :show-delete="type === 'edit'"
            show-set-default
            show-search-result
            :search-result="searchResult"
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="onSave"
            @delete="onDelete"
        />
    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";

    import { tdist } from 'utils/address'

    import { reactive,ref,toRefs,onMounted,computed } from 'vue'
    import{ addAddress,DeleteAddress,getAddressDetail,EditAddress } from 'network/address'
    import { useRouter,useRoute } from 'vue-router'
    import { Toast } from 'vant'

    export default {
        name:'AddressEdit',
        setup(){
            const router = useRouter();
            const route = useRoute();

            const state = reactive({
                areaList:{
                    province_list:{},
                    city_list:{},
                    county_list:{}, 
                },
                searchResult: [],
                addressInfo: [],
                type:'add',
                addressId: '',
                title: '',
            })

            onMounted(()=>{ 
                Toast.loading('加载中');
                //省市区列表构造
                let _province_list = {};
                let _city_list = {};
                let _county_list = {};

                tdist.getLev1().forEach(e => {
                    _province_list[e.id] = e.text
                    tdist.getLev2(e.id).forEach(c=>{
                        _city_list[c.id] = c.text
                        tdist.getLev3(c.id).forEach(p=>{
                            _county_list[p.id] = p.text 
                        })
                    })
                });

                state.areaList.province_list = _province_list;
                state.areaList.city_list = _city_list;
                state.areaList.county_list = _county_list;    

                const {type,addressId} = route.query;

                state.type = type;
                state.addressId = addressId;

                if(state.type == 'edit'){
                    getAddressDetail(addressId).then(res=>{
                        const addressDetail = res;
                        console.log(addressDetail);
                        let _areaCode = '';
                        const province = tdist.getLev1()

                        //拿出所有的键值
                        Object.entries(state.areaList.county_list).forEach(([id,text]) => { 
                            //先找到对应的区/县
                            if(text == addressDetail.county){
                                
                                //找到对应的省份
                                const provinceIndex = province.findIndex(item => item.id.substr(0,2) == id.substr(0,2))

                                //找到对应的城市
                                const cityItem = Object.entries(state.areaList.city_list).filter(([cityid,city]) => cityid.substr(0,4) == id.substr(0,4))[0]
                                
                                // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
                                if(province[provinceIndex].text == addressDetail.province && cityItem[1] == addressDetail.city){
                                    _areaCode = id
                                } 
                            }
                        })
                        
                        state.addressInfo = {
                            name:res.name,
                            tel:res.phone,
                            province:res.province,
                            city:res.city,
                            county:res.county,  
                            areaCode:_areaCode,
                            addressDetail:res.address,
                            isDefault: !!res.is_default
                        }
                        Toast.clear();
                    }).catch(err=>{})
                }
                console.log(state.addressInfo); 
                
            })

            const title = computed(()=>{
                return state.type ==  'add' ? '新增地址' : '编辑地址'
            })

            const onSave = (content) => {
                Toast.loading('操作中');
                const params = {
                    name:content.name,
                    phone:content.tel,
                    province:content.province,
                    city:content.city,
                    county:content.county,
                    address:content.addressDetail,
                    is_default:content.isDefault ? 1 : 0,
                }
                
                if(state.type == 'edit'){
                    Toast.clear();
                    EditAddress(state.addressId,params).then(res=>{
                        Toast.success('修改成功');
                        setTimeout(()=>{
                            router.back();
                        },1000) 
                    }).catch(err=>{})
                }
                else if(state.type == 'add'){
                    Toast.clear();
                    addAddress(params).then(res=>{
                        Toast.success('保存成功');

                        setTimeout(()=>{
                            router.back();
                        },1000) 
                    }).catch(err=>{})
                }

               
                

            };

            const onDelete= () => {
                Toast.loading('删除中');
                DeleteAddress(state.addressId).then(res=>{
                    Toast.success("删除成功")

                    setTimeout(()=>{
                        router.back();
                    },1000) 
                }).catch(err=>{
                    Toast.fail("删除失败!")
                })
            };

            return { ...toRefs(state),onSave,onDelete,title }
        },
        methods:{},
        components:{
            NavBar
        },
    }
</script>

<style>
    .van-address-edit__buttons button{
        background: var(--color-tint);
        border-color: var(--color-tint);   
    }   
    .edit{
        margin-top: 45px;
    }
    .van-button--default{
    background-color: #ee0a24 !important;
    border: none;
    color: white;
} 

</style>
