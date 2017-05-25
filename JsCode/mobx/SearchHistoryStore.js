import {observable,computed,action,runInAction,reaction}from 'mobx'

export default class SearchHistoryStore{
    @observable searchHistory = [];

    constructor(){
        this.getStorage();
        console.log('constructor searchHistory:'+this.searchHistory);
    }

    @action
    saveStorage (){
        storage.save({
            key: 'searchHistory',
            rawData: {
                history: this.searchHistory ,
            },
        });
    };

    getStorage = async()=>{
        await storage.load({
            key : 'searchHistory',
            autoSync : true,
            syncInBackground : true,
        }).then((ret)=>{
            if(ret){
                console.log('ret');
                console.log(ret);
                this.searchHistory = ret.history;
                console.log('storage searchHistory:'+this.searchHistory);
            }
        }).catch((err)=>{
            switch (err.name) {
                case 'NotFoundError':
                    // TODO;
                    break;
                case 'ExpiredError':
                    // TODO
                    break;
            }
        })
    };

    removeStorage(){
        storage.remove({
            key: 'searchHistory',
        });
        this.searchHistory = [];
    }
}