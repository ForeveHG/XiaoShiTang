import React,{Component}from 'react';
import {
    View,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    Modal,
    Animated
}from 'react-native';
import {reaction,observable,autorun} from 'mobx';
import {observer} from 'mobx-react/native';
import Header from '../component/DetailHeader';
import LoadMore from '../component/LoadMore';
import Loading from '../component/Loading';
import FoodTypeStore from '../mobx/FoodTypeStore';
import NutrientList from '../component/NutrientList';
import FoodInfo from '../page/FoodInfo';
import FoodDetailItem from '../component/FoodDetailItem';
import constant from '../common/Constants';
const asc = '营养素排序';
const asc1 = '由高到低';
const asc2 = '由低到高';

@observer
export default class FoodTypeDetail extends Component{

    visible = false;

    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (oldItem,newItem)=> oldItem != newItem
        }),
        sortTypes: [],
        sortCode: 'calory',
        orderName: asc,
        orderAsc: asc1,
        //selectImg:require ('../img/ic_food_ordering.png'),
        orderImg: require('../img/ic_food_ordering_down.png'),
    };

    foodTypeStore = new FoodTypeStore(this.props.typeItem.group);

    componentWillMount(){
        reaction(
            ()=>this.foodTypeStore.page,
            ()=>this.foodTypeStore.fetchFoodTypeList(),
        );
        reaction(
            ()=>this.foodTypeStore.orderBy,
            ()=>this.foodTypeStore.fetchFoodTypeList(),
        );
        reaction(
            ()=>this.foodTypeStore.orderAsc,
            ()=>this.foodTypeStore.changePage(),
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

    _renderRow(item){
        return <FoodDetailItem item = {item} onItemPress={this._onItemPress.bind(this,item)} sortCode={this.state.sortCode}/>
    }

    _onItemPress(item){
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

    static _renderFooter(){
        return <LoadMore/>
    }

    _onEndReached(){
        return this.foodTypeStore.page++;
    };

    showTypeSelect(){
        this.refs.dialog.show();
    }

    _onReturnPress(){
        this.refs.dialog.onPressReturn();
        this.props.onReturnPress();
    }

    changeOrderBy(orderBy,orderName,sortCode){
        this.foodTypeStore.orderBy = orderBy;
        this.setState({
           sortCode: sortCode,
           orderName : orderName,
        });
        return this.foodTypeStore.orderBy;
    }

    changeOrderAsc(){
        if(this.state.orderAsc == asc1 ){
            this.setState({
                orderAsc: asc2,
                orderImg: require('../img/ic_food_ordering_up.png'),
            });
            this.foodTypeStore.orderAsc = 1;
        }else if(this.state.orderAsc == asc2 ){
            this.setState({
                orderAsc: asc1,
                orderImg: require('../img/ic_food_ordering_down.png'),
            });
            this.foodTypeStore.orderAsc = 0;
        }
        return this.foodTypeStore.orderAsc;
    }

    render(){
        const {foodTypeList,isFetching,orderBy} = this.foodTypeStore;
        const data = this.state.sortTypes;
        if(isFetching){
            return(
                <View>
                    <Header title={this.props.typeItem.title} onPress={this._onReturnPress.bind(this)} />
                    <SortNutrientBar showTypeSelect = {this.showTypeSelect.bind(this)} orderName={this.state.orderName} changeOrderAsc = {this.changeOrderAsc.bind(this)} orderAsc = {this.state.orderAsc} orderImg={this.state.orderImg}/>
                    <Loading isShow={isFetching} loadText="正在加载..." />
                </View>
            )
        }
        return(
            <View>
                <View style={{zIndex:3}}>
                    <Header title={this.props.typeItem.title} onPress={this._onReturnPress.bind(this)} />
                    <SortNutrientBar showTypeSelect = {this.showTypeSelect.bind(this)} orderName={this.state.orderName} changeOrderAsc = {this.changeOrderAsc.bind(this)} orderAsc = {this.state.orderAsc} orderImg={this.state.orderImg}/>
                </View>
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(foodTypeList.slice(0))}
                    renderRow={this._renderRow.bind(this)}
                    renderFooter={this._renderFooter}
                    enableEmptySections={true}
                    initialListSize={5}
                    pageSize={5}
                    onEndReachedThreshold={5}
                    onEndReached={this._onEndReached.bind(this)}
                    style={{zIndex:1}}
                />
                <NutrientList ref="dialog" data = {data} changeOrderBy={this.changeOrderBy.bind(this)} />
            </View>
        )
    }
}

//营养素排序栏
export const SortNutrientBar = ({showTypeSelect,orderName,changeOrderAsc,orderAsc,orderImg})=>{
    return(
        <View
            style={{
                height:30,
                borderBottomColor:'#eee',
                borderBottomWidth:1,
                backgroundColor:'#fff',
                alignItems:'center',
                justifyContent:'space-between',
                flexDirection:'row',
                zIndex: 1,
            }}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={showTypeSelect}
                style={{
                    flexDirection:'row',
                    marginLeft:20,
                }}
            >
                <Text style={{fontSize:10,color:'#555'}}>{orderName}</Text>
                <Image
                    source={require('../img/ic_food_ordering.png')}
                    style={{
                           width:10,
                           height:10,
                           marginLeft:5,
                           marginTop: 2,
                       }}
                />
            </TouchableOpacity>
            <OrderBar changeOrderAsc = {changeOrderAsc} orderAsc={orderAsc} orderImg={orderImg} orderName={orderName}/>
        </View>
    )
};

export const OrderBar = ({changeOrderAsc,orderAsc,orderImg,orderName})=>{
    if(orderName == asc){
        return <View/>
    }else{
        return(
            <TouchableOpacity
                activeOpacity = {0.9}
                onPress = {changeOrderAsc}
                style = {{
                        flexDirection:'row',
                        marginRight:20,
                        alignItems:'center',
                        justifyContent:'center',
                    }}
            >
                <Text style={{fontSize:10,color:'#ff5668'}}>{orderAsc}</Text>
                <Image
                    source={orderImg}
                    style = {{
                            width:10,
                            height:10,
                            marginLeft:5,
                        }}
                />
            </TouchableOpacity>
        )
    }

};