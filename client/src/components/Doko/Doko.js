import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';


import './Doko.css';

import Infobar from '../Infobar/Infobar'


import TextContainer from '../TextContainer/TextContainer'
import PlayerHand from '../PlayerHand/PlayerHand'
import PlayTable from '../PlayTable/PlayTable'

let socket;

const Doko = ({location}) => {
    const SERVERENDPOINT = 'localhost:5000';
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    
    const [player, setPlayer] = useState('');
    

    const [players, setPlayers] = useState('');
    const [hand, setHand] = useState('');
    const [trick, setTrick] = useState(['back', 'back', 'back', 'back']);
    const [nextPlayer, setNextPlayer] = useState('');

    useEffect(()=>{
        const {name, room} = queryString.parse(location.search);
        console.log(location);
        setRoom(room);
        setName(name);
        socket = io(SERVERENDPOINT);
        console.log(socket);
        console.log('name: ' + name, ', room: ' + room)

        socket.emit('join', {name, room}, (player)=>{
           // setHand(hand);
            setPlayer(player);
            console.log(player);
        });  
        
        return () => {
            socket.close();
        }
        
    }, [SERVERENDPOINT, location.search]);

    useEffect(()=>{
        console.log("useEffect: " + players)
        socket.on('roomData', (data)=>{
            console.log('roomData');
            console.log(data);
            setPlayers(data.users);
        });        
        socket.on('newCards', (hand)=>{
            console.log('newCards')
            setHand(hand);
        });        
        socket.on('nextPlayer', (nextPlayer)=>{
            setNextPlayer(nextPlayer);
        });      
        socket.on('cardPlayed', (data)=>{
            console.log('card: '+data.card + ' played by: ' + data.player.name)
            console.log('players');
            console.log(players);
            console.log(data.players)
            const tempTrick =[...trick];
            console.log('players');

            const playerIndex = data.players.findIndex(p => p.id === data.player.id);
            tempTrick[playerIndex]= data.card;
            setTrick(tempTrick);
            console.log(tempTrick)
            console.log(playerIndex)
        });
    }, []);

    const dealCards = ()=>{
        socket.emit('dealCards', {room}, ()=>{
        socket.emit('nextPlayer', {nextPlayer: players[0]});
            
        });
    };

    const playCard = (card)=>{
        console.log('playCard by: ' + player.name)
        socket.emit('playerPlayedCard', {player, card}, ()=>{
            const playerIndex = players.findIndex(p => p.id === player.id);
            const nextplayer = players[playerIndex+1] ? players[playerIndex+1] : players[0];
            socket.emit('nextPlayer', {nextPlayer});
            console.log('nextPlayer: ' + nextPlayer);
            
        });
    };


    return(
        <div className="outerContainer">
            <div className="containerPlayTable">
                <Infobar room={room} />
                <PlayTable trick={trick} players={players} dealCards={dealCards}/>
               

            </div>
            <div className="containerPlayerHand">
                <PlayerHand player={player} hand={hand} playCard={playCard}/>
            </div>
            <TextContainer players={players}/>
        </div>
    )
}

export default Doko;
