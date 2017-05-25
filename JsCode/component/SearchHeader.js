import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
}from 'react-native';

export default class SearchHeader extends Component{

    state = {
        keyword: this.props.keyword,
    };

    render(){
        return(
            <View
                style={{
                    flexDirection:'row',
                    backgroundColor:'#fff',
                    borderBottomColor:'#eee',
                    borderBottomWidth:1,
                    height:50,
                    alignItems:'center',
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress = {this.props.onReturnPress}
                    style={{padding:8,}}
                >
                    <Image
                        source={require('../img/arrow-left.png')}
                        style={{
                            width:15,
                            height:15,
                        }}
                    />
                </TouchableOpacity>

                <TextInput
                    underlineColorAndroid='transparent'
                    placeholder='请输入食物名称'
                    placeholderTextColor='#bbb'
                    value={this.state.keyword}
                    onChangeText={(text)=>{
                        if(text==null || text == ''){
                           this.props.returnSearch();
                        }
                        this.setState({
                            keyword: text,
                        });

                    }}
                    style={{
                        height:31,
                        width:250,
                        fontSize:12,
                    }}
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={()=>{
                        this.props.getKeywords(this.state.keyword);
                        this.props.searchPress();
                    }}
                    style={{width:50,height:50,position:'absolute',top:0,right:0,alignItems:'center',justifyContent:'center',borderLeftColor:'#eee',borderLeftWidth:1}}
                >
                    <Image
                        source={require('../img/ic_input_search.png')}
                        style={{
                            width:25,
                            height:25,
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}