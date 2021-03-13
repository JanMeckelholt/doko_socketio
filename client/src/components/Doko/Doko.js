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
    //const [name, setName] = useState('');
    //const [room, setRoom] = useState('');
    
    //const [player, setPlayer] = useState('');
    

    //const [players, setPlayers] = useState('');
    
    const INITTRICK = ['back', 'back', 'back', 'back'];
    const INITGAME = {trick: INITTRICK, deck: [], currentPlayerIndex:0, players:[], room:''};
    const [game, setGame] = useState(INITGAME);
    const [hand, setHand] = useState('');
    const [trick, setTrick] = useState(['back', 'back', 'back', 'back']);
  //  const [nextPlayer, setNextPlayer] = useState('');

    const getPlayer = () =>{
        if (game && game.players){
            return game.players.find(p=> p.id === socket.id);
        }
        return null;
    }

    useEffect(()=>{
        const {name, room} = queryString.parse(location.search);
        // console.log(location);
        // setRoom(room);
        // setName(name);
        socket = io(SERVERENDPOINT);
        console.log(socket);
        console.log('name: ' + name, ', room: ' + room)

        socket.emit('join', {name, room}, (game)=>{
            setGame(game);
        });  
        
        return () => {
            socket.close();
        }
        
    }, [SERVERENDPOINT, location.search]);

    useEffect(()=>{
        socket.on('gameUpdate', (game)=>{
            setGame(game);
            setTrick(game.trick)
        });        
        socket.on('newCards', (hand)=>{
            console.log('newCards')
            setHand(hand);
            setTrick(INITTRICK);
        });        
        //socket.on('nextPlayer', (nextPlayer)=>{
        //    setNextPlayer(nextPlayer);
        //});      
        socket.on('cardPlayed', (data)=>{
            console.log('card: '+ data.card + ' played by: ' + data.player.name)
            console.log('players');
            console.log(data.players)
            console.log(data.trick);

            const playerIndex = data.players.findIndex(p => p.id === data.player.id);
            setTrick(data.trick);
        });
    }, []);

    const dealCards = ()=>{
        socket.emit('dealCards', game, ()=>{          
        });
    };

    const playCard = (card)=>{
        socket.emit('playerPlaysCard', {playerId: socket.id, card: card, game: game, hand: hand}, (data)=>{
            if (data && data.error) console.log(data.error);
            if (data && data.hand) setHand(data.hand);
        });
    };


    return(
        <div className="outerContainer">
            <div className="containerPlayTable">
                <Infobar room={game.room} />
                <PlayTable trick={trick} players={game.players} dealCards={dealCards}/>
               

            </div>
            <div className="containerPlayerHand">
                <PlayerHand player={getPlayer()} hand={hand} playCard={playCard}/>
            </div>
            <TextContainer players={game.players}/>
        </div>
    )
}

export default Doko;
