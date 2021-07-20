<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="isLogined">
                <a
                  :class="['nav-link', activeTab === 0 ? 'active' : '']"
                  @click="changeTab(0)"
                  >Your Feed</a
                >
              </li>
              <li class="nav-item">
                <a
                  :class="['nav-link', activeTab === 1 ? 'active' : '']"
                  @click="changeTab(1)"
                  >Global Feed</a
                >
              </li>
              <li class="nav-item" v-if="activeTag">
                <a
                  :class="['nav-link', activeTab === 2 ? 'active' : '']"
                  @click="changeTab(2)"
                  >#{{ activeTag }}</a
                >
              </li>
            </ul>
          </div>

          <template v-if="artList.length">
            <div
              class="article-preview"
              v-for="(art, index) in artList"
              :key="art.slug"
            >
              <div class="article-meta">
                <nuxt-link :to="`/profile?username=${art.author.username}`"
                  ><img :src="art.author.image"
                /></nuxt-link>
                <div class="info">
                  <nuxt-link :to="`/profile?username=${art.author.username}`" class="author">{{
                    art.author.username
                  }}</nuxt-link>
                  <span class="date">{{ art.updatedAt | date('MMM DD, YYYY') }}</span>
                </div>
                <button
                  :class="
                    'btn btn-outline-primary btn-sm pull-xs-right' +
                    (art.favorited ? ' isfavorited' : '')
                  "
                  @click="addFavorites(art)"
                >
                  <i class="ion-heart"></i> {{ art.favoritesCount }}
                </button>
              </div>
              <nuxt-link :to="`/article?slug=${art.slug}`" class="preview-link">
                <h1>{{ art.title }}</h1>
                <p>{{ art.description }}</p>
                <span>Read more...</span>
                <ul class="tag-list">
                  <li class="tag-default tag-pill tag-outline" v-for="tag in art.tagList">{{tag}}</li>
                </ul>
              </nuxt-link>
            </div>
          </template>
          <template v-else>
            <div class="article-preview">
              {{
                loading ? "Loading articles..." : (artList.length?"":"No articles are here... yet.")
              }}
            </div>
          </template>
          <div  class="ng-isolate-scope" >
            <nav>
              <ul class="pagination">
                <li :class="'page-item ng-scope' +( page.curr === pageNum ?' active':'')"
                  v-for="pageNum in totalPage" :key="pageNum"
                   @click="changePage(pageNum)">
                  <a class="page-link ng-binding">{{pageNum}}</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <a
                href="javascript:void(0)"
                @click="handleTagChange(tag)"
                class="tag-pill tag-default"
                v-for="(tag, index) in tags"
                :key="index"
                >{{ tag }}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  async asyncData({ $httpFns }) {
    // console.log($httpFns);
    let tags = {}
    let res = {}
      res = await $httpFns["GetTags"]()
    tags = res.tags;
    return {
      tags
    };
  },
  data() {
    return {
      loading: true,
      // tags: [],
      artList: [],
      page: {
        curr: 1,
        size: 2,
        total: 0,
      },
      activeTab: 1,
      activeTag: "",
    };
  },
  computed: {
    totalPage(){
      return Math.ceil(this.page.total / this.page.size)
    },
    isLogined() {
      return !!this.$store.state.user;
    },
  },
  mounted() {
    // console.log('this',this);
    // this.$httpFns["GetTags"]().then((res) => {
    //   this.tags = res.tags;
    // });

    // this.getArticlesFeed()

    if (this.isLogined) {
      this.activeTab = 0;
    } else {
    }
    this.getArticles();
  },
  methods: {
    handleTagChange(e) {
      this.activeTag = e;
      this.activeTab = 2;
      this.page.curr = 1
      this.page.total = 0

      this.getArticles();
    },

    getArticles() {
      this.loading = true;
      this.artList = [];
      this.page.total = 0;

      let data = {
        0: {},
        1: {},
        2: { tag: this.activeTag },
      }[this.activeTab];
      data.limit = this.page.size;
      data.offset = (this.page.curr - 1) * data.limit;

      return this.$httpFns[this.activeTab===0?"GetArticlesFeed":"GetArticles"](data)
        .then((res) => {
          this.artList = res.articles;
          this.page.total = res.articlesCount;
        })
        .finally((e) => {
          this.loading = false;
        });
    },

    changeTab(tabIdx) {
      this.activeTab = tabIdx;
      this.page.curr = 1
      this.page.total = 0
      this.getArticles();
    },

    addFavorites(art) {
      this.$httpFns[art.favorited ? "CreateArticleFavorite":'DeleteArticleFavorite']({ slug: art.slug }).then((res) => {
        art.favorited = !art.favorited
        art.favorited ? art.favoritesCount++:art.favoritesCount--
      });
    },

    changePage(num){
      let temp = this.page.curr
      this.page.curr = num
      this.getArticles().catch(e=>{
        this.page.curr = temp
      })
    }
  },
  // filters: {
  //   date2str(datestr) {
  //     // let date = new Date(datestr)
  //     // let y = date.getFullYear()
  //     // let mon = date.getMonth() + 1
  //     return `${datestr.slice(5, 7) - 0 }月 ${datestr.slice(2, 4)}th`;
  //   },
  // },
};
</script>

<style lang="css" scoped>
.isfavorited {
  color: #fff;
  background-color: #5cb85c;
  border-color: #5cb85c;
}
</style>