import React,{Component}from 'react';
import SQLite from './SQLite';
import {
    View,
    Text,
}from 'react-native';
import User from './entity/User';
const Collection_TABLE_NAME = 'User';//用户表

let sqlite = new SQLite();
let db = '';

const UserLite = React.createClass({

    setDB(){
        db = sqlite.getDB();
    },

    getUser(sqliteUser){
        let loginUser = new User();
        loginUser.setLoginName(sqliteUser.login_name);
        loginUser.setLoginPwd(sqliteUser.login_pwd);
        loginUser.setNickName(sqliteUser.nick_name);
        loginUser.setFavicon(sqliteUser.favicon);
        loginUser.setAge(sqliteUser.age);
        loginUser.setSex(sqliteUser.sex);
        loginUser.setHeight(sqliteUser.height);
        loginUser.setWeight(sqliteUser.weight);
        return loginUser;
    },

    //用户注册
    registerUser(user){
        return new Promise((resolve, reject) => {
            if (db) {
                db.executeSql(
                    'INSERT INTO ' + Collection_TABLE_NAME + ' (login_name,login_pwd) VALUES (?,?);',
                    [user.getLoginName(), user.getLoginPwd()],
                    () => {
                        sqlite._successCB('registerUser ');
                        resolve();
                    },
                    (err) => {
                        sqlite._errorCB('registerUser ', err);
                        reject();
                    }
                )
            } else {
                reject('db not open');
            }
        })
    },

    //用户登录
    loginUser(user){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql('SELECT * FROM '+ Collection_TABLE_NAME + ' WHERE login_name = ? and login_pwd = ?',
                    [user.getLoginName(),user.getLoginPwd()],
                    (results) => {
                        if(results.rows.length > 0){
                            let sqliteUser = results.rows.item(0);
                            resolve(this.getUser(sqliteUser));
                        }else{

                            reject('not find item');
                        }
                        sqlite._successCB('findUserLoginName');
                    },(err)=>{
                        console.log(err);
                        reject(err);
                        sqlite._errorCB('findUserLoginName',err);
                    });
            }else{
                reject('db not open');
            }
        })
    },

    //查询用户
    searchUser(loginName){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql('SELECT * FROM '+ Collection_TABLE_NAME + ' WHERE login_name = ?;',
                    [loginName],
                    (results) => {
                        //如果不封装直接传入mobx中保存会报错
                        if(results.rows.length > 0){
                            let sqliteUser = results.rows.item(0);
                            resolve(this.getUser(sqliteUser));
                        }else{
                            reject('not find item');
                        }
                    },(err)=>{
                        reject(err);
                        sqlite._errorCB('findUserLoginName',err);
                    });
            }else{
                reject('db not open');
            }
        })
    },

    //用户修改信息
    editUserInfo(loginName,value,field){
        return new Promise((resolve, reject) => {
            if (db) {
                db.executeSql('UPDATE '+ Collection_TABLE_NAME + ` SET ${field} = ? WHERE login_name = ?;`,
                    [value,loginName],
                    () => {
                        resolve();
                        sqlite._successCB('editUser ');
                    }, (err) => {
                        reject();
                        sqlite._errorCB('editUser ', err);
                    })
            } else {
                reject('db not open');
            }
        })
    },

    render(){
        return null;
    }

});

module.exports = UserLite;