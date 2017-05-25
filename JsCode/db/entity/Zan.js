/**
 * 点赞信息表
 **/
import React from 'react';
let id;
let user_name = '';
let post_id = '';
let discuss_id = '';
let zan_time = '';

const Zan = React.createClass({
   getId(){
       return this.id;
   },
   setId(zan_id){
       this.id = zan_id;
   },

   getUserName(){
       return this.user_name;
   },
   setUserId(user_name){
       this.user_name = user_name;
   },

   getPostId(){
       return this.post_id;
   },
   setPostId(post_id){
       this.post_id = post_id;
   },

   getDiscussId(){
       return this.discuss_id;
   },
   setDiscussId(discuss_id){
       this.discuss_id = discuss_id;
   },

   getTime(){
       return this.time;
   },
   setTime(zan_time){
       this.zan_time = zan_time;
   }
});