import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

//width:640, heigh:480
context.font = "bold 20px Comic Sans MS";

//global variables 
let bearId;
let localBear;
let bearImage = new Image()
    bearImage.src='./public/bear.png'
let background= new Image()
    background.src='./public/back.jpg'
let coinImage = new Image()
    coinImage.src='./public/coin1.png'

let players; 
let coinClient;
        

 //function to update
function drawPlayers(img,img2,context,list,img3,coin,localpleyer){
    context.clearRect(0, 0, canvas.width, canvas.height)//clear canvas
    context.drawImage(img2,0,0,canvas.width,canvas.height)//draw background
    context.drawImage(img3,coin.x,coin.y,30,30)//draw coin
    let rank=localpleyer.calculateRank(list)
    context.fillText(rank,500,20)//draw rank

    list.forEach((p,index)=>{
        
        let name=`Player ${index+1}`
        context.fillStyle = "rgb(0, 0, 0)"
        context.fillText(name,p.x,p.y-2)
        context.drawImage(img,p.x,p.y,80,70)
        
    })//draw bear players
   
   
}


//sockets 
socket.on('connect',()=>{
        bearId=socket.id
        
           })
       
socket.on('join',(playersList,coin)=>{
        coinClient = new Collectible(coin)
        players=playersList
        localBear = players.filter(x => x.id === bearId)[0]
        localBear = new Player(localBear)
        background.onload=()=>{
            drawPlayers(bearImage,background,context,players,coinImage,coin,localBear)}
      
      //drawPlayers(bearImage,background,context,players,coinImage, coin,localBear) 
    })
//function to do on keypress
    document.addEventListener("keydown",(e)=>{
        
        let keypressed;
        if (e.key == "ArrowUp"){
            keypressed='up'
        }
        if (e.key == "ArrowDown"){
            keypressed='down'
        }
        if (e.key == "ArrowLeft"){
            keypressed='left'
        }
        if (e.key == "ArrowRight"){
            keypressed='right'
        }
        
        localBear.movePlayer(keypressed,5)
        socket.emit("move",localBear)
        //if collision occurs
        if(localBear.collision(coinClient)){
           // console.log('it detected colission')
            let ran=Math.floor(Math.random() * (630 - 10 + 1)) + 10
            let rany=Math.floor(Math.random() * (470 - 10 + 1)) + 10
            let newCoin= new Collectible({x:ran,y:rany,value:1,id:1})
            coinClient=newCoin
            socket.emit('newCoin',coinClient,localBear)
           
        }
    
    })
    
//socket to update frame. Recieves information from server with setinterval 
    socket.on('new_pos',(playersList,coin)=>{
        coinClient= new Collectible(coin)
        window.requestAnimationFrame(()=>{
            drawPlayers(bearImage,background,context,playersList,coinImage,coin,localBear)
        })
        
    })
   


    
     
   
        
        

        
        
   



