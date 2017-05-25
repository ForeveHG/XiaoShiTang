/**
 * 通过ScrollableTabView控制应用主页面
 * 图标来源：阿里巴巴矢量图标库http://www.iconfont.cn/plus/search/index
 */
import React,{Component}from 'react';
import {
    View,
    Text,
    StyleSheet,
    ToastAndroid,
    BackAndroid,
    Platform,
}from 'react-native';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view';
import SQLite from '../db/SQLite';
import SubTabBar from '../component/SubTabBar';
import Food from './Food';
import MePage from './MePage';
import {observable,action}from 'mobx'
import {observer} from 'mobx-react/native';
import UserStore from '../mobx/UserStore';
import PostStore from '../mobx/PostStore';
import CollectStore from '../mobx/CollectStore';
import ZanStore from '../mobx/ZanStore';
import DiscussStore from '../mobx/DiscussStore';
import FoodWiKi from '../page/FoodWiKi';
import UserLite from '../db/UserLite';
import PostLite from '../db/PostLite';
import CollectLite from '../db/CollectLite';
import ZanLite from '../db/ZanLite';
import DiscussLite from '../db/DiscussLite';

const userLite = new UserLite();
const postLite = new PostLite();
const collectLite = new CollectLite();
const zanLite = new ZanLite();
const discussLite = new DiscussLite();

//tab标题
let titels = ['吃货','百科','我的'];
//未选中的tab图标
let icons = [
    require('../img/meishiNotActive.png'),
    require('../img/baikeNotActive.png'),
    require('../img/meNotActive.png')
];
//选中的tab图标
let iconsActive = [
    require('../img/meishiActive.png'),
    require('../img/baikeActive.png'),
    require('../img/meActive.png'),
];
const sqlite = new SQLite();

@observer
export default class MainBar extends Component{

    userStore = new UserStore();
    postStore = new PostStore();
    collectStore = new CollectStore();
    zanStore = new ZanStore();
    discussStore = new DiscussStore();

    _onChangeTab = ({i})=>{
        //alert(i)
    };

    componentDidMount(){
        let db = sqlite.getDB();
        if(!db){
            sqlite.createTable().then((result)=>{
                sqlite.cerateUserTable();
                sqlite.createPostTable();
                sqlite.createCollectTable();
                sqlite.createZanTable();
                sqlite.createDiscussTable();
                userLite.setDB();
                postLite.setDB();
                collectLite.setDB();
                zanLite.setDB();
                discussLite.setDB();
            }).catch((err)=>{
                console.log('SQLite createTable:'+err);
            });
        }
        this._addBackAndroidListener(this.props.navigator);
    }
    componentWillUnmount(){
        sqlite.close();
        this._removeBackAndroidListener();
    }

    //监听返回键
    _addBackAndroidListener(navigator){
        if(Platform.OS === 'android'){
            let currTime = 0;
            BackAndroid.addEventListener('hardwareBackPress',()=>{
                if(!navigator){return false;}
                const routers = navigator.getCurrentRoutes();
                if(routers.length == 1){ //在主界面
                    let nowTime = (new Date()).valueOf();
                    if(nowTime - currTime > 1000){
                        currTime = nowTime;
                        ToastAndroid.show('再按一次退出程序',ToastAndroid.SHORT);
                        return true;
                    }
                    return false;
                }else{
                    navigator.pop();
                    return true;
                }
            })
        }
    }

    _removeBackAndroidListener(){
        if(Platform.OS === 'android'){
            BackAndroid.removeEventListener('hardwareBackPress');
        }
    }

    render(){
        let us = this.userStore != null ? this.userStore : null;
        let ps = this.postStore != null ? this.postStore : null;
        let cs = this.collectStore != null ? this.collectStore : null;
        return (
            <View style={{flex:1}}>
                <ScrollableTabView
                    renderTabBar={()=><SubTabBar tabNames={titels} icons={icons} iconsActive={iconsActive} />}
                    tabBarPosition="bottom"
                    locked
                    onChangeTab={this._onChangeTab}
                >
                    <FoodWiKi navigator={this.props.navigator}/>
                    <Food navigator={this.props.navigator} postStore = {ps} userStore = {us} zanStore = {this.zanStore}/>
                    <MePage
                        navigator={this.props.navigator}
                        userStore = {us}
                        postStore = {ps}
                        collectStore = {cs}
                        zanStore = {this.zanStore}
                    />
                </ScrollableTabView>
            </View>
        )
    }
}