/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * 食物state管理
 * 所用信息来自十五言数据API http://www.15yan.com/apis/
 */

import {observable,computed,action,runInAction}from 'mobx'

export default class FoodStore{
    /**
     * 定义要观察的数据
     */
    @observable foodList = []; //食物列表
    @observable errorMsg = ''; //错误信息
    @observable page = 1; //分页信息
    @observable isRefreshing = false; //下拉刷新

    constructor(){
        this.fetchFoodList();
    }

    @action
    fetchFoodList = async() => {
        try {
            if(this.isRefreshing) this.page = 1;
            const result = await this._fetchData();
            //action中的操作是在修改state
            //而在async/await中修改state必须包含在runInAction中
            runInAction(()=>{
                this.isRefreshing = false;
                this.errorMsg = '';
                if(this.page == 1){
                    this.foodList.replace(result);

                }else{
                    this.foodList.splice(this.foodList.length,0,...result);
                }
            })
        }catch(error){
            this.errorMsg = error;
        }
    };

    //通过列表的长度和错误代码判断列表是否正在加载
    //正在加载返回true,已经加载完返回false
    @computed
    get isFetching(){
        return this.foodList.length == 0 && this.errorMsg == '';
    }

    @computed
    get isLoadMore(){
        return this.page !=1;
    }

    //解析url，获得json数据
    _fetchData(){
        return new Promise((resolve,reject)=>{
            const URL = `http://www.15yan.com/apis/story.json?offset=${this.page*20}&limit=20&retrieve_type=by_topic&order_by=latest&topic_id=0KtwMMNLpoN&_=1490342140336`;
            fetch(URL).then(response => {
                if(response.status == 200) return response.json();
                    return null;
            }).then(responseData => {
                if(responseData){
                    resolve(responseData.result);
                }else{
                    console.log('请求出错！');
                    reject('请求出错！')
                }
            }).catch(error => {
                console.log({error});
                reject('网络出错！');
            })
        })
    }
}