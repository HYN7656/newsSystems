<template>
  <div class="backstage-news-page backstage-notice-page">
    <div class="search-nav">
      <div class="input-table">
        <el-input v-model="SearchInp" placeholder="请输入关键词汇" class="input-search"></el-input>
        <i class="el-icon-search icon"></i>
      </div>
      <div class="select-table">
        <el-select v-model="SearchValue" placeholder="请选择" clearable>
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.iName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="btn-cell" @click="goReset">搜索</div>
      <div class="btn-cell" @click="addOpen">添加</div>
      <div class="btn-cell" @click="selectDel">删除</div>
    </div>
    <div class="result-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        show-overflow-tooltip="true"
        tooltip-effect="dark"
        v-loading="loading"
        border
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
          prop="nTitle"
          label="标题"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="iname"
          label="分类"
          width="100">
          <!--<template slot-scope="scope">
              <el-button type="text" size="small" class="edit">{{scope.row.classify}}</el-button>
          </template>-->
        </el-table-column>
        <el-table-column
          prop="nCreateTime"
          label="创建时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="uname"
          label="创建者"
          width="100">
        </el-table-column>
        <el-table-column
          prop="nReleaseTime"
          label="发布时间"
          width="120">
        </el-table-column>
        <el-table-column
          prop="top"
          label="置顶"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="look" @click="toggleTop(scope.row.id,scope.row.nTop)">
              {{scope.row.nTop == 1 ? "取消置顶" : "置顶"}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="release" @click="Release(scope.row.id,scope.row.nStatus)"
                       v-show="!scope.row.fbStatus">发布
            </el-button>
            <el-button type="text" size="small" class="release" @click="ReleaseNo(scope.row.id,scope.row.nStatus)"
                       v-show="scope.row.fbStatus">取消发布
            </el-button>
            <el-button type="text" size="small" class="look" @click="linkDetail(scope.row.id)">查看</el-button>
            <el-button type="text" size="small" class="edit" @click="editOpen(scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" class="del" @click="del(scope.row.id)">删除</el-button>
            <el-button type="text" size="small" class="tip" @click="tip(scope.row.id)">短信提醒</el-button>
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
    <!--短信提醒弹框-->
    <el-dialog title="短信提醒" :visible.sync="tipPop" class="tip-dialog footer-top" :close-on-click-modal="false">
      <el-dialog
        title="模板"
        :visible.sync="temPop"
        width="30%"
        append-to-body
        :close-on-click-modal="false">
        <div>
          <div class="mb-box" v-for="(l,index) in msgList" :key="l.key">
            <input type="radio" v-model="messAge" :name="'radio[]'" :value="l.content">
            <span>{{l.content}}</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="temPop = false">取 消</el-button>
            <el-button type="primary" @click="mbSave">确 定</el-button>
            </span>
      </el-dialog>
      <el-dialog
        title="用户选择"
        :visible.sync="userPop"
        append-to-body
        class="tip-dialog assign-detail-dialog"
        :close-on-click-modal="false"
      >
        <div class="pop-content">
          <div class="role-cell" style="width: 40%">
            <div class="role-cell-title">角色列表：</div>
            <div class="role-cell-content">
              <div
                class="user"
                v-for="(list,index) in userRoleData"

                @click="UserRoleClick(list.id)"
              >
                <i class="fa fa-user"></i>
                {{list.roleName}}
              </div>
            </div>
          </div>
          <div class="role-cell" style="width: 20%">
            <div class="role-cell-title">用户列表：</div>
            <div class="role-cell-content">
              <div
                class="user"
                v-for="(list,index) in userData"

                @click="userClick(list)"
              >
                <i class="fa fa-user"></i>
                {{list.uname}}
              </div>
            </div>
          </div>
          <div class="role-cell" style="width: 30%">
            <div class="role-cell-title">所选用户：</div>
            <div class="role-cell-content">
              <div
                class="user"
                v-for="(list,index) in chooseUserData"

                @click="delRoleClick(index)"
              >
                <i class="fa fa-user"></i>
                {{list.uname}}
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="saveAssign">确定分配</el-button>
        <el-button type="primary" @click="clearAssign">清除已选</el-button>
        <el-button type="info" @click="userPop = false" >关 闭</el-button>
      </span>
      </el-dialog>
      <div class="content">
        <div class="cell">
          <span class="name" style="line-height: 20px"> <span style="color: red">*</span>短信内容：</span>
          <el-input
            type="textarea"
            :rows="5"
            class="flew-input"
            placeholder="请输入内容"
            v-model="MsgText">
          </el-input>
          <span class="btn" @click="modelbox">模板</span>
        </div>
        <div class="cell">
          <span class="name"><span style="color: red">*</span>相关用户：</span>
          <el-input v-model="MsgUserInp" placeholder="请输入内容" class="flew-input input-user" disabled></el-input>
          <span class="btn" @click="userPop = true">选择</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="MesSave" class="confirm">确 定</el-button>
        <el-button @click="tipPop = false" class="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--添加弹框-->
    <el-dialog title="添加动态" :visible.sync="addPop" class="tip-dialog" :close-on-click-modal="false">
      <el-form :model="addObject" status-icon :rules="rules" ref="addObject" label-width="80px" class="demo-ruleForm">
        <div class="content">
          <div class="cell">
            <el-form-item label="标题：" prop="nTitle">
              <!--<span class="name">标题：</span>-->
              <el-input v-model="addObject.nTitle" placeholder="请输入内容" class="flew-input"></el-input>
            </el-form-item>
          </div>
          <div class="cell">
            <el-form-item label="分类：" prop="iId">
              <!--<span class="name">分类：</span>-->
              <el-select v-model="addObject.iId" placeholder="请选择活动区域" class="flew-input" style="width: 820px">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.iName"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-row>
            <el-col :span="11">
              <div class="cell">
                <el-form-item label="作者：" prop="nAuthor">
                  <!--<span class="name">作者：</span>-->
                  <el-input v-model="addObject.nAuthor" placeholder="请输入内容" class="flew-input"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="11" :offset="2">
              <div class="cell">
                <!--<span class="name">来源：</span>-->
                <el-form-item label="来源：" prop="nFrom">
                  <el-input v-model="addObject.nFrom" placeholder="请输入内容" class="flew-input"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
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
            <el-col :span="11" :offset="2">
            </el-col>
          </el-row>
          <div class="cell" style="margin-top: 20px;">
            <span class="name">内容：</span>
            <quill-editor ref="myTextEditor"
                          v-model="addObject.nContent"
                          :config="editorOption"
                          @change="onAddChange($event)"
                          style="margin-left: 23px;height: 300px">
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
    <el-dialog title="编辑" :visible.sync="editPop" class="tip-dialog" :close-on-click-modal="false">
      <el-form :model="editObject" status-icon :rules="rules" ref="editObject" label-width="80px" class="demo-ruleForm">
        <div class="content">
          <div class="cell">
            <el-form-item label="标题：" prop="nTitle">
              <!--<span class="name">标题：</span>-->
              <el-input v-model="editObject.nTitle" placeholder="请输入内容" class="flew-input"></el-input>
            </el-form-item>
          </div>
          <div class="cell">
            <el-form-item label="分类：" prop="iId">
              <!--<span class="name">分类：</span>-->
              <el-select v-model="editObject.iId" placeholder="请选择活动区域" class="flew-input" style="width: 820px">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.iName"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-row>
            <el-col :span="11">
              <div class="cell">
                <el-form-item label="作者：" prop="nAuthor">
                  <!--<span class="name">作者：</span>-->
                  <el-input v-model="editObject.nAuthor" placeholder="请输入内容" class="flew-input"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="11" :offset="2">
              <div class="cell">
                <el-form-item label="来源：" prop="nFrom">
                  <!--<span class="name">来源：</span>-->
                  <el-input v-model="editObject.nFrom" placeholder="请输入内容" class="flew-input"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
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
            <el-col :span="11" :offset="2">
            </el-col>
          </el-row>
          <div class="cell" style="margin-top: 20px;">
            <span class="name">内容：</span>
            <quill-editor ref="myTextEditor"
                          v-model="editObject.nContent"
                          :config="editorOption"
                          @change="onEditorChange($event)"
                          style="margin-left: 23px;height: 500px">
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
  import {quillEditor} from 'vue-quill-editor'
  import * as Quill from 'quill' //引入编辑器
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
        MsgText:'',
        MsgUserInp:'',
        // MsgUserInpId:[],
        MsgUserInpPhone:[],
        userRoleData: [],
        userData: [],
        chooseUserData: [],
        userPop: false,
        loadingBtn: false,
        loading: false,
        editPop: false,
        addPop: false,
        tipPop: false,
        innerTipPop: false,
        temPop:false,
        dialogVisible: false,
        // nSystemId : 1,
        // 搜索部分初始化
        SearchInp: '',
        SearchValue: '',
        options: [],
        tableData: [],
        // 删除选择初始化
        multipleSelection: [],
        activeTableDataId: [],
        activeTableDataId2: '',

        messAge: '',
        msgList: [],
        AddfileList: [],
        userList: [],
        addObject: {
          nTitle: '',
          nImgUrl: '',
          nurl: '',
          nEnclUrl: '',
          nEnclName: '',
          nContent: '',
          nContents: '',
          nAuthor: '',
          nFrom: '',
          iId: ''
        },
        myHeaders: {Authorization: storage.get('token')},
        editObject: {
          nTitle: '',
          nImgUrl: '',
          nurl: '',
          nEnclUrl: '',
          nEnclName: '',
          nContent: '',
          nContents: '',
          nAuthor: '',
          nFrom: '',
          iId: ''
        },
        rules: {
          nTitle: [
            {required: true, message: '必填', trigger: 'blur'},
            {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
          ],
          iId: [
            {required: true, message: '必填', trigger: 'change'},
          ],
          nAuthor: [
            {required: true, message: '必填', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          nFrom: [
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
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
        num: 0,
        searchNum: 0,
        EditName:''
      }
    },
    methods: {
      // 短信提醒
      tip(id) {
        this.tipPop = true;
        this.chooseUserData = [];
        this.MsgUserInp = '';
        // this.MsgUserInpId = [];
        this.MsgUserInpPhone = [];
        this.userData = [];
        this.MsgText = '';
        this.messAge = "";
      },
      // 短信保存
      MesSave() {
        if(this.MsgUserInpPhone.length>0){
          if(!this.MsgText){
            this.$message({
              type: 'error',
              message: '必须有短信内容！'
            });
          }else {
            let params = {};
            // params["userId"] = this.MsgUserInpId;
            params["Content"] = this.MsgText;
            params["phone"] = this.MsgUserInpPhone;
            params["type"] = 4;
            // console.log(params)
            API.post("/notice/sendMessage", params, {
              Authorization: storage.get("token")
            }).then(res => {
              // console.log(res.data)
              if (res.data.code == 200) {
                this.$message({
                  type: 'success',
                  message: '发送成功！'
                });
                this.tipPop = false;
              } else if (res.data.code == 1001) {
                this.signOut();
              } else {
                console.log(res.data.data.message);
              }
            });
          }
        }else {
          this.$message({
            type: 'error',
            message: '请选择用户！'
          });
        }
      },
      // 短信模板
      modelbox() {
        this.temPop = true;
      },
      // 短信模板保存
      mbSave() {
        this.temPop = false;
        // console.log(this.messAge)
        this.MsgText = this.messAge;
      },
      // 确定分配
      saveAssign(){
        // console.log(this.chooseUserData);
        // var arr=[];
        var arr2=[];
        var arr3=[];
        for(var i=0;i<this.chooseUserData.length;i++){
          // arr.push(this.chooseUserData[i].id);
          arr2.push(this.chooseUserData[i].uname);
          arr3.push(this.chooseUserData[i].umobilephone);
        }
        this.MsgUserInp = arr2.join(',');
        // this.MsgUserInpId = arr;
        this.MsgUserInpPhone = arr3;
        this.userPop = false;


      },
      // 用户列表
      UserRoleClick(id) {
        let params = {};
        params["RoleId"] = id;
        API.get("/Business/findByRoleId", params, {
          Authorization: storage.get("token")
        }).then(res => {
          // console.log(res.data)
          if (res.data.code == 200) {
            this.userData = res.data.data.data;
          } else if (res.data.code == 1001) {
            this.signOut();
          } else {
            console.log(res.data.data.message);
          }
        });
      },

      //角色列表
      getUser() {
        let params = {};
        API.get("/Business/findRoleAll ", params, {
          Authorization: storage.get("token")
        }).then(res => {
          // console.log(res.data)
          if (res.data.code == 200) {
            this.userRoleData = res.data.data;
          } else if (res.data.code == 1001) {
            this.signOut();
          } else {
            console.log(res.data);
          }
        });
      },
      // 模板列表
      getTem(){
        let params = {};
        API.get("/code/FindAll ", params, {
          Authorization: storage.get("token")
        }).then(res => {
          // console.log(res.data)
          if (res.data.code == 200) {
            this.msgList = res.data.data;
          } else if (res.data.code == 1001) {
            this.signOut();
          } else {
            console.log(res.data);
          }
        });
      },

      // 选择用户
      userClick(val) {
        if(this.chooseUserData.length>0){
          for(var i=0;i<this.chooseUserData.length;i++){
            if(this.chooseUserData[i].id == val.id) {
              return;
            }
          }
          this.chooseUserData.push(val);
        }else {
          this.chooseUserData.push(val);
        }
        // console.log(this.chooseUserData)
      },

      // 清除已选
      clearAssign() {
        this.chooseUserData = [];
      },
      // 点击右侧已选择的删除
      delRoleClick(idx) {
        this.chooseUserData.splice(idx, 1);
        // console.log(this.chooseUserData)
      },


// 页面初始化
      getPage() {
        let params = {};
        params['page'] = this.currentPage;
        params['count'] = this.pageSize;
        API.get('/notice/FindAll', params, {Authorization: storage.get('token')}).then((res) => {
          if (res.data.code == 200) {
            // console.log(res.data);
            // console.log(res.data);
            this.tableData = res.data.data;
            this.total = res.data.count;
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].nStatus == '1') {
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
      // 搜索
      search() {
        // console.log(this.SearchInp);
        let params = {};
        params['title'] = this.SearchInp;
        params['Iid'] = this.SearchValue;
        params['page'] = this.currentPage;
        params['count'] = this.pageSize;
        // console.log(params);
        API.get('/notice/FindBytitle', params, {Authorization: storage.get('token')}).then((res) => {
          // console.log(res.data);
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.total = res.data.count;
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].nStatus == '1') {
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
        });
      },
      goReset() {
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchNum = 1;
        this.search();
      },
      //新增
      addOpen() {
        this.addPop = true;
        this.loadingBtn = false;
        this.AddfileList = [];
        this.num = 0;
        this.addObject = {
          nTitle: '',
          nImgUrl: '',
          nurl: '',
          nEnclUrl: '',
          nEnclName: '',
          nContent: '',
          nContents: '',
          nAuthor: '',
          nFrom: '',
          iId: ''
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
              this.addObject.nEnclUrl = arr.join(',');
              this.addObject.nEnclName = arr2.join(',');
              let params = {};
              params['nTitle'] = this.addObject.nTitle;
              params['nContent'] = this.addObject.nContent;
              if (this.addObject.nContents) {
                params['nContents'] = this.addObject.nContents.replace(/[\r\n]/g, "");
              } else {
                params['nContents'] = '';
              }
              // params['nImgUrl'] = this.addObject.nurl;
              params['nAuthor'] = this.addObject.nAuthor;
              params['nFrom'] = this.addObject.nFrom;
              params['nEnclUrl'] = this.addObject.nEnclUrl;
              params['nEnclName'] = this.addObject.nEnclName;
              params['iId'] = this.addObject.iId;
              params['nSystemId'] = storage.get('sysid');
              // console.log(params);
              API.post('/notice/create', params, {Authorization: storage.get('token')}).then((res) => {
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
              });
            } else {
              return;
            }
          }
        });
      },
      // 新增图片上传
      /*succImgAdd(response, file, fileList) {
        let fileName = file.name;
        let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
        if (regex.test(fileName.toLowerCase())) {
          this.addObject.nurl = response.data.revealImage;
          this.addObject.nImgUrl = URL.createObjectURL(file.raw);
        } else {
          this.$message.error('请选择图片文件');
        }
      },*/
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
        this.editObject = {
          nTitle: '',
          nImgUrl: '',
          nurl: '',
          nEnclUrl: '',
          nEnclName: '',
          nContent: '',
          nContents: '',
          nAuthor: '',
          nFrom: '',
          iId: ''
        }
        let params = {};
        params['id'] = id;
        API.get('/notice/FindById', params, {Authorization: storage.get('token')}).then((res) => {
          // console.log(res.data);
          if (res.data.code == 200) {
            this.editObject = res.data.data.data;
            this.EditName = res.data.data.data.nTitle;
            // this.editObject.nImgUrl = config.baseURL + res.data.data.data.nImgUrl;
            // console.log(this.editObject.nImgUrl)
            // this.editObject.nurl = this.editObject.nImgUrl;
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
        })
      },
      // 编辑保存
      editSave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.EditName == this.editObject.nTitle){
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
                this.editObject.nEnclUrl = arr.join(',');
                this.editObject.nEnclName = arr2.join(',');

                function find(str, cha, num) {
                  var x = str.indexOf(cha);
                  for (var i = 0; i < num - 1; i++) {
                    x = str.indexOf(cha, x + 1);
                  }
                  return x;
                }

                let params = {};
                params['id'] = this.editObject.id;
                params['nTitle'] = this.editObject.nTitle;
                params['nContent'] = this.editObject.nContent;
                if (this.editObject.nContents) {
                  params['nContents'] = this.editObject.nContents.replace(/[\r\n]/g, "");
                } else {
                  params['nContents'] = '';
                }
                params['nAuthor'] = this.editObject.nAuthor;
                params['nFrom'] = this.editObject.nFrom;
                params['nEnclUrl'] = this.editObject.nEnclUrl;
                params['nEnclName'] = this.editObject.nEnclName;
                params['iId'] = this.editObject.iId;
                params['nSystemId'] = storage.get('sysid');
                // console.log(params);
                API.post('/notice/noticeUpdate', params, {Authorization: storage.get('token')}).then((res) => {
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
            }else {
              let tit = {};
              tit['nName'] = this.editObject.nTitle;
              API.get('/notice/findByName', tit, {Authorization: storage.get('token')}).then((res) => {
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
                    this.editObject.nEnclUrl = arr.join(',');
                    this.editObject.nEnclName = arr2.join(',');

                    function find(str, cha, num) {
                      var x = str.indexOf(cha);
                      for (var i = 0; i < num - 1; i++) {
                        x = str.indexOf(cha, x + 1);
                      }
                      return x;
                    }

                    let params = {};
                    params['id'] = this.editObject.id;
                    params['nTitle'] = this.editObject.nTitle;
                    params['nContent'] = this.editObject.nContent;
                    if (this.editObject.nContents) {
                      params['nContents'] = this.editObject.nContents.replace(/[\r\n]/g, "");
                    } else {
                      params['nContents'] = '';
                    }
                    params['nAuthor'] = this.editObject.nAuthor;
                    params['nFrom'] = this.editObject.nFrom;
                    params['nEnclUrl'] = this.editObject.nEnclUrl;
                    params['nEnclName'] = this.editObject.nEnclName;
                    params['iId'] = this.editObject.iId;
                    params['nSystemId'] = storage.get('sysid');
                    // console.log(params);
                    API.post('/notice/noticeUpdate', params, {Authorization: storage.get('token')}).then((res) => {
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
        });
      },
      // 编辑图片上传
      /*succImgEdit(response, file, fileList) {
        let fileName = file.name;
        let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
        if (regex.test(fileName.toLowerCase())) {
          this.editObject.nurl = response.data.revealImage;
          this.editObject.nImgUrl = URL.createObjectURL(file.raw);
        } else {
          this.$message.error('请选择图片文件');
        }
      },*/
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
      /*uploadUrlImg(){
        return config.baseURL + '/newsInfo/newsFile'
      },*/
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
          params['nSystemId'] = storage.get('sysid');
          API.delete('/notice/noticeDelete', params, {Authorization: storage.get('token')}).then((res) => {
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
          params['nSystemId'] = storage.get('sysid');
          API.delete('/notice/noticeDelete', params, {Authorization: storage.get('token')}).then((res) => {
            // console.log(res.data)
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
                message: '删除失败!' + res.data.message
              });
            }
          });
        });
      },
      // 置顶
      toggleTop(id, nTop) {
        let params = {};
        params['id'] = id;
        params['nTop'] = nTop;
        params['nSystemId'] = storage.get('sysid');
        // console.log(params);
        API.post('/notice/noticeupdatetop', params, {Authorization: storage.get('token')}).then((res) => {
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
      Release(id, nStatus) {
        let params = {};
        params['id'] = id;
        params['nStatus'] = nStatus;
        params['nSystemId'] = storage.get('sysid');
        // console.log(params);
        API.post('/notice/noticerelease', params, {Authorization: storage.get('token')}).then((res) => {
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
      ReleaseNo(id, nStatus) {
        let params = {};
        params['id'] = id;
        params['nStatus'] = nStatus;
        params['nSystemId'] = storage.get('sysid');
        // console.log(params);
        API.post('/notice/noticerelease', params, {Authorization: storage.get('token')}).then((res) => {
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
      //分类
      classify() {
        let params = {};
        params['type'] = 1;
        API.get('/ification/findByType', params, {Authorization: storage.get('token')}).then((res) => {
          if (res.data.code == 200) {
            this.options = res.data.data;
          } else if (res.data.code == 1001) {
            this.signOut();
          }
          // console.log(this.options);
        })
      },



      // 进入详情
      linkDetail(id) {
        this.$router.push({name: 'backstage.notice.detail', query: {id: id}});
      },
      // 翻页器：当前页，同时上一页下一页也能获取当前页
      handleCurrentChange(val) {
        // console.log(val);
        this.currentPage = val;
        if (this.searchNum == '1') {
          this.search();
        } else {
          this.getPage();
        }
      },
      // 翻页器：选择10条还是20条、
      handleSizeChange(val) {
        // console.log(val);
        this.pageSize = val;
        if (this.searchNum == '1') {
          this.search();
        } else {
          this.getPage();
        }
      },
      // 编辑器
      onEditorChange({editor, html, text}) {
        // console.log('editor change!', editor, html, text);
        this.editObject.nContent = html;
        this.editObject.nContents = text;
      },
      onAddChange({editor, html, text}) {
        // console.log('editor change!', editor, html, text);

        this.addObject.nContent = html;
        this.addObject.nContents = text;
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
      this.classify();
      this.getPage();
      this.getUser();
      this.getTem();
    },
    mounted() {

      // this.offHeight = hei;
      // console.log(this.offHeight)
      // you can use current editor object to do something(editor methods)
      // console.log('this is my editor', this.editor);
      // this.editor to do something...
    },
  }
</script>
<style>
  .assign-detail-dialog {
    font-weight: bold !important;
  }
  .assign-detail-dialog .el-dialog__header {
    padding: 20px 20px 10px !important;
    border-bottom: none  !important;
  }

  .assign-detail-dialog .el-dialog__header span {
    font-size: 14px;
  }
  .assign-detail-dialog .pop-content {
    text-align: left;
    overflow-y: auto;
    height: 100%;
    width: 100%;
  }

  .assign-detail-dialog .pop-content .role-cell {
    float: left;
    height: auto;
    margin: 0 1%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-right: 1px solid #ccc;
  }

  .assign-detail-dialog .pop-content .role-cell:last-child {
    border-right: none;
  }

  .assign-detail-dialog  .pop-content .role-cell-content {
    margin-top: 20px;
    max-height: 400px;
    height: 400px;
    overflow: auto;
  }

  .assign-detail-dialog  .pop-content .role-cell-content .user {
    height: 35px;
    cursor: pointer;
    line-height: 35px;
  }

  .assign-detail-dialog .el-dialog .el-dialog__body {
    height: 500px;
    overflow: hidden;
  }

  .assign-detail-dialog .el-dialog .el-dialog__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .assign-detail-dialog .el-dialog .dialog-footer .el-button:nth-of-type(2) {
    margin-left: 0 !important;
  }

</style>

<style lang="less">
  @import "./../../../../assets/styles/edit-pop.less";
  @import "./../../../../assets/styles/base2";

  .backstage-notice-page {
    .el-dialog__wrapper.tip-dialog {
      &.assign-detail-dialog {
        .el-dialog {
          // margin: 10vh auto !important;
          width: 600px !important;
          position: relative;
          // height: 700px;
          .pop-content {
            text-align: left;
            overflow-y: auto;
            height: 100%;
            width: 100%;
            .role-cell {
              float: left;
              height: auto;
              margin: 0 1%;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              border-right: 1px solid #ccc;
              &:last-child {
                border-right: none;
              }
              /*.role-cell:nth-of-type(2){
                width: 70%;
              }
              .role-cell:nth-of-type(1){
                width: 25%;
              }*/
            }
            .role-cell-content {
              margin-top: 20px;
              .user {
                height: 30px;
                cursor: pointer;
                line-height: 30px;
              }
            }
          }
          .el-dialog__body {
            height: 500px;
            overflow: hidden;
          }
          .el-dialog__footer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
          }
        }
      }
    }

    .footer-top > .el-dialog > .el-dialog__footer {
      padding: 0px 20px 20px !important;
    }
    .el-dialog__body {

      .el-textarea__inner {
        font-size: 13px;
        padding-left: 10px;
      }
    }

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
    .btn {
      cursor: pointer;
      width: 100px !important;
      height: 35px !important;
      line-height: 35px !important;
      font-size: 15px !important;
    }
  }

  .mb-box {
    margin-bottom: 10px;
    width: 100%;
    text-align: left;
  }


</style>
