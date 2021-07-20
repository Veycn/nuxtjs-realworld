<template>
    <div class="">
        <layoutHeader></layoutHeader>

        <!-- 子路由 -->
        <nuxt-child />
        
        <layoutFooter></layoutFooter>
    </div>
</template>

<script>
import layoutHeader from './header'
import layoutFooter from './footer'
    export default {
        name: "layout-index",
        components: {layoutHeader, layoutFooter},
        data(){
            return {
                
            }
        },
        mounted() {
            
        },
        methods:{
            
        }
    }
</script>

<style lang="scss" scoped>
    
</style>