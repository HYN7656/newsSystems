
/**
 * 工具类
 */
import Vue from 'vue'
import CryptoJS from 'crypto-js'
export default {//加密
  encrypt(word){
    var key = CryptoJS.enc.Utf8.parse('2019010817443024');   //加密密钥
    var iv  = CryptoJS.enc.Utf8.parse('2019010817443024');   //加密向量
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC});
    return encrypted.toString();

  },

}
