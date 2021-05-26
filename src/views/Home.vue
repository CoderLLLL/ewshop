<template>
  <div class="home">
    {{banner}}
  </div>
</template>

<script>
// @ is an alias to /src
  import { onMounted,ref } from 'vue'

  import {getHomeAllData,getBanner} from 'network/home'

  export default {
    name: 'Home',
    setup(){
      const banner = ref([]);
    
      onMounted(()=>{
        getHomeAllData().then(res=>{
          console.log(res.slides)
          banner.value = res.slides
        }).catch(err=>{

        })
      })

      return {banner}
    },
    components: {
    },

  }
</script>
