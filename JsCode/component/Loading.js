import React,{Component}from 'react';
import {
    View,
    Text,
    ActivityIndicator,  //圆形的loading提示符号组件
    StyleSheet,
}from 'react-native';
import constant from '../common/Constants';
export default class LoadMore extends Component{
    static propTypes = {
        isShow: React.PropTypes.bool //设置prop.isShow的类型只能是布尔值
    };
    render(){
        if(!this.props.isShow)return null;
        return(
            <View style={styles.container}>
                <View style={styles.loading}>
                    <ActivityIndicator
                        color="#FFB3B3"
                    />
                    <Text style={styles.loadingTitle}>{this.props.loadText}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height:constant.window.height,
    },
    loading: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    loadingTitle: {
        textAlign:'center',
        fontSize:10,
        color:'#aaa',
        paddingLeft:8,
        paddingTop:5,
    }
});