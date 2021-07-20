<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <nuxt-link to="/" class="navbar-brand">测试push</nuxt-link>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <!-- Add "active" class when you're on that page" -->
          <nuxt-link to="/" exact class="nav-link">Home</nuxt-link>
        </li>
        <li class="nav-item" v-if="isLogined">
          <nuxt-link class="nav-link" to="/editor">
            <i class="ion-compose"></i>&nbsp;New Post
          </nuxt-link>
        </li>
        <li class="nav-item" v-if="isLogined">
          <nuxt-link class="nav-link" to="/settings">
            <i class="ion-gear-a"></i>&nbsp;Settings
          </nuxt-link>
        </li>
        <li class="nav-item" v-if="!isLogined">
          <nuxt-link class="nav-link" to="/login">Sign in</nuxt-link>
        </li>
        <li class="nav-item" v-if="!isLogined">
          <nuxt-link class="nav-link" to="/register">Sign up</nuxt-link>
        </li>
        <li class="nav-item" v-if="isLogined">
          <nuxt-link :to="`/profile?username=${user.username}`" class="nav-link">
            <img class="user-pic" :src="user.image" alt="">{{user.username}}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "layout-header",
  data() {
    return {
    };
  },
  computed:{
    ...mapState(['user']),
    isLogined(){
      return !!this.user
    }
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>