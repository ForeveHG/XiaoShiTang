import {observable,computed,action,runInAction,reaction}from 'mobx'
import PostLite from '../db/PostLite';
import {
    ToastAndroid
}from 'react-native';
let sqlite = new PostLite();

export default class PostStore{
    //定义要观察的文章列表
    @observable postList = [];
    @observable myPost = [];

    //通过列表的长度和错误代码判断列表是否正在加载
    //正在加载返回true,已经加载完返回false
    @computed
    get isFetching(){
        return this.postList.length == 0;
    }

    @computed
    get isMyPost(){
        return this.myPost.length == 0;
    }

    //发表文章
    publishPost(post){
        return new Promise((resolve,reject)=>{
            sqlite.publishPost(post).then((result)=>{
                this.searchPost();
                resolve();
            }).catch((err)=>{
                reject();
                console.log('publishPost error:'+err);
            })
        })
    }

    //搜索文章
    searchPost(){
        sqlite.searchPost().then((result)=>{
            this.postList = result;
            console.log('searchPost success');
        }).catch((err)=>{
            console.log('searchPost error'+err);
        })
    }

    //搜索自己分享的内容（自己发表的文章）
    searchMyPost(user){
        let user_name = user.login_name;
        sqlite.searchMyShare(user_name).then((result)=>{
            this.myPost = result;
            console.log('searchMyPost success');
        }).catch((err)=>{
            this.myPost = [];
            console.log('searchMyPost error'+err);
        })
    }

    //删除文章
    deletePost(user,item){
        sqlite.deletePost(item.id).then(()=>{
            this.searchMyPost(user);
            this.searchPost();
            ToastAndroid.show('删除成功',ToastAndroid.SHORT);
            console.log('delete post success');
        }).catch((err)=>{
            console.log('delete post delete error:'+err);
        })
    }
}