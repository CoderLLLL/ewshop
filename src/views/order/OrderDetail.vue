<template>
  <div class="order-detail-box">
    <nav-bar class="nav-bar">
      <template v-slot:default>
        订单详情
      </template>
    </nav-bar>
    <div class="order-status">
      <div class="status-item">
        <label>订单状态：</label>
        <span>{{statusString}}</span>
      </div>
      <div class="status-item">
        <label>订单编号：</label>
        <span>{{detail.order_no}}</span>
      </div>
      <div class="status-item">
        <label>下单时间：</label>
        <span>{{detail.created_at}}</span>
      </div>

      <van-button v-if="detail.status == 1" @click="showPayFn" style="margin-bottom: 10px" color="#1baeae" block>去支付</van-button>
      <van-button v-if="detail.status == 2" @click="handleConfirmOrder" block >确认订单</van-button>
    </div>
    <div class="order-price">
      <div class="price-item">
        <label>商品金额：</label>
        <span>¥{{total+'.00'}}</span>
      </div>
      <div class="price-item">
        <label>配送方式：</label>
        <span>普通快递</span>
      </div>
    </div>

    <van-card 
          v-for="item in detail.orderDetails.data"
          :key="item.id"
          :num="item.num"
          :price="item.price+'.00'"
          desc="全场包邮"
          :title="item.goods.title"
          :thumb="item.goods.cover_url"
    >
    </van-card>
    <div style="width:100%;height:50px;">

    </div>

    <van-popup
      v-model:show="showPay"
      position="bottom"
      :style="{ height: '40%' }"
     
    >
    <!--  @close="close" -->
      <div :style="{ width: '100%', margin: '0 auto', padding: '20px 0' }">
        <van-grid :border="false" :column-num="2">
          <van-grid-item  text="支付宝">
            支付宝二维码<br>
            <!-- <van-image width="150" height="150" :src="aliyun" /> -->
            <div id="qrcode" class="qrcode"></div>
          </van-grid-item>
          <van-grid-item text="微信支付">
            微信二维码<br>
            <!-- <van-image width="150" height="150" :src="wechat" /> -->
            <div id="qrcode2" class="qrcode"></div>
          </van-grid-item>
        </van-grid>

      </div>
    </van-popup>
  </div>
</template>

<script>
  import { reactive, toRefs, onMounted,computed } from 'vue'
  import NavBar from "components/common/navbar/NavBar";
  import { getOrderDetail,confirmOrder,payOrder,payOrderStatus,viewExpress } from 'network/order'/* confirmOrder, */
  import { Dialog, Toast } from 'vant'
  import { useRoute, useRouter } from 'vue-router'
  import { qrcanvas } from 'qrcanvas';

  export default {
    name: 'OrderDetail',
    components: {
      NavBar
    },
    setup(){
      const router = useRouter();
      const route = useRoute();
      const state = reactive({
        orderNo:null,
        detail:{
          orderDetails:{
            data:[],
          },
          status:0,
        },
        showPay:false,
        aliyun:null,
        wechat:null,
      }); 
      

      const init = () =>{
        const {id} =  route.query;
        state.orderNo = id;
        
        getOrderDetail(id).then(res=>{
          console.log(res);
          state.detail = res
        }).catch(err=>{
          console.log(err);
        })
      }

      onMounted(()=>{
        Toast.loading({messgae:'加载中...',forbidClick:true});
        init()

        Toast.clear();
      })

      const statusString = computed(()=>{
          //1下单 2支付 3发货 4收获 5过期
          let status = ['','已下单','已支付','等待发货','确认收货','已过期'];
          return status[state.detail.status]
      })

      const total = computed(()=>{
        let sum = 0;

        state.detail.orderDetails.data.forEach(item => {
          sum += item.num * item.price
        });

        return sum;
      })

      const showPayFn = () =>{
        state.showPay = true;

        payOrder(state.orderNo,{type:'aliyun'}).then(res=>{
          state.aliyun = res.qr_code_url;
          state.wechat = res.qr_code_url;
          
          const canvas = qrcanvas({
              data:res.qr_code,
              size:128,  
          })
          document.getElementById("qrcode").innerHTML = '';
          document.getElementById("qrcode").appendChild(canvas);

          const canvas2 = qrcanvas({
              data:res.qr_code,
              size:128,  
          })
          document.getElementById("qrcode2").innerHTML = '';
          document.getElementById("qrcode2").appendChild(canvas2);
        }).catch(err=>{})

         //支付成功后轮询查看
        const timer = setInterval(() => {
          payOrderStatus(state.orderNo).then(res=>{
            if(res == '2' || res == 2){
              clearInterval(timer);
              state.showPay = false; 
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

        //由于后台出现问题，模拟支付成功
        const timers = setTimeout(()=>{
          clearInterval(timer);
          state.showPay = false; 
          state.detail.status = 2;
          Toast.success('支付成功');
          router.push({
            path:'/orderdetail',
            query:{id:state.orderNo}
          })
        },3000) 
      }

      const close = () => {
        //state.showPay = false;
        Dialog.close();
      }

      const handleConfirmOrder = () =>{
        Dialog.confirm({
          title:'是否确认订单'
        }).then(()=>{
          confirmOrder(state.orderNo),then(res=>{
            Toast('确认成功');
            init();
          }).catch(err=>console.log(err));
        }).catch(()=>{

        })
      }
      
      return {...toRefs(state),statusString,total,showPayFn,close,handleConfirmOrder}
    }
  }
</script>

<style scoped>
  .order-detail-box {
    text-align: left;
    background: #f7f7f7;
  }
  .order-status {
    background: #fff;
    margin-top: 44px;
    padding: 20px;
    font-size: 15px;
  }
  .status-item {
    margin-bottom: 10px;    
  }
  .status-item label {
    color: #999;
  }
  /* .status-item span {

  } */

  .order-price {
    background: #fff;
    margin: 20px 0;
    padding: 20px;
    font-size: 15px;
    }
    .price-item {
      margin-bottom: 10px; 
    }
    .price-item label {
      color: #999;
    }
    /* .price-item span{

    } */
    .van-card {
      margin-top: 0;
    }
    .van-card__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .van-grid>.van-grid-item{
      padding: 4px !important;
    }
    /* .van-grid-item{
        flex: 1 !important;
    } */
    .qrcode{
        padding-top: 20px;
    }
</style>
