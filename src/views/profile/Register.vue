<!--  -->
<template>
    <div>
        <NavBar>
            <template v-slot:default>新用户注册</template>
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
              v-model="name"
              name="用户名"
              label="用户名"
              placeholder="用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
            />

            <van-field
              v-model="password"
              type="password"
              name="密码"
              label="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />

            <van-field
              v-model="password_confirmation"
              type="password"
              name="确认密码"
              label="确认密码"
              placeholder="确认密码"
              :rules="[{ required: true, message: '请确认密码' }]"
            />

            <van-field
            v-model="email"
            name="邮箱"
            label="邮箱"
            placeholder="邮箱"
            :rules="[{ required: true, message: '请填写邮箱' }]"
          />
            <div style="margin: 16px;">  
              <van-button style="margin-top: 30px;" round block type="info" color="#44b883" native-type="submit">提交</van-button>
              <div class="link-login" @click="$router.push({ path:'/login' })">
                已有账号，立即登录
              </div>
            </div>
          </van-form>
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'

    import {register} from 'network/user'

    import { Notify,Toast } from 'vant';

    import { ref,toRefs,reactive } from 'vue'
    import { useRouter } from 'vue-router'

    export default {
        name:'Register',
        setup(){
            const router = useRouter();

            const userinfo = reactive({
                name: ref(null),
                password: ref(null),
                password_confirmation: ref(null),
                email: ref(null),
            }) 

            const onSubmit = () =>{
                if(userinfo.password != userinfo.password_confirmation){
                    Notify('两次密码不一致');
                }
                else{
                    register(userinfo).then(res=>{
                        //coderl   1234567   coderl@coder.com
                        if(res.status == '201'){
                            Toast.success('注册成功')
                            setTimeout(()=>{
                                router.push({
                                    path:'/login'
                                })
                            },1000)
                        }

                        userinfo.password = null;
                        userinfo.password_confirmation = null;
                    }).catch(err=>{})
                }
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
