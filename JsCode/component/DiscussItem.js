import React,{Component} from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity
}from 'react-native';
import constant from '../common/Constants';
export default class DiscussItem extends Component{
    render(){
        return (
            <View style={{margin:10,borderBottomColor:'#eee',borderBottomWidth:1,paddingBottom:5}}>
                <View style={{
                    flexDirection:'row',
                    width:constant.window.width-20,
                    justifyContent:'space-between',
                    marginBottom:5
                }}>
                    <View style={{flexDirection:'row',}}>
                        <Image
                            source={{uri:this.props.item.favicon}}
                            style={{width:30,height:30,}}
                        />
                        <View style={{marginLeft:12,justifyContent:'center'}}>
                            <Text style={{fontSize:12}}>{this.props.item.nick_name}</Text>
                            <Text style={{color:'#aaa',fontSize:10,marginTop:5}}>{this.props.index}楼 {this.props.item.discuss_time}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                        >
                            <Image
                                source={require('../img/discuss.png')}
                                style={{width:20,height:20,marginRight:10}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}

                        >
                            <Image
                                source={require('../img/zan_discuss.png')}
                                style={{width:20,height:20,}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text>{this.props.item.discuss_content}</Text>
            </View>
        )
    }
}