import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Navigator
}from 'react-native';
import Header from '../component/DetailHeader';
import MainBar from '../page/MainBar';
import constant from '../common/Constants';

export default class SetPage extends Component{
    quitLoad(){
        this.props.userStore.removeStorageUser();
        let navigator = this.props.navigator;
        if(navigator){
            navigator.replace({
                component:MainBar,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                params:{
                    name:'MainBar',
                }
            })
        }
    }
    render(){
        let Component = null;
        if(this.props.userStore.user){
            Component = LogQuit;
        }else{
            Component = ()=>{
                return <View/>
            }
        }
        return(
            <View style={{backgroundColor:constant.color.bk,height:constant.window.height}}>
                <Header title="设置" onPress={this.props.onPressReturn}/>
                <Item title="评个分吧"/>
                <Item title="提个建议"/>
                <Item title="分享给朋友"/>
                <View
                    style={{
                        justifyContent:'center',
                        alignItems:'center',
                    }}
                >
                    <Component quitLoad={this.quitLoad.bind(this)}/>
                    <Text style={{color:'#aaa',fontSize:10,marginTop:10}}>- 版本号:1.0 -</Text>
                </View>
                <View style={{height:125,backgroundColor:constant.color.bk,position:'absolute',bottom:25,left:0}}>
                    <Image
                        source={require('../img/img_login_bottom.png')}
                        style={{width:350,height:125}}
                    />
                </View>
            </View>
        )
    }
}

const Item = ({title})=>{
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={()=>{}}
            style={{
                height:40,
                borderBottomColor:'#eee',
                borderBottomWidth:1,
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                marginLeft:10,
                marginRight:10,

            }}
        >
            <Text style={{textAlign:'center',fontSize:12,}}>{title}</Text>
            <Image
                source={require('../img/ic_my_right.png')}
                style={{width:15,height:15,marginLeft:5,marginRight:10}}
            />
        </TouchableOpacity>
    )
};

const LogQuit = ({quitLoad})=>{
    return (
        <TouchableOpacity
        activeOpacity={0.7}
        onPress={quitLoad}
        style={{
             height:30,
             marginTop:20,
             borderRadius:5,
             backgroundColor:constant.color.theme,
             justifyContent:'center',
             alignItems:'center',
             width:constant.window.width - 20,
         }}
        >
            <Text style={{color:'#f5f5f5'}}>退出登录</Text>
        </TouchableOpacity>
    )
};