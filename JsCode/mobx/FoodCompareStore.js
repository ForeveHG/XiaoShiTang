import {observable,computed,action,runInAction}from 'mobx'

export default class FoodCompareStore{

    @observable leftImg: '';
    @observable leftTitle: '';
    @observable leftNutrition:[];
    @observable rightImg: '';
    @observable rightTitle: '';
    @observable rightNutrition:[];
    @observable code = '';
    @observable flag = '';

    getCompareList(code,flag){
        this.code = code;
        this.flag = flag;
        this.fetchCompareList();
    }

    clearLeft(){
        this.leftTitle = '';
        this.leftImg = '';
        this.leftNutrition = [];
    }

    clearRight(){
        this.rightTitle = '';
        this.rightImg = '';
        this.rightNutrition = [];
    }

    fetchCompareList = async() => {
        let result = await this._fetchComppareData();
        if(this.flag == 'left'){
            this.leftImg = result.thumb_image_url;
            this.leftTitle = result.name;
            this.leftNutrition = result.nutrition;
        }else if(this.flag == 'right'){
            this.rightImg = result.thumb_image_url;
            this.rightTitle = result.name;
            this.rightNutrition = result.nutrition;
            console.log('alsdkjf;asdf'+this.rightNutrition);
        }
    };

    _fetchComppareData(){
        let URL = `http://food.boohee.com/fb/v1/foods/${this.code}/brief?`;
        return new Promise((resolve,reject)=>{
            fetch(URL).then((response)=>{
                if(response.status == 200){
                    return response.json();
                }
                return null;
            }).then((responseData)=>{
                if(responseData){
                    resolve(responseData);
                }else{
                    console.log('请求出错！');
                }
            }).catch((error)=>{
                console.log('请求出错：'+error);
                reject(error);
            })
        })
    }
}