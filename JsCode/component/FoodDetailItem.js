/**
 * 单项食物组件
 */
import React,{Component}from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
}from 'react-native'
import constant from '../common/Constants';

export default class FoodDetailItem extends Component{

    compareFoodStore = this.props.compareFoodStore;

    state = {
        addFoodFlag:false,
    };

    componentWillMount(){
        this.setState({
            addFoodFlag: this.props.addFoodFlag,
        })
    }

    addPress(item){
        if(item.code != undefined){
            return new Promise((resolve,reject)=>{
                this.compareFoodStore.getCompareList(item.code,this.props.flag);
                resolve();
            });
        }
    }

    render() {
        let item = this.props.item;
        let onItemPress = this.props.onItemPress;
        let sortCode = this.props.sortCode;
        let data = item[sortCode];
        if(data == null || data == ''){
            data = 0;
        }
        let title = item.name;
        if(title.length>20){
            title = title.slice(0,20)+'...';
        }
        let unit = constant.nutrientsList[sortCode].unit;
        return(
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onItemPress}
                style={{
                flexDirection:'row',
                height:60,
                alignItems:'center',
                borderBottomWidth:1,
                borderBottomColor:'#eee',
                backgroundColor:'#f5f5f5'
            }}
            >
                <View
                    style={{
                    width:60,
                    height:60,
                    justifyContent:'center',
                    alignItems:'center',
                }}
                >
                    <Image
                        source={{uri:item.thumb_image_url}}
                        style={{width:40,height:40,borderRadius:20,marginRight:10,marginLeft:10}}
                    />
                </View>

                <View
                    style={{
                    height:40
                }}
                >
                    <Text style={{fontSize:12,marginBottom:5}}>{title}</Text>
                    <View
                        style={{
                        flexDirection:'row'
                    }}
                    >
                        <Text style={{fontSize:10,marginRight:10,color:'#ff5668'}}>{data}</Text>
                        <Text style={{fontSize:10,}}>{unit}/100克</Text>
                    </View>
                </View>
                {this.state.addFoodFlag ? <FoodCompareBar item={item} addPress={this.addPress.bind(this)} onReturnPress={this.props.onReturnPress}/>  : <FoodLightImg item={item}/>}
            </TouchableOpacity>
        )
    }
}

const FoodLightImg = ({item})=>{
    let food_light = item.health_light;
    let food_light_img = '';
    switch (food_light){
        case 1:
            food_light_img = require('../img/foodtype/ic_food_light_green.png');
            break;
        case 2:
            food_light_img = require('../img/foodtype/ic_food_light_yellow.png');
            break;
        case 3:
            food_light_img = require('../img/foodtype/ic_food_light_red.png');
    }
    return (
        <Image
        source={ food_light_img ? food_light_img : require('../img/foodtype/ic_food_light_green.png') }
        style={{
                        width:15,
                        height:15,
                        position:'absolute',
                        right:30,
                    }}
        />
    )
};

const FoodCompareBar = ({item,addPress,onReturnPress})=>{
    return(
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={()=>{
                    addPress(item).then(()=>{
                        onReturnPress();
                    })
                }}
                style={{
                    width:80,
                    height:25,
                    borderColor:constant.color.theme,
                    borderWidth:1,
                    borderRadius:3,
                    justifyContent:'center',
                    alignItems:'center',
                    position:'absolute',
                    right:30,
                }}
            >
                <Text style={{fontSize:12,color:constant.color.theme}}>+加入对比</Text>
            </TouchableOpacity>
    )
};