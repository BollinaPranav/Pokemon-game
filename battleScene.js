const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBG.png'
const battleBackground = new Sprite({position:{
    x:0, 
    y:0
},
image: battleBackgroundImage
})


let caterpi 
let charmander
let renderedSprites
let battleAnimationId
let queue

function initBattle(){
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()



    caterpi = new Monster(monsters.Caterpi)
    charmander = new Monster(monsters.Charmander)
    renderedSprites = [caterpi, charmander]
    queue = []

    charmander.attacks.forEach((attack) => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })
    //event listeners fr buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click',(e)=>{
        const selectedAttack = attacks[e.srcElement.innerHTML]
        charmander.attack({
        attack: selectedAttack,
        recipient: caterpi,
        renderedSprites
    })

    if(caterpi.health <= 0){
        queue.push(()=>{
            caterpi.faint()
            })
        queue.push(()=>{
            gsap.to('#overlappingDiv', {
                opacity:1,
                onComplete: () =>{
                    cancelAnimationFrame(battleAnimationId)
                    animate()
                    document.querySelector('#userInterface').style.display = 'none'
                    gsap.to('#overlappingDiv',{
                        opacity: 0
                    })

                    battle.initiated = false
                }
            })
            }) 
    }
        
    const randomAttack = caterpi.attacks[Math.floor(Math.random() * caterpi.attacks.length)]
    queue.push(()=>{
        caterpi.attack({
            attack: randomAttack,
            recipient: charmander,
            renderedSprites
        })

        if(charmander.health <= 0){
            queue.push(()=>{
                charmander.faint()
                }) 
                queue.push(()=>{
                    gsap.to('#overlappingDiv', {
                        opacity:1,
                        onComplete: () =>{
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#overlappingDiv',{
                                opacity: 0
                            })

                            battle.initiated = false
                        }
                    })
                    }) 
        }
    })    
})
  button.addEventListener('mouseenter',(e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML]
    document.querySelector('#attackType').innerHTML = selectedAttack.type
    document.querySelector('#attackType').style.color = selectedAttack.color
  })
})
}

function animateBattle(){
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    console.log(battleAnimationId);

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

animate()
// initBattle()
// animateBattle()

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
      queue[0]()
      queue.shift()
    } else e.currentTarget.style.display = 'none'
  })
