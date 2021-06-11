import {getCart} from 'network/cart'

const actions = {
    setIsLogin(context,payload){
        context.commit('setIsLogin',payload)
    },

    updateCart(context){
        getCart().then(res=>{
            context.commit('addCart',{count:res.data.length || 0});
        }).catch(err=>{})
    },
};

export default actions;