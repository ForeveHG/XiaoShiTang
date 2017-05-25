/**
 * 屏幕下方切换tab
 */
import React,{Component}from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
}from 'react-native';
import constant from '../common/Constants';
export default class SubTabBar extends Component{
    static propTypes = {
        tabs: React.PropTypes.array, //所有tab的集合
        goToPage: React.PropTypes.func, //跳转到对应tab的方法
        activeTab: React.PropTypes.number, //当前选中的tab下标

        tabNames: React.PropTypes.array, //tab名称
        icons: React.PropTypes.array, //图标
        iconsActive: React.PropTypes.array, //点击时的图标
    };
    renderTabOption(tab,i){
        let icon = this.props.activeTab == i ? this.props.iconsActive[i] : this.props.icons[i];

        return(
            <TouchableOpacity
                onPress={()=>{this.props.goToPage(i)}}
                activeOpacity={0.95}
                key={i}
            >
                <View style={styles.tab}>
                    <Image source={icon} style={styles.tabIcon}/>
                    <Text style={styles.tabText}>
                        {this.props.tabNames[i]}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
    render(){
        return (
            <View style={{flexDirection:'row',borderTopWidth:1,borderTopColor:'#ccc'}}>
                {this.props.tabs.map((tab,i)=>this.renderTabOption(tab,i))}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    tab:{
        width:constant.window.width/3,
        height:50,
        backgroundColor:"#fff",
        justifyContent:'center',
        alignItems:'center',
    },
    tabIcon:{
      width:20,
      height:20,
    },
    tabText:{
        fontSize:12,
    }
});