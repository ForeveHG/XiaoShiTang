import React,{Component}from 'react';
import {
    View,
    Text,
    ActivityIndicator,  //圆形的loading提示符号组件
    StyleSheet,
}from 'react-native';
export default class LoadMore extends Component{
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.loading}>
                    <ActivityIndicator
                        size="small"
                        color="#FFB3B3"
                    />
                    <Text style={styles.loadingTitle}>加载更多...</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    loading: {
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    loadingTitle: {
        textAlign:'center',
        fontSize:10,
        color:'#aaa',
        paddingLeft:2,
    }
});