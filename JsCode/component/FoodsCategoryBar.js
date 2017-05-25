/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * 动态场景中的种类选项
 */

import React,{Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
}from 'react-native';
import constant from '../common/Constants';

export default class FoodsCategoryBar extends Component{
    static propTypes = {
        goToPage: React.PropTypes.func, // 跳转到对应tab的方法
        activeTab: React.PropTypes.number, // 当前被选中的tab下标
        tabs: React.PropTypes.array, // 所有tabs集合

        tabNames: React.PropTypes.array, // 保存Tab名称
    };

    setAnimationValue({value}) {
        console.log(value);
    }

    componentDidMount() {
        // Animated.Value监听范围 [0, tab数量-1]
        this.props.scrollValue.addListener(this.setAnimationValue);
    }

    renderTabOption(tab, i) {
        let color = this.props.activeTab == i ? "#FFB3B3" : "#555";
        let tabActive = this.props.activeTab == i ? {
            borderBottomColor:'#FFB3B3',borderBottomWidth:2
        } : {
            borderBottomColor:'#eee',borderBottomWidth:1
        }; // 判断i是否是当前选中的tab，设置不同的颜色
        let borderBottomColor = this.props.activeTab == i ? '#FFB3B3' : '#ccc';
        return (
            <TouchableOpacity
                onPress={()=>this.props.goToPage(i)}
                activeOpacity={0.8}
                key={i}
            >
                <View style={[styles.tab,tabActive]}>
                    <Text style={{color:color,fontSize:12,fontFamily:'times'}}>{this.props.tabNames[i]}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
    },
    tab:{
        height:44,
        width:constant.window.width/3,
        alignItems:'center',
        justifyContent:'center',
        borderBottomWidth: 1
    },
});