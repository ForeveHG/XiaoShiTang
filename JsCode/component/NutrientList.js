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

let createHeight = 270;
let appState = observable({
    opacity: new Animated.Value(0),
    top: new Animated.Value(-createHeight),
    hide: true,
    data: [],
    index: 1,
});



@observer
export default class NutrientList extends Component{

    componentWillMount(){
        appState.data = this.props.data.types;
        createHeight = this.props.createHeight;
        console.log(createHeight);
    }

    //显示动画
    in(h){

        Animated.parallel([
            Animated.timing(
                appState.top,
                {
                    toValue: h,
                    duration:1000
                }
            ),
            Animated.timing(
                appState.opacity,
                {
                    toValue:0.4,
                    duration:1000
                }
            )
        ]).start();
    }

    //隐藏动画
    @action
    out(){
        Animated.parallel([
            Animated.timing(
                appState.top,
                {
                    toValue: -createHeight,
                    duration:1000,
                }
            ),
            Animated.timing(
                appState.opacity,
                {
                    toValue:0,
                    duration:1000,
                }
            )
        ]).start();
    }

    //选择
    choose(msg){
        this.close();
    }

    onPressReturn(){
        if(!appState.hide){
            this.close();
        }
    }

    //关闭
    close(){
        appState.hide = !appState.hide;
        if(appState.hide){
            this.out();
        }
    }

    @action
    show(h){
        appState.hide = !appState.hide;
        //设置一些值
        if(h == undefined){
            h = 0;
        }
        if(appState.hide){
            this.out();
        }else if(!appState.hide){
            this.in(h);
        }
    }

    render(){
        if(appState.hide){
            return <View/>
        }
        return(
            <View style={styles.wrap}>

                <Animated.View style={[styles.cover,{opacity:appState.opacity,}]} >
                </Animated.View>

                <Animated.View style={{position:'absolute',top:appState.top,left:0,}}>
                    <View
                        style={{
                            height:createHeight,
                            width:constant.window.width,
                            position:'absolute',
                            top:60,
                            left:0,
                            backgroundColor:'#fff',
                            flexDirection:'row',
                            flexWrap:'wrap',
                        }}
                    >
                            {appState.data.map((item,index)=>{
                                return <NutrientItem key={index} item={item} choose={this.choose.bind(this)} changeOrderBy={this.props.changeOrderBy} />
                            })}
                    </View>
                </Animated.View>
            </View>
        )
    }
}

const NutrientItem = ({item,choose,changeOrderBy})=>{
    return(
        <TouchableOpacity
            onPress={()=>{
                changeOrderBy(item.index,item.name,item.code);
                choose();
            }}
            style={{
                width:constant.window.width/3,
                height:30,
                borderBottomWidth:1,
                borderBottomColor:'#eee',
                justifyContent:'center',
                alignItems:'center',
            }}
        >
            <Text style={{fontSize:10,color:'#555'}}>{item.name}</Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrap:{
        position:'absolute',
        width:constant.window.width,
        height:constant.window.height,
        left:0,
        top:0,
        zIndex: 2,
    },
    container:{
        width:constant.window.width-40,
        height:createHeight,
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
        opacity:0.3,
        position:'absolute',
        left:0,
        top:62,
        width:constant.window.width,
        height:constant.window.height,
    },
});