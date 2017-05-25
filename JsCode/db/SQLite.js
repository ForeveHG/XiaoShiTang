
import React from 'react';
import SQLiteStorage from 'react-native-sqlite-storage';

SQLiteStorage.DEBUG(true);
let database_name = 'weidao.db'; //数据库名
let database_version = '1.0'; //数据库版本
let database_displayname = 'MySQLite';
let database_size = -1;
let db;
const USER_TABLE_NAME = 'User';//用户表
const POST_TABLE_NAME = 'Post';//文章表
const DISCUSS_TABLE_NAME = 'Discuss';//评论表
const ZAN_TABLE_NAME = 'Like'; //点赞表
const COLLECT_TABLE_NAME = 'Collect';//收藏表



const SQLite = React.createClass({

    //不用渲染用户界面，所以直接返回空
    render(){
        return null;
    },

    //页面卸载的时候关闭数据库
    componentWillUnmount(){
        if(db){
            this._successCB('close');
            db.close();
        }else{
            console.log("SQLiteStorage not open");
        }
    },

    //打开数据库
    open(){
        db = SQLiteStorage.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
            ()=>{
                this._successCB('open');
            },
            (err)=>{
                this._errorCB('open',err);
            }
        );
    },

    getDB(){
        return db;
    },

    //打印成功消息
    _successCB(name){
        console.log('SQLiteStorage '+name+' success');
    },

    //打印失败消息
    _errorCB(name,err){
        console.log('hh SQLiteStorage '+name+' error: '+err);
    },

    //新建表
    createTable(){
        if(!db){
            return new Promise((resolve,reject)=>{
                this.open();
                resolve(db);
            })
        }
    },

    //关闭数据库
    close(){
        if(db){
            this._successCB('close');
            db.close();
        }else{
            console.log('SQLiteStorage not open');
        }
        db = null;
    },

    //创建用户表
    cerateUserTable(){
        db.transaction((tx)=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + USER_TABLE_NAME + '('+
                'id INTEGER PRIMARY KEY NOT NULL,'+
                'login_name VARCHAR,'+
                'login_pwd VARCHAR,'+
                'nick_name VARCHAR,'+
                'favicon VARCHAR,'+
                'sex VARCHAR,'+
                'age VARCHAR,'+
                'height VARCHAR,'+
                'weight VARCHAR'+');'
                , [], ()=>{
                    this._successCB('executeSql');
                },(err)=>{
                    this._errorCB('executeSql',err);
                });
        },(err)=>{
            this._errorCB('transaction',err);
        },()=>{
            this._successCB('transaction');
        });
    },

    //创建分享文章表
    createPostTable(){
        db.transaction((tx)=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + POST_TABLE_NAME + '( '+
                'id INTEGER PRIMARY KEY NOT NULL,'+
                'user_name VARCHAR,'+
                'post_title VARCHAR,'+
                'post_content VARCHAR,'+
                'post_img VARCHAR,'+
                'post_time VARCHAR'+ ');'
                , [], ()=>{
                    this._successCB('executeSql');
                },(err)=>{
                    console.log(err);
                    this._errorCB('executeSql',err);
                });
        },(err)=>{
            this._errorCB('transaction',err);
        },()=>{
            this._successCB('transaction');
        });
    },

    //创建收藏表
    createCollectTable(){
        db.transaction((tx)=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + COLLECT_TABLE_NAME + '( '+
                'id INTEGER PRIMARY KEY NOT NULL,'+
                'user_name VARCHAR,'+
                'food_id VARCHAR,'+
                'post_id VARCHAR,'+
                'post_time VARCHAR'+ ');'
                , [], ()=>{
                    this._successCB('executeSql');
                },(err)=>{
                    console.log(err);
                    this._errorCB('executeSql',err);
                });
        },(err)=>{
            this._errorCB('transaction',err);
        },()=>{
            this._successCB('transaction');
        });
    },

    //创建点赞表
    createZanTable(){
        db.transaction((tx)=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + ZAN_TABLE_NAME + '( '+
                'id INTEGER PRIMARY KEY NOT NULL,'+
                'user_name VARCHAR,'+
                'post_id VARCHAR,'+
                'discuss_id VARCHAR,'+
                'zan_time VARCHAR'+ ');'
                , [], ()=>{
                    this._successCB('executeSql');
                },(err)=>{
                    console.log(err);
                    this._errorCB('executeSql',err);
                });
        },(err)=>{
            this._errorCB('transaction',err);
        },()=>{
            this._successCB('transaction');
        });
    },

    //创建评论表
    createDiscussTable(){
        db.transaction((tx)=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + DISCUSS_TABLE_NAME + '( '+
                'id INTEGER PRIMARY KEY NOT NULL,'+
                'user_name VARCHAR,'+
                'post_id VARCHAR,'+
                'discuss_content VARCHAR,'+
                'discuss_time VARCHAR,'+
                'discuss_parent_id VARCHAR'+');'
                , [], ()=>{
                    this._successCB('executeSql');
                },(err)=>{
                    console.log(err);
                    this._errorCB('executeSql',err);
                });
        },(err)=>{
            this._errorCB('transaction',err);
        },()=>{
            this._successCB('transaction');
        });
    }
});


module.exports = SQLite;
