import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Navigator,
    TextInput,
    ReactNative,
    KeyboardAvoidingView,
    Keyboard,
    ToastAndroid,
}from 'react-native';
import {observer} from 'mobx-react/native';
import Header from '../component/DetailHeader';
import constant from '../common/Constants';
import DiaLog from '../component/DiaLog';
import CollectStore from '../mobx/CollectStore';
import ZanStore from '../mobx/ZanStore';
import LoadPage from '../page/LoadPage';
import Discuss from '../db/entity/Discuss';
import DiscussStore from '../mobx/DiscussStore';
import DiscussItem from '../component/DiscussItem';
let not_collect_img = require('../img/post/page_collect_2.png');
let not_zan_img = require('../img/post/page_zan_2.png');
let collect_img = require('../img/post/page_collect_1.png');
let zan_img = require('../img/post/page_zan_1.png');

let discussStore = new DiscussStore();

const bottomPadding = 35;
const bottomPaddingMax = 70;
const bottomMargin = 20;

@observer
export default class ShareFoodDetail extends Component{

    collectStore = new CollectStore();
    userStore = this.props.userStore;
    zanStore = new ZanStore();
    post = this.props.item;

    state = {
        collect_flag: false,
        collect_img : not_collect_img,
        zan_flag: false,
        zan_img : not_zan_img,
        discussPadding: bottomPadding,
        discussBottom: bottomMargin,
        discussHeight: 30,
        discussButton: false, //发表按钮不显示
        discussContent: '',
    };

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow () {
        this.setState({
            discussPadding: bottomPaddingMax,
        })
    }

    _keyboardDidHide () {
        this.setState({
            discussPadding: bottomPadding,
        })
    }

    constructor(props){
        super(props);
        this.collectStore.searchPostCollect(this.userStore.user.login_name,this.post.post_id).then((result)=>{
            if(result){
                this.setState({
                    collect_img : collect_img,
                })
            }else{
                this.setState({
                    collect_img : not_collect_img,
                })
            }
        }).catch((error)=>{
            console.log(error);
        });

        this.zanStore.searchPostZan(this.userStore.user.login_name,this.post.post_id).then((result)=>{
            if(result){
                this.setState({
                    zan_img : zan_img,
                })
            }else{
                this.setState({
                    zan_img : not_zan_img,
                })
            }
        });

        console.log(this.post);
        discussStore.discussList = [];
        discussStore.searchDiscuss(this.post.post_id);
    }

    onReturnPress(){
        this.props.postStore.searchPost();
        let navigator = this.props.navigator;
        if(navigator){
            navigator.pop();
        }
    }

    loadPage(){
        let navigator = this.props.navigator;
        if(navigator){
            navigator.push({
                component:LoadPage,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                params:{
                    name:'LoadPage',
                    onPressReturn:this.onReturnPress.bind(this),
                    userStore: this.props.userStore,
                }
            });
        }
    };

    //收藏
    _onCollectPress() {
        if(this.props.userStore.user){
            let collect = {
                user_name: '',
                post_id : '',
                post_title:'',
                collect_time: '',
            };
            let {collect_flag} = this.collectStore;
            //改变图标
            collect.user_name = this.userStore.user.login_name;
            collect.post_id = this.post.post_id;
            collect.post_title = this.post.post_title;
            if (collect_flag) {
                this.setState({
                    collect_img: not_collect_img
                });
                this.collectStore.removeCollect(collect.user_name,collect.post_id);
            }else{
                this.setState({
                    collect_img: collect_img
                });
                let date = new Date(); //拿到文章发表时间
                collect.collect_time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
                this.collectStore.addCollect(collect);
            }
        }else{
            this.loadPage();
        }

    }

    //点赞
    _onZanPress(){
        if(this.props.userStore.user){
            let zan = {
                user_name: '',
                post_id : '',
                post_title:'',
                zan_time: '',
            };
            let {zan_flag} = this.zanStore;
            zan.user_name = this.userStore.user.login_name;
            zan.post_id = this.post.post_id;
            zan.post_title = this.post.post_title;
            let date = new Date();
            zan.zan_time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
            if(zan_flag){
                this.setState({
                    zan_img: not_zan_img
                });
                this.zanStore.removeZan(zan.user_name,zan.post_id);
            }else{
                this.setState({
                    zan_img: zan_img
                });
                this.zanStore.addZan(zan)
            }
        }else{
            this.loadPage();
        }

    }

    _onFocus() {
        //this.refs.dialog.show(); //遮罩层
        if(this.props.userStore.user){
            this.setState({
                discussPadding:bottomPaddingMax,
                discussBottom: 0,
                discussHeight:100,
                discussButton:true,
            })
        }else{
            ToastAndroid.show('请先登录',ToastAndroid.SHORT);
            this.loadPage();
        }

    }

    _onBlur(){
        this.setState({
            discussPadding:bottomPaddingMax,
            discussBottom:bottomMargin,
            discussHeight:30,
            discussButton:false,
        })
    }

    //发表评论
    publishDiscuss(){
        if(this.state.discussContent){
            Keyboard.dismiss();
            let discuss = new Discuss();
            let user_name = this.props.userStore.user.login_name;
            let post_id = this.props.item.post_id;
            let discuss_content = this.state.discussContent;
            let date = new Date(); //拿到文章发表时间
            let time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
            let discuss_parent = 0;
            discuss.setUserName(user_name) ;
            discuss.setPostID(post_id);
            discuss.setDiscussContent(discuss_content);
            discuss.setDiscussTime(time);
            discuss.setDiscussParentId(discuss_parent);
            discussStore.publishDiscuss(discuss);
            discussStore.searchDiscuss(this.post.post_id);
            this.setState({
                discussContent : '',
            })
        }else{
            ToastAndroid.show('请输入内容',ToastAndroid.SHORT);
        }

    }

    render(){
        let food = this.props.item;
        let width = constant.window.width;
        let height = constant.window.height;
        let {discussList} = discussStore;
        return(
            <View
                style={{height:height}}
            >
                <Header title='详情' onPress={this.onReturnPress.bind(this)} />
                <View
                    ref="scrollView"
                    style={{
                        flex: 1,
                        justifyContent:'flex-end',
                    }}
                >
                    <ScrollView contentContainerStyle={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontWeight :'bold',fontSize:14,textAlign:'center',marginTop:10,marginBottom:5}}>{food.post_title}</Text>
                        <Text style={{lineHeight:20,fontSize:10,color:'#aaa',textAlign:'center',marginBottom:10}}>{food.post_time}</Text>
                        <View style={{
                            marginLeft:20,
                            marginRight:20,
                        }}>
                            <Text style={{fontSize:14,textAlign:'left',letterSpacing:10,lineHeight:30}}>{food.post_content}</Text>
                        </View>
                        <Image
                            source={{uri:food.post_img}}
                            style={{
                            width:width-20,
                            height:380,
                            margin:10
                        }}
                        />
                        <View
                            style={{flexDirection:'row',}}
                        >
                            <View style={{marginRight:50}}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={this._onCollectPress.bind(this)}
                                    style={{
                                    alignItems:'center',
                                    justifyContent:'center',
                                }}
                                >
                                    <Image
                                        source={this.state.collect_img}
                                        style={{
                                        width:20,
                                        height:20,
                                        marginBottom:10
                                    }}
                                    />
                                    <Text style={{fontSize:12}}>收藏</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={this._onZanPress.bind(this)}
                                    style={{
                                    alignItems:'center',
                                    justifyContent:'center',
                                }}
                                >
                                    <Image
                                        source={this.state.zan_img}
                                        style={{
                                        width:20,
                                        height:20,
                                        marginBottom:10
                                    }}
                                    />
                                    <Text style={{fontSize:12}}>赞</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <DiscussList discussList = {discussList}/>
                        <View style={{height:50}}/>
                    </ScrollView>

                    <KeyboardAvoidingView
                        behavior='padding'
                    >
                        <ScrollView>
                            <View
                                style={{
                                    padding:10,
                                    backgroundColor:'#fff',
                                    marginBottom:this.state.discussBottom,
                                }}
                            >
                                <TextInput
                                    placeholder='写下你的评论...'
                                    ref="textInput"
                                    multiline={true}
                                    value={this.state.discussContent}
                                    style={{
                                        height:this.state.discussHeight,
                                        justifyContent:'center',
                                        borderColor:'#ccc',
                                        borderWidth:1,
                                        textAlignVertical: 'top',
                                    }}
                                    underlineColorAndroid = 'transparent'
                                    onFocus={this._onFocus.bind(this)}
                                    onBlur={this._onBlur.bind(this)}
                                    onChangeText={(text)=>{
                                        this.setState({
                                            discussContent: text,
                                        })
                                    }}
                                />
                            </View>
                        </ScrollView>
                        {this.state.discussButton
                            ? (
                            <View
                                style={{
                                 alignItems:'flex-end',
                                 marginRight:20,
                            }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.4}
                                    onPress={this.publishDiscuss.bind(this)}
                                    style={{
                                        height:30,
                                        width:80,
                                        justifyContent:'center',
                                        alignItems:'center',
                                        borderColor:constant.color.theme,
                                        borderWidth:1,
                                        marginBottom:this.state.discussPadding,
                                    }}
                                >
                                    <Text style={{color:constant.color.theme}}>发表评论</Text>
                                </TouchableOpacity>
                            </View>
                            )
                            : <View/>
                        }
                    </KeyboardAvoidingView>
                </View>
            </View>
        )
    }
}

const DiscussList = ({discussList})=>{
    console.log('discussList:'+discussList);
  return(
      <View>
          <View
            style={{
                height:20,
                backgroundColor:'#eee',
                marginTop:10,
                marginBottom:10,
            }}
          >
              <Text style={{
                  marginLeft:10,
                  width:constant.window.width-10,
              }}>评论 {discussList.length}</Text>
          </View>
          {
              discussList.length != 0
                  ? discussList.map((item,index)=>{
                        return <DiscussItem item = {item} key={index} index={discussList.length - index}/>
                    })
                  : <View style={{justifyContent:'center',alignItems:'center',marginTop:20}}>
                        <Text>暂无评论</Text>
                    </View>
          }
      </View>
  )
};