import {observable,computed,action,runInAction,reaction}from 'mobx';
import ZanLite from '../db/ZanLite';
import {
    ToastAndroid
}from 'react-native';
let sqlite = new ZanLite();

export default class ZanStore{

    @observable myZanPost = [];
    @observable zan_flag = false;
    @observable zanNum = [];

    //添加文章赞
    addZan(zan){
        sqlite.addZan(zan).then((result)=>{
            this.zan_flag = true;
            console.log('zan success');
        }).catch((err)=>{
            console.log('zan error '+err);
        })
    };

    //取消赞
    removeZan(user_name,post_id){
        sqlite.removeZan(user_name,post_id).then((result)=>{
            console.log('zan success');
            this.zan_flag = false;
            this.selectMyPostZan(user_name);
            ToastAndroid.show('取消成功',ToastAndroid.SHORT);
        }).catch((err)=>{
            console.log('zan error:'+err);
        })
    }

    //查询我赞过的所有文章
    selectMyPostZan(user_name){
        sqlite.selectMyPostZan(user_name).then((result)=>{
            console.log(result);
            this.myZanPost = result;
        }).catch((error)=>{
            this.myZanPost = [];
            console.log("searchMyPostZan error:"+error);
        })
    }

    @computed
    get isMyZan(){
        return this.myZanPost.length == 0;
    }

    //查询我是否赞过某篇文章
    searchPostZan(user_name,post_id){
        return new Promise((resolve,reject)=>{
            sqlite.searchPostZan(user_name,post_id).then((result)=>{
                this.zan_flag = result;
                resolve(result);
            }).catch((error)=>{
                reject(false);
                console.log('searchPostZan error:'+error);
            })
        }).catch((error)=>{
            console.log('searchPostZan error:'+error);
        });
    };

    // //查询某篇文章点赞数量
    // searchZanNum(post_id){
    //      sqlite.searchZanNum(post_id).then((result)=>{
    //          this.zanNum = result;
    //          console.log('searchZanNum store success');
    //      }).catch((error)=>{
    //          console.log(error);
    //      });
    // }
}