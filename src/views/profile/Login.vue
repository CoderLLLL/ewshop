<!--  -->
<template>
    <div>
        <NavBar>
            <template v-slot:default>用户登录</template>
        </NavBar>

        <div style="margin-top:60px">
            <div style="text-align:center">
                <van-image
                    width="10rem"
                    height="10rem"
                    fit="contain"
                    src="https://img01.yzcdn.cn/vant/logo.png" 
                />
            </div>
        </div>

        <van-form @submit="onSubmit">
            <van-field
              v-model="email"
              name="邮箱"
              label="邮箱"
              placeholder="邮箱"
              :rules="[{ required: true, message: '请填写用户邮箱' }]"
            />

            <van-field
              v-model="password"
              type="password"
              name="密码"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />

            <div style="margin: 16px;">  
              <van-button style="margin-top: 30px;" round block type="info" color="#44b883" native-type="submit">提交</van-button>
              <div class="link-login" @click="$router.push({ path:'/register' })">
                没有账号，立即注册
              </div>
            </div>
          </van-form>
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'

    import {login} from 'network/user'

    import { Notify,Toast } from 'vant';

    import { ref,toRefs,reactive } from 'vue'
    import { useRouter } from 'vue-router'
    import { useStore } from 'vuex'

    export default {
        name:'Login',
        setup(){
            const router = useRouter();
            const store = useStore();

            const userinfo = reactive({
                email: ref(null),
                password: ref(null),
            }) 

            const onSubmit = () =>{
                login(userinfo).then(res=>{
                    //将token保存在本地 setItem(key,value) getItem(key)
                    window.localStorage.setItem('token',res.access_token);

                    //修改在vuex的状态
                    store.dispatch('setIsLogin',true);

                    //处理登录成功后留下来的数据
                    Toast.success('登录成功');
                    userinfo.email = null
                    userinfo.password = null

                    setTimeout(() => {
                        router.go(-1)
                    }, 500);
                    //在vuexisLogin 
                    console.log(res);
                }).catch(err=>{})
            }

            return {...toRefs(userinfo),onSubmit}
        },
        components:{
            NavBar
        },
    }
</script>

<style  scoped>
    .link-login{
        font-size: 14px;
        margin-top: 40px;
        color: #42b983;
        display: inline-block;
    }
</style>
