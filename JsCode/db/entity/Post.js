import React from 'react';
let id = '';
let user_name = '';
let post_title = '';
let post_content = '';
let post_img = '';
let post_time = '';

const Post = React.createClass({

    getId(){
        return this.id;
    },
    setId(id){
        this.id = id;
    },

    getUserName(){
        return this.user_name;
    },
    setUserName(userName){
       this.user_name = userName;
    },

    getPostTitle(){
       return this.post_title;
    },
    setPostTitle(postTitle){
        this.post_title = postTitle;
    },

    getPostContent(){
        return this.post_content;
    },
    setPostContent(postContent){
       this.post_content = postContent;
    },

    getPostImg(){
        return this.post_img;
    },
    setPostImg(postImg){
       this.post_img = postImg;
    },

    getPostTime(){
        return this.post_time;
    },
    setPostTime(postTime){
        this.post_time = postTime;
    },

    render(){
        return null;
    },

});

module.exports = Post;