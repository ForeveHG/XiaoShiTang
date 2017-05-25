/**
 * 文章信息表Lite
 */
import React,{Component}from 'react';
import SQLite from './SQLite';
import {
    View,
    Text,
}from 'react-native';
import Post from './entity/User';
const USER_TABLE_NAME = 'User';//用户表
const POST_TABLE_NAME = 'Post';//文章表
const ZAN_TABLE_NAME = 'Like'; //点赞表

let sqlite = new SQLite();
let db = '';

const PostLite = React.createClass({

    setDB(){
        db = sqlite.getDB();
    },

    //发表文章，获得数据后插入数据库
    publishPost(post){
        return new Promise((resolve,reject) => {
            if(db) {
                db.executeSql(
                    'INSERT INTO '+ POST_TABLE_NAME + ' ( user_name,post_title,post_content,post_img,post_time) VALUES (?,?,?,?,?);',
                    [post.getUserName(),post.getPostTitle(),post.getPostContent(),post.getPostImg(),post.getPostTime()],
                    () => {
                        sqlite._successCB('publishPost: ');
                        resolve(post);
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

    //得到文章标题,文章图片,用户头像,用户昵称，赞的数量
    searchPost(){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql(
                    'SELECT a.id post_id,a.post_title,a.post_content,a.post_time,a.post_img,b.id as user_id,b.login_name,b.favicon,b.nick_name,d.count FROM '+ POST_TABLE_NAME + ' a LEFT JOIN '+ USER_TABLE_NAME+' b ON a.user_name = b.login_name LEFT JOIN ' + '(SELECT post_id,COUNT(*) as count FROM '+ ZAN_TABLE_NAME + ' c GROUP BY c.post_id) d ON a.id = d.post_id ' + ' ORDER BY a.id DESC;',
                    [],
                    (results) => {
                        let postList = [];
                        if(results.rows.length > 0){
                            for(let i = 0;i<results.rows.length;i++){
                                let sqlitePost = results.rows.item(i);
                                postList.push(sqlitePost);
                            }
                            resolve(postList);
                            sqlite._successCB('searchPost: ');
                        }else{
                            reject('not find item');
                        }
                    },
                    (err) => {
                        console.log(err);
                        reject(err);
                        sqlite._errorCB('searchPost: ', err);
                    }
                )
            }else{
                reject('db not open');
            }
        })
    },

    searchMyShare(user_name){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql(
                    'SELECT * FROM '+ POST_TABLE_NAME + ' a WHERE user_name = ?',
                    [user_name],
                    (results) => {
                        let postList = [];
                        if(results.rows.length > 0){
                            for(let i = 0;i<results.rows.length;i++){
                                let sqlitePost = results.rows.item(i);
                                postList.push(sqlitePost);
                            }
                            resolve(postList);
                            sqlite._successCB('search MyPost');
                        }else{
                            reject('not find item');
                        }
                    },
                    (err) => {
                        console.log(err);
                        reject(err);
                        sqlite._errorCB('search MyPost: ', err);
                    }
                )
            }
        })
    },

    //删除文章
    deletePost(post_id){
        return new Promise((resolve,reject)=>{
            if(db){
                db.executeSql(
                    'DELETE FROM '+ POST_TABLE_NAME + ' WHERE id = ?',
                    [post_id],
                    () => {
                        sqlite._successCB('deletePost: ');
                        resolve();
                    },
                    (err) => {
                        console.log(err);
                        sqlite._errorCB('deletePost: ', err);
                        reject();
                    }
                );
            }
        })
    },

    getPost(sqlitePost){
       let post = new Post();
       post.user_name = sqlitePost.user_name;
       post.post_title = sqlitePost.post_title;
       post.post_content = sqlitePost.post_content;
       post.post_img = sqlitePost.post_img;
       post.post_time = sqlitePost.post_time;
       return post;
    },

    render(){
        return null;
    }

});

module.exports = PostLite;