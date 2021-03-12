const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
    }
});

const PORT = process.env.PORT || 5000
const router = require('./router')

const {getUser, removeUser, addUser, getUsersInRoom} = require('./users');
const {addPlayer, getPlayersInRoom, getPlayer, removePlayer, createDeck, dealToHand, playCard} = require('./doko');

io.on('connection', (socket)=>{
    console.log("There is a new connection!!");

    socket.on('join', ({name, room}, callback)=>{
        console.log('Name: ' + name + ' ,room: ' + room);
        console.log('soekt.id: ' +socket.id);
        const {error, player} = addPlayer({ id: socket.id, name, room})
        if(error) return callback(error);
        console.log('player.name: ' + player.name + ', player.room: ' + player.room);
        socket.join(player.room);
        io.to(player.room).emit('roomData', {room: player.room, playerss: getPlayersInRoom(players.room)});
        callback(user); 
    });

    socket.on('dealCards', ({room}, callback)=>{
        let deck = createDeck();
        console.log(socket.id);
        const players = getPlayersInRoom(room); 
        console.log('players in dealCards');
        console.log(players);
        console.log(room);
        players.forEach(player =>{
            let hand;
            [hand, deck] = dealToHand(deck, 10, (error)=>{
                console.log(erorr)
            });
            if (player.id===socket.id){
                socket.emit('newCards', hand);
            } else{
                socket.broadcast.to(player.id).emit('newCards', hand);
            }
        });

    });
            
    socket.on('nextPlayer', ({nextPlayer}, callback)=>{
        const player = getPlayer(socket.id);
        io.to(player.room).emit('nextPlayer', {nextPlayer});

     });        
     socket.on('playerPlayedCard', ({player, card}, callback)=>{
        const {trick, error} = playCard(player, card);
        if (error) return callback(error);
        const players = getPlayersInRoom(player.room)
        io.to(player.room).emit('cardPlayed', {player, card, players});
     });

    socket.on('disconnect', ()=> {
        console.log('Connection ended!');
        const user = removePlayer(socket.id);
        if (user){
            io.to(user.room).emit('roomData', {room: player.room, players: getPlayersInRoom(player.room)});
        }
    });
});

app.use(router);

server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`));
