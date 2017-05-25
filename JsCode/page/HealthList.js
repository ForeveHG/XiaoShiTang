/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * 健康信息列表
 */

import React, { PureComponent } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl
} from 'react-native';
import {reaction,observable,autorun} from 'mobx';
import {observer} from 'mobx-react/native';
import Toast from 'react-native-easy-toast';
import FoodSingleItem from '../component/FoodSingleItem';
import HealthStore from '../mobx/HealthStore';
import Loading from '../component/Loading';
import LoadMore from '../component/LoadMore';
import FoodDetail from './FoodDetail';
@observer
export default class HealthList extends PureComponent {
    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged:(oldRow,newRow)=>oldRow!=newRow,
        })
    };

    healthListStore = new HealthStore();

    componentDidMount() {
        reaction(
            ()=> this.healthListStore.page,
            ()=> this.healthListStore.fetchHealthList()
        )
    }

    componentWillReact(){
        const{errorMsg} = this.healthListStore;
        errorMsg && this.Toast.show(errowMsg)
    }

    _renderRow = (data) => {
        return <FoodSingleItem
            onPress={this._onPress.bind(this,data)} food={data} />;
    };

    _onRefresh = ()=>{
        this.healthListStore.isRefershing = true;
        this.healthListStore.fetchHealthList();
    };

    _onEndReach = ()=>{
        return this.healthListStore.page++;
    };

    _renderFooter= ()=>{
        return <LoadMore/>
    };

    _onPress = (food) =>{
        this.props.navigator.push({
            name:food.title,
            component:FoodDetail,
            //传递参数
            params:{
                food:food,
            }
        })
    };

    render() {
        const {isFetching,healthList,isRefreshing} = this.healthListStore;
        if(isFetching){
            return <Loading isShow={isFetching}  loadText='正在加载...' />;
        }
        return (
            <View>
                <ListView
                    style={{backgroundColor:'#fafafa'}}
                    dataSource={this.state.dataSource.cloneWithRows(healthList.slice(0))}
                    renderRow={this._renderRow}
                    renderFooter={this._renderFooter}
                    enableEmptySections={true}
                    initialListSize={5}
                    pageSize={5}
                    onEndReached={this._onEndReach}
                    onEndReachedThreshold={5}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            colors={['#FFB3B3']}
                        />
                    }
                />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    grid:{
        justifyContent: "flex-start",
        flexDirection: "row",
        flexWrap: "wrap",
    },
});
