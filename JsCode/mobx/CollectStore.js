import {observable,computed,action,runInAction,reaction}from 'mobx';
import CollectLite from '../db/CollectLite';

let sqlite = new CollectLite();

export default class CollectStore{

    @observable myCollectPost = [];
    @observable collect_flag = false;

    //添加文章收藏
    addCollect(collect){
        sqlite.addCollect(collect).then((result)=>{
            this.collect_flag = true;
            console.log('collect success');
        }).catch((err)=>{
            console.log('collect error '+err);
        })
    };

    //取消收藏
    removeCollect(user_name,post_id){
        sqlite.removeCollect(user_name,post_id).then((result)=>{
            console.log('collect success');
            this.collect_flag = false;
            this.searchMyPostCollect(user_name);
            ToastAndroid.show('取消成功',ToastAndroid.SHORT);
        }).catch((err)=>{
            console.log('collect error:'+err);
        })
    }

    //查询我收藏的所有文章
    searchMyPostCollect(user_name){
        sqlite.selectMyPostCollect(user_name).then((result)=>{
            console.log(result);
            this.myCollectPost = result;
        }).catch((error)=>{
            this.myCollectPost = [];
            console.log("searchMyPostCollect error:"+error);
        })
    }

    @computed
    get isMyCollect(){
        return this.myCollectPost.length == 0;
    }

    //查询我是否收藏某篇文章
    searchPostCollect(user_name,post_id){
        return new Promise((resolve,reject)=>{
            sqlite.searchPostCollect(user_name,post_id).then((result)=>{
                this.collect_flag = result;
                resolve(result);
            }).catch((error)=>{
                reject(false);
                console.log('searchPostCollect error:'+error);
            })
        }).catch((error)=>{
            console.log('searchPostCollect error:'+error);
        });
    }
}