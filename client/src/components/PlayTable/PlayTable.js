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
        {(trick && players) ? (
        <div class="row ">
            <div className="col-s-6">
                
                    <div>
                        
                        {trick.map ((card, index) => {
                        const playerName = players[index] ? players[index].name : 'empty Chair';
                        return (
                            <TrickCard kex={index} card={card} player={playerName}/>
                    // console.log('user in room: ' + user.name)
                        )
                    })}
                    </div>
       
                
            </div>
            <div className="col-s-6 ml-5">
                    <div>
                        <button disabled={(players.length < trick.length)} onClick={dealCards} className="btn btn-primary m-3">New Game</button>
                        <button className="btn btn-primary m-3">Leave Table</button>
                    </div>
                  
                    {(players.length < trick.length)? (
                        <div>
                            <p>You need {`${trick.length}`} players to start.</p>
                            <p>Invite more players to your room!</p>
                        </div>
                    ) : null}
            </div>
        </div>
       ) : null }
    </div>
    )
};
    
    
export default PlayTable;