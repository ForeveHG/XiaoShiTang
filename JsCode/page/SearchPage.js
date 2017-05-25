import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ListView,
    ScrollView
}from 'react-native';
import constant from '../common/Constants';
import SearchHeader from '../component/SearchHeader';
import SearchFoodStore from '../mobx/SearchFoodStore';
import {reaction,observable,autorun} from 'mobx';
import {observer} from 'mobx-react/native';
import {SortNutrientBar,OrderBar}from '../page/FoodTypeDetail';
import FoodDetailItem from '../component/FoodDetailItem';
import FoodInfo from '../page/FoodInfo';
import LoadMore from '../component/LoadMore';
import NutrientList from '../component/NutrientList';
import SearchWe from '../component/SearchWe';
import SearchHistory from '../component/SearchHistory';
import SearchHistoryStore from '../mobx/SearchHistoryStore';

const asc = '营养素排序';
const asc1 = '由高到低';
const asc2 = '由低到高';

@observer
export default class SearchPage extends Component{

    searchFoodStore = new SearchFoodStore();
    searchHistoryStore = new SearchHistoryStore();

    history = [];

    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (oldItem,newItem)=> oldItem != newItem
        }),
        search: false,
        sortCode: 'calory',
        sortTypes: [],
        orderName: asc,
        orderAsc: asc1,
        orderImg: require('../img/ic_food_ordering_down.png'),
    };

    componentDidMount(){
        reaction(
            ()=> this.searchFoodStore.page,
            ()=> this.searchFoodStore.fetchSearchFoodList(),
        );
        reaction(
            ()=>this.searchFoodStore.orderBy,
            ()=>this.searchFoodStore.changePage(),
        );
        reaction(
            ()=>this.searchFoodStore.keyword,
            ()=>this.searchFoodStore.changePage(),
        );
        reaction(
            ()=>this.searchFoodStore.orderAsc,
            ()=>this.searchFoodStore.changePage(),
        );
        this._fetchNutrientDate();
    }

    _fetchNutrientDate = async()=>{
        let URL = 'http://food.boohee.com/fb/v1/foods/sort_types';
        try{
            const result = await fetch(URL).then((response)=>{
                return response.json();
            });
            console.log(result);
            this.setState({
                sortTypes : result,
            });
        }catch(error){
            console.log(error);
        }
    };

    _searchPress(){
        this.searchFoodStore.fetchSearchFoodList();
        this.setState({
            search:true,
        })
    }

    _renderRow(item){
        let addFoodFlag = false;
        if(this.props.addFoodFlag != undefined){
            addFoodFlag = true;
        }
        let compareFoodStore = '';
        if(this.props.compareFoodStore){
            compareFoodStore = this.props.compareFoodStore;
        }
        return (
            <FoodDetailItem
                item={item}
                addFoodFlag={addFoodFlag}
                onItemPress={this.onItemPress.bind(this,item)}
                sortCode={this.state.sortCode}
                onReturnPress = {this._onReturnPress.bind(this)}
                compareFoodStore = {compareFoodStore}
                flag = {this.props.flag}
            />
        )
    }

    _renderFooter(){
        return <LoadMore/>
    }

    onItemPress(item){
        let navigator = this.props.navigator;
        if(navigator){
            navigator.push({
                name:'FoodInfo',
                component:FoodInfo,
                params:{
                    navigator: navigator,
                    type: this.state.sortTypes,
                    food:item,
                    onReturnPress:this._onReturnPress.bind(this),
                }
            })
        }
    }

    _onReturnPress(){
        this.refs.dialog.onPressReturn();
        this.props.onReturnPress();
    }

    _onEndReached(){
        return this.searchFoodStore.page++;
    }

    //显示元素选择下拉列表
    showTypeSelect(){
        this.refs.dialog.show(20);
    }

    //得到关键字
    getKeywords(keyword){
        if(this.searchFoodStore.keyword != keyword){
            this.searchFoodStore.keyword = keyword;
            this.addHistory();
            return this.searchFoodStore.keyword;
        }
    }

    //添加历史搜索记录
    addHistory(){
        let keyword = this.searchFoodStore.keyword;
        let historyList = this.searchHistoryStore.searchHistory;
        if(historyList.length == 0){
            this.searchHistoryStore.searchHistory.push(keyword);
        }else{
            this.searchHistoryStore.searchHistory.map((item,index)=>{
                if(item == keyword){
                    this.searchHistoryStore.searchHistory.splice(index,1);
                    return;
                }
            });
            if(historyList.length<10){
                this.searchHistoryStore.searchHistory.unshift(keyword);
            }else{
                this.searchHistoryStore.searchHistory.pop();
                this.searchHistoryStore.searchHistory.unshift(keyword);
            }
        }
        this.searchHistoryStore.saveStorage();
    }

    //删除搜索历史
    removeHistory(){
        this.searchHistoryStore.removeStorage();
    }

    searchKeyword(keyword){
        this.setState({
            search:true,
        });
        this.getKeywords(keyword);
    }

    returnSearch(){
        this.setState({
            search:false,
        });
        this.searchFoodStore.keyword='';
    }

    //改变从高到低排序的图标
    changeOrderAsc(){
        if(this.state.orderAsc == asc1 ){
            this.setState({
                orderAsc: asc2,
                orderImg: require('../img/ic_food_ordering_up.png'),
            });
            this.searchFoodStore.orderAsc = 'asc';
        }else if(this.state.orderAsc == asc2 ){
            this.setState({
                orderAsc: asc1,
                orderImg: require('../img/ic_food_ordering_down.png'),
            });
            this.searchFoodStore.orderAsc = 'desc';
        }
        return this.searchFoodStore.orderAsc;
    }

    changeOrderBy(orderBy,orderName,sortCode){
        console.log('orderBy:'+orderBy);
        console.log('orderName:'+orderName);
        console.log('sortCode:'+sortCode);
        this.searchFoodStore.orderBy = sortCode;
        this.setState({
            sortCode: sortCode,
            orderName : orderName,
        });
        return this.searchFoodStore.orderBy;
    }

    render(){
        const {searchFoodList} = this.searchFoodStore;
        const {searchHistory} = this.searchHistoryStore;
        const data = this.state.sortTypes;
        if(!this.state.search){
            return(
                <View>
                    <SearchHeader
                        keyword={this.searchFoodStore.keyword}
                        onReturnPress = {this.props.onReturnPress}
                        searchPress={this._searchPress.bind(this)}
                        getKeywords={this.getKeywords.bind(this)}
                        changePage={this.searchFoodStore.changePage}
                        returnSearch={this.returnSearch.bind(this)}
                    />
                    <ScrollView>
                        <SearchHistory
                            history={searchHistory}
                            searchHistory = {this.searchKeyword.bind(this)}
                            removeHistory = {this.removeHistory.bind(this)}
                        />
                        <SearchWe searchWe = {this.searchKeyword.bind(this)}/>
                        <View style={{height:80}} />
                    </ScrollView>
                </View>
            )
        }
        return(
            <View style={{backgroundColor:constant.color.bk}}>
                <View style={{zIndex:3}}>
                    <SearchHeader
                        keyword={this.searchFoodStore.keyword}
                        onReturnPress = {this._onReturnPress.bind(this)}
                        searchPress={this._searchPress.bind(this)}
                        getKeywords={this.getKeywords.bind(this)}
                        changePage={this.searchFoodStore.changePage}
                        returnSearch={this.returnSearch.bind(this)}
                    />
                    <SortNutrientBar
                        showTypeSelect={this.showTypeSelect.bind(this)}
                        orderName={this.state.orderName}
                        changeOrderAsc = {this.changeOrderAsc.bind(this)}
                        orderAsc = {this.state.orderAsc}
                        orderImg={this.state.orderImg}
                    />
                </View>
                <ListView
                    dataSource = {this.state.dataSource.cloneWithRows(searchFoodList.slice(0))}
                    renderRow = {this._renderRow.bind(this)}
                    enableEmptySections = {true}
                    renderFooter={this._renderFooter.bind(this)}
                    initialListSize={5}
                    pageSize={5}
                    onEndReachedThreshold={5}
                    onEndReached={this._onEndReached.bind(this)}
                />
                <NutrientList ref="dialog" data = {data} changeOrderBy={this.changeOrderBy.bind(this)} />
            </View>
        )
    }
}