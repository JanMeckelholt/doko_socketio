import React from 'react';

import './TextContainer.css';
import onlineIcon from '../../icons/onlineIcon.png'


const TextContainer = ({players}) => (
    <div className="textContainer">
        <h1>People currently in this room:</h1>
        {players ? (
        <div>
            

            <div className="activeTextContainer">
                {players.map ((player) => (
                    <div key={player.id} className="activeTextItem">
                        Username: {player.name}
                        <img alt="online" src={onlineIcon}/>
                    </div>
                   // console.log('user in room: ' + user.name)
                ))}
            </div>
            <h2>Total: {players.length}</h2>
        </div>
        ) : null }
    </div>
);
    
    
export default TextContainer;