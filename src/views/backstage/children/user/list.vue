<template>
  <div class="backstage-news-page backstage-user-page">
    <div class="search-nav">
      <div class="input-table">
        <el-input v-model="SearchInp" placeholder="请输入关键词汇" class="input-search"></el-input>
        <i class="el-icon-search icon"></i>
      </div>
      <div class="btn-cell" @click="goReset">搜索</div>
      <div class="btn-cell" @click="addOpen">添加</div>
      <div class="btn-cell" @click="selectDel">删除</div>
    </div>
    <div class="result-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        border
        v-loading="loading"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="55"
          class="column">
        </el-table-column>
        <el-table-column
          prop="uName"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="uCreateTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="qname"
          label="创建人">
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="look" @click="linkDetail(scope.row.id)">查看</el-button>
            <el-button type="text" size="small" class="edit" @click="editOpen(scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" class="del" @click="del(scope.row.id,scope.row.uName)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-table">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--添加弹框-->
    <el-dialog title="添加用户" :visible.sync="addPop" class="tip-dialog" :close-on-click-modal="false">
      <el-form :model="addObject" status-icon :rules="rules" ref="addObject" label-width="80px" class="demo-ruleForm">
        <div class="content">
          <div class="cell">
            <el-form-item label="用户名：" prop="uName">
              <!--<span class="name">用户名：</span>-->
              <el-input v-model="addObject.uName" placeholder="请输入用户名" class="flew-input"></el-input>
            </el-form-item>
          </div>
          <div class="cell qx">
            <span class="name" style="padding-left: 15px;"><span style="color: #f56c6c">*</span>权限：</span>
            <div class="qx-div">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="AddAllhandleChecked">全选
              </el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="checkedCities" @change="AddhandleChecked">
                <el-checkbox v-for="p in power" :label="p.qName" :key="p.id">{{p.qName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSave('addObject')" class="confirmAdd" :loading='loadingBtn'>确 定</el-button>
        <el-button @click="addPop = false;loadingBtn=false" class="cancelAdd">取 消</el-button>
      </div>
    </el-dialog>
    <!--编辑弹框-->
    <el-dialog v-bind:title="title" :visible.sync="editPop" class="tip-dialog" :close-on-click-modal="false">
      <el-form :model="editObject" status-icon :rules="rules" ref="editObject" label-width="80px" class="demo-ruleForm">
        <div class="content">
          <div class="cell">
            <el-form-item label="用户名：" prop="uName">
              <!--<span class="name">用户名：</span>-->
              <el-input v-model="editObject.uName" placeholder="请输入内容" class="flew-input"
                        :disabled="true"></el-input>
            </el-form-item>
          </div>
          <div class="cell qx">
            <span class="name" style="padding-left: 15px;">权限：</span>
            <div class="qx-div">
              <el-checkbox :indeterminate="EditisIndeterminate" v-model="EditcheckAll" @change="EditAllhandleChecked"
                           v-bind:disabled="look">全选
              </el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="EditcheckedCities" @change="EdithandleChecked">
                <el-checkbox v-for="p in power" :label="p.qName" :key="p.id" v-bind:disabled="look">{{p.qName}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="!look">
        <el-button type="primary" @click="editSave('editObject')" class="confirmTip" :loading='loadingBtn'>确 定</el-button>
        <el-button @click="editPop = false;loadingBtn=false" class="cancelTip">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: '',
    data() {
      var validatePass = (rule, value, callback) => {
        const reg = /^[0-9a-zA-Z]*$/g;
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if(reg.test(value)){
          callback();
        } else {
          return callback(new Error('用户名只能为字母、数字或组合'));
        }
      };
      return {
        loadingBtn:false,
        loading: false,
        editPop: false,
        addPop: false,
        checkAll: false,
        look: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        uSystemId: storage.get('sysid'),
        title: "编辑",
        // 搜索初始化
        SearchInp: '',
        // 删除选择初始化
        multipleSelection: [],
        activeTableDataId: [],
        activeTableDataName:[],
        activeTableDataId2: '',
        tableData: [],
        // 权限项
        power: [],
        // 权限打开页面被选中的
        checkedCities: [],
        isIndeterminate: false,
        checkAll: false,
        // 编辑权限打开页面被选中的
        EditcheckedCities: [],
        EditisIndeterminate: true,
        EditcheckAll: false,
        UName:'',
        addObject: {
          uName: '',
          powerList: []
        },
        editObject: {
          userName: '',
          powerList: [],
          id: ''
        },
        rules: {
          uName: [
            {validator: validatePass, trigger: 'blur'},
            {min:6 , max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
          ]
        },
        searchNum:0
      }
    },
    methods: {
      // 页面初始化
      getPage() {
        let params = {};
        params['page'] = this.currentPage;
        params['count'] = this.pageSize;
        API.get('/ususer/FindAll', params, {Authorization: storage.get('token')}).then((res) => {
          if (res.data.code == 200) {
            // console.log(res.data);
            this.tableData = res.data.data;
            this.total = res.data.count;
          } else if (res.data.code == 1001) {
            this.signOut();
          } else {
            console.log(res.data);
          }
        })
        API.get('/juris/FindAll', params, {Authorization: storage.get('token')}).then((res) => {
          // console.log(res.data);
          if (res.data.code == 200) {
            this.power = res.data.data;
          } else if (res.data.code == 1001) {
            this.signOut();
          } else {
            console.log(res.data);
          }
        })
      },
      // 搜索
      search() {
        let params = {};
        params['name'] = this.SearchInp;
        params['page'] = this.currentPage;
        params['count'] = this.pageSize;
        API.get('/ususer/FindByName', params, {Authorization: storage.get('token')}).then((res) => {
          // console.log(res.data);
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.total = res.data.count;
          } else if (res.data.code == 1001) {
            this.signOut();
          } else {
            console.log(res.data);
          }
        })
      },
      goReset(){
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchNum = 1;
        this.search();
      },
      // 新增
      addOpen() {
        this.checkedCities = [];
        this.addPop = true;
        this.loadingBtn = false;
        this.isIndeterminate = true;
        this.addObject = {
          uName: '',
          powerList: []
        }
        if (this.$refs.addObject) {
          this.$refs.addObject.clearValidate();
        } else {
          return;
        }
      },
      // 新增保存
      addSave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!this.addObject.powerList.length) {
              this.$message({
                type: 'error',
                message: '请选择权限!'
              });
            } else {
              this.loadingBtn = true;
              let params = {};
              params['uName'] = this.addObject.uName;
              params['qId'] = this.addObject.powerList;
              params['uSystemId'] = this.uSystemId;
              // console.log(params);
              API.post('/ususer/create', params, {Authorization: storage.get('token')}).then((res) => {
                // console.log(res.data)
                if (res.data.code == 200) {
                  this.addPop = false;
                  this.getPage();
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });
                } else if (res.data.code == 1001) {
                  this.signOut();
                } else {
                  this.$message({
                    type: 'error',
                    message: '新增失败!' + res.data.message
                  });
                  this.loadingBtn = false;
                }
              });
            }
          }
        });
      },
      // 新增权限
      AddAllhandleChecked(val) {
        var cityOptions = [];
        var cityOptionsKey = [];
        for (var i = 0; i < this.power.length; i++) {
          cityOptions.push(this.power[i].qName);
          cityOptionsKey.push(this.power[i].id);
        }
        this.checkedCities = val ? cityOptions : [];
        this.addObject.powerList = val ? cityOptionsKey : [];
        this.isIndeterminate = false;
      },
      AddhandleChecked(value) {
        // console.log(value);
        this.addObject.powerList = [];
        var ctOption = value;
        for (var i = 0; i < ctOption.length; i++) {
          for (var j = 0; j < this.power.length; j++) {
            if (ctOption[i] == this.power[j].qName) {
              this.addObject.powerList.push(this.power[j].id);
            }
          }
        }
        // console.log(this.addObject.powerList);
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.power.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.power.length;
      },
      // 编辑
      editOpen(id) {
        if (this.$refs.editObject) {
          this.$refs.editObject.clearValidate();
        }
        this.look = false;
        this.loadingBtn = false;
        this.title = "编辑";
        this.EditcheckedCities = [];
        this.editObject = {
          uName: '',
          powerList: []
        }
        var arr = [];
        this.editPop = true;
        let params = {};
        params['id'] = id;
        API.get('/ususer/FindByid', params, {Authorization: storage.get('token')}).then((res) => {
          // console.log(res.data);
          if (res.data.code == 200) {
            this.editObject = res.data.data;
            this.editObject.uName = res.data.data.uname;
            this.UName = res.data.data.uname;
            arr = res.data.data.qid;
            this.editObject.powerList = Array.prototype.slice.call(arr);
            this.editObject.powerList = arr;
            for (var i = 0; i < arr.length; i++) {
              for (var j = 0; j < this.power.length; j++) {
                if (arr[i] == this.power[j].id) {
                  this.EditcheckedCities.push(this.power[j].qName);
                  // this.editObject.powerList.push(this.power[j].id)
                }
              }
            }
            // console.log(this.EditcheckedCities);
            // console.log(this.editObject.powerList);
          } else if (res.data.code == 1001) {
            this.signOut();
          } else {
            console.log(res.data);
          }
        });
      },
      // 编辑保存
      editSave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!this.editObject.powerList || !this.editObject.powerList.length) {
              this.$message({
                type: 'error',
                message: '请选择权限!'
              });
            } else {
              if(this.UName == this.editObject.uName){
                this.loadingBtn = true;
                var params = {
                  qId: []
                };
                params['id'] = this.editObject.id;
                params['uName'] = this.editObject.uName;
                params['qId'] = this.editObject.powerList.join(',');
                params['uSystemId'] = this.uSystemId;
                // console.log(params);
                API.post('/ususer/update', params, {Authorization: storage.get('token')}).then((res) => {
                  // console.log(res.data)
                  if (res.data.code == 200) {
                    this.editPop = false;
                    this.getPage();
                    this.$message({
                      type: 'success',
                      message: '编辑成功!'+"重新登录才可生效"
                    });
                  } else if (res.data.code == 1001) {
                    this.signOut();
                  } else {
                    this.$message({
                      type: 'error',
                      message: '编辑失败!'+ res.data.message
                    });
                  }
                });
              }else {
                var name = {};
              name['name'] = this.editObject.uName;
              API.get('/ususer/shiroByName', name, {Authorization: storage.get('token')}).then((res) => {
                // console.log(res.data);
                if (res.data.code == 200) {
                  this.loadingBtn = true;
                  var params = {
                    qId: []
                  };
                  params['id'] = this.editObject.id;
                  params['uName'] = this.editObject.uName;
                  params['qId'] = this.editObject.powerList.join(',');
                  params['uSystemId'] = this.uSystemId;
                  // console.log(params);
                  API.post('/ususer/update', params, {Authorization: storage.get('token')}).then((res) => {
                    // console.log(res.data);
                    if (res.data.code == 200) {
                      this.editPop = false;
                      this.getPage();
                      this.$message({
                        type: 'success',
                        message: '编辑成功!'
                      });
                    } else if (res.data.code == 1001) {
                      this.signOut();
                    } else {
                      this.$message({
                        type: 'error',
                        message: '编辑失败!'+ res.data.message
                      });
                    }
                  });
                } else if (res.data.code == 1001) {
                  this.signOut();
                } else {
                  this.$message({
                    type: 'error',
                    message: '编辑失败!' + res.data.message
                  });
                }
              });
              }
            }
          }
        });
      },

      // 编辑权限
      EditAllhandleChecked(val) {
        var cityOptions = [];
        var cityOptionsKey = [];
        for (var i = 0; i < this.power.length; i++) {
          cityOptions.push(this.power[i].qName);
          cityOptionsKey.push(this.power[i].id);
        }
        this.EditcheckedCities = val ? cityOptions : [];
        this.editObject.powerList = val ? cityOptionsKey : [];
        // console.log(this.editObject.powerList);
        this.EditisIndeterminate = false;
      },
      EdithandleChecked(value) {
        // console.log(value);
        this.editObject.powerList = [];
        var ctOption = value;
        for (var i = 0; i < ctOption.length; i++) {
          for (var j = 0; j < this.power.length; j++) {
            if (ctOption[i] == this.power[j].qName) {
              this.editObject.powerList.push(this.power[j].id);
            }
          }
        }
        // console.log(this.editObject.powerList);
        let checkedCount = value.length;
        this.EditcheckAll = checkedCount === this.power.length;
        this.EditisIndeterminate = checkedCount > 0 && checkedCount < this.power.length;
      },
      // 选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
        // console.log(this.multipleSelection);
      },
      // 选择删除
      selectDel() {
        this.activeTableDataId = [];
        this.activeTableDataName = [];
        var num = 0;
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: 'info',
            message: '请选择需要删除的数据'
          });
          return
        }
        this.multipleSelection.forEach(ele => {
          this.activeTableDataId.push(ele.id);
          this.activeTableDataName.push(ele.uName)
        })
        this.activeTableDataId2 = this.activeTableDataId.join(',');
        this.$confirm('您确定要删除这' + this.multipleSelection.length + '条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for(var i=0;i<this.activeTableDataName.length;i++){
            if(this.activeTableDataName[i]=='admin'){
              num++;
            }
          }
          if(num>0){
            this.$message({
              type: 'error',
              message: '管理员不可删除!'
            });
            return;
          }else{
            let params = {};
            params['id'] = this.activeTableDataId2;
            params['uSystemId'] = storage.get('sysid');
            API.delete('/ususer/delete', params, {Authorization: storage.get('token')}).then((res) => {
              // console.log(res.data);
              if (res.data.code == 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getPage();
              } else if (res.data.code == 1001) {
                this.signOut();
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败!' + res.data.message
                });
              }
            });
          }
        });
      },
      // 单个删除
      del(id,name) {
        if(name == "admin"){
          this.$message({
            type: 'error',
            message: '管理员不可删除!'
          });
        }else {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = {};
            params['id'] = id;
            params['uSystemId'] = storage.get('sysid');
            API.delete('/ususer/delete', params, {Authorization: storage.get('token')}).then((res) => {
              // console.log(res.data);
              if (res.data.code == 200) {
                this.getPage();
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              } else if (res.data.code == 1001) {
                this.signOut();
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败!' + res.data.message
                });
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      // 翻页器：当前页，同时上一页下一页也能获取当前页
      handleCurrentChange(val) {
        this.currentPage = val;
        if(this.searchNum == '1'){
          this.search();
        }else {
          this.getPage();
        }
        // console.log(val);
      },
      // 翻页器：选择10条还是20条、
      handleSizeChange(val) {
        this.pageSize = val;
        if(this.searchNum == '1'){
          this.search();
        }else {
          this.getPage();
        }
        // console.log(val);
      },
      // 进入详情
      linkDetail(id) {
        this.editOpen(id);
        //this.$router.push({name:'backstage.meeting.detail',query:{id:id}})
        this.look = true;
        this.editPop = true;
        this.title = "详情";
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
        this.$router.push({name: 'login'});
      }
    },
    created() {
      this.getPage();
    },
    mounted() {
      // you can use current editor object to do something(editor methods)
      // console.log('this is my editor', this.editor);
      // this.editor to do something...
    }
  }
</script>

<style lang="less">
  @import "./../../../../assets/styles/edit-pop.less";
  @import "./../../../../assets/styles/base2";

  .backstage-user-page {
    .tip-dialog {
      .el-dialog {
        .el-dialog__footer {
          padding: 0px 20px 20px;
        }
      }
    }
    .el-table__body-wrapper {
      .el-table__row {
        td:nth-of-type(3) {
          text-align: center !important;
        }
      }
    }
    .qx {
      .qx-div {
        height: 50px;
        .el-checkbox {
          float: left;
        }
        .el-checkbox-group {
          float: left;
          margin-top: 15px;
        }
      }
    }
  }

</style>
