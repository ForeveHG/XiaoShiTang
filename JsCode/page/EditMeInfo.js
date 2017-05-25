import React,{Component}from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    Animated,
    Navigator
}from 'react-native';
import Header from '../component/DetailHeader';
import DiaLog from '../component/DiaLog';
import {observable,action,reaction}from 'mobx'
import {observer} from 'mobx-react/native';
import InfoSelect from '../common/InfoSelect'
import Picker from 'react-native-picker';
import  ImagePicker from 'react-native-image-picker'; //第三方相机
import NickName from './NickName';
import UserLite from '../db/UserLite';
import UploadImage from '../component/UploadImage';
import constant from '../common/Constants';

let sqlite = new UserLite();

let appState = observable({
    user : '',
    userInfo : [],
    userFavicon : '',
});

let photoOptions = {
    //底部弹出框选项
    title:'请选择',
    cancelButtonTitle:'取消',
    takePhotoButtonTitle:'拍照',
    chooseFromLibraryButtonTitle:'选择相册',
    quality:0.75,
    allowsEditing:true,
    noData:false,
    storageOptions: {
        skipBackup: true,
        path:'images'
    }
};

let uploadImage = new UploadImage();

@observer
export default class EditMeInfo extends Component{

    userStore = this.props.userStore;

    _showPicker(item){
        let data = item.data;
        let title = item.title;
        let value = [];
        if(item.title == '体重' && item.value != '' && item.value != null ){
            value = item.value.split('.');
        }else{
            value.push(item.value);
        }
        Picker.init({
            pickerData: data,
            selectedValue: value,
            pickerFontColor:[255,89,67,1],
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText:'请选择您的'+title,
            pickerConfirmBtnColor: [255,89,67,1],
            pickerCancelBtnColor: [255,89,67,1],
            pickerToolBarBg: [240, 240, 240, 1] ,
            pickerBg:[255, 255, 255, 1],
            onPickerConfirm: pickedValue => {
                let value = '';
                pickedValue.map((i)=>{
                    value = value + i;
                });
                this.saveUserInfo(value,title);
                console.log(pickedValue);
                this.refs.dialog.iknow();
            },
            onPickerCancel: pickedValue => {
                this.refs.dialog.iknow();
            },
            onPickerSelect: pickedValue => {
                //this.saveUserInfo(pickedValue,title);
            }
        });
        Picker.show();
    }

    //保存用户信息
    saveUserInfo(pickedValue,title){
        let value = pickedValue ? pickedValue : '';
        let loginName = this.userStore.user.login_name;
        switch (title){
            case '昵称' :
                this._sqliteUserInfo(loginName,value,'nick_name');
                break;
            case '头像' :
                this._sqliteUserInfo(loginName,value,'favicon');
                break;
            case '性别' :
                this._sqliteUserInfo(loginName,value,'sex');
                break;
            case '年龄' :
                this._sqliteUserInfo(loginName,value,'age');
                break;
            case '身高' :
                this._sqliteUserInfo(loginName,value,'height');
                break;
            case '体重' :
                this._sqliteUserInfo(loginName,value,'weight');
                break;
            default:
                break;
        }
    }

    @action
    _sqliteUserInfo(loginName,value,field){
        sqlite.editUserInfo(loginName,value,field).then(()=>{
            this.userStore.searchUser(loginName).then(()=>{
                console.log('appState.user.age:'+this.userStore.user.age);
            })
        }).catch((err)=>{
            console.log('sqlite editUserInfo error: '+err);
        });
    }

    //打开相册或摄像头
    openMycamera = (loginName,field) =>{
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
                let key = loginName + 'favicon';
                appState.userFavicon = source.uri;
                uploadImage.uploadImage(source.uri,key).then((result)=>{
                    sqlite.editUserInfo(loginName,result,field).then(()=>{
                        this.userStore.searchUser(loginName);
                    })
                });
            }
        })
    };

    //设置昵称页面
    setNickName(navigator){
        if(navigator){
            navigator.push({
                component:NickName,
                sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                params:{
                    name:'NickName',
                    onPressReturn:this.props.onPressReturn,
                    userStore: this.props.userStore,
                }
            });
        }
    }

    @action
    _onPress(item,navigator){
        let loginName = this.userStore.user.login_name;
        if(item.data!=null){
            this._showPicker(item);
            this.refs.dialog.show(); //遮罩层
        }
        if(item.title == '头像'){
            this.openMycamera(loginName,'favicon');
        }
        if(item.title == '昵称'){
            this.setNickName(navigator);
        }
    }

    render(){
        const {user}= this.userStore;
        let favicon = user.favicon ? {uri:user.favicon} : require('../img/my_favicon.png');
        userInfo = [
            {title : '头像', value : favicon, data : null},
            {title : '昵称', value : user.nick_name, data : null},
            {title : '性别', value : user.sex, data : InfoSelect.userSex},
            {title : '年龄', value : user.age, data : InfoSelect.userAge},
            {title : '身高', value : user.height, data : InfoSelect.userHeight},
            {title : '体重', value : user.weight, data : InfoSelect.userWeight},
        ];
        console.log('user.favicon:'+user.favicon);
        return(
            <View style={{backgroundColor:constant.color.bk,height:constant.window.height}}>
                <Header title="修改资料" onPress={this.props.onPressReturn}/>
                <View>
                    {userInfo.map((item,index)=>{
                        return <EditItem key={index} item={item} onPress={this._onPress.bind(this,item,this.props.navigator)}/>
                    })}
                </View>

                <View style={{height:125,backgroundColor:constant.color.bk,position:'absolute',bottom:25,left:0}}>
                    <Image
                        source={require('../img/img_login_bottom.png')}
                        style={{width:350,height:125}}
                    />
                </View>
                <DiaLog ref="dialog"/>
            </View>
        )
    }
}
const EditItem = ({item,onPress})=>{
   return(
       <TouchableOpacity
           activeOpacity={0.7}
           onPress={onPress}
           style={{
               height:55,
               borderBottomWidth:1,
               borderBottomColor:'#eee',
               flexDirection:'row',
               justifyContent:'space-between',
               alignItems:'center',
           }}
       >
           <Text style={{fontSize:12,marginLeft:10}}>{item.title}</Text>
           <View style={{flexDirection:'row'}}>
               {item.title=='头像'
                   ? <Image
                        source={item.value}
                        style={{width:40,height:40,borderRadius:20}}
                    />
                   : <Text style={{fontSize:12,marginLeft:10}}>{item.value}</Text>}
               <Image
                   source={require('../img/ic_my_right.png')}
                   style={{width:20,height:20,marginLeft:5,marginRight:10}}
               />
           </View>
       </TouchableOpacity>
   )
};
