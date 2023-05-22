class Player {
  constructor({x, y, score, id}) {
    this.x=x,
    this.y=y,
    this.score=score,
    this.id=id
  }

  movePlayer(dir, speed) {
     if (dir=="up"){
      this.y-=speed
    }
    if (dir=="down"){
      this.y+=speed
    }
    if (dir=="left"){
      this.x-=speed
    }
    if (dir=="right"){
      this.x+=speed
    }
  }

  collision(item) {
    
    if (item.x-10<this.x&item.x+10>this.x&item.y+10>this.y&item.y-10<this.y){
      return true
    }

  }

  calculateRank(arr) {
    let arr1=[...arr]
    arr1.sort((a,b)=>b.score-a.score)
    let totalPlayers=arr1.length
    let currentRanking;
    arr1.forEach((play,index)=> {
      if(play.id==this.id){
        currentRanking=index+1
      }
    })
   
    return `Rank: ${currentRanking}/${totalPlayers}`
    
  }
}

export default Player;
