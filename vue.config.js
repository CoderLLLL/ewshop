module.exports={
    configureWebpack:{
        resolve:{
            alias:{
                'src':'@',
                'assets':'@/assets',
                'components':'@/components',
                'views':'@/views',
                'utils':'@/utils',
                'network':'@/network',
            }
        }
    },
    publicPath: './'
}