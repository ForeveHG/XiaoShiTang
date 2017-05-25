/**
 * 遮罩层和下方弹出的选项，但选项没有使用，用的Picker插件
 */

import React,{Component}from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Animated,
    Easing,
    TouchableOpacity
}from 'react-native';
import constant from '../common/Constants';
import {observable,action}from 'mobx'
import {observer} from 'mobx-react/native';
import Picker from 'react-native-picker';
import Info from '../common/InfoSelect';
let appState = observable({
    offset: new Animated.Value(0),
    opacity: new Animated.Value(0),
    hide: true,
    data: [],
});

@observer
export default class DiaLog extends Component{
    //显示动画
    in(){

        Animated.parallel([
            Animated.timing(
                appState.opacity,
                {
                    easing: Easing.linear,
                    duration: 500,
                    toValue: 0.8
                }),
            Animated.timing(
                appState.offset,
                {
                    easing: Easing.linear,
                    duration: 500,
                    toValue:1,
                }
            )
        ]).start();
    }
    //隐藏动画
    @action
    out(){
        Animated.parallel([
            Animated.timing(
                appState.opacity,
                {
                    easing: Easing.linear,
                    duration: 500,
                    toValue:0,
                }
            ),
            Animated.timing(
                appState.offset,
                {
                    easing: Easing.linear,
                    duration: 500,
                    toValue:0,
                }
            )
        ]).start();

        setTimeout(
            () => appState.hide=true,
            500
        )
    }
    iknow(event){
        if(!appState.hide){
            this.out();
        }
    }

    //选择
    choose(msg){
        if(!appState.hide){
            this.out();
            //得到选择的值

        }
    }

    @action
    show(){
        //设置一些值
        appState.hide = false;
        if(!appState.hide){
            this.in();
        }
    }

    render(){
        if(appState.hide){
            return <View/>
        }
        return(
            <View style={styles.wrap}>
                <Animated.View style={styles.cover}>
                </Animated.View>

                {/*<Animated.View style={[styles.container,{*/}
                {/*transform:[{*/}
                {/*translateY: appState.offset.interpolate({*/}
                {/*inputRange:[0,1],*/}
                {/*outputRange:[constant.window.height,(constant.window.height-240)]*/}
                {/*}),*/}
                {/*}]*/}
                {/*}]}>*/}
                {/*// <View style={{justifyContent:'center',alignItems:'center',height:60,backgroundColor:'#fff'}}>*/}
                {/*//     <Text style={{textAlign:'center',fontSize:14,}}>请选择你的性别</Text>*/}
                {/*// </View>*/}
                {/*// <TouchableOpacity*/}
                {/*//     activeOpacity={0.7}*/}
                {/*//     onPress={()=>{}}*/}
                {/*//     style={styles.opt}*/}
                {/*// >*/}
                {/*//     <Text style={{textAlign:'center',fontSize:14,color:'#ff8978'}}>男</Text>*/}
                {/*// </TouchableOpacity>*/}
                {/*// <TouchableOpacity*/}
                {/*//     activeOpacity={0.7}*/}
                {/*//     onPress={()=>{}}*/}
                {/*//     style={styles.opt}*/}
                {/*// >*/}
                {/*//     <Text style={{textAlign:'center',fontSize:14,color:'#ff8978'}}>女</Text>*/}
                {/*// </TouchableOpacity>*/}
                {/*// <View style={{justifyContent:'center',alignItems:'center',height:60,backgroundColor:'#fff'}}>*/}
                {/*//*/}
                {/*// </View>*/}
                {/*//*/}
                {/*<TouchableOpacity*/}
                {/*activeOpacity={0.7}*/}
                {/*onPress={this.iknow.bind(this)}*/}
                {/*style={styles.console}*/}
                {/*>*/}
                {/*<Text style={{color:'#ff8978'}}>取消</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*// </Animated.View>*/}
            </View>

        )
    }
}
const styles = StyleSheet.create({
    wrap:{
        position:'absolute',
        width:constant.window.width,
        height:constant.window.height,
        left:0,
        top:0
    },
    container:{
        width:constant.window.width-40,
        height:220,
        borderBottomWidth:1,
        borderColor:'#eee',
        marginLeft:20,
        marginRight:20,
        position:'absolute',
        top:0,
        left:0,
    },
    cover:{
        backgroundColor:'#383838',
        opacity:0.8,
        position:'absolute',
        left:0,
        top:0,
        width:constant.window.width,
        height:constant.window.height
    },
    opt:{
        height:50,
        borderTopWidth:1,
        borderColor:"#eee",
        backgroundColor:'#fff',
        alignItems:'center',justifyContent:'center'
    },
    console:{
        height:50,
        marginTop:10,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center'
    }
});