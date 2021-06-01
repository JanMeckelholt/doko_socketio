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
const {getGameByRoom, createGame, startGame, getGameOfPlayerById, getPlayerByIdInGame, removePlayerByIdFromRoom, addPlayerToRoom, createDeck, dealToHand, playCard, claimTrick, getIndexOfPlayer} = require('./doko');

io.on('connection', (socket)=>{
    console.log("There is a new connection!!");

    socket.on('join', ({name, room}, callback)=>{
        console.log('Name: ' + name + ' ,room: ' + room);
        console.log('soekt.id: ' +socket.id);
        let game = getGameByRoom(room);
        console.log('game from getGameByRoom: ' + game)
        if (!game) {
            game = createGame(room);
        };
        game = addPlayerToRoom({ playerId: socket.id, playerName: name, room:room})
        if (game.error) {
            console.log("game-error")
            console.log(game)
            return callback(game);
        }
        console.log(game);
        socket.join(game.room);
        io.to(game.room).emit('gameUpdate', game);
        callback(game); 
    });

    socket.on('dealCards', (game, callback)=>{
        let deck = createDeck(game);
        game = startGame(game);
        game.players.forEach(player =>{
            let hand;
            [hand, deck] = dealToHand(deck, 10, (error)=>{
                console.log(erorr)
            });
            if (player.id===socket.id){
                socket.emit('newCards', {hand, game});
            } else{
                socket.broadcast.to(player.id).emit('newCards', {hand: hand, game:game});
            }
        });

    });
    
    socket.on('claimTrick', ({game, trick}, callback)=>{
        const player = getPlayerByIdInGame({id: socket.id, game: game});
        //const playerIndex = getIndexOfPlayer(game, player);
        game = claimTrick(game, trick, player);
        io.to(game.room).emit('gameUpdate', game);

     }); 

    // socket.on('nextPlayer', ({nextPlayer}, callback)=>{
    //     const player = getPlayer(socket.id);
    //     io.to(player.room).emit('nextPlayer', {nextPlayer});

    //  });        
     socket.on('playerPlaysCard', ({playerId, card, game, hand}, callback)=>{
       const data = playCard(playerId, card, game, hand);
        if(data.error) {
            return callback({error:data.error});
        } else {
            io.to(game.room).emit('gameUpdate', data.game);
            return callback({hand: data.hand})
        }

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
