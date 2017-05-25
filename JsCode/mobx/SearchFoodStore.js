import {observable,computed,action,runInAction}from 'mobx'

export default class SearchFoodStore{

    //定义可监控的变量
    @observable searchFoodList = [];
    @observable page = 1; //页码
    @observable keyword = ''; //搜索关键词
    @observable orderAsc = 'desc'; //排序方式
    @observable orderBy = ''; //按哪种元素排序
    @observable health_mode = 1; //血糖
    @observable health_light = 1; //推荐
    @observable tags = ''; //食物标签

    changePage(){
        this.page = 1;
        this.fetchSearchFoodList();
    }

    fetchSearchFoodList = async()=>{
        try{
            const result = await this._fetchSearchData();
            runInAction(()=>{
                if(this.page == 1){
                    this.searchFoodList.replace(result);
                }else{
                    this.searchFoodList.splice(this.searchFoodList.length,0,...result);
                }
            });
        }catch(error){
            console.log('fetchSearchFoodList:'+error)
        }
    };

    _fetchSearchData(){
        return new Promise((resolve,reject)=>{
            let URL = `http://food.boohee.com/fb/v1/search?page=${this.page}&q=${this.keyword}&order_asc=${this.orderAsc}`;
            if(this.orderBy != ''){
                URL += `&order_by=${this.orderBy}`;
            }
            fetch(URL).then((response)=>{
                if(response.status == 200)return response.json();
                    return null;
            }).then((responseData)=>{
                if(responseData){
                    resolve(responseData.items);
                }else{
                    console.log('请求出错');
                    reject('请求出错');
                }
            }).catch((error)=>{
                console.log(error);
            });
        });
    }
}