<template>
  <div>
    <br>
    <div class="contain">
      <ul class="current_position">
        <li>当前位置：</li>
        <li><router-link :to="{name:'backstage.news'}">新闻管理</router-link></li>
        <li>&nbsp;&nbsp;<i class="icon iconfont icon-youjiantou"></i>&nbsp;&nbsp;&nbsp;</li>
        <li><a href="javascript:;">详情</a></li>
      </ul>
    </div>
    <br/>
    <div class="title_hr">
      <div class="banner_hr">
        <div class="bar_hr"></div>
      </div>
    </div>
    <br/>
    <div class="news_tails">
      <div class="news_title">
        {{datail.fTitle}}
      </div>
      <br/><br/>
      <div class="dis">
        <span>作者：{{datail.fAuthor}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span>发布时间：{{datail.fReleaseTime}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span>来源：{{datail.fFrom}}</span>
      </div>
      <br/><br/>
      <div class="detail_content ql-snow" >
        <div class="ql-editor" v-html="datail.fContent"></div>
      </div>
      <br/><br/>
      <div class="down_res" v-for="i in file">
        <a :href="i.url" style="color: #df6657;text-align: left;" >{{i.fenclName}}</a>
      </div>
      <br/><br/><br/>
    </div>
  </div>
</template>


<script>
  import config from "@/config/config.js";
    export default {
      data(){
        return{
          datail:{},
          file : []
        }
      },
      mounted: function () {
        this.getDetail();
      },
      methods:{
        getDetail(){
          let params={};
          params['id'] = this.$route.query.id;
          API.get('/newsInfo/FindById',params,{Authorization:storage.get('token')}).then((res)=>{
            // console.log(res.data);
            if(res.data.code == 200) {
              // this.datail = res.data.data.data;
              var arr = Object.assign({}, res.data.data.data);
              if(arr.fReleaseTime){
                arr.fReleaseTime = arr.fReleaseTime.slice(0,19);
              }else {
                arr.fReleaseTime = '';
              }

              this.datail = arr;
              this.file = res.data.data.file;
              for(var i=0;i<this.file.length;i++){
                this.file[i].url = config.baseURL + this.file[i].fenclUrl;
              }
            } else if(res.data.code == 1001){
              this.signOut();
            }
          })
          // console.log(this.$route.query.id);
        },
        signOut(){
          this.$message({
            type: 'error',
            message: '登录失效，请重新登录!'
          });
          storage.delete('Authorization');
          storage.delete('userName');
          storage.delete('auth');
          storage.delete('token');
          storage.delete('sysid');
          this.$router.push({name:'login'});
        }
      }
    }
</script>

<style lang="less" scoped>
  @import '../../../../assets/styles/list_details.less';
</style>
