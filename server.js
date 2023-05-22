require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();
const helmet = require ('helmet');
const { default: Player } = require('./public/Player.mjs');
const  Collectible = require('./public/Collectible.mjs');

//protection with helmet 
app.use(helmet({
  noCache:true,
  hidePoweredBy:{
    setTo:"PHP 7.4.3"
  }
}))
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

//socket 

let playersList=[]

const io = new socket(server)
let ran=Math.floor(Math.random() * (630 - 20 + 1)) + 10
let rany=Math.floor(Math.random() * (460 - 20 + 1)) + 10
let coin = new Collectible({x:ran,y:rany,value:1,id:1})

io.on('connection',(socket)=>{
  console.log('connect',socket.id)
  let ran=Math.floor(Math.random() * (620 - 20 + 1)) + 20
  let rany=Math.floor(Math.random() * (450 - 20 + 1)) + 20

  let player= new Player({x:ran,y:rany,score:0,id:socket.id})
  
  //push player to list
  playersList.push(player)
  //emite list and coin
  socket.emit("join",playersList,coin)
 
  socket.on('disconnect',()=>{
    playersList=playersList.filter(p=>p.id!=socket.id)
    console.log('disconenct',socket.id)
  })
 
//update information with information sent
  socket.on('move',(localBear)=>{
    playersList.forEach(play=>{
      if (play.id==localBear.id){
        play.x=localBear.x
        play.y=localBear.y
      }
      
    })//clsure of forEach
    

    function info(){
      socket.emit('new_pos',playersList,coin)
    }
    //send information by framerate 10 per second
    setInterval(info,1000/10)
  })

  //what to do with new coin in colission 
  socket.on('newCoin',(coinClient,localBear)=>{

    coin= new Collectible (coinClient)
    //update score
    playersList.forEach(play=>{
      if(play.id==localBear.id){
        play.score+=coinClient.value
        
      }
    })
    
  })//clsure 
 
 
})//closure of io



module.exports = app; // For testing
