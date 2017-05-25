
export default class TipModal{
    render(){
        return(
            <Modal
                animationType={'slide'}
                transparent={false}
                visible={appState.modalIsVisible}
                onRequestClose={()=>{}}
                style={{flex:1}}
            >

            </Modal>
        )
    }
}