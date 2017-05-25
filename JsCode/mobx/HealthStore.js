import {observable,computed,action,runInAction}from 'mobx'
import Cheerio from 'cheerio';
const HOST_URL = 'http://www.jianshu.com';
export default class HealthStore{
    /**
     * 定义要观察的数据
     */
    @observable healthList = []; //健康信息列表
    @observable page = 1; //页码
    @observable isRefreshing = false; //控制刷新
    @observable errorMsg = '';
    constructor(){
       //构造函数
        this.fetchHealthList();
    }

    //得到健康信息列表的数据
    @action
    fetchHealthList = async() => {
        try{
            if(this.isRefreshing) this.page = 1;
            const html = await this._fetchData();
            const result = await this.resolveHtml(html);
            runInAction(()=>{
                this.isRefreshing = false;
                this.errorMsg = '';
                if(this.page == 1){
                    this.healthList.replace(result);
                }else{
                    this.healthList.splice(this.healthList.length,0,...result);
                }
            })
        }catch(error){
            this.errorMsg = error;
        }
    };

    //因为无法获得数据源的json数据，所以这里采用解析网页的方式来获得数据
    resolveHtml(html){
        let $ = Cheerio.load(html,{decodeEntities: false});
        let body = $('ul.note-list');
        let list = this.healthList;
        body.each((index,item)=>{
            let healthItem = {
                title:'',
                date_created:'',
                viewers_count:'',
                image_thumbnail:'',
                url:'',
            };
            let li = $(body).find('li');
            $(li).each((i,elem)=>{
                healthItem.title = $(elem).find('a.title').html();
                healthItem.date_created = $(elem).find('span.time').attr('data-shared-at');
                healthItem.image_thumbnail = 'http:'+$(elem).find('a.wrap-img img').attr('src');
                let viewStr = $(elem).find('div.meta a').html();
                healthItem.viewers_count = viewStr.substr(viewStr.indexOf('</i>')+4);
                healthItem.url = HOST_URL+$(elem).find('a.title').attr('href');
                list.push(healthItem);
            })
        });
        return list;
    }

    @computed
    get isFetching(){
        return this.healthList.length == 0 && this.errorMsg == '';
    }

    @computed
    get isLoadMore(){
        return this.page !=1;
    }

    //解析url获得数据
    _fetchData(){
        return new Promise((resolve,reject)=>{
            const url = `http://www.jianshu.com/c/YZRvCb?order_by=commented_at&page=${this.page}`;
            fetch(url).then(response=>{
                if(response.status == 200){
                    return response.text();
                }
                return null;
            }).then(responseData=>{
                resolve(responseData);
            }).catch(error=>{
                console.log({error});
                reject('网络请求出错！');
            })
        })
    }
}
