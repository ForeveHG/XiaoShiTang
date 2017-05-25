import React,{Component}from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView
}from 'react-native';
import Heard from '../component/DetailHeader';
import SearchPage from '../page/SearchPage';
import FoodCompareStore from '../mobx/FoodCompareStore';
import {observer} from 'mobx-react/native';
import {reaction,observable,autorun} from 'mobx';
import constant from '../common/Constants';

let appState = observable({
    compareList: [],
    leftImg : false,
    rightImg : false
});

@observer
export default class FoodCompare extends Component{

    compareFoodStore = new FoodCompareStore();

    componentWillMount(){
        let code = this.props.food.code;
        let flag = this.props.flag;
        if(code && flag){
            this.compareFoodStore.getCompareList(code,flag);
        }
    }

    clearLeftFood() {
        this.compareFoodStore.clearLeft();
        appState.leftImg = false;
    }

    clearRightFood(){
        this.compareFoodStore.clearRight();
        appState.rightImg = false;
    }


    onPressAdd(flag){
        let navigator = this.props.navigator;
        if(navigator){
            navigator.push({
                name: 'SearchPage',
                component: SearchPage,
                params: {
                    addFoodFlag: true,
                    onReturnPress: this.props.onReturnPress,
                    compareFoodStore: this.compareFoodStore,
                    flag:flag,
                }
            })
        }
    }

    readyData(leftNutrition,rightNutrition) {
        let leftNutritionLength = leftNutrition ? leftNutrition.length : 0; //左边营养元素数量
        let rightNutritionLength = rightNutrition ? rightNutrition.length : 0; //右边营养元素数量
        let leftNutritionNames = []; //左边营养元素名列表
        let rightNutritionNames = []; //右边营养元素名列表
        if(leftNutritionLength!=0){
            appState.leftImg = true;
            leftNutrition.map((nutrition)=>{
                leftNutritionNames.push(nutrition.name);
            })
        }else{
            appState.leftImg = false;
        }
        if(rightNutritionLength!=0){
            appState.rightImg = true;
            rightNutrition.map((nutrition)=>{
                rightNutritionNames.push(nutrition.name);
            })
        }else{
            appState.rightImg = false;
        }
        let nutritionNameTemp = [];//得到左右两边全部营养元素名称列表
        let nutirtionNameList = []; //得到去重后营养元素名称列表
        //
        if(leftNutritionLength != 0 || rightNutritionLength != 0 ){
            //营养元素少的食物的营养元素在前
            if(leftNutritionLength < rightNutritionLength){
                nutritionNameTemp = leftNutritionNames.concat(rightNutritionNames);
            }else if(rightNutritionLength < leftNutritionLength){
                nutritionNameTemp = rightNutritionNames.concat(leftNutritionNames);
            }else{
                nutritionNameTemp = leftNutritionNames.concat(rightNutritionNames);
            }
        }

        //去重
        if(nutritionNameTemp){
            for(let i = 0;i<nutritionNameTemp.length;i++){
                let flag = true;
                let temp = nutritionNameTemp[i];
                for(let j = 0 ;j<nutirtionNameList.length;j++){
                    if(temp == nutirtionNameList[j]){
                        flag = false;
                        break;
                    }
                }
                if(flag){
                    nutirtionNameList.push(temp);
                }
            }
        }
        let data = [];
        nutirtionNameList.map((nutirtionName)=>{
            let lineData = {left:'',name:nutirtionName,right:''};
            if(leftNutrition){
                leftNutrition.map((item,index)=>{
                    //对单位进行处理
                    if(item.name == nutirtionName){
                        let unit = item.unit;
                        if(unit == 'kcal'){
                            unit = '千卡';
                        }else if(unit == undefined){
                            unit = '';
                        }
                        lineData.left = item.value + unit;
                    }
                });
            }
            if(rightNutrition){
                rightNutrition.map((item,index)=>{
                    if(item.name == nutirtionName){
                        //对单位进行处理
                        if(item.name == nutirtionName) {
                            let unit = item.unit;
                            if (unit == 'kcal') {
                                unit = '千卡';
                            } else if (unit == undefined) {
                                unit = '';
                            }
                        lineData.right = item.value + unit;
                        }
                    }
                });
            }
            if(lineData.left == ''){
                lineData.left = '--';
            }
            if(lineData.right == ''){
                lineData.right = '--';
            }
            data.push(lineData);
        });
        appState.compareList = data;
    }


    render(){
        let {leftTitle,rightTitle,leftImg,rightImg,leftNutrition,rightNutrition} = this.compareFoodStore;
        this.readyData(leftNutrition,rightNutrition);
        return(
            <View>
                <Heard title="对比详情" onPress={this.props.onReturnPress} />
                <ImgCompare
                    onPressAdd={this.onPressAdd.bind(this)}
                    leftTitle={leftTitle}
                    leftImg={leftImg}
                    rightTitle={rightTitle}
                    rightImg={rightImg}
                    clearLeftFood={this.clearLeftFood.bind(this)}
                    clearRightFood={this.clearRightFood.bind(this)}
                />
                <ScrollView>
                     <ListCompare/>
                    <View style={{height:250}}/>
                </ScrollView>
            </View>
        )
    }
}

const ImgCompare = ({onPressAdd,leftTitle,leftImg,rightTitle,rightImg,clearLeftFood,clearRightFood})=>{
    let lImg = leftImg =='' || leftImg == null ?  '' : {uri:leftImg};
    let lTitle = leftTitle ? leftTitle : '';
    let rImg = rightImg == '' || rightImg == null ? '' :{uri:rightImg};
    let rTitle = rightTitle ? rightTitle:'';
    console.log('rImg:');
    console.log(rImg);
    return(
        <View>
            <View
                style={{
                    flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',
                    marginTop:30,
                    marginBottom:20,
                }}
            >
                <View>
                    <View>
                        {lImg ? <ShowImg img={lImg} /> : <AddImg onPressAdd={onPressAdd} flag='left' /> }
                        {appState.leftImg ? <CleanImg press={clearLeftFood}/> : <View/>}
                    </View>
                    <Text style={{textAlign:'center',fontSize:12,marginTop:10}}>{lTitle}</Text>
                </View>

                <View>
                    <Image
                        source={require('../img/ic_libary_vs.png')}
                        style={{
                            width:25,
                            height:25,
                            marginLeft:30,
                            marginRight:30,
                        }}
                    />
                </View>
                <View>
                    <View>
                        {rImg ? <ShowImg img={rImg} /> : <AddImg onPressAdd={onPressAdd} flag='right'/> }
                        {appState.rightImg ? <CleanImg press={clearRightFood}/> : <View/>}
                    </View>
                    <Text style={{textAlign:'center',fontSize:12,marginTop:10}}>{rTitle}</Text>
                </View>

            </View>
            <View
                style={{
                       height:30,
                       justifyContent:'center',
                       alignItems:'center',
                   }}
            >
                <Text style={{fontSize:12,color:'#888'}}>营养元素</Text>
            </View>
        </View>
    )
};

const ListCompare = ()=>{
    let width = constant.window.width-40;
    if(!appState.compareList){
        return <View/>
    }
    return(
        <View>
            {appState.compareList.map((item,index)=>{
                return(
                    <View
                        key={index}
                        style={{
                            flexDirection:'row',
                            height:40,
                            borderTopWidth:1,
                            borderTopColor:'#eee',
                            alignItems:'center',
                            width:width,
                            marginLeft:20,
                            marginRight:20,
                        }}
                    >
                        <View style={{width:width/3}}>
                            <Text style={{fontSize:12}}>{item.left}</Text>
                        </View>
                       <View style={{width:width/3}}>
                           <Text style={{fontSize:12,textAlign:'center'}}>{item.name}</Text>
                       </View>
                        <View style={{width:width/3}}>
                            <Text style={{fontSize:12,textAlign:'right'}}>{item.right}</Text>
                        </View>
                    </View>
                )
            })}

        </View>
    )
};

const CleanImg = ({press})=>{
    return(
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={press}
            style={{
                        position:'absolute',
                        left:45,
                        top:-25,
                    }}
        >
            <Image
                source={require('../img/ic_clear.png')}
                style={{
                                width:50,
                                height:50,
                            }}
            />
        </TouchableOpacity>
    )
};

const ShowImg = ({img})=>{
   return(
       <View
           style={{
                width:70,
                height:70,
                justifyContent:'center',
                alignItems:'center',
            }}
       >
           <Image
               source={img}
               style={styles.foodImg}
           />
       </View>
   )
};

const AddImg = ({flag,onPressAdd})=>{
    return(
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={()=>{
                    onPressAdd(flag)
               }}
                style={styles.imgOpt}
            >
                <Image
                    source={require('../img/ic_contrast_add.png')}
                    style={styles.img}
                />
            </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
   img:{
       width:48,
       height:48,
   },
   foodImg:{
       width:70,
       height:70,
   },
   imgOpt:{
       width:70,
       height:70,
       backgroundColor:'#fff',
       justifyContent:'center',
       alignItems:'center',
   }
});
