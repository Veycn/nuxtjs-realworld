<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  v-model="article.title"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  v-model="article.description"
                  class="form-control"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  v-model="article.body"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  v-model="tagVal"
                  @keyup.enter="pushTag"
                  class="form-control"
                  placeholder="Enter tags"
                />
                <div class="tag-list"></div>
                <div class="tag-list">
                  <span
                    v-for="(tag, index) in article.tagList"
                    :key="tag"
                    class="tag-default tag-pill"
                  >
                    <i class="ion-close-round" @click="removeTag(index)"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="publish"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "editor",
  middleware: "authenticated",
  data() {
    return {
      tagVal: "",
      article: {
        title: "How to train your dragon",
        description: "Ever wonder how?",
        body: "You have to believe",
        tagList: ["reactjs", "angularjs", "dragons"],
      },
    };
  },
  mounted() {
    if(this.$route.query.slug){
      this.$httpFns['GetArticle']({slug:this.$route.query.slug}).then(res=>{
        // let {title, body,description, tagList} = res.article
        this.article = res.article
      })
    }
  },
  methods: {
    async publish() {
      let slug = this.$route.query.slug
      if(slug){
        await this.$httpFns["UpdateArticle"]({ slug: slug },{article: this.article});
        alert('修改成功')
      }else{
        await this.$httpFns["CreateArticle"]({ article: this.article });
        alert('发布成功')
      }
      this.$router.push('/article?slug='+ slug)
    },

    pushTag() {
      this.article.tagList.push(this.tagVal);
      this.tagVal = "";
    },

    removeTag(index) {
      this.article.tagList.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>