import React,{Component}from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
}from 'react-native';
import Header from '../component/DetailHeader';
import {observer} from 'mobx-react/native';
import contant from '../common/Constants';

@observer
export default class MyZan extends Component{

    userStore = this.props.userStore;
    zanStore = this.props.zanStore;

    constructor(props){
        super(props);
        console.log('zanStore:'+this.props.zanStore);
        this.zanStore.selectMyPostZan(this.userStore.user.login_name);
    }

    _deletePress(item){
        this.zanStore.removeZan(this.userStore.user.login_name,item.post_id);
    }

    render(){
        let {isMyZan,myZanPost} = this.zanStore;
        if(isMyZan){
            return (
                <View>
                    <Header title='我赞过的' onPress={this.props.onPressReturn} />
                    <View style={{
                        height:contant.window.height-40,
                        justifyContent:'center',
                        alignItems:'center',
                    }}>
                        <Text style={{
                            color:"#aaa",
                            fontSize:14,
                        }}>暂无内容</Text>
                    </View>
                </View>
            )
        }
        return(
            <View>
                <Header title='我赞过的' onPress={this.props.onPressReturn} />
                <ScrollView>
                    {myZanPost.map((item,index)=>{
                        return <ZanItem key={index} item={item} deletePress = {this._deletePress.bind(this,item)}/>
                    })}
                </ScrollView>
            </View>
        )
    }
}

const ZanItem = ({item,deletePress})=>{
    return (
        <TouchableOpacity
            style={{
                height:60,
                borderBottomWidth:1,
                borderBottomColor:'#eee',
                flexDirection:'row',
                alignItems:'center',
                justifyContent: 'space-between',
            }}

        >
            <View style={{marginLeft:15}}>
                <Text style={{fontSize:12,fontWeight:'bold',marginBottom:10}}>{item.post_title}</Text>
                <Text style={{fontSize:10,color:'#aaa'}}>{item.post_time}</Text>
            </View>
            <TouchableOpacity
                activeOpacity = {0.9}
                onPress={deletePress}
                style={{
                    justifyContent:"center",
                    alignItems:"center",
                    marginRight:15,
                    height:30,
                    width:80,
                    backgroundColor:contant.color.theme,
                }}
            >
                <Text style={{color:'#fff'}}>取消赞</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
};