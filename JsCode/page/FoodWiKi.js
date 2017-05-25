/**
 * 食物百科页面
 */
import React,{Component} from 'react';
import {
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    ListView,
    ScrollView,
    Navigator
}from 'react-native';
import {observable,action}from 'mobx'
import {observer} from 'mobx-react/native';
import constant from '../common/Constants';
import foodType from '../common/FoodType';
import SearchPage from './SearchPage';
import FoodTypeDetail from './FoodTypeDetail';
import Header from '../component/DetailHeader';

let contentWidth = constant.window.width - 30;

let appState = observable({
   typeItem : '',
});

export default class FoodWiKi extends Component{

    _onReturnPress(){
        let navigator = this.props.navigator;
        if(navigator){
            navigator.pop();
        }
    }

    _searchPress(){
        let navigator = this.props.navigator;
        if(navigator){
            navigator.push({
                name:'searchPress',
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                component:SearchPage,
                params:{
                    onReturnPress: this._onReturnPress.bind(this),
                }
            })
        }
    }

    render(){
        return(
            <View style={{backgroundColor:constant.color.bk,height:constant.window.height}}>
                <HomeHeader searchPress={this._searchPress.bind(this)}/>
                <View
                    style={{justifyContent:'center',alignItems:'center',marginTop:20,}}>
                    <FoodList title="食物分类"  navigator = {this.props.navigator} returnPress={this._onReturnPress.bind(this)}/>
                </View>
            </View>
        )
    }
}

const HomeHeader = ({searchPress})=>{
    return(
        <View>
            <Image
                source={require('../img/img_home_bg.png')}
                style={{width:constant.window.width,height:200,alignItems:'center'}}
            >
                <Image
                    source={require("../img/app_title.png")}
                    style={{
                            width:72,
                            height:27,
                            marginTop:30,
                        }}
                />
                <View style={{alignItems:'center',marginTop:50,}}>
                    <Text style={{color:'#f5f5f5',fontSize:12,marginBottom:10}}>查询食物信息</Text>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={searchPress}
                        style={{
                                width:300,
                                height:40,
                                justifyContent:'center',
                                backgroundColor:'#f5f5f5',
                                borderRadius:3,
                            }}
                    >
                        <Image
                            source={require('../img/ic_home_search.png')}
                            style={{
                                    width:20,
                                    height:20,
                                    position:'absolute',
                                    top:10,
                                    left:0,
                                }}
                        />
                        <Text style={{
                                color:constant.color.theme,
                                marginLeft:25,
                                fontSize:12
                            }}>请输入食物名称</Text>
                    </TouchableOpacity>
                </View>
            </Image>
        </View>
    )
};

const FoodList = ({title,navigator,returnPress})=>{
    return(
        <View
            style={{
                width:contentWidth,
                justifyContent:'center',
                alignItems:'center',
                marginTop:20,
            }}
        >
            <View
                style={{
                    backgroundColor:'#fff',
                    height:20,
                    width:contentWidth,
                    alignItems:'center',
                    justifyContent:'center'
                }}
            >
                <Text
                    style={{color:'#aaa',fontSize:10,textAlign:'center'}}
                >{title}</Text>
            </View>
            <Image
                source={require('../img/img_home_list_bg.png')}
                style={{width:contentWidth,height:12}}
            />
            <View
                style={{
                    width:contentWidth,
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor:'#fff',
                }}
            >
                <View
                    style={{
                    flexDirection:'row',
                    flexWrap:'wrap',
                    height:constant.window.height,
                    justifyContent:'center',
                    alignItems:'flex-start',
                }}
                >
                    {foodType.typeList.map((item,index)=>{
                        return <TypeItem key={index} typeItem={item} navigator={navigator} returnPress={returnPress}/>
                    })}
                </View>
            </View>

        </View>
    )
};

const TypeItem = ({typeItem,navigator,returnPress})=>{

    let _typeItemPress = ()=>{
        if(navigator){
            navigator.push({
                name:'typeItemPress',
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                component:FoodTypeDetail,
                params:{
                    typeItem: typeItem,
                    onReturnPress: returnPress,
                    header:Header,
                },
            })
        }
    };

    return (
        <View
            style={{
                width:contentWidth/3-10,
                height:85,
                justifyContent:'center',
                alignItems:'center',
            }}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={_typeItemPress}
                style={{
                    justifyContent:'center',
                    alignItems:'center',
                }}
            >
                <View
                    style={{
                        borderWidth:1,
                        borderColor:'#eee',
                        width:40,
                        height:40,
                        borderRadius:20,
                        alignItems:'center',
                        justifyContent:'center',
                    }}
                >
                    <Image
                        source={typeItem.img}
                        style={{
                            width:20,
                            height:20,
                        }}
                    />
                </View>
                <Text style={{marginTop:10,fontSize:12,color:'#555'}}>{typeItem.title}</Text>
            </TouchableOpacity>
        </View>

    )
};