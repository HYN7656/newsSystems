<template>
  <div class="backstage-news-page">
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
          prop="fTitle"
          label="标题"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="fCreateTime"
          label="创建时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="uname"
          label="创建者"
          width="100">
        </el-table-column>
        <el-table-column
          prop="fReleaseTime"
          label="发布时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="top"
          label="置顶"
          width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="look" @click="toggleTop(scope.row.id,scope.row.fTop)">
              {{scope.row.fTop == 1 ? "取消置顶" : "置顶"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="250">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="release" @click="Release(scope.row.id,scope.row.fStatus)"
                       v-show="!scope.row.fbStatus">发布
            </el-button>
            <el-button type="text" size="small" class="release" @click="ReleaseNo(scope.row.id,scope.row.fStatus)"
                       v-show="scope.row.fbStatus">取消发布
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
    <el-dialog title="添加新闻" :visible.sync="addPop" class="tip-dialog" :close-on-click-modal="false">
      <el-form :model="addObject" status-icon :rules="rules" ref="addObject" label-width="80px" class="demo-ruleForm">
        <div class="content">
          <div class="cell">
            <el-form-item label="标题：" prop="fTitle">
              <!--<span class="name">标题：</span>-->
              <el-input v-model="addObject.fTitle" placeholder="请输入内容" class="flew-input"></el-input>
            </el-form-item>
          </div>
          <el-row>
            <el-col :span="11">
              <div class="cell">
                <el-form-item label="作者：" prop="fAuthor">
                  <!--<span class="name">作者：</span>-->
                  <el-input v-model="addObject.fAuthor" placeholder="请输入内容" class="flew-input"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="11" :offset="2">
              <div class="cell">
                <!--<span class="name">来源：</span>-->
                <el-form-item label="来源：" prop="fFrom">
                  <el-input v-model="addObject.fFrom" placeholder="请输入内容" class="flew-input"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <div class="cell">
                <span class="name">缩略图：</span>
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrlImg()"
                  :show-file-list="false"
                  :on-success="succImgAdd"
                  :headers="myHeaders">
                  <img v-if="addObject.fImgUrl" :src="addObject.fImgUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </el-col>
            <el-col :span="11" :offset="2">
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
                  :before-upload="beforeUpload"
                  :on-exceed="handleExceed"
                  :on-success="succAdd"
                  :on-remove="remAdd"
                  :headers="myHeaders">
                  <el-button size="small" type="primary" slot="trigger">选择文件</el-button>
                  <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </div>
            </el-col>
          </el-row>
          <div class="cell" style="margin-top: 20px;">
            <span class="name">内容：</span>
            <quill-editor ref="myTextEditor"
                          v-model="addObject.fContent"
                          :options="editorOption"
                          @change="onAddChange($event)"
                          style="height: 500px">
            </quill-editor>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSave('addObject')" class="confirmAdd" :loading='loadingBtn'> 确 定
        </el-button>
        <el-button @click="addPop = false;loadingBtn=false" class="cancelAdd">取 消</el-button>
      </div>
    </el-dialog>
    <!--编辑弹框-->
    <el-dialog title="编辑" :visible.sync="editPop" class="tip-dialog" :close-on-click-modal="false">
      <el-form :model="editObject" status-icon :rules="rules" ref="editObject" label-width="80px" class="demo-ruleForm">
        <div class="content">
          <div class="cell">
            <el-form-item label="标题：" prop="fTitle">
              <!--<span class="name">标题：</span>-->
              <el-input v-model="editObject.fTitle" placeholder="请输入内容" class="flew-input"></el-input>
            </el-form-item>
          </div>
          <el-row>
            <el-col :span="11">
              <div class="cell">
                <el-form-item label="作者：" prop="fAuthor">
                  <!--<span class="name">作者：</span>-->
                  <el-input v-model="editObject.fAuthor" placeholder="请输入内容" class="flew-input"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="11" :offset="2">
              <div class="cell">
                <el-form-item label="来源：" prop="fFrom">
                  <!--<span class="name">来源：</span>-->
                  <el-input v-model="editObject.fFrom" placeholder="请输入内容" class="flew-input"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <div class="cell">
                <span class="name">缩略图：</span>
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrlImg()"
                  :show-file-list="false"
                  :on-success="succImgEdit"
                  :headers="myHeaders">
                  <img v-if="editObject.fImgUrl" :src="editObject.fImgUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </el-col>
            <el-col :span="11" :offset="2">
              <div class="cell">
                <span class="name">上传附件：</span>
                <el-upload
                  ref="Editupload"
                  class="upload-demo"
                  :action="uploadUrl()"
                  :file-list="EditfileList"
                  :multiple="true"
                  :limit="5"
                  :before-upload="beforeUpload"
                  :on-exceed="handleExceed"
                  :on-success="succEdit"
                  :on-remove="remEdit"
                  :headers="myHeaders">
                  <el-button size="small" type="primary" slot="trigger">选择文件</el-button>
                  <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </div>
            </el-col>
          </el-row>
          <div class="cell" style="margin-top: 20px;">
            <span class="name">内容：</span>
            <quill-editor ref="myTextEditor"
                          v-model="editObject.fContent"
                          :options="editorOption"
                          @change="onEditorChange($event)"
                          style="height: 500px">
            </quill-editor>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSave('editObject')" class="confirmTip" :loading='loadingBtn'>确 定
        </el-button>
        <el-button @click="editPop = false;loadingBtn=false" class="cancelTip">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import config from "@/config/config.js";
  import {quillEditor} from 'vue-quill-editor';
  import * as Quill from 'quill'; //引入编辑器
  //quill编辑器的字体
  var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif'];
  var Font = Quill.import('formats/font');
  Font.whitelist = fonts; //将字体加入到白名单
  Quill.register(Font, true);

  export default {
    name: '',
    components: {quillEditor},
    data() {
      return {
        abc: false,
        loadingBtn: false,
        loading: false,
        editPop: false,
        addPop: false,
        fb: true,
        // fSystemId: 1,
        // 搜索初始化
        SearchInp: '',
        // 删除选择初始化
        multipleSelection: [],
        activeTableDataId: [],
        activeTableDataId2: '',
        // 校验
        rules: {
          fTitle: [
            {required: true, message: '必填', trigger: 'blur'},
            {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
          ],
          fAuthor: [
            {required: true, message: '必填', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          fFrom: [
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],

        },
        addObject: {
          fTitle: '',
          fContent: '',
          fContents: '',
          furl: '',
          fImgUrl: '',
          fAuthor: '',
          fFrom: '',
          fEnclUrl: '',
          fEnclName: ''
        },
        myHeaders: {Authorization: storage.get('token')},
        editObject: {
          fTitle: '',
          fContent: '',
          fContents: '',
          furl: '',
          fImgUrl: '',
          fAuthor: '',
          fFrom: '',
          fEnclUrl: '',
          fEnclName: ''
        },
        AddfileList: [],
        EditfileList: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        // 富文本配置
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],

              [{'header': 1}, {'header': 2}],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'script': 'sub'}, {'script': 'super'}],
              // [{ 'indent': '-1'}, { 'indent': '+1' }],
              [{'direction': 'rtl'}],

              [{'size': []}],
              [{'header': [1, 2, 3, 4, 5, 6, false]}],

              [{'color': []}, {'background': []}],
              [{'font': fonts}],    //把上面定义的字体数组放进来

              [{'align': []}],

              ['clean'],
              ['image', 'video']
            ]
          },
          theme: 'snow'
        },
        tableData: [],
        num: 0,
        ImgUrl: '',
        searchNum: 0,
        EditName: ''
      }
    },
    computed: {},
    methods: {
      // 页面初始化
      getPage() {
        let params = {};
        params['page'] = this.currentPage;
        params['count'] = this.pageSize;
        API.get('/newsInfo/FindAll', params, {Authorization: storage.get('token')}).then((res) => {
          if (res.data.code == 200) {
            // console.log(res.data);
            this.tableData = res.data.data;
            this.total = res.data.count;
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].fStatus == '1') {
                this.tableData[i].fbStatus = true;
              } else {
                this.tableData[i].fbStatus = false;
              }
            }
            // console.log(this.tableData);
            //this.currentPage = 4
          } else if (res.data.code == 1001) {
            this.signOut();
          } else {
            // console.log(res.data)
          }
        })
      },
      // 搜索
      search() {
        // console.log(this.SearchInp);
        let params = {};
        params['title'] = this.SearchInp;
        params['page'] = this.currentPage;
        params['count'] = this.pageSize;
        API.get('/newsInfo/FindBytitle', params, {Authorization: storage.get('token')}).then((res) => {
          // console.log(res.data);
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.total = res.data.count;
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].fStatus == '1') {
                this.tableData[i].fbStatus = true;
              } else {
                this.tableData[i].fbStatus = false;
              }
            }
          } else if (res.data.code == 1001) {
            this.signOut();
          } else {
            console.log(res.data);
          }
        })
      },
      goReset() {
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchNum = 1;
        this.search();
      },
      // 新增
      addOpen() {
        this.addPop = true;
        this.loadingBtn = false;
        this.num = 0;
        this.AddfileList = [];
        this.addObject = {
          fTitle: '',
          fContent: '',
          fContents: '',
          furl: '',
          fImgUrl: '',
          fEnclName: '',
          fAuthor: '',
          fFrom: '',
          fEnclUrl: ''
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
            this.num++;
            if (this.num == 1) {
              this.loadingBtn = true;
              // 上传数据
              var arr = [];
              var arr2 = [];
              for (var i = 0; i < this.AddfileList.length; i++) {
                if (this.AddfileList[i].response.code == '200') {
                  arr.push(this.AddfileList[i].response.data.revealImage);
                  arr2.push(this.AddfileList[i].response.data.imageName);
                }
              }
              this.addObject.fEnclUrl = arr.join(',');
              this.addObject.fEnclName = arr2.join(',');
              let params = {};
              params['fTitle'] = this.addObject.fTitle;
              params['fContent'] = this.addObject.fContent;
              params['fContents'] = this.addObject.fContents.replace(/[\r\n]/g, "");
              params['fImgUrl'] = this.addObject.furl;
              params['fEnclUrl'] = this.addObject.fEnclUrl;
              params['fEnclName'] = this.addObject.fEnclName;
              params['fAuthor'] = this.addObject.fAuthor;
              params['fFrom'] = this.addObject.fFrom;
              params['fSystemId'] = storage.get('sysid');
              // console.log(params);
              API.post('/newsInfo/create', params, {Authorization: storage.get('token')}).then((res) => {
                // console.log(res.data);
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
                  this.num = 0;
                }
              })
            } else {
              return;
            }
          } else {
            this.loadingBtn = false;
          }
        })
      },
      // 新增图片上传
      succImgAdd(response, file, fileList) {
        // console.log(response);
        let fileName = file.name;
        let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
        if (regex.test(fileName.toLowerCase())) {
          this.addObject.furl = response.data.revealImage;
          this.addObject.fImgUrl = URL.createObjectURL(file.raw);
        } else {
          this.$message.error('请选择图片文件');
        }
      },
      // 新增上传功能成功
      succAdd(response, file, fileList) {
        this.AddfileList = fileList;
      },
      // 新增上传功能删除
      remAdd(file, fileList) {
        this.AddfileList = fileList;
      },
      // 上传大小限制
      beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 100     //这里做文件大小限制
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过 100MB!',
            type: 'warning'
          });
        }
        return isLt2M
      },
      // 编辑
      editOpen(id) {
        if (this.$refs.editObject) {
          this.$refs.editObject.clearValidate();
        }
        this.editPop = true;
        this.loadingBtn = false;
        this.num = 0;
        this.EditfileList = [];
        this.EditName = '';
        this.editObject = {
          fTitle: '',
          fContent: '',
          fContents: '',
          furl: '',
          fImgUrl: '',
          fEnclName: '',
          fAuthor: '',
          fFrom: '',
          fEnclUrl: ''
        }
        let params = {};
        params['id'] = id;
        API.get('/newsInfo/FindById', params, {Authorization: storage.get('token')}).then((res) => {
          console.log(res.data);
          if (res.data.code == 200) {
            var arr = Object.assign({}, res.data.data.data);
            this.ImgUrl = res.data.data.data.fImgUrl;
            this.editObject = arr;
            this.EditName = arr.fTitle;
            this.editObject.fImgUrl = config.baseURL + arr.fImgUrl;
            this.editObject.furl = this.editObject.fImgUrl;
            // 上传列表
            this.EditfileList = res.data.data.file;
            var obj = [];
            for (var i = 0; i < res.data.data.file.length; i++) {
              obj.push({url: res.data.data.file[i].fenclUrl, name: res.data.data.file[i].fenclName});
            }
            this.EditfileList = obj;
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
            if (this.EditName == this.editObject.fTitle) {
              this.num++;
              if (this.num == 1) {
                this.loadingBtn = true;
                // 上传部分
                var arr = [];
                var arr2 = [];
                for (var i = 0; i < this.EditfileList.length; i++) {
                  if (this.EditfileList[i].response && this.EditfileList[i].response.code == '200') {
                    arr.push(this.EditfileList[i].response.data.revealImage);
                    arr2.push(this.EditfileList[i].response.data.imageName);
                  } else {
                    arr.push(this.EditfileList[i].url);
                    arr2.push(this.EditfileList[i].name);
                  }
                }
                this.editObject.fEnclUrl = arr.join(',');
                this.editObject.fEnclName = arr2.join(',');

                function find(str, cha, num) {
                  var x = str.indexOf(cha);
                  for (var i = 0; i < num - 1; i++) {
                    x = str.indexOf(cha, x + 1);
                  }
                  return x;
                }

                let params = {};
                params['id'] = this.editObject.id;
                params['fTitle'] = this.editObject.fTitle;
                params['fContent'] = this.editObject.fContent;
                params['fContents'] = this.editObject.fContents.replace(/[\r\n]/g, "");
                params['fImgUrl'] = this.ImgUrl;
                params['fEnclUrl'] = this.editObject.fEnclUrl;
                params['fEnclName'] = this.editObject.fEnclName;
                params['fAuthor'] = this.editObject.fAuthor;
                params['fFrom'] = this.editObject.fFrom;
                params['fSystemId'] = storage.get('sysid');
                console.log(params)
                API.post('/newsInfo/newsUpdate', params, {Authorization: storage.get('token')}).then((res) => {
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
                      message: '编辑失败!' + res.data.message
                    });
                    this.loadingBtn = false;
                    this.num = 0;
                  }
                })
              } else {
                return;
              }
            } else {
              let tit = {};
              tit['title'] = this.editObject.fTitle;
              API.get('/newsInfo/findByName', tit, {Authorization: storage.get('token')}).then((res) => {
                if (res.data.code == 200) {
                  this.num++;
                  if (this.num == 1) {
                    this.loadingBtn = true;
                    // 上传部分
                    var arr = [];
                    var arr2 = [];
                    for (var i = 0; i < this.EditfileList.length; i++) {
                      if (this.EditfileList[i].response && this.EditfileList[i].response.code == '200') {
                        arr.push(this.EditfileList[i].response.data.revealImage);
                        arr2.push(this.EditfileList[i].response.data.imageName);
                      } else {
                        arr.push(this.EditfileList[i].url);
                        arr2.push(this.EditfileList[i].name);
                      }
                    }
                    this.editObject.fEnclUrl = arr.join(',');
                    this.editObject.fEnclName = arr2.join(',');

                    function find(str, cha, num) {
                      var x = str.indexOf(cha);
                      for (var i = 0; i < num - 1; i++) {
                        x = str.indexOf(cha, x + 1);
                      }
                      return x;
                    }

                    let params = {};
                    params['id'] = this.editObject.id;
                    params['fTitle'] = this.editObject.fTitle;
                    params['fContent'] = this.editObject.fContent;
                    params['fContents'] = this.editObject.fContents.replace(/[\r\n]/g, "");
                    params['fImgUrl'] = this.ImgUrl;
                    params['fEnclUrl'] = this.editObject.fEnclUrl;
                    params['fEnclName'] = this.editObject.fEnclName;
                    params['fAuthor'] = this.editObject.fAuthor;
                    params['fFrom'] = this.editObject.fFrom;
                    params['fSystemId'] = storage.get('sysid');
                    // console.log(params)
                    API.post('/newsInfo/newsUpdate', params, {Authorization: storage.get('token')}).then((res) => {
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
                          message: '编辑失败!' + res.data.message
                        });
                        this.loadingBtn = false;
                        this.num = 0;
                      }
                    })
                  } else {
                    return;
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
        })
      },
      // 编辑图片上传
      succImgEdit(response, file, fileList) {
        let fileName = file.name;
        let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
        if (regex.test(fileName.toLowerCase())) {
          this.editObject.furl = response.data.revealImage;
          this.ImgUrl = response.data.revealImage;
          // console.log(this.editObject.furl)
          this.editObject.fImgUrl = URL.createObjectURL(file.raw);
        } else {
          this.$message.error('请选择图片文件');
        }
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
      // 上传图片地址
      uploadUrlImg() {
        return config.baseURL + '/newsInfo/newsFile';
      },
      // 上传文件地址
      uploadUrl() {
        return config.baseURL + '/newsInfo/newsFiles';
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
          params['fSystemId'] = storage.get('sysid');
          API.delete('/newsInfo/newsDelete', params, {Authorization: storage.get('token')}).then((res) => {
            if (res.data.code == 200) {
              this.currentPage = 1;
              this.pageSize = 10;
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
          });
        });
      },
      // 选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
        this.$confirm('您确定要删除这' + this.multipleSelection.length + '条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {};
          params['id'] = this.activeTableDataId2;
          params['fSystemId'] = storage.get('sysid');
          API.delete('/newsInfo/newsDelete', params, {Authorization: storage.get('token')}).then((res) => {
            // console.log(res.data);
            if (res.data.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.currentPage = 1;
              this.pageSize = 10;
              this.getPage();
            } else if (res.data.code == 1001) {
              this.signOut();
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
          });
        });
      },
      // 置顶
      toggleTop(id, fTop) {
        let params = {};
        params['id'] = id;
        params['fTop'] = fTop;
        params['fSystemId'] = storage.get('sysid');
        // console.log(params);
        API.post('/newsInfo/newsupdatetop', params, {Authorization: storage.get('token')}).then((res) => {
          // console.log(res.data);
          if (res.data.code == 200) {
            this.getPage();
          } else if (res.data.code == 1001) {
            this.signOut();
          } else {
            this.$message({
              type: 'error',
              message: '置顶失败!' + res.data.message
            });
          }
        });
      },
      //发布
      Release(id, fStatus) {
        let params = {};
        params['id'] = id;
        params['fStatus'] = fStatus;
        params['fSystemId'] = storage.get('sysid');
        // console.log(params);
        API.post('/newsInfo/newsrelease', params, {Authorization: storage.get('token')}).then((res) => {
          // console.log(res.data);
          if (res.data.code == 200) {
            this.getPage();
          } else if (res.data.code == 1001) {
            this.signOut();
          } else {
            this.$message({
              type: 'error',
              message: '发布失败!' + res.data.message
            });
          }
        });
      },
      // 取消发布
      ReleaseNo(id, fStatus) {
        let params = {};
        params['id'] = id;
        params['fStatus'] = fStatus;
        params['fSystemId'] = storage.get('sysid');
        // console.log(params);
        API.post('/newsInfo/newsrelease', params, {Authorization: storage.get('token')}).then((res) => {
          // console.log(res.data);
          if (res.data.code == 200) {
            this.getPage();
          } else if (res.data.code == 1001) {
            this.signOut();
          } else {
            this.$message({
              type: 'error',
              message: '取消发布失败!' + res.data.message
            });
          }
        });
      },
      // 查看
      linkDetail(id) {
        this.$router.push({name: 'backstage.news.detail', query: {id: id}});
      },
      // 翻页器：当前页，同时上一页下一页也能获取当前页
      handleCurrentChange(val) {
        this.currentPage = val;
        if (this.searchNum == '1') {
          this.search();
        } else {
          this.getPage();
        }

        // console.log(val);
      },
      // 翻页器：选择10条还是20条、
      handleSizeChange(val) {
        this.pageSize = val;
        if (this.searchNum == '1') {
          this.search();
        } else {
          this.getPage();
        }
        // console.log(val);
      },
      // 编辑器
      onEditorChange({editor, html, text}) {
        this.editObject.fContent = html;
        this.editObject.fContents = text;
      },
      onAddChange({editor, html, text}) {
        this.addObject.fContent = html;
        this.addObject.fContents = text;
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


</style>

