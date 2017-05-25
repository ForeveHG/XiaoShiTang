import React,{Component}from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
}from 'react-native';
let renderView = [];
export default class DetailFooter extends Component{
    _onSharePress(){
        //分享功能：qq,微信,
    }
    _onCollectPress(){
        //收藏功能
    }
    render(){
        return(
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.opt}
                    onPress={this._onSharePress.bind(this)}
                    activeOpacity={0.8}
                    key={this.props.uri}
                >
                    <Text style={styles.title}>分享</Text>
                    <Image
                        style={styles.img}
                        source={this.props.shareIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.opt}
                    onPress={this._onCollectPress.bind(this)}
                    activeOpacity={0.8}
                    key={this.props.uri}
                >
                    <Text style={styles.title}>收藏</Text>
                    <Image
                        style={styles.img}
                        source={this.props.collectIcon}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        height:30,
        justifyContent:'center',
        alignItems:'center',
        borderTopWidth:1,
        borderTopColor:'#ccc',
    },
    img:{
        width:15,
        height:15,
    },
    title:{
        fontSize:12,
        textAlign:'left',
        marginRight:5,
    },
    opt:{
      flex:1,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
    }
});