import { request } from './request'

export function getHomeAllData(){
    return request({
        url:'/api/index',
    }) 
}

export function getHomeGoodList(){
    return request({
        url:'/api/goods'
    })
}