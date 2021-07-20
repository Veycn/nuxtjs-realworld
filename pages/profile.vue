<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="blogger.image" class="user-img" />
            <h4>{{ blogger.username }}</h4>
            <p>{{ blogger.bio }}</p>

            <nuxt-link
              class="btn btn-sm btn-outline-secondary action-btn"
              v-if="isUser"
              to="/settings"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>

            <button
              class="btn btn-sm btn-outline-secondary action-btn"
              v-else
              @click="changeFollow"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              {{ blogger.following ? "Follow" : "Unfollow" }}
              {{ blogger.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a
                  :class="['nav-link', activeTab === 0 ? 'active' : '']"
                  @click="changeTab(0)"
                  >My Articles</a
                >
              </li>
              <li class="nav-item">
                <a
                  :class="['nav-link', activeTab === 1 ? 'active' : '']"
                  @click="changeTab(1)"
                  >Favorited Articles</a
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="(art, index) in artList"
            :key="art.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="'/profile?username=' + art.author.username"
                ><img :src="art.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="'/profile?username=' + art.author.username"
                  class="author"
                  >{{ art.author.username }}</nuxt-link
                >
                <span class="date">{{
                  art.updatedAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button
                :class="
                  'btn btn-outline-primary btn-sm pull-xs-right' +
                  (art.favorited ? ' active' : '')
                "
                @click="addFavorites(art, index)"
              >
                <i class="ion-heart"></i> {{ art.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="'/article?slug=' + art.slug" class="preview-link">
              <h1>{{ art.title }}</h1>
              <p>{{ art.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li
                  class="tag-default tag-pill tag-outline"
                  v-for="tag in art.tagList"
                  :key="tag"
                >
                  {{ tag }}
                </li>
              </ul>
            </nuxt-link>
          </div>

          <template v-show="!artList.length">
            <div class="article-preview">
              {{
                loading
                  ? "Loading articles..."
                  : artList.length
                  ? ""
                  : "No articles are here... yet."
              }}
            </div>
          </template>
          <div class="ng-isolate-scope">
            <nav>
              <ul class="pagination">
                <li
                  :class="
                    'page-item ng-scope' +
                    (page.curr === pageNum ? ' active' : '')
                  "
                  v-for="pageNum in totalPage"
                  :key="pageNum"
                  @click="changePage(pageNum)"
                >
                  <a class="page-link ng-binding">{{ pageNum }}</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "profile",
  middleware: "authenticated",
  // watchQuery:['$route.params.username'],
  async mounted() {
    let { profile } = await this.$httpFns["GetProfileByUsername"]({
      username: this.$route.query.username,
    });
    this.blogger = profile;
  },
  data() {
    return {
      blogger: {},
      loading: true,
      artList: [],
      page: {
        curr: 1,
        size: 2,
        total: 0,
      },
      activeTab: 0,
    };
  },
  computed: {
    isUser() {
      if (!this.$store.state.user) return false;
      return this.$store.state.user.username === this.$route.query.username;
    },
    totalPage() {
      return Math.ceil(this.page.total / this.page.size);
    },
  },
  mounted() {
    this.getArticles();
  },
  methods: {
    changeTab(tabIdx) {
      this.activeTab = tabIdx;
      this.page.curr = 1;
      this.page.total = 0;
      this.getArticles();
    },
    changePage(num) {
      let temp = this.page.curr;
      this.page.curr = num;
      this.getArticles().catch((e) => {
        this.page.curr = temp;
      });
    },
    getArticles() {
      this.loading = true;
      this.artList = [];
      this.page.total = 0;

      let data = {
        0: { author: this.$route.query.username },
        1: { favorited: this.$route.query.username },
      }[this.activeTab];
      data.limit = this.page.size;
      data.offset = (this.page.curr - 1) * data.limit;

      return this.$httpFns["GetArticles"](data)
        .then((res) => {
          this.artList = res.articles;
          this.page.total = res.articlesCount;
        })
        .finally((e) => {
          this.loading = false;
        });
    },
    async changeFollow() {
      await this.$httpFns[
        this.blogger.following
          ? "FollowUserByUsername"
          : "UnfollowUserByUsername"
      ]({
        username: this.blogger.username,
      });
      this.blogger.following = !this.blogger.following;
    },

    async addFavorites(row, idx) {
      await this.$httpFns[
        row.favorited ? "CreateArticleFavorite" : "DeleteArticleFavorite"
      ]({
        slug: row.slug,
      });
      row.favorited = !row.favorited;
      row.favorited ? row.favoritesCount++ : row.favoritesCount--;
    },
  },
  watch: {
    "$route.params.username"(n, o) {
      this.changeTab(0);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>