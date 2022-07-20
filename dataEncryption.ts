import { JSEncrypt } from 'jsencrypt';
import CryptoJS from 'crypto-js';


class DataEncryption {
  currentKey: string;
  serverPubKey: string;
  constructor() {
    this.currentKey = '';
    this.serverPubKey = '';
  }

  get aseKey() {
    return this.currentKey;
  }

  setPublicKey(key: string){
    this.serverPubKey = key
  }

  randomKey(length = 16) {
    const random =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < length; i++) {
      str = str + random.charAt(Math.random() * random.length);
    }
    return str;
  }

  /**
   * 获取加密后 ase 密钥
   * @returns string
   */
  getEncryptKey() {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(this.serverPubKey);
    const randomKey = this.randomKey();
    this.currentKey = randomKey; // 存储当前 aseKey
    // rsa 加密 aes 的密钥
    return jsEncrypt.encrypt(randomKey);
  }

  /**
   * 综合加密
   * @param {*} 加密数据
   * @returns key: 密钥，ciphertext: 密文
   */
  encrypt(plaintext: any) {
    try {
      if (plaintext instanceof Object) plaintext = JSON.stringify(plaintext);
      const key = this.getEncryptKey();
      const ciphertext = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(plaintext),
        CryptoJS.enc.Utf8.parse(this.currentKey),
        { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 },
      ).toString();
      return {
        key,
        ciphertext,
      };
    } catch (error) {
      console.log('DataEncryption encrypt error', error);
      return {};
    }
  }

  // aes 解密
  decrypt(data: string) {
    try {
      const rawData = CryptoJS.AES.decrypt(
        data,
        CryptoJS.enc.Utf8.parse(this.currentKey),
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        },
      ).toString(CryptoJS.enc.Utf8);
      return JSON.parse(rawData);
    } catch (error) {
      console.log('DataEncryption encrypt error', error);
    }
  }
}
const dataEncryption = new DataEncryption();

export default dataEncryption;
