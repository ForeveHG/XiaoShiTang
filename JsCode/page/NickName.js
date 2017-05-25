import React,{Component}from 'react';
import{
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
}from 'react-native';
import Header from '../component/DetailHeader'
import {observable,action}from 'mobx'
import {observer} from 'mobx-react/native';
import constant from '../common/Constants';
import UserLite from '../db/UserLite';
let sqlite = new UserLite();
let appState = observable({
   nikeName:'',
});

@observer
export default class NickName extends Component{

    userStore = this.props.userStore;

    editNickName(){
        if(appState.nikeName != this.userStore.user.nick_name && appState.nikeName != ''){
            let loginName = this.userStore.user.login_name;
            if(this.userStore){
                sqlite.editUserInfo(loginName,appState.nikeName,'nick_name').then(()=>{
                    this.userStore.searchUser(loginName).then(()=>{
                        console.log('editNickName success');
                        console.log(this.userStore.user.nick_name)
                    })
                }).catch((error)=>{
                    console.log(error);
                })
            }
        }
        let navigator = this.props.navigator;
        if(navigator){
            navigator.pop();
        }
    }

    render(){
        appState.nikeName = this.userStore.user.nick_name;
        return(
            <View style={{backgroundColor:constant.color.bk,height:constant.window.height}}>
                <Header title="修改昵称" onPress={this.props.onPressReturn}/>
                <TouchableOpacity
                    onPress={this.editNickName.bind(this)}
                    activeOpacity={0.7}
                    style={{height:30,width:50,padding:8,position:'absolute',right:10,top:0}}
                >
                    <Text style={{fontSize:12,textAlign:'right'}}>完成</Text>
                </TouchableOpacity>
                <View style={{backgroundColor:'#f5f5f5',height:constant.window.height-30}}>
                    <TextInput
                        underlineColorAndroid="transparent"
                        autoFocus = {true}
                        selectTextOnFocus = {true}
                        selectionColor = "#eee"
                        keyboardType = "default"
                        defaultValue = {this.userStore.user.nick_name}
                        style = {{
                            height:30,
                            width:constant.window.window,
                            backgroundColor:'#fff',
                            marginTop:10,
                            borderTopWidth:1,
                            borderBottomWidth:1,
                            borderColor:'#aaa',
                        }}
                        onChangeText={(text)=>{appState.nikeName = text}}
                    />
                </View>
                <View style={{height:125,backgroundColor:constant.color.bk,position:'absolute',bottom:25,left:0}}>
                    <Image
                        source={require('../img/img_login_bottom.png')}
                        style={{width:350,height:125}}
                    />
                </View>
            </View>
        )
    }
}