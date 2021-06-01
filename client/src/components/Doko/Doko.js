import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';


import './Doko.css';

import Infobar from '../Infobar/Infobar'


import TextContainer from '../TextContainer/TextContainer'
import PlayerHand from '../PlayerHand/PlayerHand'
import PlayTable from '../PlayTable/PlayTable'

let socket;


const Doko = ({ location }) => {



    const SERVERENDPOINT = 'localhost:5000';
    //const [name, setName] = useState('');
    //const [room, setRoom] = useState('');

    //const [player, setPlayer] = useState('');


    //const [players, setPlayers] = useState('');
    const [connected, setConnected] = useState(false);

    const INITTRICK = ['back', 'back', 'back', 'back'];
    const INITGAME = { started: false, trick: INITTRICK, deck: [], currentPlayerIndex: 0, players: [], room: '' };
    const [game, setGame] = useState(INITGAME);
    const [hand, setHand] = useState('');
    const [trick, setTrick] = useState(['back', 'back', 'back', 'back']);
    //  const [nextPlayer, setNextPlayer] = useState('');

    const getPlayer = () => {
        if (game && game.players && socket) {
            return game.players.find(p => p.id === socket.id);
        }
        return null;
    }

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        // console.log(location);
        // setRoom(room);
        // setName(name);
        socket = io(SERVERENDPOINT);
        console.log(socket);
        console.log('name: ' + name, ', room: ' + room)
        setConnected(true);
        socket.emit('join', { name, room }, (game) => {
            if (game.error) {
                //location.pathname = "/"
            }
            setGame(game);
        });


        return () => {
            socket.close();
            setConnected(false);
        }

    }, [SERVERENDPOINT, location.search]);

    useEffect(() => {
        socket.on('connect_error', () => {
            console.log('Failed to connect to server');
            setConnected(false);
            setTimeout(() => {
                socket.connect();
            }, 1000);
        });
        socket.on('connect', () => {
            setConnected(true);
        });
        socket.on('gameUpdate', (game) => {
            setGame(game);
            setTrick(game.trick)
        });
        socket.on('newCards', ({ hand, game }) => {
            console.log('newCards')
            console.log(hand);
            console.log(game);
            setHand(hand);
            setTrick(INITTRICK);
            setGame(game);
        });
        //socket.on('nextPlayer', (nextPlayer)=>{
        //    setNextPlayer(nextPlayer);
        //});      
        socket.on('cardPlayed', (data) => {
            console.log('card: ' + data.card + ' played by: ' + data.player.name)
            console.log('players');
            console.log(data.players)
            console.log(data.trick);

            const playerIndex = data.players.findIndex(p => p.id === data.player.id);
            setTrick(data.trick);
        });
    }, []);

    const dealCards = (confirmMessage) => {
        console.log('confirmMessage: ')
        console.log(confirmMessage);
        console.log(!confirmMessage);
        if (!confirmMessage || window.confirm(confirmMessage)) {

            socket.emit('dealCards', game, () => {
            });
        }

    };
    const claimTrick = () => {
        socket.emit('claimTrick', { game: game, trick: trick }, () => {
        });
    };

    const leaveTable = () => {
        socket.close();
        setConnected(false);
    }

    const playCard = (card) => {
        socket.emit('playerPlaysCard', { playerId: socket.id, card: card, game: game, hand: hand }, (data) => {
            console.log('callback playerPlaysCard');
            console.log(data);
            if (data && data.error) console.log(data.error);
            if (data && data.hand) setHand(data.hand);
        });
    };


    return (
        <div>
            {(connected) ? (
                <div className="outerContainer">
                    <div className="containerPlayTable">
                        <Infobar room={game ? game.room : ''} playerName={getPlayer() ? getPlayer().name : ''} />
                        <PlayTable trick={trick} game={game} dealCards={dealCards} claimTrick={claimTrick} leaveTable={leaveTable} />


                    </div>
                    <div className="containerPlayerHand">
                        <PlayerHand player={getPlayer()} hand={hand} playCard={playCard} />
                    </div>
                    <TextContainer players={game ? game.players : []} />
                </div>
            ) : (
                <div>
                    <h1>Server seems to be down!</h1>
                    <a href="/">Back to Login</a>
                </div>
            )}
        </div>
    )
}

export default Doko;
