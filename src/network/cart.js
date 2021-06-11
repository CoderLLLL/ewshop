import { request } from './request'

//添加购物车
export function addCart(data){
    return request({
       url:'/api/carts',
       method:'post',
       data,
    })
}

//修改购物车
export function modifyCart(id,data){
    return request({
       url:`/api/carts/${id}`,
       method:'put',
       data,
    })
}

//商品选择状态
export function checkCard(data){
    return request({
       url:'/api/carts/checked',
       method:'patch',
       data,
    })
}

//获取购物车
export function getCart(data=''){
    return request({
       url:'/api/carts?'+data,
       method:'get',
    })
}

//删除购物车中的商品
export function deleteCartItem(id){
    return request({
       url:`/api/carts/${id}`,
       method:'delete',
    })
}