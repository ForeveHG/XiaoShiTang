/**
 * FoodList中的一个item
 **/
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import constant from '../common/Constants';


export default class FoodSingleItem extends Component {
    render(){
        return(
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={this.props.onPress}
                    activeOpacity={0.75}
                    style={styles.touchable}
                >
                    <View style={styles.item}>
                        <View style={styles.text}>
                            <Text style={styles.font} numberOfLines={2}>{this.props.food.title}</Text>
                            <View style={styles.subText}>
                                <Text style={{fontSize:10,color:'#aaa',}}>{this.props.food.date_created.substr(0,10)}</Text>
                                <View style={styles.watch}>
                                    <Image
                                        source={require('../img/ic_feed_watch.png')}
                                        style={styles.img}
                                    />
                                    <Text style={{fontSize:8,color:'#aaa',height:12}}>{this.props.food.viewers_count}</Text>
                                </View>
                            </View>
                        </View>
                        <Image
                            defaultSource={require('../img/img_news_default.png')}
                            source={this.props.food.image_thumbnail ? {uri:this.props.food.image_thumbnail} : require('../img/img_news_default.png') }
                            style={{width:(constant.window.width-2*15)/3,height:50}}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        width:constant.window.width,
        marginTop:10,
        marginBottom:10,
    },
    touchable:{
        backgroundColor:'#fff',
        height:80,
    },
    font:{
        fontSize:12,
        width:constant.window.width*0.5
    },
    item:{
        flexDirection:'row',
        flex:1,
        margin:15,
        alignItems:'center'
    },
    text:{
        flex:1,
        justifyContent:'flex-end',
        height:50,
        alignItems:'flex-start',
    },
    subText:{
        flexDirection:'row',
        flex:1,
        alignItems:'flex-end',
        width:190,
        justifyContent:'space-between',
    },
    watch:{
        flexDirection:'row',
        alignItems:'flex-end',
        justifyContent:'flex-end'
    },
    img:{
        width:12,
        height:12,
        padding:2,
        marginRight:4
    }
});