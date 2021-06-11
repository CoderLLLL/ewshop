import axios from 'axios'
import { Notify,Toast } from 'vant';

import router from '../router';

export function request(config){
    const instance = axios.create({
        baseURL:'https://api.shop.eduwork.cn',
        timeout:5000,
    })

    instance.interceptors.request.use(config=>{
        const token = window.localStorage.getItem('token');
        if(token){
            config.headers.Authorization = 'Bearer' + token;
        }

        return config        
    },err=>{});

    instance.interceptors.response.use(res=>{
        return res.data ? res.data : res

    },err=>{
        if(err.response.status == '401'){
            Toast.fail('请先登录');
            router.push({
                path:'/login',
                
            })
        }

        Notify(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0]);
    });

    return instance(config);
}
