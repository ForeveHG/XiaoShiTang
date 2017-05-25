/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * 动态场景
 */

import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Navigator,
}from 'react-native';
//兼容安卓和IOS的滚动选项卡控件
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import FoodList from './FoodList';
import HealthList from './HealthList';
import FoodsCategoryBar from '../component/FoodsCategoryBar';
import PostShare from './PostShare';
import PublishPost from '../page/PublishPost';
import {observer} from 'mobx-react/native';

const titles = ['分享','美食','健康'];

@observer
export default class Food extends Component{

    postStore = this.props.postStore;
    userStore = this.props.userStore;
    collectStore = this.props.collectStore;

    _onEditPress(){
        let navigator = this.props.navigator;
        if(navigator){
            navigator.push({
                name:'PublishPost',
                component:PublishPost,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                params:{
                    postStore : this.postStore,
                    userStore : this.userStore,
                }
            })
        }
    }

    render(){
        return(
            <View style={{flex:1}}>
                <View style={{height:40,backgroundColor:'#FAFAFA',flexDirection:'row',justifyContent:'center',alignItems:'center',borderBottomColor:'#eee',borderBottomWidth:1}}>
                    <Text style={{fontSize:14,textAlign:'center'}}>小食堂</Text>
                    {this.userStore.user ? <EditIcon onEditPress={this._onEditPress.bind(this)}/> : <View/>}
                </View>
                <ScrollableTabView
                    tabBarPosition='top'
                    tabBarActiveTextColor="#FFB3B3"
                    tabBarTextStyle={
                        {fontSize:12}
                    }
                    renderTabBar={()=><FoodsCategoryBar tabNames={titles}/>}
                    style={styles.scrollBar}
                >
                    <PostShare
                        tabLabel="post" navigator={this.props.navigator}
                        postStore={this.props.postStore}
                        userStore={this.props.userStore}
                        collectStore={this.props.collectStore}
                        zanStore={this.props.zanStore}
                    />
                    <FoodList tabLabel="food" navigator={this.props.navigator} />
                    <HealthList tabLabel="health" navigator={this.props.navigator} />
                </ScrollableTabView>
            </View>

        )
    }
}

let EditIcon = ({onEditPress})=>{
    return(
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onEditPress}
            style={{
                position:'absolute',
                top:0,
                right:10
            }}
        >
            <Image
                source={require('../img/ic_edit.png')}
                style={{width:40,height:40,}}
            />
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    scrollBar:{
        backgroundColor:"#FAFAFA",
    },
});