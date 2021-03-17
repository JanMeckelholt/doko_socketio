import React from 'react';
import { Button } from 'react-bootstrap';

import './PlayTable.css';
import TrickCard from './TrickCard/TrickCard';
const cardFolder = '/cards/'



const PlayTable = ({ trick, game, dealCards }) => {
    const handleClick = (e) =>{
        e.preventDefault();
        if (e.target.id === 'startGame') {
            dealCards('');
        }       
        if (e.target.id === 'restartGame') {
            dealCards('Do you really want to abort the current game?');
        }
       
        // const tempTrick =[...trick];
        // const playerIndex = players.findIndex(p => p.id === player.id);
        // tempTrick[playerIndex]= `${e.target.id}`;
        // setTrick(tempTrick);
    }

    return (
        <div className="container ml-3">
            {(trick && game && game.players) ? (
                <div className="row ">
                    <div className="col-s-6">

                        <div>

                            {trick.map((card, index) => {
                                const playerName = game.players[index] ? game.players[index].name : 'empty Chair';
                                return (
                                    <TrickCard kex={index} card={card} player={playerName} />
                                    // console.log('user in room: ' + user.name)
                                )
                            })}
                        </div>


                    </div>
                    <div className="col-s-6 ml-5">


                        {(game.players.length >= trick.length) ? (
                            <div>
                                {(game.started) ? (
                                    <div>
                                        <p>Player to play Card: {`${game.players[game.currentPlayerIndex].name}`}</p>
                                        <button 
                                            id="restartGame"
                                            disabled={(game.players.length < trick.length)} 
                                            onClick={handleClick}
                                            className="btn btn-danger m-3">
                                                Abort Game and start new
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <button id="startGame" disabled={(game.players.length < trick.length)} onClick={handleClick} className="btn btn-primary m-3">Start Game</button>
                                    </div>
                                )}

                            </div>
                        )
                            : (
                                <div>
                                    <p>You need {`${trick.length}`} players to start.</p>
                                    <p>Invite more players to your room!</p>
                                </div>
                            )}
                        <div>

                            <button className="btn btn-warning m-3">Leave Table</button>



                            
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
};


export default PlayTable;