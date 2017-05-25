import {
    InteractionManager,
}from 'react-native';
import {observable,computed,action,runInAction}from 'mobx'
//import Cheerio from 'cheerio';

export default class FoodTypeStore{
    @observable foodTypeList = []; //食物详细列表
    @observable page = 1; //页码
    @observable categoryId = 1; //食物分类代码，比如：主食，鸡蛋
    @observable orderBy = 1; //营养元素代码，1默认为全部
    @observable orderAsc = 0; //排序方式，默认为从高到低
    @observable isNoMore = true; //是否还有更多

    constructor(categoryId){
        //解决卡顿
        InteractionManager.runAfterInteractions(()=>{
            this.categoryId = categoryId;
            this.fetchFoodTypeList();
        });
    }

    @computed
    get isFetching(){
        return this.foodTypeList.length == 0;
    }

    changePage(){
        this.page = 1;
        this.fetchFoodTypeList();
    }

    fetchFoodTypeList = async()=>{
        try{
            const {foods,isNoMore} = await this._fetchData();
            //const result = await this.resolveHtml(html);
            runInAction(()=>{
                this.isNoMore = isNoMore;
                if(this.page == 1){
                    this.foodTypeList.replace(foods);
                }else{
                    this.foodTypeList.splice(this.foodTypeList.length,0,...foods);
                }
            })
        }catch(error){
            console.log(error);
        }
    };

    _fetchData(){
        console.log('this.orderBy:'+this.orderBy);
        return new Promise((resolve,reject)=>{
            const URL = `http://food.boohee.com/fb/v1/foods?kind=group&value=${this.categoryId}&order_by=${this.orderBy}&order_asc=${this.orderAsc}&page=${this.page}`;
            fetch(URL).then((response)=>{
                if(response.status == 200){
                    return response.json();
                }
            }).then((responseData)=>{
                if(responseData){
                    const {foods,page,total_pages} = responseData;
                    resolve({foods,isNoMore: page == total_pages});
                }else{
                    reject('请求出错');
                }
            }).catch((error)=>{
                reject(error);
                console.log('网络请求出错：'+error);
            })
        })
    }

    //没找到数据接口前使用的方法
    // resolveHtml(html){
    //     let $ = Cheerio.load(html,{decodeEntities: false});
    //     let body = $('ul.food-list');
    //     let list = this.foodTypeList;
    //     body.each((index,item)=>{
    //         let typeItem = {
    //             title: '',
    //             img:'',
    //             content:'',
    //             url:'',
    //         };
    //         let li = $(body).find('li');
    //         $(li).each((i,elem)=>{
    //             typeItem.img = $(elem).find('div.img-box a img').attr('src');
    //             typeItem.title = $(elem).find('div.text-box h4 a').html();
    //             typeItem.content = $(elem).find('div.text-box p').html();
    //             typeItem.url = $(elem).find('div.text-box h4 a').attr('href');
    //             list.push(typeItem);
    //         })
    //     });
    //     return list;
    // }

}

