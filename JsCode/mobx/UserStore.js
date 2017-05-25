/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 */

import {observable,computed,action,runInAction,reaction}from 'mobx'
import {
    ToastAndroid
}from 'react-native';
import UserLite from '../db/UserLite';
let sqlite = new UserLite();

export default class UserStore{

    /**
     * 定义要观察的数据
     */
    @observable user = ''; //用户

    constructor(){
        this.getStorageUser();
    }

    //用户登录
    @action
    loginUser(loginUser){
        return new Promise((resolve,reject)=> {
            sqlite.loginUser(loginUser).then((result) => {
                this.user = result;
                this.saveStorage(result);
                resolve();
            }).catch((err) => {
                console.log('sqlite loginUser error: ' + err);
                reject();
            });
        })
    };

    //用户注册
    @action
    registerUser (user){
        return new Promise((resolve,reject)=>{
            sqlite.registerUser(user).then((result)=>{
                resolve(result);
                console.log('sqlite registerUser success:'+err);
            }).catch((err)=>{
                reject(err);
                console.log('sqlite registerUser error:'+err);
            })
        })
    }

    //查询
    @action
    searchUser(loginName){
        return new Promise((reslove,reject)=>{
            sqlite.searchUser(loginName).then((result)=>{
                this.user = result;
                this.saveStorage(result);
                reslove();
                console.log('sqlite searchUser success');
            }).catch((err)=>{
                reject(null);
                console.log('sqlite searchUser error: '+err);
            })
        });
    };

    //将已经登陆的用户保存到storage中
    @action
    saveStorage (user){
        storage.save({
            key: 'loginState',
            rawData: {
                user: user,
            },
            expires: 1000 * 3600 //指定过期时间
        });
    };

    //得到storage中的用户
    @action
    getStorageUser = async() =>{
        await storage.load({
            key: 'loginState',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,
            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用sync方法的同时先返回已经过期的数据。
            // 设置为false的话，则始终强制返回sync方法提供的最新数据(当然会需要更多等待时间)。
            syncInBackground: true,
        }).then(ret => {
            // 如果找到数据，则在then方法中返回
            // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
            // 你只能在then这个方法内继续处理ret数据
            // 而不能在then以外处理
            // 也没有办法“变成”同步返回
            // 你也可以使用“看似”同步的async/await语法
            if(ret){
                this.user = ret.user ;
            }
        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            switch (err.name) {
                case 'NotFoundError':
                    // TODO;
                    break;
                case 'ExpiredError':
                    // TODO
                    break;
            }
        });
    };

    //移除storage中的用户
    removeStorageUser(){
        storage.remove({
            key: 'loginState'
        });
        this.user  = null;
    }
}