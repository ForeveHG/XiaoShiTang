/**
 * 收藏信息表
 **/
import React from 'react';
//收藏ID、食物ID、文章ID、收藏时间
let id;
let user_name = '';
let food_id = '';
let post_id = '';
let collect_time = '';

const Collect = React.createClass({
    getId(){
        return this.id;
    },
    setId(id){
        this.id = id;
    },
    getCollectId(){
        return this.user_name;
    },
    setCollectId(user_name){
        this.user_name = user_name;
    },
    getFoodId(){
        return this.food_id;
    },
    setFoodId(food_id){
        this.food_id = food_id;
    },
    getPostId(){
        return this.post_id;
    },
    setPostId(post_id){
        this.post_id = post_id;
    },
    getPostId(){
        return collect_time;
    },
    setCollectTime(collect_time){
        this.collect_time = collect_time;
    }
});