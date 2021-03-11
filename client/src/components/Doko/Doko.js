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

    useEffect(()=>{
        const {name, room} = queryString.parse(location.search);
        console.log(location);
        setRoom(room);
        setName(name);
        socket = io(SERVERENDPOINT);
        console.log(socket);
        console.log('name: ' + name, ', room: ' + room)

        socket.emit('join', {name, room}, (hand, player)=>{
            setHand(hand);
            setPlayer(player);
            console.log('hand'+hand);
        });  
        
        return () => {
            socket.close();
        }
        
    }, [SERVERENDPOINT, location.search]);

    useEffect(()=>{

            

        socket.on('roomData', (data)=>{
            setPlayers(data.users);

            console.log(data.users);

        });
    }, []);



    return(
        <div className="outerContainer">
            <div className="containerPlayTable">
                <Infobar room={room} />
                <PlayTable trick={trick} players={players}/>
               

            </div>
            <div className="containerPlayerHand">
                <PlayerHand player={player} players={players} hand={hand} trick={trick}  setTrick={setTrick}/>
            </div>
            <TextContainer players={players}/>
        </div>
    )
}

export default Doko;
