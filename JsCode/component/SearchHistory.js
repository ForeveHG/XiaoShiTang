import React,{Component}from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
}from  'react-native';
export default class SearchHistory extends Component{


    render(){
        if(this.props.history.length == 0){
            return <View/>
        }
        return(
            <View>
                <View style={{height:40,justifyContent:'center',borderBottomColor:'#eee',borderBottomWidth:1}}>
                    <Text style={{fontSize:12,color:'#aaa',marginLeft:20,}}>搜索历史</Text>
                </View>
                <View style={{backgroundColor:'#fff',}}>
                    {this.props.history.map((item,index)=>{
                        return (
                            <View
                                key={index}
                                style={{flexDirection:'row',marginLeft:20}}
                            >
                                <View style={{width:40,height:40,justifyContent:'center',}}>
                                    <Image
                                        source={require('../img/ic_search_history.png')}
                                        style={{width:20,height:20}}
                                    />
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={()=>{
                                        this.props.searchHistory(item);
                                    }}
                                    style={{
                                        flex:1,
                                        borderBottomColor:'#eee',
                                        borderBottomWidth:1,
                                        height:40,
                                        justifyContent:'center'
                                    }}

                                >
                                    <Text style={{fontSize:12,color:'#888',}}>{item}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
                <TouchableOpacity
                    style={{
                        flexDirection:'row',
                        height:40,alignItems:'center',
                        justifyContent:'center',
                        borderBottomColor:'#eee',
                        borderBottomWidth:1,
                        backgroundColor:'#fff'
                    }}
                    onPress={this.props.removeHistory}
                >
                    <Image
                        source={require('../img/ic_trash.png')}
                        style={{
                            width:20,
                            height:20,
                        }}
                    />
                    <Text style={{fontSize:12,color:'#aaa'}}>清除历史</Text>
                </TouchableOpacity>
            </View>
        )
    }
}