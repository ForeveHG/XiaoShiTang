import React,{Component}from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
    Navigator
}from 'react-native';
import constant from '../common/Constants';
import {observer} from 'mobx-react/native';
import {observable,computed,action,runInAction,reaction}from 'mobx';
import Loading from '../component/Loading';
import LoadMore from '../component/LoadMore';
import ShareFoodDetail from './ShareFoodDetail';

let not_like = require('../img/ic_feed_like.png');
let like = require('../img/ic_feed_like_selected.png');

let appState = observable({
   zanNum : 0,
   zanImg : not_like,
});



@observer
export default class PostShare extends Component{

    constructor(props){
        super(props);
        this.props.zanStore.searchPostZan();
        this.props.postStore.searchPost();
    }

    onShareFoodPress(item){
        let navigator = this.props.navigator;
        if(navigator){
            navigator.push({
                name:'ShareFoodDetail',
                component:ShareFoodDetail,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                params:{
                    item : item,
                    userStore: this.props.userStore,
                    postStore: this.props.postStore,
                }
            })
        }
    }

    onPressZan(){
        let {zan_flag} = this.props.zanStore;
        alert(zan_flag);
        console.log('zan_flag:'+zan_flag);
        if(zan_flag){
            appState.zanImg = not_like;
        }else{
            appState.zanImg = like;
        }
    }

    readyZan(item){
        this.props.zanStore.searchPostZan(this.props.userStore.user.login_name,item.post_id).then((result)=>{
            console.log(result);
            if(result){
                appState.zanImg = not_like;
            }else{
                appState.zanImg = like;
            }
        })
    };

    render(){
        let {postList,isFetching} = this.props.postStore;
        if(isFetching){
            return <Loading isShow={isFetching} loadText='正在加载...'/>
        }
        return(
            <ScrollView>
                <View
                    style={{backgroundColor:'#FAFAFA',flexDirection:'row',flexWrap:'wrap',paddingTop:10}}
                >
                    {postList.map((item,index)=>{
                        //this.readyZan(item);
                        return <Post item={item} key={index} onShareFoodPress={this.onShareFoodPress.bind(this,item)} onPressZan={this.onPressZan.bind(this)}/>
                    })}
                </View>
            </ScrollView>
        )
    }
}

const Post = ({item,onShareFoodPress,onPressZan,zanStore})=>{
    let width = constant.window.width/2-20;
    let userFavicon = item.favicon ? {uri:item.favicon} : require('../img/my_favicon.png');
    let postImg = item.post_img ? {uri:item.post_img} : require('../img/post/post1.png');
    let userName = item.nick_name ? item.nick_name : item.user_name;
    let count = item.count ? item.count : 0;
    return(
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onShareFoodPress}
            style={{width:width,height:275,margin:10,backgroundColor:'#fff'}}>
            <View>
                <Image
                    source={postImg}
                    style={{width:width,height:200}}
                />
            </View>
            <View style={{borderWidth:1,borderColor:'#eee',}}>
                <View style={{height:25,justifyContent:'center',alignItems:'center',borderBottomColor:'#eee',borderBottomWidth:1,}}>
                    <Text style={{fontSize:12,width:width,marginLeft:5,}}>{item.post_title}</Text>
                </View>
                <View style={{flexDirection:'row',height:40,justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row',marginLeft:5,justifyContent:'center',alignItems:'center'}}>
                        <Image
                            source={userFavicon}
                            style={{width:30,height:30,borderRadius:15,}}
                        />
                        <Text style={{fontSize:10,color:'#555',marginLeft:5}}>{userName}</Text>
                    </View>
                    <TouchableOpacity
                        style={{flexDirection:'row',marginRight:5,justifyContent:'center',alignItems:'center',height:40}}
                        activeOpacity={0.8}
                        onPress={()=>{}}
                    >
                        <Image
                            source={appState.zanImg}
                            style={{width:15,height:15}}
                        />
                        <Text style={{fontSize:10,color:'#555'}}>{count}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
};