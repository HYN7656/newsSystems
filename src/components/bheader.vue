<template>
  <div class="up-header">
    <div class="nav-box">
      <div class="up-nav">
        <span class="logo">
          <img src="./../assets/logo.png" alt="">
          <span class="name">管理平台</span>
        </span>
        <span class="welcome">
            <span class="user">
              <i class="iconfont icon icon-yonghu"></i><strong>欢迎您：{{userName}}</strong>
            </span>
            <span class="user" @click="OpenPassword">
              <strong style="font-size: 13px;">修改密码</strong>
            </span>
            <span class="exit" @click="exit">
              <i class="iconfont icon icon-tuichu-copy"></i><strong>退出</strong>
            </span>
        </span>
      </div>
    </div>
    <div class="p-content">
      <div class="p-left" v-bind:style="{ minHeight: offHeight + 'px' }">
        <div class="nav-left active">
          <ul>
            <li>
              <router-link :to="{name:'backstage.index'}" class="left-c" :class="{active: $route.name == 'backstage.index'}"><i
                class="icon iconfont icon-xinwen"></i>首页
              </router-link>
            </li>
            <li v-show="newsS">
              <router-link :to="{name:'backstage.news'}" class="left-c"
                           :class="{active: $route.name == 'backstage.news'||$route.name == 'backstage.news.detail'}"><i class="icon iconfont icon-xinwen"></i>新闻管理
              </router-link>
            </li>
            <li v-show="noticeS">
              <router-link :to="{name:'backstage.notice'}" class="left-c"
                           :class="{active: $route.name == 'backstage.notice'||$route.name == 'backstage.notice.detail'}"><i
                class="icon iconfont icon-gonggao"></i>动态管理
              </router-link>
            </li>
            <li v-show="meetingS">
              <router-link :to="{name:'backstage.meeting'}" class="left-c"
                           :class="{active: $route.name == 'backstage.meeting'||$route.name == 'backstage.meeting.detail'}" ><i
                class="icon iconfont icon-huiyi"></i>会议管理
              </router-link>
            </li>
            <li v-show="planS">
              <router-link :to="{name:'backstage.plan'}" class="left-c"
                           :class="{active: $route.name == 'backstage.plan'||$route.name == 'backstage.plan.detail'}"><i
                class="icon iconfont icon-huiyi"></i>空域规划
              </router-link>
            </li>
            <li v-show="manageS">
              <router-link :to="{name:'backstage.manage'}" class="left-c"
                           :class="{active: $route.name == 'backstage.manage'||$route.name == 'backstage.manage.detail'}"><i
                class="icon iconfont icon-huiyi"></i>空域管理
              </router-link>
            </li>
            <li v-show="designS">
              <router-link :to="{name:'backstage.design'}" class="left-c"
                           :class="{active: $route.name == 'backstage.design'||$route.name == 'backstage.design.detail'}"><i
                class="icon iconfont icon-huiyi"></i>程序设计
              </router-link>
            </li>
            <li v-show="energyS">
              <router-link :to="{name:'backstage.energy'}" class="left-c"
                           :class="{active: $route.name == 'backstage.energy'||$route.name == 'backstage.energy.detail'}"><i
                class="icon iconfont icon-huiyi"></i>节能减排
              </router-link>
            </li>
            <li v-show="userS">
              <router-link :to="{name:'backstage.user'}" class="left-c"
                           :class="{active: $route.name == 'backstage.user'}"><i
                class="icon iconfont icon-yonghuguanli"></i>用户管理
              </router-link>
            </li>
            <li v-show="classifyS">
              <router-link :to="{name:'backstage.classify'}" class="left-c"
                           :class="{active: $route.name == 'backstage.classify'}"><i
                class="icon iconfont icon-yijianfankui"></i>分类管理
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="view">
        <slot name="right-view"></slot>
      </div>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="editPassword"
      width="20%"
      class="tip-dialog pass-top">
      <div class="content">
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="80px"
                 class="demo-ruleForm">
          <el-form-item label="原始密码" prop="passOld">
            <el-input type="password" v-model="ruleForm2.passOld" autocomplete="off"  placeholder="请输入原始密码"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass" >
            <el-input type="password" v-model="ruleForm2.pass" autocomplete="off" placeholder="请输入6-18位数字或字母" ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass" >
            <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off" placeholder="请再次输入密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm2')" class="confirm">提交</el-button>
          <el-button @click="resetForm('ruleForm2')" class="cancel">重置</el-button>
        </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: 'PHeader',
    data() {
      var validatePass = (rule, value, callback) => {
        const reg = /^[0-9a-zA-Z]*$/g;
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(reg.test(value)){
          callback();
        } else {
          return callback(new Error('密码只能为字母和数字'));
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        newsS: false,
        noticeS: false,
        meetingS: false,
        userS: false,
        classifyS: false,
        planS:false,
        manageS:false,
        designS:false,
        energyS:false,
        isActive: 1,
        isLeftActive: 1,
        isLeftNav: 1,
        offHeight: 0,
        editPassword: false,
        ruleForm2: {
          passOld: '',
          pass: '',
          checkPass: ''
        },
        userName: storage.get('userName'),
        rules2: {
          passOld: [
            {required: true, message: '请输入旧密码', trigger: 'blur'},
          ],
          pass: [
            {validator: validatePass, trigger: 'blur'},
            // {required: true, message: '请输入新密码', trigger: 'blur'},
            {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}

          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'},
            {required: true, message: '请再次输入密码', trigger: 'blur'},
          ]
        },
        auth: []
      }
    },
    methods: {
      getAuto() {
        this.auth = storage.getJson('auth')
        console.log(this.auth)
        for (var i = 0; i < this.auth.length; i++) {
          if (this.auth[i] == 1) {
            this.newsS = true
          } else if (this.auth[i] == 2) {
            this.noticeS = true
          } else if (this.auth[i] == 3) {
            this.meetingS = true
          } else if (this.auth[i] == 4) {
            this.userS = true
          } else if (this.auth[i] == 5) {
            this.classifyS = true
          }else if (this.auth[i] == 6) {
            this.planS = true
          }else if (this.auth[i] == 7) {
            this.manageS = true
          }else if (this.auth[i] == 8) {
            this.designS = true
          }else if (this.auth[i] == 9) {
            this.energyS = true
          }
        }
      },
      OpenPassword() {
        this.editPassword = true
        if (this.$refs.ruleForm2) {
          this.$refs.ruleForm2.clearValidate();
        }
      },
      // 修改密码提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          console.log(this.ruleForm2)
          if (valid) {
            let params = {};
            params['uName'] = storage.get('userName');
            params['id'] = storage.get('sysid');
            params['uPasswd'] = this.ruleForm2.passOld;
            params['NewuPasswd'] = this.ruleForm2.pass;
            console.log(params)
            API.post('/ususer/changepasswd', params, {Authorization: storage.get('token')}).then((res) => {
              console.log(res.data)
              if (res.data.code == 200) {
                this.editPassword = false;
                this.$message({
                  type: 'success',
                  message: '密码修改成功!需重新登录生效'
                });
                storage.delete('Authorization');
                storage.delete('userName');
                storage.delete('auth');
                storage.delete('token');
                storage.delete('sysid');
                this.$router.push({name: 'login'})
              } else if (res.data.code == 1001) {
                this.signOut()
              } else {
                this.$message({
                  type: 'error',
                  message: '密码修改失败!'+ res.data.message
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      switcher(number) {
        this.isLeftActive = number;
      },
      // 退出登陆
      exit() {
        this.$confirm('您确定要退出管理平台?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          storage.delete('Authorization');
          storage.delete('userName');
          storage.delete('auth');
          storage.delete('token');
          storage.delete('sysid');
          this.$message({
            type: 'success',
            message: '您已成功退出!'
          });
          let that = this
          setTimeout(function () {
            that.$router.push({name: 'login'})
          }, 300)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });
        });
      },
      signOut() {
        this.$message({
          type: 'error',
          message: '登录失效，请重新登录!'
        });
        storage.delete('Authorization');
        storage.delete('userName');
        storage.delete('auth');
        storage.delete('token');
        storage.delete('sysid');
        this.$router.push({name: 'login'})
      }
    },
    mounted() {
      let hei = document.documentElement.clientHeight - 110;
      // console.log(hei)
      this.offHeight = hei;
      // console.log(this.offHeight)
      this.getAuto()
    }
  }
</script>

<style lang="less" scoped>
  @import "../assets/styles/edit-pop.less";

  .tip-dialog .el-dialog .dialog-footer .el-button {
    margin-left: 0;
  }

  .up-header {
    min-width: 1200px;
    position: inherit;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /*font-size: 18px;*/
    /*font-weight: bold;*/
    .pass-top {
      .el-dialog {
        .el-dialog__body {
          .content {
            padding: 10px 0;
          }
        }
      }
    }

    .demo-ruleForm {
      .el-form-item {
        .el-form-item__label {
          width: 80px;
        }
        .el-form-item__content {
          margin-left: 85px;
        }
      }
    }

    .nav-box {
      width: 100%;
      background-color: #026ab3;
      height: 75px;
      .up-nav {
        width: 90%;
        height: 100%;
        margin: auto;
        .logo {
          .name {
            float: left;
            padding-left: 20px;
            font-size: 18px;
            color: #fff;
            line-height: 75px;
          }
        }
      }
    }
  }

  .up-nav img {
    float: left;
    margin-top: 0.8%;
    width: 50px;
  }

  .welcome {
    float: right;
    height: 75px;
    overflow: hidden;
    line-height: 75px;
    font-size: 13px;
    color: #d5e0ee;
    .user {
      cursor: pointer;
      margin-right: 20px;
      .iconfont {
        font-size: 18px;
        margin-right: 10px;
      }
    }
    .exit {
      cursor: pointer;
      margin-right: 5px;
      .iconfont {
        font-size: 18px;
        margin-right: 10px;
      }
    }
  }

  .header-nav li {
    list-style: none;
    float: left;
    width: 12%;
    text-align: left;
    margin-top: 30px;
  }

  .nav-left {
    background-color: #003b64;
    position: absolute;
    width: 16%;
    height: 100%;
    font-weight: bolder;
    font-size: 15px;
    li {
      list-style: none;
      height: 65px;
      line-height: 65px;
      .left-c {
        display: block;
        text-decoration: none;
        color: #fff;
        &:hover {
          background: #fff;
          color: #003b64;
        }
        &.active {
          background: #fff;
          color: #003b64;
        }
      }
      .iconfont {
        font-size: 15px;
        margin-right: 10px;
      }
    }
  }

  .p-content {
    width: 100%;
    position: relative;
    overflow: hidden;
    .p-left {
      float: left;
      /*min-height: 880px;*/
      min-height: 1px;
      width: 16%;
    }
    .view {
      float: left;
      width: 84%;
      padding: 0 5% 0 2%;
      box-sizing: border-box;
    }
  }

</style>
