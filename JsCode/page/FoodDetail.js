/**
 * 美食详情页
 */
import React,{Component} from 'react';
import{
    View,
    Text,
    Image,
    WebView,
    StyleSheet
}from 'react-native';
import HtmlView from 'react-native-htmlview';
//import Cheerio from 'cheerio';
import DetailHeader from '../component/DetailHeader';
import DetailFooter from '../component/DetailFooter';
import common from '../common/Constants';

export default class FoodDetail extends Component{

    _onPressReturn(){
       let navigator = this.props.navigator;
       if(navigator){
           navigator.pop();
       }
    };
    render(){
        const {food} = this.props;  //使用解构的方式获得数据
        const uri =food.url;
        return(
            <View style={{flex:1}}>
                <DetailHeader  title='详细信息' onPress={this._onPressReturn.bind(this)}/>
                <View style={{flex:1,overflow:'hidden',height:common.window.height-30,backgroundColor:'green'}}>
                    <View style={{marginTop:-100,backgroundColor:'#f5f5f5',flex:1}}>
                        <WebView
                            source={{uri}}
                            startInLoadingState={true}
                            scalesPageToFit={true}
                            style={[styles.webview_style,{height: common.window.height - 44 - 50}]}
                           automaticallyAdjustContentInsets={false}
                        />
                    </View>
                </View>
                <DetailFooter key={uri} shareIcon={require('../img/share.png')} collectIcon={require('../img/collect_01.png')} />
            </View>
        )
    }
}
var styles = StyleSheet.create({
    webview_style:{
        backgroundColor:'#f5f5f5',

        flex:1,
        overflow:'hidden'
    }
});