import React,{Component} from 'react';
import {
    Image,
    Animated,
}from 'react-native';
import MainBar from '../page/MainBar';
import constant from '../common/Constants';

export default class Splash extends Component{

    state = {
        opacity: new Animated.Value(1),
    };

    componentDidMount(){
        const{navigator} = this.props;
        this.timer = setTimeout(()=>{
            Animated.timing(
                this.state.opacity,
                {
                    toValue:0,
                    duration:1000,
                },
            ).start();
            navigator.resetTo({
                component: MainBar,
                name:'MainBar',
            });
        },1000);
    }

    componentWillUnmount(){
        clearTimeout(this.timer);
    }

    render(){
        return(
            <Animated.Image
                style={{
                    width: constant.window.width,
                    height:constant.window.height,
                    opacity:this.state.opacity,
                }}
                source={require('../img/welcome_page.png')}
            />
        )
    }
}

















