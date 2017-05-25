import React,{Component} from 'react';
import {observable,action}from 'mobx'
import {observer} from 'mobx-react/native';
import{
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity,
    Keyboard,
    Modal,
    Navigator,
    ToastAndroid,
}from 'react-native';
import Header from '../component/DetailHeader';
import constant from '../common/Constants';
import User from '../db/entity/User';
import UserLite from '../db/UserLite';
import MainBar from '../page/MainBar';
import UserStore from '../mobx/UserStore';

let userLite = new UserLite();

//定义常量
const ConfirmLoad = '确认登录';
const GoRegister = '马上注册';
const ConfirmRegister = '确认注册';
const ReLoad = '返回登陆';
const LoadUserPlace = '请输入用户名';
const LoadPwdPlace = '请输入密码';
const RegisterUserPlace = '请输入4-16位字母用户名';
const RegisterPwdPlace = '请输入6-16位密码';
const LoadUserImg = require('../img/user_not_active.png');
const LoadPwdImg = require('../img/pwd_not_active.png');
const FocusLoadUserImg = require('../img/user_active.png');
const FocusLoadPwdImg = require('../img/pwd_active.png');
const RegistUserImg = require('../img/img_me_register.png');
const RegistPwdImg = require('../img/img_me_safe.png');
const FocusRegistUserImg = require('../img/img_me_register_active.png');
const FocusRegistPwdImg = require('../img/img_me_safe_active.png');

//第三方登录的图片
let loadLink = [
    require('../img/ic_account_qq.png'),
    require('../img/ic_account_wechat.png'),
    require('../img/ic_account_weibo.png'),
];

//定义可观察的变量
appState = observable({
    user_color: '#aaa', //用户名文本框的borderColor
    pwd_color:'#aaa', //密码文本框的borderColor
    userIcon: LoadUserImg, //用户名前的图像
    pwdIcon: LoadPwdImg, //密码框的图像
    user: new User(), //新建用户
    modalIsVisible:false, //定义提示框是否显示
    oneBtnText: ConfirmLoad,
    twoBtnText: GoRegister,
    onePlaceholder: LoadUserPlace,
    twoPlaceholder: LoadPwdPlace,
});

@observer
export default class LoadPage extends Component{

    userStore = new UserStore();

    constructor(props){
        super(props);
        appState.user = this.userStore.user || appState.user;
    }

    @action
    _onFocusInput(val){
        if(val == 'user' || val == undefined){
            appState.user_color = constant.color.theme;
            appState.pwd_color = '#aaa';
            if(appState.oneBtnText == ConfirmLoad){
                appState.userIcon = FocusLoadUserImg;
                appState.pwdIcon = LoadPwdImg;
            }else{
                appState.userIcon = FocusRegistUserImg;
                appState.pwdIcon = RegistPwdImg;
            }
        }
        if(val == 'pwd'){
            appState.pwd_color = constant.color.theme;
            appState.user_color = '#aaa';
            if(appState.oneBtnText == ConfirmLoad){
                appState.userIcon = LoadUserImg;
                appState.pwdIcon = FocusLoadPwdImg;
            }else{
                appState.userIcon = RegistUserImg;
                appState.pwdIcon = FocusRegistPwdImg;
            }
        }
    };

    /**
     * 监听键盘弹出和键盘隐藏，暂存
     */
    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow () {
        //alert('Keyboard Shown');
    }

    _keyboardDidHide () {
        //alert('Keyboard Hidden');
    }

    //登录和注册的界面切换
    _handler(){
        Keyboard.dismiss();
        appState.user_color = constant.color.theme;
        appState.pwd_color = '#eee';
        this.refs.userName.clear();
        this.refs.userPwd.clear();
        if(appState.twoBtnText == GoRegister){
            appState.oneBtnText = ConfirmRegister;
            appState.twoBtnText = ReLoad;
            appState.onePlaceholder = RegisterUserPlace;
            appState.twoPlaceholder = RegisterPwdPlace;
            appState.userIcon = FocusRegistUserImg;
            appState.pwdIcon = RegistPwdImg;
        }else{
            appState.oneBtnText = ConfirmLoad;
            appState.twoBtnText = GoRegister;
            appState.onePlaceholder = LoadUserPlace;
            appState.twoPlaceholder = LoadPwdPlace;
            appState.userIcon = FocusLoadUserImg;
            appState.pwdIcon = LoadPwdImg;
        }

    }

    //登陆成功或注册成功应该有一个跳转的界面，目前还没有
    _registerSuccess(){
        return (
            <View>

            </View>
        )
    }

    //登陆
    @action
    loginUser(){
        return this.userStore.loginUser(appState.user);
    }

    _handlerAct(){
        if(appState.oneBtnText == ConfirmLoad){ //确认登录
            this.loginUser().then((result)=>{
                ToastAndroid.show('登陆成功',ToastAndroid.SHORT);
                this._loginSuccess();
            }).catch(()=>{
                ToastAndroid.show('用户名或密码错误',ToastAndroid.SHORT);
            });
        }else if(appState.oneBtnText == ConfirmRegister){ //确认注册
            this._registerUser();
        }else{
            console.log('error:登陆或注册出错！');
        }
    }

    //注册用户
    _registerUser() {
        appState.modalIsVisible = true;
        let user = appState.user;
        let loginName = user.getLoginName();
        if (loginName == '' || loginName == null) {
            ToastAndroid.show('用户名不能为空',ToastAndroid.SHORT);
            //alert('用户名不能为空'); //这里应该有弹出提示，目前没有
        } else if (loginName.length < 4) {
            ToastAndroid.show('用户名不能少于4位',ToastAndroid.SHORT);
            //alert('用户名不能少于4位');
        } else {
            this.userStore.searchUser(loginName).then(() => {
                ToastAndroid.show('用户已注册，请直接登陆',ToastAndroid.SHORT);
                this._handler();
                //alert('用户已注册，请直接登陆');
            }).catch(() => {
                this.userStore.registerUser(user).then(() => {
                    ToastAndroid.show('注册成功,请登录',ToastAndroid.SHORT);
                    this._handler();
                }).catch((err) => {
                    alert('保存失败======' + err);
                });
            })
        }
    }

    _loginSuccess(){
        //将已经登陆的用户保存到storage中
        if(this.userStore.user){
            //登陆成功后跳转到首页
            let navigator = this.props.navigator;
            if(navigator){
                navigator.replace({
                    component:MainBar,
                    sceneConfig: Navigator.SceneConfigs.FadeAndroid,
                    params:{
                        name:'MainBar',
                    }
                })
            }
        }
    }

    render(){
        return(
            <View style={{backgroundColor:constant.color.bk,height:constant.window.height}}>
                <Header title="登录" onPress={this.props.onPressReturn}/>
                <View style={{justifyContent:'center',alignItems:'center',flex:1,paddingTop:100}}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Image
                            source={appState.userIcon}
                            style={{width:20,height:20,marginLeft:15}}
                        />
                        <TextInput
                            style={[styles.textInput,{borderColor:appState.user_color}]}
                            ref= 'userName'
                            underlineColorAndroid="transparent"
                            /*页面加载完成后文本框自动获得焦点*/
                            autoFocus={true}
                            placeholder={appState.onePlaceholder}
                            placeholderTextColor="#ccc"
                            selectTextOnFocus={true}
                            selectionColor= {constant.color.theme}
                            keyboardType="default"
                            onFocus={this._onFocusInput.bind(this,'user')}
                            onChangeText={(text)=>{appState.user.setLoginName(text)}}
                        />
                    </View>

                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Image
                            source={appState.pwdIcon}
                            style={{width:20,height:20,marginLeft:15}}
                        />
                        <TextInput
                            style={[styles.textInput,{borderColor:appState.pwd_color}]}
                            ref= 'userPwd'
                            /*取消安卓中默认的下边框线，太丑了*/
                            underlineColorAndroid="transparent"
                            placeholder={appState.twoPlaceholder}
                            placeholderTextColor="#ccc"
                            /*文本框会遮住之前输入的文字,用于密码框*/
                            secureTextEntry={true}
                            /*获得焦点时选中文本框中的所有文字*/
                            selectTextOnFocus={true}
                            /*选中文本框内容是高亮的颜色*/
                            selectionColor= {constant.color.theme}
                            keyboardType="default"
                            /*设置最大输入16个字符*/
                            maxLength={16}
                            onFocus={this._onFocusInput.bind(this,'pwd')}
                            onSubmitEditing={Keyboard.dismiss}
                            onChangeText = {(text)=>{appState.user.setLoginPwd(text)}}
                        />

                    </View>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={this._handlerAct.bind(this)}
                        style={{width:150,height:30,marginTop:20,marginLeft:20,backgroundColor: constant.color.theme,borderRadius:2,justifyContent:'center',alignItems:'center'}}
                    >
                        <Text style={{color:'#f5f5f5'}}>{appState.oneBtnText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={this._handler.bind(this)}
                        style={{width:150,height:30,marginTop:20,marginLeft:20,borderColor:constant.color.theme,borderWidth:1,borderRadius:2,justifyContent:'center',alignItems:'center'}}
                    >
                        <Text ref='btnText' style={{color: constant.color.theme }}>{appState.twoBtnText}</Text>
                    </TouchableOpacity>

                    <View style={{flex:1,marginTop:60}}>
                        <Text style={{fontSize:12,color:"#ccc",textAlign:'center'}}>--第三方登陆--</Text>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                            {loadLink.map((item,index)=>{
                                return <Image key={index} source={item} style={styles.loadLinkImg}/>
                            })}
                        </View>
                    </View>
                </View>

                <View style={{height:125,backgroundColor:constant.color.bk}}>
                    <Image
                        source={require('../img/img_login_bottom.png')}
                        style={{width:350,height:125,position:'absolute',bottom:25,left:0}}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textInput:{
        height: 30,
        width:250,
        margin:10,
        color:"#707070",
        borderColor:"#aaa",
        borderWidth: 1,
        padding:5
    },
    loadLinkImg:{
        width:45,
        height:45,
        margin:20,
    }
});