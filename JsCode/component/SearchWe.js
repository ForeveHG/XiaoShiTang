import React,{Component}from 'react';
import {
    View,
    Text,
    TouchableOpacity,
}from  'react-native';
import constant from '../common/Constants';
export default class SearchWe extends Component{

    constructor(props){
        super(props);
        this._fetchSearchWe();
    }

    state = {
        data : [],
    };

    _fetchSearchWe = async()=>{
        const URL = 'http://food.boohee.com/fb/v1/keywords';
        try{
            const result = await fetch(URL).then((response)=>{
                return response.json();
            });
            this.setState({
                data:result.keywords,
            })

        }catch(error){
            console.log('请求出错：'+error);
        }
    };

    render(){
        if(this.state.data == null || this.state.data == ''){
            return <View/>
        }
        return(
            <View>
                <View style={{height:40,justifyContent:'center',}}>
                    <Text style={{fontSize:12,marginLeft:20,color:'#aaa'}}>大家都在搜</Text>
                </View>
                <View
                    style={{
                        flexDirection :'row',
                        flexWrap:'wrap',
                        backgroundColor:'#fff',
                    }}
                >
                    {this.state.data.map((item,index)=>{
                        return(
                            <TouchableOpacity
                                onPress={()=>{
                                    this.props.searchWe(item);
                                }}
                                activeOpacity={0.8}
                                key={index}
                                style={{
                                    height:40,
                                    width:constant.window.width/2,
                                    borderTopWidth:1,
                                    borderTopColor:'#eee',
                                    justifyContent:'center',
                                }}
                    >
                                <Text style={{color:'#888',fontSize:12,marginLeft:20}}>{item}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        )
    }
}