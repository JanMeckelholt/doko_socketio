import React from 'react';
import { Button } from 'react-bootstrap';

import './PlayTable.css';
import TrickCard from './TrickCard/TrickCard';
const cardFolder= '/cards/'



const PlayTable = ({trick, players, dealCards}) => {
    console.log('players');
    console.log(players);
    return (
    <div className="container ml-3">
        <div class="row ">
            <div className="col-s-6">
                {(trick && players) ? (
                    <div>
                        
                        {trick.map ((card, index) => {
                        const playerName = players[index] ? players[index].name : 'empty Chair';
                        return (
                            <TrickCard kex={index} card={card} player={playerName}/>
                    // console.log('user in room: ' + user.name)
                        )
                    })}
                    </div>
       
                ) : null }
            </div>
            <div className="col-s-6 ml-5">
                    <div>
                        <button onClick={dealCards} className="btn btn-primary m-3">New Game</button>
                        <button className="btn btn-primary m-3">Leave Table</button>
                    </div>

            </div>
        </div>
       
    </div>
    )
};
    
    
export default PlayTable;