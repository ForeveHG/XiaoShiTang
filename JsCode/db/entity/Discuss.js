/**
 * 评论信息表
 **/
import React from 'react';
let id;
let user_name = ''; //发表评论人的用户名
let post_id = ''; //在哪篇文章下发表的评论
let discuss_content = ''; //评论内容
let discuss_time = ''; //评论时间
let discuss_parent_id = ''; //父元素的id，0代表原评论，

const Discuss = React.createClass({
    getId(){
        return this.id;
    },
    setId(id){
        this.id = id;
    },
    getUserName(){
        return this.user_name;
    },
    setUserName(user_name){
        this.user_name = user_name;
    },
    getPostID(){
        return this.post_id;
    },
    setPostID(post_id){
        this.post_id = post_id;
    },
    getDiscussContent(){
        return this.discuss_content;
    },
    setDiscussContent(discuss_content){
        this.discuss_content = discuss_content;
    },
    getDiscussTime(){
        return this.discuss_time;
    },
    setDiscussTime(discuss_time){
        this.discuss_time = discuss_time;
    },
    getDiscussParentId(){
        return this.discuss_parent_id;
    },
    setDiscussParentId(discuss_parent_id){
        this.discuss_parent_id = discuss_parent_id;
    },
    render(){
        return null;
    }
});

module.exports = Discuss;