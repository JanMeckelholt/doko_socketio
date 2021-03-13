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

//const {getUser, removeUser, addUser, getUsersInRoom} = require('./users');
//const {addPlayer, getPlayersInRoom, getPlayer, removePlayer, createDeck, dealToHand, playCard} = require('./doko');
const {getGameByRoom, createGame, getGameOfPlayerById, getPlayerByIdInGame, removePlayerByIdFromRoom, addPlayerToRoom, createDeck, dealToHand, playCard} = require('./doko');

io.on('connection', (socket)=>{
    console.log("There is a new connection!!");

    socket.on('join', ({name, room}, callback)=>{
        console.log('Name: ' + name + ' ,room: ' + room);
        console.log('soekt.id: ' +socket.id);
        let game = getGameByRoom(room);
        if (!game) {
            game = createGame(room);
        };
        const gameOrError = addPlayerToRoom({ playerId: socket.id, playerName: name, room:room})
        if(gameOrError.error) return callback(gameOrError.error);
        game = gameOrError;
        console.log(game);
        socket.join(game.room);
        io.to(game.room).emit('gameUpdate', game);
        callback(game); 
    });

    socket.on('dealCards', (game, callback)=>{
        let deck = createDeck(game);
        game.players.forEach(player =>{
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
     socket.on('playerPlaysCard', ({playerId, card, game}, callback)=>{
         console.log('playerPlaysCard: ' + playerId);
         console.log('playerPlaysCard: ' + card);
         console.log('playerPlaysCard: ' + game);
         console.log(game);
       // const player = getPlayerByIdInGame({playerId, game});
        const gameOrError = playCard(playerId, card, game);
        if(gameOrError.error) return callback(gameOrError.error);
        io.to(game.room).emit('gameUpdate', gameOrError);
     });

    socket.on('disconnect', ()=> {
        console.log('Connection ended!');
        console.log(socket.id);
        let game = getGameOfPlayerById(socket.id);
        console.log('disconnect: '+game);
        if (game){
            game = removePlayerByIdFromRoom({id: socket.id, room: game.room});
            io.to(game.room).emit('gameUpdate', game);
        }
    });
});

app.use(router);

server.listen(PORT, ()=> console.log(`Server has started on port ${PORT}`));
