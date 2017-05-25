/**
 * 配置应用的Navigator对象，管理页面跳转
 */
import React,{Component}from 'react';
import{
    Navigator,
}from 'react-native';
export default class AppNavigator extends Component{
    static defaultProps = {
      component:React.PropTypes.required,
    };
    render(){
        return(
            <Navigator
                //初始化路由，定义路由的数据结构(根据需要自定义)
                initialRoute={
                    {
                        name:this.props.name,
                        component:this.props.component, //要渲染的组件
                        //sceneConfig:'',//页面切换方式
                        data:''//数据
                    }
                }
                //配置切换方式
                configureScene={(route,routeStack)=>{
                        if(route.sceneConfig){
                            return route.sceneConfig;
                        }
                        return{
                             ...Navigator.SceneConfigs.PushFromRight,
                             gesture:{} //禁用滑动的手势
                        }

                    }
                }
                //渲染场景
                renderScene={(route,navigator)=>{
                        let Scene = route.component;
                        return <Scene {...route.params} navigator={navigator} />
                    }
                }
            />
        )
    }
}
