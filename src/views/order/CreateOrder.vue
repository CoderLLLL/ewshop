<template>
    <div class="create-order">
        <nav-bar class="nav-bar">
            <template v-slot:default>
               订单预览
            </template>
        </nav-bar>

        <div class="address-wrap">
            <div class="name" @click="goTo">
                <strong><span>{{address.name}}&nbsp;</span></strong>
                <strong><span>{{address.phone}}</span></strong>
            </div>
            <div class="address">
               <strong>{{address.province}}&nbsp;{{address.city}}&nbsp;{{address.county}}&nbsp;{{address.address}}</strong>
            </div>
            <van-icon id="arrow1" class="arrow" name="arrow" @click="goTo"/>
            <div class="dividing"></div>
        </div>

        <div class="good">
            <div class="good-item" v-for="item in cartList" :key="item.goods.id">
                <div class="good-img"><img v-lazy="item.goods.cover_url" alt=""></div>
                <div class="good-desc">
                    <div class="good-title">
                        <span>{{item.goods.title}}</span>
                        <span>x{{item.num}}</span>
                    </div>
                    <div class="good-btn">
                        <div class="price">￥{{item.goods.price}}.00</div>
                    </div>
                </div>
            </div>
        </div>

        <van-submit-bar
                class="submit-all"
                :price="total * 100"
                button-text="生成订单"
                @submit="handleCreateOrder"
        >
            商品金额
        </van-submit-bar>

        <van-popup
                closeable
                :close-on-click-overlay="false"
                v-model:show="showPay"
                position="bottom"
                :style="{ height: '40%' }"
                @close="close"
        >

        <div :style="{width:'90%',margin:'0 auto', padding:'50px 0'}">
            <van-button :style="{marginBottom:'10px'}" color="#1989fa" block>
                支付宝支付
            </van-button>

            <van-button color="#4fc08d" block>
                微信支付
            </van-button>
        </div>

        <van-grid :border="false" :column-num="3">
            <van-grid-item>
              支付宝二维码<br>
              <van-image width="150" height="150" :src="aliyun" />
            </van-grid-item>
            <van-grid-item>
              微信二维码<br>
              <van-image width="150" height="150" :src="wechat" />
            </van-grid-item>
          </van-grid>
        </van-popup>
    </div>
</template>

<script>
    import { reactive, onMounted, toRefs, computed } from 'vue'
    import NavBar from "components/common/navbar/NavBar";
    import { getOrderPreview,createOrder,payOrder,payOrderStatus } from 'network/order'
    import { Toast } from 'vant'
    import { useRoute, useRouter } from 'vue-router'
    import {useStore} from 'vuex';
    export default {
        name:'CreateOrder',
        components: {
            NavBar
        },
        setup() {
            const router = useRouter()
            const route = useRoute()
            const store = useStore()
            const state = reactive({
                cartList: [],
                address: {},
                showPay:false,
                orderNo:null,
                aliyun:null,
                wechat:null,
            })

            const init = () =>{
                Toast.loading({
                    message:'加载中',
                    forbidClick:true,
                })

                getOrderPreview().then(res=>{
                    let address = res.address.filter(n=>n.is_default == '1');
                    if(address.length == 0){
                        state.address = {
                            address:'还没有设置默认地址，请选择或添加地址'
                        }
                    }
                    else{
                        state.address = address[0]
                    }
                    
                    state.cartList = res.carts;

                }).catch(err=>{
                    console.log(err);
                })
            }  

            onMounted(() => {
                init()
            })


            const goTo = () => {
                router.push({ path: '/address'})
            }

            

            const handleCreateOrder = () => {
                const params = {
                    address_id: state.address.id
                }

                createOrder(params).then(res=>{
                    Toast.success('创建订单成功');
                    store.dispatch('updateCart');

                    state.showPay = true;
                    state.orderNo = res.id;

                    payOrder(state.orderNo,{type:'aliyun'}).then(res=>{
                        state.aliyun = res.qr_code_url;
                        state.wechat = res.qr_code_url;
                        console.log(res.qr_code_url);
                    }).catch(err=>{})

                    //由于微信没有沙箱环境，无法调试
                   /*  payOrder(state.orderNo,{type:'wechat'}).then(res=>{
                        state.wechat = res.qr_code_url
                    }).catch(err=>{}) */

                    //支付成功后轮询查看
                    const timer = setInterval(() => {
                        payOrderStatus(state.orderNo).then(res=>{
                            if(res == '2' || res == 2){
                                clearInterval(timer);
                                router.push({
                                    path:'/orderdetail',
                                    query:{id:state.orderNo}
                                })
                            }
                            else{
                                console.log(res);
                            }
                        }).catch(err=>{
                            console.log(err);
                        })
                    }, 3000);
                })

            }

            const close = () => {
                router.push({path:'/orderdetail', query:{id:state.orderNo}})
            }

            const total = computed(()=>{
                let sum = 0;
                
                state.cartList.forEach(item=>{
                    sum += parseInt(item.num) * parseFloat(item.goods.price)
                })

                return sum;
            })

            return {
                ...toRefs(state),
                goTo,
                handleCreateOrder,
                close,
                total,
            }
        }
    }
</script>

<style scoped>
    .van-submit-bar{
        z-index: 4 !important;
    }
    .create-order {
        background: #f9f9f9;
    }

    .address-wrap {
        text-align: left;
        margin-bottom: 20px;
        background: #fff;
        position: relative;
        margin-top: 44px;
        font-size: 14px;
        padding: 15px;
        color: #222333;   
    }


    .name, .address {
        margin: 10px 0;
        width: 87%;
        overflow: hidden;
        text-overflow:ellipsis;
	    white-space:nowrap
    }
    .arrow {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 20px;
    }
    .dividing{
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 2px;
        background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
        background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
        background-size: 80px;
        content: '';
    }  
    .good {
        margin-bottom: 120px;
    }
    .good-item {
        padding: 10px;
        background: #fff;
        display: flex;
    }
    .good-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 20px;     
    }
    .good-img img{
        width:100px;
        height:auto;
    }
    .good-title {
        display: flex;
        justify-content: space-between;
    }
    .good-btn {
        display: flex;
        justify-content: space-between;
    }
    .price {
        font-size: 16px;
        color: red;
        line-height: 28px;
    }
    .van-icon-delete {
        font-size: 20px;
        margin-top: 4px;
    }
    .van-popup>div button:nth-child(1){
        color: white;
        background: rgb(25, 137, 250) !important;
        border-color: rgb(25, 137, 250) !important;
        margin-bottom: 10px;
    }
    .van-popup>div button:nth-child(2){
        color: white;
        background: rgb(79, 192, 141) !important;
        border-color: rgb(79, 192, 141) !important;
        margin-bottom: 10px;
    }
    .pay-wrap {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #fff;
        padding: 10px 0;
        padding-bottom: 50px;
        border-top: 1px solid #e9e9e9;   
    }
    .pay-wrap>div {
        display: flex;
        justify-content: space-between;
        padding: 0 5%;
        margin: 10px 0;
        font-size: 14px;  
    }
    .pay-wrap>div span:nth-child(2){
        color: red;
        font-size: 18px;
    }

    .pay-btn {
        position: fixed;
        bottom: 7px;
        right: 0;
        left: 0;
        width: 90%;
        margin: 0 auto;
    }

    .submit-all {
        margin-bottom: 50px;
        z-index: 9 !important;
    }
</style>
