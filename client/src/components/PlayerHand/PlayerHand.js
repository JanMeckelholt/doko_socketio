import React from 'react';

import PlayerHandCard from './PlayerHandCard/PlayerHandCard'

import './PlayerHand.css';

import onlineIcon from '../../icons/onlineIcon.png'



const Playerhand = ({hand, setTrick}) => (
    <div className="playerHand">
        {hand ? (
        <div>
            <h3 className="pt-3 pb-3">Your Hand:</h3>

            <div className="activeContainer">
                {hand.map ((card, index) => (
                    <PlayerHandCard card={card} index={index} setTrick={setTrick}/>
                   // console.log('user in room: ' + user.name)
                ))}
            </div>
        </div>
        ) : null }
    </div>
);
    
    
export default Playerhand;