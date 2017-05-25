import React from 'react';
let id;
let login_name = '';
let login_pwd = '';
let nick_name = '';
let favicon = '';
let sex = '';
let age = '';
let height = '';
let weight = '';

const User = React.createClass({
    render(){
        return null;
    },
    getId(){
        return this.id;
    },
    setId(id){
        this.id = id;
    },
    getLoginName(){
        return this.login_name;
    },
    setLoginName(login_name){
        this.login_name = login_name;
    },
    getLoginPwd(){
        return this.login_pwd;
    },
    setLoginPwd(login_pwd){
        this.login_pwd = login_pwd;
    },
    getNickName(){
        return this.nick_name;
    },
    setNickName(nick_name){
        this.nick_name = nick_name;
    },
    getFavicon(){
        return this.favicon;
    },
    setFavicon(favicon){
        this.favicon = favicon;
    },
    getSex(){
        return this.sex;
    },
    setSex(sex){
        this.sex = sex;
    },
    getAge(){
        return this.age;
    },
    setAge(age){
        this.age = age;
    },
    getHeight(){
        return this.height;
    },
    setHeight(height){
        this.height = height;
    },
    getWeight(){
        return this.Weight;
    },
    setWeight(weight){
        this.weight = weight;
    }
});
module.exports = User;
