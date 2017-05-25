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
export default class MyShare extends Component{

    userStore = this.props.userStore;
    postStore = this.props.postStore;

    constructor(props){
        super(props);
        this.postStore.searchMyPost(this.userStore.user);
    }

    _deletePress(item){
        this.postStore.deletePost(this.userStore.user,item);
    }

    render(){
        let {myPost,isMyPost} = this.postStore;
        if(isMyPost){
            return (
                <View>
                    <Header title='我的分享' onPress={this.props.onPressReturn} />
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
                <Header title='我的分享' onPress={this.props.onPressReturn} />
                <ScrollView>
                    {myPost.map((item,index)=>{
                        return <PostItem key={index} item={item} deletePress = {this._deletePress.bind(this,item)}/>
                     })}
                </ScrollView>
            </View>
        )
    }
}

const PostItem = ({item,deletePress})=>{
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
                <Text style={{color:'#fff'}}>删除</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
};