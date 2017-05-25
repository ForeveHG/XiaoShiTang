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

let sqlite = new SQLite();
let db = '';

const CollectLite = React.createClass({
    setDB(){
        db = sqlite.getDB();
    },

    //添加收藏
    addCollect(collect){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql(
                    'INSERT INTO '+ COLLECT_TABLE_NAME + ' (user_name,post_id,post_time) VALUES (?,?,?);',
                    [collect.user_name,collect.post_id,collect.collect_time],
                    () => {
                        sqlite._successCB('collect post: ');
                        resolve();
                    },
                    (err) => {
                        console.log(err);
                        sqlite._errorCB('collect post: ', err);
                        reject();
                    }
                )
            }
        })
    },

    //取消收藏
    removeCollect(user_name,post_id){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql('DELETE FROM '+ COLLECT_TABLE_NAME + ' WHERE user_name = ? and post_id = ?',
                [user_name,post_id],
                () => {
                    sqlite._successCB('collect post: ');
                    resolve();
                },
                (err) => {
                    console.log(err);
                    sqlite._errorCB('collect post: ', err);
                    reject();
                })
            }
        })
    },

    //查询用户是否收藏某篇文章
    searchPostCollect(user_name,post_id){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql(
                    'SELECT * FROM ' + COLLECT_TABLE_NAME + ' WHERE user_name = ? AND post_id = ?',
                    [user_name,post_id],
                    (results) => {
                        if(results.rows.length > 0){
                            resolve(true);
                            sqlite._successCB('search Post Collect: ');
                        }else{
                            reject(false);
                        }
                    },
                    (err) => {
                        console.log(err);
                        reject(err);
                        sqlite._errorCB('search Post Collect: ', err);
                    }
                )
            }
        })
    },

    //查询我收藏的文章
    selectMyPostCollect(user_name){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql(
                    'SELECT * FROM '+ COLLECT_TABLE_NAME + ' a LEFT JOIN '+ POST_TABLE_NAME +' b WHERE a.post_id = b.id AND a.user_name = ? ' ,
                    [user_name],
                    (results) => {
                        let collectList = [];
                        if(results.rows.length > 0){
                            for(let i = 0;i<results.rows.length;i++){
                                let sqliteCollect = results.rows.item(i);
                                collectList.push(sqliteCollect);
                            }
                            resolve(collectList);
                            sqlite._successCB('search MyCollect: ');
                        }else{
                            reject('not find item');
                        }
                    },
                    (err) => {
                        console.log(err);
                        reject(err);
                        sqlite._errorCB('search Post Collect: ', err);
                    }
                )
            }
        })
    },

    render(){
        return null;
    },
});
module.exports = CollectLite;