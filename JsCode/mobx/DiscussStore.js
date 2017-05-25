import {observable,computed,action,runInAction,reaction}from 'mobx'
import DiscussLite from '../db/DiscussLite';
import {
    ToastAndroid
}from 'react-native';
let sqlite = new DiscussLite();

export default class DiscussStore{

    @observable discussList = [];

    publishDiscuss(discuss){
        sqlite.publishDiscuss(discuss).then((result)=>{
            console.log('discussStore publishDiscuss success');
        }).catch((error)=>{
            console.log('discussStore publishDiscuss error:'+error);
        })
    };

    searchDiscuss(post_id){
        sqlite.searchDiscuss(post_id).then((result)=>{
            this.discussList = result;
            console.log('discussStore searchDiscuss success');
        }).catch((error)=>{
            this.discussList = [];
            console.log('discussStore searchDiscuss error: '+error);
        })
    };

    deleteDiscuss(){
        sqlite.deleteDiscuss().then((result)=>{
            console.log('delete success');
        })
    }
};


