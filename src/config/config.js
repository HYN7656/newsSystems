import router from '../router';
import LocalStorageUtils from '@/utils/LocalStorageUtils.js'

const storage = new LocalStorageUtils();
export default {


  url: '',

  baseURL: 'http://192.168.3.41:8083',
  // baseURL: 'http://192.168.206.113:8083',
  // baseURL: 'http://moka.dino-tech.com/airapi',

  secret: '888A9AE0E1EEE6A7421D7C8774BD41FC',
  passwordsecret: '*975b99fe*15c9*4341*b21a*f355926ded00',

  transformRequest: [function (config) {
    return config;
  }],


  transformResponse: [function (data) {
    // let errcode = data.errcode;
    // if (null != errcode && '888' == errcode) {
    //
    //   MessageBox.confirm("登录异常，请重新登录", "温馨提示", {confirmButtonText: "去登录"}).then(action => {
    //     storage.deleteAll()
    //
    //     router.push({name: 'login'})
    //
    //   }).catch(action => {
    //
    //   });
    //
    // }

    return data;
  }],
  //get,delete方法传递参数
  params: {},

  //post,put 方法
  data: {

  },

  timeout: 200000,

  withCredentials: false, // default

  responseType: 'json', // default

  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  maxContentLength: 2000,

  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    // 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryrGKCBY7qhFd3TrwA',
  },

  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  maxRedirects: 15, // default
}









