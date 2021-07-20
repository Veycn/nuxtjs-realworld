<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
          <p class="text-xs-center">
            <nuxt-link to="/register">{{
              isLogin ? "Need an account?" : "Have an account?"
            }}</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(errArr, key) in errors" >
              <li v-for="msg in errArr">{{ key + msg}}</li>
            </template>
          </ul>

          <form>
            <fieldset class="form-group">
              <input
                v-if="!isLogin"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="user.username"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Email"
                v-model="user.email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="user.password"
                required
                minlength="8"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right" @click.prevent="login">
              {{ isLogin ? "Sign in" : "Sign up" }}
            </button>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      user: {
        username: "frankchou1",
        email: "46027533@qq.com",
        password: "12345678",
      },
      errors: {},
    };
  },
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },
  mounted() {},
  methods: {
    login() {
      this.$httpFns[this.isLogin ? "Login":'CreateUser']({
        user: this.user
      })
        .then((res) => {
          this.$store.commit('setUser', res.user)
          this.$router.push('/')
        })
        .catch((err) => {
          console.log(err)
          this.errors = err
        });
    },

  },
};
</script>

<style lang="scss" scoped>
</style>