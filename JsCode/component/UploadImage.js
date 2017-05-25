/**
 * 图片上传
 */
import React,{Component} from 'react';

let qiniu = require('react-native-qiniu');

//要上传的七牛空间
bucket = 'xiaost';

//构建上传策略函数 创建一个token
// putPolicy = new qiniu.Auth.PutPolicy2(bucket+':'+key);
// token = putPolicy.token();

export default class UploadImage extends Component{

    constructor(){
        super();
        qiniu.Conf.ACCESS_KEY = 'Fzx95UmnFQalzUxR5SGhRb5O16tWrlI6EpqcTT6d';
        qiniu.Conf.SECRET_KEY = 'NHDU9g0HnC-FIHdy745OczTeulAWCGpt7Q0H6X2-';
        this.state = {
            avatarSource:{uri:'http://www.kiodev.com/wp-content/uploads/2016/03/react-logo.png'},
            info:''
        }
    }

    uploadImage(uri,key){ //uri:本地文件路径 key:上传到七牛后保存的文件名
        let putPolicy = new qiniu.Auth.PutPolicy2({scope: bucket+':'+key});
        let uptoken = putPolicy.token();
        let formData = new FormData();
        formData.append('file', {uri: uri, type: 'application/octet-stream', name: key});
        formData.append('key', key);
        formData.append('token', uptoken);
        let options = {};
        options.body = formData;
        options.method = 'post';

        return new Promise((resolve,reject)=>{
            fetch(qiniu.Conf.UP_HOST, options).then((response) => {
                if(response.status == 200){
                    let downURL = this.downloadPrivate(key);
                    console.log('downURL:'+downURL);
                    resolve(downURL);
                }
            }).catch((error)=>{
                reject(error);
                console.log('error'+error);
            });
        });
    }

    downloadPrivate(key) {
        let getPolicy = new qiniu.Auth.GetPolicy();
        let url = getPolicy.makeRequest('http://oohot6mcu.bkt.clouddn.com/'+key);
        return url;
    }
}