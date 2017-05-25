import React,{Component}from 'react';
import SQLite from './SQLite';
import {
    View,
    Text,
}from 'react-native';
import Collect from './entity/User';
const USER_TABLE_NAME = 'User';//用户表
const POST_TABLE_NAME = 'Post';//文章表
const COLLECT_TABLE_NAME = 'Collect';//收藏表
const ZAN_TABLE_NAME = 'Like'; //点赞表

let sqlite = new SQLite();
let db = '';

const ZanLite = React.createClass({
    setDB(){
        db = sqlite.getDB();
    },

    //添加赞（文章）
    addZan(zan){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql(
                    'INSERT INTO '+ ZAN_TABLE_NAME + ' (user_name,post_id,zan_time) VALUES (?,?,?);',
                    [zan.user_name,zan.post_id,zan.zan_time],
                    () => {
                        sqlite._successCB('zan post: ');
                        resolve();
                    },
                    (err) => {
                        console.log(err);
                        sqlite._errorCB('zan post error: ', err);
                        reject();
                    }
                )
            }
        })
    },

    //取消赞
    removeZan(user_name,post_id){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql('DELETE FROM '+ ZAN_TABLE_NAME + ' WHERE user_name = ? and post_id = ?',
                    [user_name,post_id],
                    () => {
                        sqlite._successCB('zan post: ');
                        resolve();
                    },
                    (err) => {
                        console.log(err);
                        sqlite._errorCB('zan post: ', err);
                        reject();
                    })
            }
        })
    },

    //查询用户是否点赞某篇文章
    searchPostZan(user_name,post_id){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql(
                    'SELECT * FROM ' + ZAN_TABLE_NAME + ' WHERE user_name = ? AND post_id = ?',
                    [user_name,post_id],
                    (results) => {
                        if(results.rows.length > 0){
                            resolve(true);
                            sqlite._successCB('search Post Zan: ');
                        }else{
                            reject(false);
                        }
                    },
                    (err) => {
                        console.log(err);
                        reject(err);
                        sqlite._errorCB('search Post Zan: ', err);
                    }
                )
            }
        })
    },

    //查询我赞过的文章
    selectMyPostZan(user_name){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql(
                    'SELECT * FROM '+ ZAN_TABLE_NAME + ' a LEFT JOIN '+ POST_TABLE_NAME +' b WHERE a.post_id = b.id AND a.user_name = ? ' ,
                    [user_name],
                    (results) => {
                        let zanList = [];
                        if(results.rows.length > 0){
                            for(let i = 0;i<results.rows.length;i++){
                                let sqliteZan = results.rows.item(i);
                                zanList.push(sqliteZan);
                            }
                            resolve(zanList);
                            sqlite._successCB('search MyZan: ');
                        }else{
                            reject('not find item');
                        }
                    },
                    (err) => {
                        console.log(err);
                        reject(err);
                        sqlite._errorCB('search Post Zan: ', err);
                    }
                )
            }
        })
    },

    //查询赞过的人数
    searchZanNum(post_id){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql(
                    'SELECT post_id,COUNT(*) as count FROM '+ ZAN_TABLE_NAME + ' GROUP BY post_id;'
                    ,[]
                    ,(results) => {
                        sqlite._successCB('zan post: ');
                        let zanList = [];
                        if(results.rows.length > 0) {
                            for (let i = 0; i < results.rows.length; i++) {
                                let sqliteZan = results.rows.item(i);
                                zanList.push(sqliteZan);
                            }
                            console.log(zanList);
                            resolve(zanList);
                        }
                    },
                    (err) => {
                        console.log(err);
                        sqlite._errorCB('zan post: ', err);
                        reject();
                    }
                )
            }
        })
    },

    render(){
        return null;
    },
});
module.exports = ZanLite;