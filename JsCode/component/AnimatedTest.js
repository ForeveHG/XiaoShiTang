import React,{Component}from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated
}from 'react-native';
import {observable,action}from 'mobx'
import {observer} from 'mobx-react/native';

let appState = observable({
    scale: new Animated.Value(0),
});

@observer
export default class AnimatedTest extends Component{
    componentDidMount(){
        appState.scale.setValue(1.5);
        Animated.spring(
            appState.scale,
            {
                toValue:0.8,
                friction:1
            }
        ).start();
    }
    render(){
        return(
            <Animated.Image
                source={require('../img/my_favicon.png')}
                style={{
                    flex:1,
                    transform:[
                        {scale:appState.scale}
                    ]
                }}
            />
        )
    }
}