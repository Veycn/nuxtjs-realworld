<template>
    <div class="settings-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>

        <form>
          <fieldset>
              <fieldset class="form-group">
                <input class="form-control" v-model="settings.image" type="text" placeholder="URL of profile picture">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="settings.username" type="text" placeholder="Your Name">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" v-model="settings.bio" rows="8" placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="settings.email" type="text" placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" v-model="settings.password" type="password" placeholder="Password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" @click="handleUpdate">
                Update Settings
              </button>
          </fieldset>
        </form>
        
        <hr>

        <button class="btn btn-outline-danger" @click="logout">
          Or click here to logout.
        </button>
      </div>

    </div>
  </div>
</div>
</template>image

<script>
    export default {
        name: "settings",
        middleware: 'authenticated',
        data(){
            return {
              
            }
        },
        asyncData({app,store,$httpFns}) {
          return {
            settings: Object.assign({},store.state.user)
          }
        },
        methods:{
            handleUpdate(){
              this.$httpFns['UpdateCurrentUser']({user:this.settings}).then(res=>{
                alert('更新成功')
                this.$store.commit('setUser',res.user)
              }).catch(e=>{
                alert('更新失败',e)
              })

            },
            logout(){
                this.$store.commit('logout')
            }
        }
    }
</script>

<style lang="scss" scoped>
    
</style>