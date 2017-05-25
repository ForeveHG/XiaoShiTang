import React,{Component}from 'react';
import SQLite from './SQLite';
import {
    View,
    Text,
}from 'react-native';

const DISCUSS_TABLE_NAME = 'Discuss';//评论表
const USER_TABLE_NAME = 'User';//用户表
const POST_TABLE_NAME = 'Post';//文章表

let sqlite = new SQLite();
let db = '';

const DiscussLite = React.createClass({
    setDB(){
        db = sqlite.getDB();
    },

    //发表评论
    publishDiscuss(discuss){
        return new Promise((resolve,reject) => {
            if(db) {
                db.executeSql(
                    'INSERT INTO '+ DISCUSS_TABLE_NAME + ' ( user_name,post_id,discuss_content,discuss_time,discuss_parent_id) VALUES (?,?,?,?,?);',
                    [discuss.getUserName(),discuss.getPostID(),discuss.getDiscussContent(),discuss.getDiscussTime(),discuss.getDiscussParentId()],
                    () => {
                        sqlite._successCB('publishPost: ');
                        resolve(discuss);
                    },
                    (err) => {
                        console.log(err);
                        sqlite._errorCB('publishPost: ', err);
                        reject();
                    }
                )
            }else{
                reject('db not open');
            }
        })
    },

    //查找评论
    searchDiscuss(post_id){
      return new Promise((resolve,reject)=>{
          console.log(post_id);
          if(db){
              db.executeSql(
                  'SELECT * FROM ' + DISCUSS_TABLE_NAME + ' a LEFT JOIN '+ USER_TABLE_NAME +' b ON a.user_name = b.login_name WHERE a.post_id = ? ORDER BY a.id DESC',
                  [post_id],
                  (results) => {
                      let discussList = [];
                      if(results.rows.length > 0){
                          for(let i = 0;i<results.rows.length;i++){
                              let sqliteDiscuss = results.rows.item(i);
                              discussList.push(sqliteDiscuss);
                          }
                          resolve(discussList);
                          console.log(discussList);
                          sqlite._successCB('searchDiscuss: ');
                      }
                  },
                  (err) => {
                      console.log(err);
                      sqlite._errorCB('searchDiscuss: ', err);
                      reject();
                  }
              )
          }
      })
    },

    deleteDiscuss(){
        return new Promise((resolve,reject)=>{
            if(db) {
                db.executeSql(
                    'DELETE FROM '+ DISCUSS_TABLE_NAME ,
                    [],
                    () => {
                        sqlite._successCB('publishPost: ');
                        resolve();
                    },
                    (err) => {
                        console.log(err);
                        sqlite._errorCB('publishPost: ', err);
                        reject();
                    }
                )
            }else{
                reject('db not open');
            }
        })
    },

    render(){
        return null;
    }
});

module.exports = DiscussLite;