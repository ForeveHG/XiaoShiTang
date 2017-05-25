import React,{Component}from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
}from 'react-native';
import Header from '../component/DetailHeader';
import {NutrientItem} from './FoodInfo';
import constant from '../common/Constants';
export default class FoodInfoAll extends Component{
    render(){
        return(
            <View>
                <Header title='营养信息' onPress={this.props.onReturnPress}/>
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
                    <ScrollView style={{backgroundColor:'#fff',}}>
                        {this.props.types.map((type,index)=>{
                            return <NutrientItem type={type} key={index} food={this.props.food} foodData={this.props.foodData}/>
                        })}
                        <View style={{height:140}}/>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

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
});