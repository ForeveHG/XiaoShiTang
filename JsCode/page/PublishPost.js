/**
 * 分享美食
 */
import React,{Component}from 'react';
import{
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ToastAndroid
}from 'react-native';
import Header from '../component/DetailHeader';
import AutoExpandingTextInput from '../component/AutoExpandingTextInput';
import constant from '../common/Constants';
import {observer} from 'mobx-react/native';
import {observable,action}from 'mobx'
import Post from '../db/entity/Post';
import  ImagePicker from 'react-native-image-picker'; //第三方相机
import UploadImage from '../component/UploadImage';

let uploadImage = new UploadImage();
let appState = observable({
   post: new Post(),
   userName:'',
   postTitle:'',
   postContent:'',
   postImg:'',
   postTime:'',
});

let photoOptions = {
    //底部弹出框选项
    title:'请选择',
    cancelButtonTitle:'取消',
    takePhotoButtonTitle:'拍照',
    chooseFromLibraryButtonTitle:'选择相册',
    quality:0.9,
    allowsEditing:true,
    noData:false,
    storageOptions: {
        skipBackup: true,
        path:'images'
    }
};

@observer
export default class PublishPost extends Component{

    postStore = this.props.postStore;
    userStore = this.props.userStore;

    onReturnPress(){
        let navigator = this.props.navigator;
        if(navigator){
            navigator.pop();
        }
    }

    _onChangeText(text){
        if(text != ''&& text != null){
            appState.post.setPostContent(text);
        }
    }

    _onChangeTitle(title){
        if(title != '' && title != null){
            appState.post.setPostTitle(title);
        }
    }

    //发表文章
    publishPost(){
        //this.postStore.deletePost();
        return new Promise((resolve,reject)=>{
            let post = appState.post;  //拿到文章数据
            let user = this.userStore.user; //拿到用户数据
            let date = new Date(); //拿到文章发表时间
            let time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
            let img = appState.postImg ? appState.postImg.uri : ''; //拿到图片
            let key = '';

            post.setPostTime(time);
            post.setUserName(user.login_name);
            if(!post.post_title){
                ToastAndroid.show('标题不能为空',ToastAndroid.SHORT);
            }else if (!post.post_content) {
                ToastAndroid.show('内容不能为空', ToastAndroid.SHORT);
            }else if(!img){
                ToastAndroid.show('晒一晒您的美食图片吧^_^',ToastAndroid.SHORT);
            }else{
                if(img){
                    key = user.login_name + img;
                    uploadImage.uploadImage(img,key).then((result)=>{
                        post.setPostImg(result);
                        ToastAndroid.show('发表成功',ToastAndroid.SHORT);
                        this.postStore.publishPost(post).then(()=>{
                            this.onReturnPress();
                            appState.postImg = '';
                        });
                    });
                }
            }
        });

    }

    //打开相册或摄像头
    openMycamera = (loginName) =>{
        ImagePicker.showImagePicker(photoOptions,(response) =>{
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };
                appState.postImg = source;
            }
        })
    };

    render(){
        return(
            <View>
                <Header title='分享美食' onPress={this.onReturnPress.bind(this)}/>
                <View
                    style={{
                        backgroundColor:'#fff',
                        justifyContent:'space-between',
                        borderBottomColor:'#eee',
                        borderBottomWidth:1,
                    }}
                >
                    <View>
                        <View style={{borderBottomWidth:1,borderBottomColor:'#eee'}}>
                            <AutoExpandingTextInput
                                onChangeText = {this._onChangeTitle}
                                placeHolder = '请输入标题...'
                                maxLength = {35}
                                minHeight = {40}
                            />
                        </View>
                        <View>
                            <AutoExpandingTextInput
                                onChangeText = {this._onChangeText}
                                placeHolder = '请输入内容...'
                                maxLength = {140}
                                minHeight = {80}
                            />
                        </View>
                        <View style={{flexDirection:'row'}}>
                            {appState.postImg ? <PostImg/> : <View/>}
                            <TouchableOpacity
                                onPress={this.openMycamera}
                                style={styles.postImg}
                            >
                                <Image
                                    source={require('../img/ic_album_default.png')}
                                    style={{
                                    width:20,
                                    height:20,
                                    marginBottom:10
                                }}
                                />
                                <Text style={{fontSize:15}}>照片</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.publishPost.bind(this)}
                    style={{
                            position:'absolute',
                            top:5,
                            right:10,
                        }}
                >
                    <Text style={{color:constant.color.theme}}>发布</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const PostImg = ()=>{
    console.log('appState.postImg:'+appState.postImg);
  return(
    <View>
        <Image
            source={appState.postImg}
            style={styles.postImg}
        />
    </View>
  )
};

const styles = StyleSheet.create({
    postImg:{
        width:100,
        height:100,
        backgroundColor:'#eee',
        justifyContent:'center',
        alignItems:'center',
        margin:12,
    },
});