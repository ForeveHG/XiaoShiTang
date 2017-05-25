import React,{Component}from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
}from 'react-native';
import Header from '../component/DetailHeader';
import FoodInfoAll from './FoodInfoAll';
import {observable,action}from 'mobx'
import {observer} from 'mobx-react/native';
import constant from '../common/Constants';
import FoodCompare from './FoodCompare';

let appState = observable({
    bottomColor1: constant.color.theme,
    bottomColor2: '#fff',
    caloryUnit: '千卡',
});

@observer
export default class FoodInfo extends Component{
    food = this.props.food;

    state = {
      foodData: [],
    };

    componentWillMount(){
        this._fetchFoodData();
    }

    _fetchFoodData = async()=>{
        const URL = 'http://food.boohee.com/fb/v1/foods/'+this.food.code;
        try{
            const result = await fetch(URL).then((response)=>{
                return response.json();
            });
            this.setState({
                foodData: result,
            });
            appState.caloryUnit = this.state.foodData.calory+'千卡'
        }catch(error){
            console.log(error);
        }
    };

    _onPressMore(){
        let navigator = this.props.navigator;
        if(navigator){
            navigator.push({
                component: FoodInfoAll,
                params:{
                    onReturnPress: this.props.onReturnPress,
                    food: this.food,
                    foodData: this.state.foodData,
                    types:this.props.type.types
                }
            })
        }
    }

    onComparePress(){
        let navigator = this.props.navigator;
        if(navigator){
            navigator.push({
                component: FoodCompare,
                params:{
                    onReturnPress: this.props.onReturnPress,
                    food: this.food,
                    flag: 'left',
                }
            })
        }
    }

    render(){
        return(
            <View>
                <Header title={this.state.foodData.name} onPress={this.props.onReturnPress}/>
                <CollectIcon/>
                <FoodInfoHeader food={this.state.foodData} onComparePress={this.onComparePress.bind(this)} />
                <ScrollView
                    style={{backgroundColor:constant.color.bk,height:constant.window.height,}}
                >
                    <NutrientList types={this.props.type.types}  food={this.food} foodData={this.state.foodData} onPressMore={this._onPressMore.bind(this)}/>
                    <FoodGiGl food={this.state.foodData}/>
                    <FoodLightTab food={this.state.foodData}/>
                    <FoodCalory food={this.state.foodData}/>
                    <View style={{height:240}} />
                </ScrollView>
            </View>
        )
    }
}

const CollectIcon = ()=>{
  return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>{}}
        style={{
            height:30,
            justifyContent:'center',
            position:'absolute',
            right:20
        }}
      >
          <Image
              source={require('../img/collect_food.png')}
              style={{
                  width:15,height:15,
              }}
          />
      </TouchableOpacity>
  )
};

const FoodInfoHeader = observer(({food,onComparePress})=>{
    return(
        <View
            style={{
                backgroundColor:'#fff',
                paddingBottom:20,
                marginBottom:10,
            }}
        >
            <View
                style={{
                height:60,
                margin:20,
                backgroundColor:'#fafafa',
                flexDirection:'row',
                alignItems:'center',
            }}
            >
                <Image
                    source={{uri:food.thumb_image_url}}
                    style={{
                    width:40,
                    height:40,
                    borderRadius:20,
                    marginLeft:20,
                    marginRight:10,
                }}
                />
                <View>
                    <Text style={{fontSize:12,marginBottom:5}}>{food.name}</Text>
                    <View
                        style={{
                            flexDirection:'row',
                            alignItems:'center',
                        }}
                    >
                        <Text style={{fontSize:14,}}>{appState.caloryUnit}</Text>
                        <Text style={{fontSize:10,marginTop:3}}>/每100克</Text>
                    </View>
                </View>
                <View
                    style={{
                    position:'absolute',
                    right:20,
                    bottom:0,
                    flexDirection:'row',
                }}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={()=>{
                            appState.bottomColor1 = constant.color.theme;
                            appState.bottomColor2 = '#fff';
                            appState.caloryUnit = food.calory+'千卡';
                            //appState.calory = food.calory;
                        }}
                        style={{
                            height:25,
                            width:25,
                            borderBottomColor:appState.bottomColor1,
                            borderBottomWidth:1,
                        }}
                    >
                        <Text style={{fontSize:10}}>千卡</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={()=>{
                            appState.bottomColor1 = '#fff';
                            appState.bottomColor2 = constant.color.theme;
                            appState.caloryUnit = Math.round(food.calory * 4.2)+'千焦';
                        }}
                        style={{
                            height:25,
                            width:25,
                            borderBottomColor:appState.bottomColor2,
                            borderBottomWidth:1,
                        }}
                    >
                        <Text style={{fontSize:10}}>千焦</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    justifyContent:'center',
                    alignItems:'center',
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onComparePress}
                    style={{
                    backgroundColor:constant.color.theme,
                    width:200,
                    height:30,
                    borderRadius:5,
                    justifyContent:'center',
                    alignItems:'center',
                }}
                >
                    <Text style={{color:'#fff',fontSize:14,}}>+ 加入对比</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
});

const NutrientList = ({food,foodData,types,onPressMore})=>{
    return(
        <View>
            <View
                style={{
                    flexDirection:'row',
                    borderBottomColor:'#eee',
                    borderBottomWidth:1,
                    backgroundColor:'#fff',
                }}
            >
                <View style={styles.itemTitle}>
                    <Text style={styles.headFont}>营养元素</Text>
                </View>
                <View style={styles.itemTitle}>
                    <Text style={styles.headFont}>每100克</Text>
                </View>
                <View style={styles.itemTitle}>
                    <Text style={styles.headFont}>备注</Text>
                </View>
            </View>
            <View style={{backgroundColor:'#fff',}}>
                {types.map((type,index)=>{
                    console.log('type:'+type);
                    if(index > 5){
                        return;
                    }
                    return <NutrientItem type={type} key={index} food={food} foodData={foodData}/>
                })}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress = {onPressMore}
                    style={{
                        justifyContent:'center',
                        alignItems:'center',
                        height:30,
                        borderTopColor:'#eee',
                        borderTopWidth:1,
                    }}
                >
                    <Text style={styles.headFont}>更多营养元素</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

export let NutrientItem = ({type,food,foodData})=>{
    let unit = '';
    if(constant.nutrientsList[type.code]!=undefined){
        unit = constant.nutrientsList[type.code].unit;
    }
    let bz = '';
    if(foodData.lights != undefined){
        bz = foodData.lights[type.code];
    }

    let value = food[type.code];
    if(value != '' && value != null){
        value = value+unit;
    }else{
        value = '--'
    }
    return(
        <View
            style={{
                height:40,
                flexDirection:'row',
                borderBottomWidth:1,
                borderBottomColor:'#f9f9f9',
                justifyContent:'center',
                alignItems:'center',
                flex:1,
            }}
        >
            <View style={styles.itemTitle}>
                <Text style={styles.itemFont}>{type.name}</Text>
            </View>
            <View style={styles.itemTitle}>
                <Text style={styles.itemFont}>{value}</Text>
            </View>
            <View style={styles.itemTitle}>
                <Text style={[styles.itemFont,{color:constant.color.theme}]}>{bz}</Text>
            </View>
        </View>
    )
};

let FoodLightTab = ({food})=>{
    let food_light = food.health_light;
    let food_light_img = '';
    switch (food_light){
        case 1:
            food_light_img = require('../img/foodtype/ic_green_light_big.png');
            break;
        case 2:
            food_light_img = require('../img/foodtype/ic_yellow_light_big.png');
            break;
        case 3:
            food_light_img = require('../img/foodtype/ic_red_light_big.png');
    }
    return(
        <View
            style={{
                backgroundColor:'#fff',
                marginTop:10,
                padding:20,
                paddingTop:10,
            }}
        >
            <View>
                <Text style={[styles.headFont,]}>食物红绿灯:</Text>
            </View>
            <View
                style={{
                    flexDirection:'row',
                    alignItems:'center',
                    marginTop:10,
                }}
            >
                <Image
                    source={food_light_img ? food_light_img : {}}
                    style={{
                         width:50,
                         height:20,
                    }}
                />
                <View
                    style= {{
                        marginLeft:20,
                        marginRight:50,
                    }}
                >
                    <Text style={[styles.itemFont,{lineHeight:20,}]}>{food.appraise}</Text>
                </View>
            </View>
        </View>
    )
};

let FoodGiGl = ({food})=>{
    let giText = '';
    let glText = '';
    if(food.lights != undefined) {
        giText = food.lights.gi;
        glText = food.lights.gl;
    }
    if(giText == '' && giText == ''){
        return <View />
    }
    return(
        <View
            style={{
                marginTop:10,
                backgroundColor:'#fff',
            }}

        >
            <View style={styles.gigl}>
                <View style={styles.itemTitle}>
                    <Text style={styles.giglText}>GI值</Text>
                </View>
                <View style={styles.itemTitle}>
                    <Text style={styles.giglText}>{food.gi}</Text>
                </View>
                <View style={styles.itemTitle}>
                    <Text style={styles.giglText}>{giText}</Text>
                </View>
            </View>

            <View style={styles.gigl}>
                <View style={styles.itemTitle}>
                    <Text style={styles.giglText}>GL值</Text>
                </View>
                <View style={styles.itemTitle}>
                    <Text style={styles.giglText}>{food.gl}</Text>
                </View>
                <View style={styles.itemTitle}>
                    <Text style={styles.giglText}>{glText}</Text>
                </View>
            </View>
        </View>
    )
};

let FoodCalory = ({food})=>{
    if(food.units == undefined || food.units == null || food.units == ''){
        return <View/>
    }
    return (
        <View style={{backgroundColor:'#fff',marginTop:10,marginBottom:10}}>
            <View style={{padding:20}}>
                <Text style={styles.headFont}>所含热量:</Text>
            </View>
            <View>
                {food.units.map((item,index)=>{
                    return <CaloryItem item={item} key={index}/>
                })}
            </View>
        </View>
    )
};

let CaloryItem = ({item})=>{
    let amount = 0;
    if(item.amount){
        amount = Number.parseInt(item.amount)
    }
    return(
        <View style={{flexDirection:'row'}}>
            <View style={styles.itemTitle}>
                <Text style={styles.itemFont}>{amount+item.unit}</Text>
            </View>
            <View style={styles.itemTitle}>
                <Text style={styles.itemFont}>{item.eat_weight+'克'}</Text>
            </View>
            <View style={styles.itemTitle}>
                <Text style={styles.itemFont}>{item.calory+'千卡'}</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    itemTitle:{
        width:constant.window.width/3,
        height:30,
        justifyContent:'center',
        alignItems:'center',
    },
    headFont:{
        fontSize:12,
    },
    itemFont:{
        fontSize:10,
    },
    gigl:{
        height:30,
        borderBottomWidth:1,
        borderBottomColor:'#eee',
        flexDirection:'row',
    },
    giglText:{
        fontSize:12,
        color:constant.color.theme,
    }
});