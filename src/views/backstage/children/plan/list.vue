<template>
  <div class="backstage-news-page">
    <div class="search-nav">
      <div class="input-table">
        <el-input v-model="SearchInp" placeholder="请输入关键词汇" class="input-search"></el-input>
        <i class="el-icon-search icon"></i>
      </div>
      <div class="select-table">
        <el-select v-model="SearchValue" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.iName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="btn-cell" @click="search">搜索</div>
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
          prop="title"
          label="标题"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="uname"
          label="创建者"
          width="100">
        </el-table-column>
        <el-table-column
          prop="releaseTime"
          label="发布时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="top"
          label="置顶"
          width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="look" @click="toggleTop(scope.row.id,scope.row.top)">
              {{scope.row.top == 1 ? "取消置顶" : "置顶"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="250">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="release" @click="Release(scope.row.id,scope.row.fbStatus)"
                       v-show="!scope.row.status">发布
            </el-button>
            <el-button type="text" size="small" class="release" @click="ReleaseNo(scope.row.id,scope.row.fbStatus)"
                       v-show="scope.row.status">取消发布
            </el-button>
            <el-button type="text" size="small" class="look" @click="linkDetail(scope.row.id)">查看</el-button>
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
    <el-dialog title="添加" :visible.sync="addPop" class="tip-dialog" :close-on-click-modal="false" :show-close="false">
    <el-form :model="addObject" status-icon :rules="rules" ref="addObject" label-width="80px" class="demo-ruleForm">
      <div class="content">
        <el-row>
          <el-col :span="11">
            <div class="cell">
              <el-form-item label="标题：" prop="title">
                <!--<span class="name">标题：</span>-->
                <el-input v-model="addObject.title" placeholder="请输入内容" class="flew-input"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="11" :offset="2">
            <div class="cell">
              <span class="name">来源：</span>
              <el-input v-model="addObject.pFrom" placeholder="请输入内容" class="flew-input"></el-input>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"><div class="cell">
            <el-form-item label="作者：" prop="author">
              <!--<span class="name">作者：</span>-->
              <el-input v-model="addObject.author" placeholder="请输入内容" class="flew-input"></el-input>
            </el-form-item>
          </div>
          </el-col>
          <el-col :span="11" :offset="2">
            <div class="cell">
              <el-form-item label="分类：" prop="iId">
                <!--<span class="name">分类：</span>-->
                <el-select v-model="addObject.iId" placeholder="请选择活动区域" class="flew-input" style="width: 332.48px">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.iName"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <div class="cell">
            <span class="name">上传附件：</span>
            <el-upload
              ref="Addupload"
              class="upload-demo"
              :action="uploadUrl()"
              :file-list="AddfileList"
              :auto-upload="true"
              :multiple="true"
              :limit="5"
              :on-exceed="handleExceed"
              :on-success="succAdd"
              :on-remove="remAdd"
              :headers="myHeaders">
              <el-button size="small" type="primary" slot="trigger">选择文件</el-button>
              <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </div>
        </el-row>
        <div class="cell" style="margin-top: 20px;">
          <span class="name">内容：</span>
          <quill-editor ref="myTextEditor"
                        v-model="addObject.content"
                        :options="editorOption"
                        @change="onAddChange($event)">
          </quill-editor>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addSave('addObject')" class="confirmAdd" :loading='loadingBtn'>确 定</el-button>
      <el-button @click="addPop = false;loadingBtn=false" class="cancelAdd">取 消</el-button>
    </div>
  </el-dialog>

    <!--编辑弹框-->
    <el-dialog title="编辑" :visible.sync="editPop" class="tip-dialog" :close-on-click-modal="false" :show-close="false">
      <el-form :model="editObject" status-icon :rules="rules" ref="editObject" label-width="80px" class="demo-ruleForm">
        <div class="content">
          <el-row>
            <el-col :span="11">
              <div class="cell">
                <el-form-item label="标题：" prop="title">
                  <!--<span class="name">标题：</span>-->
                  <el-input v-model="editObject.title" placeholder="请输入内容" class="flew-input"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="11" :offset="2">
              <div class="cell">
                <span class="name">来源：</span>
                <el-input v-model="editObject.pFrom" placeholder="请输入内容" class="flew-input"></el-input>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <div class="cell">
                <el-form-item label="作者：" prop="author">
                  <!--<span class="name">作者：</span>-->
                  <el-input v-model="editObject.author" placeholder="请输入内容" class="flew-input"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="11" :offset="2">
              <div class="cell">
                <el-form-item label="分类：" prop="iId">
                  <!--<span class="name">分类：</span>-->
                  <el-select v-model="editObject.iId" placeholder="请选择活动区域" class="flew-input" style="width: 332.48px">
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.iName"
                      :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <div class="cell">
              <span class="name">上传附件：</span>
              <el-upload
                ref="Editupload"
                class="upload-demo"
                :action="uploadUrl()"
                :file-list="EditfileList"
                :multiple="true"
                :limit="5"
                :on-exceed="handleExceed"
                :on-success="succEdit"
                :on-remove="remEdit"
                :headers="myHeaders">
                <el-button size="small" type="primary" slot="trigger">选择文件</el-button>
                <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
              </el-upload>
            </div>
          </el-row>
          <div class="cell" style="margin-top: 20px;">
            <span class="name">内容：</span>
            <quill-editor ref="myTextEditor"
                          v-model="editObject.content"
                          :options="editorOption"
                          @change="onEditorChange($event)">
            </quill-editor>
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
  import config from "@/config/config.js";
  import {quillEditor} from 'vue-quill-editor'
  import * as Quill from 'quill' //引入编辑器
  //quill编辑器的字体
  var fonts = ['SimSun', 'SimHei','Microsoft-YaHei','KaiTi','FangSong','Arial','Times-New-Roman','sans-serif'];
  var Font = Quill.import('formats/font');
  Font.whitelist = fonts; //将字体加入到白名单
  Quill.register(Font, true);

  export default {
    name: '',
    components: {quillEditor},
    data() {
      return {
        loadingBtn:false,
        loading: false,
        editPop: false,
        addPop: false,
        fb: true,
        // fSystemId: 1,
        // 搜索初始化
        SearchInp: '',
        SearchValue : '',
        // 删除选择初始化
        multipleSelection: [],
        activeTableDataId: [],
        activeTableDataId2: '',
        // 校验
        rules: {
          title: [
            { required: true, message: '必填', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          author: [
            { required: true, message: '必填', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          iId: [
            { required: true, message: '必填', trigger: 'change' },
          ],
        },
        options : [],
        addObject: {
          title: '',
          content: '',
          contents: '',
          author: '',
          pFrom: '',
          enclUrl: '',
          enclName: '',
          iId : ''
        },
        myHeaders :{Authorization:storage.get('token')},
        editObject: {
          title: '',
          content: '',
          contents: '',
          enclName : '',
          author: '',
          pFrom: '',
          enclUrl: '',
          iId : ''
        },
        AddfileList: [],
        EditfileList: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        // 富文本配置
        editorOption: {
          modules:{
            toolbar:[
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],

              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'script': 'sub'}, { 'script': 'super' }],
              // [{ 'indent': '-1'}, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],

              [{ 'size': [] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': fonts }],    //把上面定义的字体数组放进来

              [{ 'align': [] }],

              ['clean'],
              ['image','video']
            ]
          },
          theme:'snow'
        },
        tableData: [],
        top : 0,
        num:0
      }
    },
    computed: {},
    methods: {

      // 页面初始化
      getPage() {
        let params = {};
        params['page'] = this.currentPage;
        params['count'] = this.pageSize;
        API.get('/plan/findAll', params,{Authorization:storage.get('token')}).then((res) => {
          if (res.data.code == 200) {
            console.log(res.data)
            this.tableData = res.data.data;
            this.total = res.data.count;
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].fStatus == '1') {
                this.tableData[i].fbStatus = true;
              } else {
                this.tableData[i].fbStatus = false;
              }
            }
            console.log(this.tableData)
            //this.currentPage = 4
          } else if(res.data.code == 1001){
            this.signOut()
          } else {
            // console.log(res.data)
          }
        })
      },
      classify() {
        let params = {};
        params['type'] = 2;
        API.get('/ification/findByType', params,{Authorization:storage.get('token')}).then((res) => {
          console.log(res.data)
          if(res.data.code == 200){
            this.options = res.data.data;
          }else if(res.data.code == 1001){
            this.signOut()
          }
          console.log(this.options)
        })
      },
      // 搜索
      search() {
        console.log(this.SearchInp)
        let params = {};
        params['title'] = this.SearchInp;
        params['iId'] = this.SearchValue;
        params['page'] = this.currentPage;
        params['count'] = this.pageSize;
        API.get('/plan/findAll', params,{Authorization:storage.get('token')}).then((res) => {
          console.log(res.data)
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.total = res.data.count;
          } else if(res.data.code == 1001){
            this.signOut()
          } else {
            console.log(res.data)
          }
        })
      },
      // 新增
      addOpen() {
        this.addPop = true;
        this.loadingBtn = false;
        this.num = 0;
        this.AddfileList = [];
        this.addObject = {
          title: '',
          content: '',
          contents: '',
          enclName : '',
          author: '',
          pFrom: '',
          enclUrl: '',
          iId : ''
        }
        if(this.$refs.addObject){
          this.$refs.addObject.clearValidate();
        }else {
          return
        }
      },
      // 新增保存
      addSave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.num ++;
            if(this.num == 1) {
              this.loadingBtn = true;
              // 上传数据
              var arr = [];
              var arr2 = [];
              console.log(this.AddfileList)
              for (var i = 0; i < this.AddfileList.length; i++) {
                if (this.AddfileList[i].response.code == '200') {
                  arr.push(this.AddfileList[i].response.data.revealImage);
                  arr2.push(this.AddfileList[i].response.data.imageName);
                }
              }
              this.addObject.enclUrl = arr.join(',');
              this.addObject.enclName = arr2.join(',');
              let params = {};
              params['title'] = this.addObject.title;
              params['content'] = this.addObject.content;
              params['contents'] = this.addObject.contents.replace(/[\r\n]/g, "");
              params['iId'] = this.addObject.iId;
              params['enclUrl'] = this.addObject.enclUrl;
              params['enclName'] = this.addObject.enclName;
              params['author'] = this.addObject.author;
              params['pFrom'] = this.addObject.pFrom;
              params['systemId'] = storage.get('sysid');
              console.log(params)
              API.post('/plan/create', params,{Authorization:storage.get('token')}).then((res) => {
                console.log(res.data)
                if (res.data.code == 200) {
                  this.addPop = false;
                  this.getPage();
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });
                } else if(res.data.code == 1001){
                  this.signOut()
                } else {
                  this.$message({
                    type: 'error',
                    message: '新增失败!'
                  });
                }
              })
            }else {
              return;
            }
          }
        })
      },
      // 新增上传功能成功
      succAdd(response, file, fileList) {
        this.AddfileList = fileList;
      },
      // 新增上传功能删除
      remAdd(file, fileList) {
        this.AddfileList = fileList;
      },
      // 编辑
      editOpen(id) {
        if(this.$refs.editObject){
          this.$refs.editObject.clearValidate();
        }
        this.editPop = true;
        this.loadingBtn = false;
        this.num = 0;
        this.EditfileList = [];
        this.editObject = {
          title: '',
          content: '',
          contents: '',
          enclName : '',
          author: '',
          pFrom: '',
          enclUrl: '',
          iId : ''
        }
        let params = {};
        params['id'] = id;
        API.get('/plan/FindById', params,{Authorization:storage.get('token')}).then((res) => {
          console.log(res.data)
          if (res.data.code == 200) {
            this.editObject = res.data.data.data;
            // this.editObject.furl = this.editObject.fImgUrl;
            // 上传列表
            this.EditfileList = res.data.data.file;
            var obj = [];
            for (var i = 0; i < res.data.data.file.length; i++) {
              obj.push({url: res.data.data.file[i].fenclUrl, name: res.data.data.file[i].fenclName})
            }
            this.EditfileList = obj;
          } else if(res.data.code == 1001){
            this.signOut()
          } else {
            console.log(res.data)
          }
        })
      },
      // 编辑保存
      editSave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.num ++;
            if(this.num == 1) {
              this.loadingBtn = true;
              // 上传部分
              var arr = [];
              var arr2 = [];
              for (var i = 0; i < this.EditfileList.length; i++) {
                if (this.EditfileList[i].response && this.EditfileList[i].response.code == '200') {
                  arr.push(this.EditfileList[i].response.data.revealImage);
                  arr2.push(this.EditfileList[i].response.data.imageName);
                } else {
                  arr.push(this.EditfileList[i].url)
                  arr2.push(this.EditfileList[i].name)
                }
              }
              this.editObject.enclUrl = arr.join(',');
              this.editObject.enclName = arr2.join(',');
              let params = {};
              params['id'] = this.editObject.id;
              params['title'] = this.editObject.title;
              params['content'] = this.editObject.content;
              params['content'] = this.editObject.content;
              if(this.editObject.contents){
                params['contents'] = this.editObject.contents.replace(/[\r\n]/g, "");
              }else {
                params['contents'] = '';
              }
              params['iId'] = this.editObject.iId;
              params['enclUrl'] = this.editObject.enclUrl;
              params['enclName'] = this.editObject.enclName;
              params['author'] = this.editObject.author;
              params['pFrom'] = this.editObject.pFrom;
              params['systemId'] = storage.get('sysid');
              console.log(params)
              API.put('/plan/newsUpdate', params,{Authorization:storage.get('token')}).then((res) => {
                if (res.data.code == 200) {
                  this.editPop = false;
                  this.getPage();
                  this.$message({
                    type: 'success',
                    message: '编辑成功!'
                  });
                } else if(res.data.code == 1001){
                  this.signOut()
                } else {
                  this.$message({
                    type: 'error',
                    message: '编辑失败!'
                  });
                }
              })
            }else {
              return;
            }
          }
        })
      },
      // 编辑上传功能成功
      succEdit(response, file, fileList) {
        this.EditfileList = fileList;
      },
      // 编辑上传功能删除
      remEdit(file, fileList) {
        this.EditfileList = fileList;
      },
      // 文件上传部分
      handleExceed(files, fileList) {
        this.$message.warning(`当前已有${fileList.length} 个文件，限制选择5个文件，本次选择了 ${files.length} 个文件`);
      },
      // 上传文件地址
      uploadUrl(){
        return config.baseURL + '/newsInfo/newsFiles'
      },
      // 单个删除
      del(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {};
          params['id'] = id;
          params['systemId'] = storage.get('sysid');
          API.delete('/plan/delete', params,{Authorization:storage.get('token')}).then((res) => {
            if (res.data.code == 200) {
              this.getPage();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else if(res.data.code == 1001){
              this.signOut()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
          })
        })
      },
      // 选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 选择删除
      selectDel() {
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: 'info',
            message: '请选择需要删除的数据'
          });
          return
        }
        this.multipleSelection.forEach(ele => {
          this.activeTableDataId.push(ele.id)
        })
        this.activeTableDataId2 = this.activeTableDataId.join(',');
        this.$confirm('您确定要删除这' + this.multipleSelection.length + '条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {};
          params['id'] = this.activeTableDataId2;
          params['systemId'] = storage.get('sysid');
          API.delete('/plan/delete', params,{Authorization:storage.get('token')}).then((res) => {
            console.log(res.data)
            if (res.data.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getPage();
            } else if(res.data.code == 1001){
              this.signOut()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
          })
        })
      },
      // 置顶
      toggleTop(id, fTop) {
        if(fTop == 1){
          this.top = 0;
        }else if(fTop == 0){
          this.top = 1;
        }
        let params = {};
        params['id'] = id;
        params['top'] = this.top;
        params['systemId'] = storage.get('sysid');
        console.log(params)
        API.put('/plan/newsUpdate', params,{Authorization:storage.get('token')}).then((res) => {
          console.log(res.data)
          if (res.data.code == 200) {
            this.getPage()
          } else if(res.data.code == 1001){
            this.signOut()
          } else {
            this.$message({
              type: 'error',
              message: '置顶失败!'
            });
          }
        })
      },
      //发布
      Release(id, fStatus) {
        let params = {};
        params['id'] = id;
        params['status'] = 1;
        params['systemId'] = storage.get('sysid');
        console.log(params)
        API.put('/plan/newsUpdate', params,{Authorization:storage.get('token')}).then((res) => {
          console.log(res.data)
          if (res.data.code == 200) {
            this.getPage()
          } else if(res.data.code == 1001){
            this.signOut()
          } else {
            this.$message({
              type: 'error',
              message: '发布失败!'
            });
          }
        })
      },
      // 取消发布
      ReleaseNo(id, fStatus) {
        let params = {};
        params['id'] = id;
        params['status'] = 0;
        params['systemId'] = storage.get('sysid');
        console.log(params)
        API.put('/plan/newsUpdate', params,{Authorization:storage.get('token')}).then((res) => {
          console.log(res.data)
          if (res.data.code == 200) {
            this.getPage()
          } else if(res.data.code == 1001){
            this.signOut()
          } else {
            this.$message({
              type: 'error',
              message: '取消发布失败!'
            });
          }
        })
      },
      // 查看
      linkDetail(id) {
        this.$router.push({name: 'backstage.plan.detail', query: {id: id}})
      },
      // 翻页器：当前页，同时上一页下一页也能获取当前页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getPage()
        console.log(val);
      },
      // 翻页器：选择10条还是20条、
      handleSizeChange(val) {
        this.pageSize = val;
        this.getPage()
        console.log(val);
      },
      // 编辑器
      onEditorChange({editor, html, text}) {
        this.editObject.content = html
        this.editObject.contents = text
      },
      onAddChange({editor, html, text}) {
        this.addObject.content = html
        this.addObject.contents =text
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
        this.$router.push({name:'login'})
      }
    },
    created() {
      this.getPage();
      this.classify();

    },
    mounted() {
      // you can use current editor object to do something(editor methods)
      console.log('this is my editor', this.editor)
      // this.editor to do something...
    }

  }
</script>

<style lang="less">
  @import "./../../../../assets/styles/edit-pop.less";
  @import "./../../../../assets/styles/base2";
  .search-nav {
    .input-table {
      width: 35% !important;
    }
    .select-table {
      float: left;
      margin-left: 30px;
      position: relative;
      width: 15%;
      .el-input__inner {
        padding-left: 30px;
        height: 35px;
        line-height: 35px;
        font-size: 13px;
      }
    }
  }

</style>

