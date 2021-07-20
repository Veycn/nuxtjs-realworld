<template>
    <div class="article-page">

  <div class="banner">
    <div class="container">

      <h1>{{art.title}}</h1>

      <div class="article-meta">
        <nuxt-link :to="'/profile?username='+ art.author.username"><img :src="art.author.image" /></nuxt-link>
        <div class="info">
          <nuxt-link :to="'/profile?username='+ art.author.username" class="author">{{art.author.username}}</nuxt-link>
          <span class="date">{{art.updateAt | date('MMM DD, YYYY')}}</span>
        </div>

        <template v-if="authorIsMe">
          <span>
            <nuxt-link class="btn btn-outline-secondary btn-sm" :to="`/editor?slug=${art.slug}`">
              <i class="ion-edit"></i> Edit Article
            </nuxt-link>

            <button class="btn btn-outline-danger btn-sm" :disabled="delLoading" @click="deleteArticle">
              <i class="ion-trash-a"></i> Delete Article
            </button>
          </span>
        </template>

        <template v-else>
          <span>
            <button :class="'btn btn-sm '+ (art.author.following? 'btn-secondary':'btn-outline-secondary')"
              @click="changeFollow">
              <i class="ion-plus-round"></i>
              &nbsp;
              {{art.author.following?'Follow': 'Unfollow'}} {{art.author.username}}
            </button>
            &nbsp;&nbsp;
            <button :class="'btn btn-sm btn-outline-primary'+ (art.favorited ? ' active' :'')" @click="changeFavorite">
              <i class="ion-heart"></i>
              &nbsp;
              Favorite Post <span class="counter">({{art.favoritesCount}})</span>
            </button>
          </span>
        </template>
        
      </div>

    </div>
  </div>

  <div class="container page">

    <div class="row article-content">
      <div class="col-md-12">
        <p v-html="art.body">
        <!-- {{art.body}} -->
        </p>
      </div>
    </div>

    <hr />

    <div class="article-actions">
      <div class="article-meta">
        <nuxt-link :to="'/profile?username='+ art.author.username"><img :src="art.author.image" /></nuxt-link>
        <div class="info">
          <nuxt-link :to="'/profile?username='+ art.author.username" class="author">{{art.author.username}}</nuxt-link>
          <span class="date">{{art.updateAt | date('MMM DD, YYYY')}}</span>
        </div>

        <template v-if="authorIsMe">
          <span>
            <nuxt-link class="btn btn-outline-secondary btn-sm" :to="`/editor?slug=${art.slug}`">
              <i class="ion-edit"></i> Edit Article
            </nuxt-link>

            <button class="btn btn-outline-danger btn-sm" :disabled="delLoading" v-if="$store.state.user" @click="deleteArticle">
              <i class="ion-trash-a"></i> Delete Article
            </button>
          </span>
        </template>

        <template v-else>
          <span>
            <button :class="'btn btn-sm '+ (art.author.following? 'btn-secondary':'btn-outline-secondary')"
              @click="changeFollow">
              <i class="ion-plus-round"></i>
              &nbsp;
              {{art.author.following?'Follow': 'Unfollow'}} {{art.author.username}}
            </button>
            &nbsp;&nbsp;
            <button :class="'btn btn-sm btn-outline-primary'+ (art.favorited ? ' active' :'')" @click="changeFavorite">
              <i class="ion-heart"></i>
              &nbsp;
              Favorite Post <span class="counter">({{art.favoritesCount}})</span>
            </button>
          </span>
        </template>

      </div>
    </div>

    <div class="row">

      <div class="col-xs-12 col-md-8 offset-md-2">

        <form class="card comment-form" v-if="$store.state.user">
          <div class="card-block">
            <textarea class="form-control" v-model="textareaVal" placeholder="Write a comment..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <img :src="$store.state.user.image" class="comment-author-img" />
            <button class="btn btn-sm btn-primary" @click="postComment">
             Post Comment
            </button>
          </div>
        </form>
        
        <div class="card" v-for="comm in comments" :key="comm.id">
          <div class="card-block">
            <p class="card-text">{{comm.body}}</p>
          </div>
          <div class="card-footer">
            <nuxt-link :to="'/profile?username='+ comm.author.username" class="comment-author">
              <img :src="comm.author.image" class="comment-author-img" />
            </nuxt-link>
            &nbsp;
            <nuxt-link :to="'/profile?username='+ comm.author.username" class="comment-author">{{comm.author.username}}</nuxt-link>
            <span class="date-posted">{{comm.createAt | date('MMM DD,YYYY')}}</span>
            <span class="mod-options" v-show="canModify(comm.author.username)" v-if="$store.state.user">
              <i class="ion-trash-a" @click="delComment(comm.id)"></i>
            </span>
          </div>
        </div>
        
      </div>

    </div>

  </div>

</div>
</template>

<script>
import markdownIt from 'markdown-it';
    export default {
        name: "article-page",
        // 生成全静态的时候这个meta才有用
        head() {
            return {
              title: `${this.art.title} - RealWrold`,
              meta:[
                {hid:'hid是为了避免与父组件冲突而设的唯一标识', name:'article', content: this.art.description}
              ]
            }
        },
        // 若是想生成纯静态页面，获取数据最好用asyncData钩子进行获取，否则用mounted
        async mounted() {
          let {slug} = this.$route.query
          if(!slug) return this.$router.repalce('/error')
          let [{ article },{ comments }] = await Promise.all([
            this.$httpFns['GetArticle']({slug}),
            this.$httpFns['GetArticleComments']({slug})
          ])
          const md = new markdownIt()
          article.body = md.render(article.body)
          this.art = article
          this.comments = comments
        },
        data(){
            return {
                art:{
                  author:{}
                },
                comments:[],
                textareaVal:'',
                delLoading: false,
            }
        },
        computed:{
          authorIsMe(){
            if(!this.$store.state.user?.username) return false
            return this.$store.state.user.username === this.art.author.username
          },
        },
        methods:{
          canModify(user){
            return this.$store.state.user.username === user
          },
            async getComments(){
              let { comments } = await this.$httpFns['GetArticleComments']({slug:this.$route.query.slug})
              this.comments = comments
              this.textareaVal = ''
            },
            async changeFollow(){
              await this.$httpFns[this.art.author.following ? 'FollowUserByUsername':'UnfollowUserByUsername'](
                {username:this.art.author.username},config=>{
                  console.log(config);
                  return config
                }
              )
              this.art.author.following = !this.art.author.following
            },

            async changeFavorite(){
              await this.$httpFns[this.art.favorited ? 'CreateArticleFavorite':'DeleteArticleFavorite']({slug:this.$route.query.slug})
              this.art.favorited = !this.art.favorited
              this.art.favorited ? this.art.favoritesCount++:this.art.favoritesCount--
            },

            async deleteArticle(){
              if(confirm('确定要删除该文章吗?')){
                this.delLoading = true
                await this.$httpFns['DeleteArticle']({slug: this.art.slug})
                this.delLoading = false
                this.$router.replace('/profile?username='+ this.$store.state.user.username)
              }
            },

            async postComment(){
              await this.$httpFns['CreateArticleComment']({slug:this.$route.query.slug},config=>{
                config.data = {
                  "comment": {
                    "body": this.textareaVal
                  }
                }
                return config
              })
              alert('发表成功')
              this.getComments()
            },

            async delComment(id){
              await this.$httpFns['DeleteArticleComment']({slug:this.$route.query.slug,id})
              alert('删除成功')
              this.getComments()
            }
        }
    }
</script>

<style lang="css" scoped>
</style>