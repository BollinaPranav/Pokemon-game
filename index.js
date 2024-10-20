const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')


canvas.width = 1024
canvas.height = 600

const collisionsMap= [] 
for(let i= 0; i<collisions.length; i+=70)
{
    collisionsMap.push(collisions.slice(i,70 + i))
}

const battleZonesMap= [] 
for(let i= 0; i<battleZones.length; i+=70)
{
    battleZonesMap.push(battleZones.slice(i,70 + i))
}
console.log(battleZonesMap)



const boundaries= []
const offset = {
    x:-740,
    y:-600
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025)
        boundaries.push(new Boundary({position:{
            x:j*Boundary.width + offset.x,
            y:i*Boundary.height + offset.y
        }}))
    })
})

const battlezones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025)
        battlezones.push(new Boundary({position:{
            x:j*Boundary.width + offset.x,
            y:i*Boundary.height + offset.y
        }}))
    })
})

console.log(battlezones)

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()
image.src = './img/Pellet Town.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foreground.png'


const playerImage = new Image()
playerImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'




  const player = new Sprite({
    position: {
        x: canvas.width/2-256/4/2,
        y: canvas.height/2- 256/4 +70
    },
    image: playerImage,
    frames: {
        max:3.6,
        hold: 10,
        error: 7

    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerImage
    }
  })

const background = new Sprite({
    position:{
        x:-740,
        y:-600
    },
    image: image
    
})

const foreground = new Sprite({
    position:{
        x:offset.x,
        y:offset.y
    },
    image: foregroundImage
    
})


const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}
const testBoundary = new Boundary({
    position:{
        x: 400,
        y: 400
    }
})
const movables = [background, ...boundaries, foreground, ...battlezones]
function rectangularCollision({rectangle1, rectangle2}){
return(
    rectangle1.position.x+rectangle1.width-20>= rectangle2.position.x && 
    rectangle1.position.x +20 <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y +20 <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y+ rectangle1.height-20 >= rectangle2.position.y)
}

const battle = {
    initiated: false
}

function animate(){
    const animationID = window.requestAnimationFrame(animate)
    console.log(animationID)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    battlezones.forEach(battlezone =>{
        battlezone.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    if(battle.initiated) return
    //activate a battle

    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed)
    {
        for(let i = 0; i<battlezones.length; i++)
            {
                const battlezone = battlezones[i]
                const overlappingArea =  (Math.min(player.position.x+player.width, battlezone.position.x+battlezone.width) 
                - Math.max(player.position.x, battlezone.position.x))* (Math.min(player.position.y + player.height, battlezone.position.y + battlezone.height)
                - Math.max(player.position.y, battlezone.position.y))
                 
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: battlezone           
                }) &&
                overlappingArea > (player.width * player.height)/2  &&
                Math.random() < 0.01
                )
                {
                    console.log("activate battle")
                      // deactivate the above activated loop
                    window.cancelAnimationFrame(animationID)

                    battle.initiated = true
                    gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat:3,
                    yoyo: true,
                    duration: 0.3,
                    onComplete(){
                        gsap.to('#overlappingDiv',{
                            opacity: 1,
                            duration:0.3,
                            onComplete() {
                                  // activate a new animation loop
                        initBattle()          
                        animateBattle()
                        gsap.to('#overlappingDiv',{
                            opacity: 0,
                            duration:0.3,
                            
                        })
                        
                            }
                        })

                      

                      
                    }
                })
                    break
                }
            }
    }
    


        if(keys.w.pressed && lastkey ==='w') {
            player.animate = true
            player.image = player.sprites.up
            for(let i = 0; i<boundaries.length; i++)
            {
                const boundary = boundaries[i]
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: { //creates a clone of boundary without overriding the original
                        x: boundary.position.x,
                        y: boundary.position.y +3
                    
                    }}            
                }))
                {
                    moving = false
                    break
                }
            }
            if(moving)
            movables.forEach((movable) => {
                movable.position.y+=3
            })


        }
        else if(keys.a.pressed && lastkey ==='a') {
            player.animate = true
            player.image = player.sprites.left
            for(let i = 0; i<boundaries.length; i++)
            {
                const boundary = boundaries[i]
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: { //creates a clone of boundary without overriding the original
                        x: boundary.position.x+3,
                        y: boundary.position.y
                    
                    }}            
                }))
                {
                    moving = false
                    break
                }
            }

            for(let i = 0; i<battlezones.length; i++)
            {
                const battlezone = battlezones[i]
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: battlezone           
                }))
                {
                    console.log("battle zone collision detected")
                    break
                }
            }

            if(moving)
            movables.forEach((movable) => {
                movable.position.x+=3
            })
        }
        else if(keys.s.pressed && lastkey ==='s'){
            player.animate = true
            player.image = player.sprites.down
            for(let i = 0; i<boundaries.length; i++)
            {
                const boundary = boundaries[i]
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: { //creates a clone of boundary without overriding the original
                        x: boundary.position.x,
                        y: boundary.position.y -3
                    
                    }}            
                }))
                {
                    moving = false
                    break
                }
            }
            if(moving)
            movables.forEach((movable) => {
                movable.position.y-=3
            })        }
        else if(keys.d.pressed && lastkey ==='d'){
            player.animate = true
            player.image = player.sprites.right
            for(let i = 0; i<boundaries.length; i++)
            {
                const boundary = boundaries[i]
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: { //creates a clone of boundary without overriding the original
                        x: boundary.position.x-3,
                        y: boundary.position.y 
                    
                    }}            
                }))
                {
                    moving = false
                    break
                }
            }
            if(moving)
            movables.forEach((movable) => {
                movable.position.x-=3
            })        }
        
        
}
//animate()




let lastkey = ''
window.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = true
            lastkey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastkey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastkey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastkey = 'd'
            break
    }
})
window.addEventListener('keyup', (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
    console.log(keys)
})



