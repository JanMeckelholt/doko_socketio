import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './PlayTable.css';
import TrickCard from './TrickCard/TrickCard';
const cardFolder = '/cards/'



const PlayTable = ({ trick, game, dealCards, claimTrick, leaveTable }) => {
    const handleClick = (e) => {
        e.preventDefault();
        if (e.target.id === 'startGame') {
            dealCards('');
        }
        if (e.target.id === 'restartGame') {
            dealCards('Do you really want to abort the current game?');
        }
        if (e.target.id === 'claimTrick') {
            claimTrick();
        }
        if (e.target.id === 'leaveTable') {
            leaveTable();
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
                                        {(trick.findIndex(c=> c==='back') === -1) ? (
                                            <div>
                                                <p>test</p>
                                                <button
                                                    id="claimTrick"
                                                    onClick={handleClick}
                                                    className="btn btn-primary m-3">
                                                    Claim Trick
                                        </button>
                                            </div>
                                        ) :
                                            (<div>
                                                <p>Player to play Card: {`${game.players[game.currentPlayerIndex].name}`}</p>
                                            </div>
                                            )}

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

                            <button id="leaveTable" className="btn btn-warning m-3" onClick={handleClick}>Leave Table</button>

                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
};


export default PlayTable;