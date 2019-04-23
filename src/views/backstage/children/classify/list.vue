<template>
  <div class="backstage-news-page backstage-classify-page-classify">
    <div class="search-nav">
      <div class="btn-cell" @click="selectDel">删除</div>
      <div class="btn-cell" @click="addOpen">添加</div>
    </div>
    <div class="result-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        show-overflow-tooltip="true"
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
          prop="iName"
          label="分类名称">
        </el-table-column>
        <el-table-column
          prop="pname"
          label="类别">
        </el-table-column>
        <el-table-column
          prop="iCreateTime"
          label="创建时间"
          width="220">
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="edit" @click="editOpen(scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" class="del" @click="del(scope.row.id)">删除</el-button>
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
    <el-dialog title="添加分类" :visible.sync="addPop" class="tip-dialog small-dia" :close-on-click-modal="false">
      <el-form :model="addObject" status-icon :rules="rules" ref="addObject" label-width="100px" class="demo-ruleForm">
      <div class="content">
        <div class="cell">
          <el-form-item label="类别：">
            <el-select v-model="addObject.iType" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in option"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
       <!-- <div class="cell" v-show="AddtypeShow">
          <el-form-item label="类别：">
            <el-select v-model="addObject.iType" placeholder="请选择" style="width: 100%" >
              <el-option
                v-for="item in option"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>-->
        <div class="cell">
          <el-form-item label="分类名称：" prop="iName">
            <!--<span class="name">分类：</span>-->
            <el-input v-model="addObject.iName" placeholder="请输入内容" class="flew-input"></el-input>
          </el-form-item>
        </div>
      </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSave('addObject')" class="confirmAdd" :loading='loadingBtn'>确 定</el-button>
        <el-button @click="addPop = false;loadingBtn=false" class="cancelAdd">取 消</el-button>
      </div>
    </el-dialog>
    <!--编辑弹框-->
    <el-dialog title="编辑" :visible.sync="editPop" class="tip-dialog small-dia" :close-on-click-modal="false">
      <el-form :model="editObject" status-icon :rules="rules" ref="editObject" label-width="100px" class="demo-ruleForm">
      <div class="content">
        <div class="cell">
          <el-form-item label="类别：">
            <el-select v-model="editPname" placeholder="请选择" style="width: 100%" @change="editChang" disabled="disabled">
              <el-option
                v-for="item in option"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <!--<div class="cell" v-show="EdittypeShow">
          <el-form-item label="类别：">
            <el-select v-model="editObject.iType" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in option"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>-->
        <div class="cell">
          <el-form-item label="分类名称：" prop="iName">
          <!--<span class="name">分类：</span>-->
          <el-input v-model="editObject.iName" placeholder="请输入内容" class="flew-input"></el-input>
          </el-form-item>
        </div>
      </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSave('editObject')" class="confirmTip" :loading='loadingBtn'>确 定</el-button>
        <el-button @click="editPop = false;loadingBtn=false" class="cancelTip">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    name: '',
    components: {},
    data() {
      return {
        loadingBtn:false,
        loading: false,
        editPop: false,
        addPop: false,
        // iSystemId : 1,
        // 删除选择初始化
        multipleSelection: [],
        activeTableDataId: [],
        activeTableDataId2: '',
        option:[],
        addObject: {
          iName: '',
          // iPid : '',
          iType : ''
        },
        editObject: {
          iName: '',
          // iPid : '',
          iType: ''
        },
        editPname:'',
        editPnameId:'',
        tableData: [],
        rules: {
          iName: [
            { required: true, message: '必填', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ]
        },
        // treeListP:[],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        EditName:'',
        num:0,
        // AddtypeShow : false,
        // EdittypeShow : false
      }
    },
    computed: {},
    methods: {
      // 页面初始化
      getPage() {
        let params = {};
        params['page'] = this.currentPage;
        params['count'] = this.pageSize;
        API.get('/ification/FindAll', params,{Authorization:storage.get('token')}).then((res) => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.total = res.data.count;
            // console.log(res.data);
            /*var arr = res.data.data.ificationList;
            var arr2 = [];
            this.tableData = arr2.concat(arr);
            this.tableData.pop();
            this.treeListP = res.data.data.treeList;
            for(var i=0;i<arr.length;i++){
              if(typeof arr[i] != 'object'){
                this.total = arr[i];
              }
            }*/
          } else if(res.data.code == 1001){
            this.signOut();
          } else {
            console.log(res.data);
          }
        })
      },
      // 类别初始化
      getClassify(){
        let params = {};
        API.get('/ification/typeAll', params,{Authorization:storage.get('token')}).then((res) => {
          if (res.data.code == 200) {
            // console.log(res.data);
            this.option = res.data.data
          } else if(res.data.code == 1001){
            this.signOut();
          } else {
            console.log(res.data);
          }
        })
      },
      // 新增
      addOpen() {
        this.addPop = true;
        this.loadingBtn = false;
        this.num = 0;
        this.addObject = {
          iName: '',
          iType : ''
        }
        if(this.$refs.addObject){
          this.$refs.addObject.clearValidate();
        }else {
          return;
        }
      },
      // 新增保存
      addSave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.num ++;
            if(this.num == 1){
              this.loadingBtn = true;
              let params = {};
              params['iName'] = this.addObject.iName;
              // params['iPid'] = this.addObject.iPid;
              params['iType'] = this.addObject.iType;
              params['iSystemId'] = storage.get('sysid');
              // console.log(params);
              API.post('/ification/create', params,{Authorization:storage.get('token')}).then((res) => {
                // console.log(res.data)
                if (res.data.code == 200) {
                  this.addPop = false;
                  this.getPage();
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });
                } else if(res.data.code == 1001){
                  this.signOut();
                } else {
                  this.loadingBtn = false;
                  this.num = 0;
                  this.$message({
                    type: 'error',
                    message: '新增失败!'+ res.data.message
                  });
                }
              });
            }else {
              return;
            }

          }
        });
      },
      // 编辑
      editOpen(id) {
        if(this.$refs.editObject){
          this.$refs.editObject.clearValidate();
        }
        this.editPop = true;
        this.loadingBtn = false;
        this.editObject = {
          iName: '',
          // iPid : '',
          iType : ''
        }
        this.num = 0;
        let params = {};
        params['id'] = id;
        API.get('/ification/FindByid', params,{Authorization:storage.get('token')}).then((res) => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.editObject = res.data.data.classIfication;
            this.EditName = res.data.data.classIfication.iName;
            this.editPname = res.data.data.pname;
            this.editPnameId = this.editObject.iType;
          } else if(res.data.code == 1001){
            this.signOut();
          } else {
            console.log(res.data);
          }
        })
      },
      editChang(){
        this.editPnameId = this.editPname;
      },
      // 编辑保存
      editSave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.EditName == this.editObject.iName){
              this.num ++;
              if(this.num == 1){
                this.loadingBtn = true;
                // console.log(this.editPnameId)
                let params = {};
                params['id'] = this.editObject.id;
                params['iName'] = this.editObject.iName;
                params['iPid'] = this.editObject.iPid;
                params['iType'] =this.editPnameId;
                params['iSystemId'] = storage.get('sysid');
                console.log(params)
                API.post('/ification/ificatUpdate', params,{Authorization:storage.get('token')}).then((res) => {
                  // console.log(res.data);
                  if (res.data.code == 200) {
                    this.editPop = false;
                    this.getPage();
                    this.$message({
                      type: 'success',
                      message: '编辑成功!'
                    });
                  } else if(res.data.code == 1001){
                    this.signOut();
                  } else {
                    this.$message({
                      type: 'error',
                      message: '编辑失败!'+ res.data.message
                    });
                    this.loadingBtn = false;
                    this.num = 0;
                  }
                });
              }else {
                return
              }
            }else {
              let tit = {};
              tit['iName'] = this.editObject.iName;
              API.get('/ification/findByName', tit, {Authorization: storage.get('token')}).then((res) => {
                if (res.data.code == 200) {
                  this.num ++;
                  if(this.num == 1){
                    this.loadingBtn = true;
                    // console.log(this.editPnameId)
                    let params = {};
                    params['id'] = this.editObject.id;
                    params['iName'] = this.editObject.iName;
                    params['iPid'] = this.editObject.iPid;
                    params['iType'] =this.editPnameId;
                    params['iSystemId'] = storage.get('sysid');
                    console.log(params)
                    API.post('/ification/ificatUpdate', params,{Authorization:storage.get('token')}).then((res) => {
                      // console.log(res.data);
                      if (res.data.code == 200) {
                        this.editPop = false;
                        this.getPage();
                        this.$message({
                          type: 'success',
                          message: '编辑成功!'
                        });
                      } else if(res.data.code == 1001){
                        this.signOut();
                      } else {
                        this.$message({
                          type: 'error',
                          message: '编辑失败!'+ res.data.message
                        });
                        this.loadingBtn = false;
                        this.num = 0;
                      }
                    });
                  }else {
                    return
                  }
                } else if (res.data.code == 1001) {
                  this.signOut();
                } else {
                  this.$message({
                    type: 'error',
                    message: '编辑失败!' + res.data.message
                  });
                  this.loadingBtn = false;
                  this.num = 0;
                }
              })
            }


          }
        });
      },
      // 单个删除
      del(id) {
        this.$confirm('删除后分类下的内容以后将无法查看, 请确认是否一定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {};
          params['id'] = id;
          params['iSystemId'] = storage.get('sysid');
          API.delete('/ification/ificatDelete', params,{Authorization:storage.get('token')}).then((res) => {
            if (res.data.code == 200) {
              this.currentPage = 1;
              this.pageSize = 10;
              this.getPage();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else if(res.data.code == 1001){
              this.signOut();
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'+res.data.message
              });
            }
          });
        });
      },
      // 选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
        // console.log(this.multipleSelection);
      },
      // 选择删除
      selectDel() {
        this.activeTableDataId = [];
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: 'info',
            message: '请选择需要删除的数据'
          });
          return;
        }
        this.multipleSelection.forEach(ele => {
          this.activeTableDataId.push(ele.id);
        })
        this.activeTableDataId2 = this.activeTableDataId.join(',');
        this.$confirm('删除后分类下的内容以后将无法查看, 您确定要删除这' + this.multipleSelection.length + '条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {};
          params['id'] = this.activeTableDataId2;
          params['iSystemId'] = storage.get('sysid');
          API.delete('/ification/ificatDelete', params,{Authorization:storage.get('token')}).then((res) => {
            // console.log(res.data);
            if (res.data.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.currentPage = 1;
              this.pageSize = 10;
              this.getPage();
            } else if(res.data.code == 1001){
              this.signOut();
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'+res.data.message
              });
            }
          });
        });
      },
      // 翻页器：当前页，同时上一页下一页也能获取当前页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getPage();
        // console.log(val);
      },
      // 翻页器：选择10条还是20条、
      handleSizeChange(val) {
        this.pageSize = val;
        this.getPage();
        // console.log(val);
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
    },
    created() {
      this.getPage();
      this.getClassify();
    }

  }
</script>

<style lang="less">
  @import "./../../../../assets/styles/edit-pop.less";
  @import "./../../../../assets/styles/base2";

  .backstage-classify-page-classify {
    .tip-dialog {
      .el-dialog {
        .el-dialog__footer {
          padding: 0px 20px 20px;
        }
      }
    }
    .search-nav {
      .btn-cell {
        float: right!important;
      }
    }

    .result-table {
      .el-table__body-wrapper {
        .el-table__row {
          td {
            text-align: center;
          }
          td:nth-of-type(3) {
            text-align: center;
          }
        }
      }
    }
    .pagination-table {
      margin-top: 40px;
    }
    .small-dia {
      .el-dialog {
        width: 400px !important;
      }
    }
  }


</style>

