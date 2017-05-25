import React,{Component} from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
}from 'react-native';
export default class AutoExpandingTextInput extends Component{
    constructor(props){
        super(props);
        this.state = {
            text: '',
            height: 0,
            num:0,
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(event){
        console.log(event.nativeEvent);
        this.setState({
            text: event.nativeEvent.text,
            height: event.nativeEvent.contentSize.height,
            num: event.nativeEvent.text.length,
        });
        console.log('num:'+this.state.num);
    }


    render(){
        return(
            <View>
                <TextInput
                    {...this.props}
                    placeholder= {this.props.placeHolder}
                    placeholderTextColor='#ccc'
                    underlineColorAndroid="transparent"
                    multiline = {true}
                    onChange = {this.onChange}
                    onChangeText = {(text)=>{
                        this.props.onChangeText(text);
                    }}
                    maxLength={this.props.maxLength}
                    style={[styles.textInputStyle,{textAlignVertical: 'top',lineHeight:25, height:Math.max(this.props.minHeight,this.state.height)}]}
                    value={this.state.text}
                />
                {/*<View>*/}
                    {/*<Text>{this.state.num}</Text>*/}
                {/*</View>*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textInputStyle: {
        height:30,
        fontSize:14,
        padding:10,
        backgroundColor:'#fff',
    }
});