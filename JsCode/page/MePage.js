import React,{PureComponent} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Navigator
}from 'react-native';
import {observable,action}from 'mobx'
import {observer} from 'mobx-react/native';
import constant from '../common/Constants';
import LoadPage from './LoadPage';
import EditMeInfo from './EditMeInfo';
import SetPage from './SetPage';
import UserStore from '../mobx/UserStore';
import MyShare from '../page/MyShare';
import MyCollect from '../page/MyCollect';
import MyZan from '../page/MyZan';

userState = observable({
    userIcon: require('../img/my_favicon.png'), //用户头像
    userName: '' , //用户名
    text: '点击登陆', //按钮文字
});

@observer
export default class MePage extends PureComponent{

    userStore = this.props.userStore;
    postStore = this.props.postStore;
    collectStore = this.props.collectStore;

    _onPressReturn(){
        let navigator = this.props.navigator;
        if(navigator){
            navigator.pop();
        }
    };

    _onPressLoad(){
        let navigator = this.props.navigator;
        let component = this.userStore.user ? EditMeInfo : LoadPage;
        if(navigator){
            navigator.push({
                component:component,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                params:{
                    name:'component',
                    onPressReturn:this._onPressReturn.bind(this),
                    userStore: this.props.userStore
                }
            })
        }
    };

    _onPressSetting(){
        let navigator = this.props.navigator;
        if(navigator){
            navigator.push({
                component: SetPage,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                params:{
                    name:'component',
                    onPressReturn:this._onPressReturn.bind(this),
                    userStore: this.props.userStore
                }
            })
        }
    }

    _onPressMyShare(){
        let navigator = this.props.navigator;
        let component = this.userStore.user ? MyShare : LoadPage;
        if(navigator){
            navigator.push({
                component: component,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                params:{
                    name:'component',
                    onPressReturn:this._onPressReturn.bind(this),
                    userStore: this.props.userStore,
                    postStore: this.props.postStore,
                }
            })
        }
    }

    _onPressMyCollect(){
        let navigator = this.props.navigator;
        let component = this.userStore.user ? MyCollect : LoadPage;
        if(navigator){
            navigator.push({
                component: component,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                params:{
                    name:'component',
                    onPressReturn:this._onPressReturn.bind(this),
                    userStore: this.props.userStore,
                    collectStore: this.collectStore,
                }
            })
        }
    }

    _onPressMyZan(){
        let navigator = this.props.navigator;
        let component = this.userStore.user ? MyZan : LoadPage;
        console.log('this.props.zanStore:'+this.props.zanStore);
        if(navigator){
            navigator.push({
                component: component,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                params:{
                    name:'component',
                    onPressReturn:this._onPressReturn.bind(this),
                    userStore: this.props.userStore,
                    zanStore: this.props.zanStore,
                }
            })
        }
    }

    render(){
        return(
            <View>
                <MeHeader onPress={this._onPressLoad.bind(this)} onSetPress={this._onPressSetting.bind(this)} user={this.userStore.user} />
                <MeSelectItem MeItemIcon={require('../img/ic_my_upload.png')} MeItemTitle="我的分享" onPress={this._onPressMyShare.bind(this)}/>
                <MeSelectItem MeItemIcon={require('../img/ic_my_collect.png')} MeItemTitle="我的收藏" onPress={this._onPressMyCollect.bind(this)}/>
                <MeSelectItem MeItemIcon={require('../img/post/page_zan_2.png')} MeItemTitle="我赞过的" onPress={this._onPressMyZan.bind(this)}/>
            </View>
        );
    };
}

const MeHeader = ({onPress,onSetPress,user})=>{
    if(user){
        console.log(user.nick_name);
        userState.userIcon = user.favicon != null ? {uri:user.favicon} : require('../img/my_favicon.png');
        userState.userName = user.nick_name != null ? user.nick_name :( user.login_name ? user.login_name : '');
        userState.text = '修改资料';
    }else{
        userState.userIcon = require('../img/my_favicon.png');
        userState.userName = '';
        userState.text = '点击登陆';
    }

    return(
        <Image
            source={require('../img/img_my_head.png')}
            style={styles.headerImg}
        >
            <View style={styles.headerTitle}>
                <Text style={styles.title}>我的</Text>
                <View style={{paddingBottom:20}}>
                    <Image
                        source={userState.userIcon}
                        style={{width:60,height:60,marginBottom:10}}
                    />
                    <Text style={{textAlign:'center',color:'#f5f5f5',fontSize:12,marginBottom:5}}>{userState.userName}</Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={onPress}
                    >
                        <Text style={styles.headerText}>{userState.text}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onSetPress}
                style={styles.headerSetOpt}
            >
                <Image
                    source={require('../img/ic_setting.png')}
                    style={styles.headerSetting}
                />
            </TouchableOpacity>
        </Image>
    )
};

const MeSelectItem = ({MeItemIcon,MeItemTitle,onPress})=>{
    return(
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={{
            flexDirection:'row',justifyContent:'space-between',
            alignItems:'center',height:60,borderBottomColor:'#eee',borderBottomWidth:1,
            marginLeft:10,marginRight:10
        }}>
            <View
                style={{flexDirection:'row'}}>
                <Image
                    source={MeItemIcon}
                    style={{width:20,height:20,marginRight:15}}
                />
                <Text style={{fontSize:14}}>{MeItemTitle}</Text>
            </View>
            <Image
                source={require('../img/ic_my_right.png')}
                style={{width:35,height:35}}
            />
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    title:{
      color:'#f5f5f5',
      fontSize:16
    },
    headerImg:{
        width:constant.window.width,
        height:200,
    },
    headerTitle:{
        flex:1,
        flexDirection:'column',
        justifyContent:'space-around',
        alignItems:'center',
    },
    headerSetOpt:{
        position:'absolute',
        top:10,
        right:0
    },
    headerSetting:{
        width:40,
        height:40,
    },
    headerText:{
        fontSize:12,
        color:'#f5f5f5',
        padding:4,
        borderWidth:1,
        borderColor:'#f5f5f5',
        textAlign:'center'
    }
});