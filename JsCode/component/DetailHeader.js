import React,{Component}from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
}from 'react-native';
export default class DetailHeader extends Component{
    render(){
        return(
            <View style={styles.container}>
                <TouchableOpacity
                    style={{padding:8}}
                    onPress={this.props.onPress}
                >
                    <Image
                        source={require('../img/arrow-left.png')}
                        style={styles.img}
                    />
                </TouchableOpacity>
                <View style={{flex:1}}>
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
      flexDirection:'row',
      height:30,
      backgroundColor:'#fff',
      borderBottomWidth:1,
      borderBottomColor:'#eee',
      alignItems:'center',
    },
    img:{
        width:15,
        height:15,
    },
    title:{
        padding:8,
        fontSize:14,
        textAlign:'left',
    }
});