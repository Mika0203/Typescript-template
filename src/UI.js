import React from 'react';

class UI extends React.Component{
    constructor(props){
        super(props)
    };

    render(){
        const style = {
            position: 'absolute',
            display: 'inline-grid',
            border: 'solid 1px rgba(0,0,0,0.5)',
            backgroundColor : 'rgba(255,255,255,0.8)',
            padding: '10px',
            borderRadius: '8px',
            margin : '5px',
        };

return <div style={style}>
            <button onClick={this.props.startSearch}>탐색</button>
            <button onClick={() => {
                this.props.mapInfo.removeAllObstacles();
                }}>모든 장애물 제거</button>
            <input value={this.props.interval} onChange={this.props.setMapSize} />
        </div> 
    }
}

export default UI