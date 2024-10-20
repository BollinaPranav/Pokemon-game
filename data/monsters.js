

const monsters = {
    Caterpi: {
        position: {
            x: 730,
            y: 300
        },
        image: {
            src: './img/caterpi1.png'
        },
        frames: {
            max: 8,
            hold: 10,
            error: 0
        },
        animate: true,
        isEnemy: true,
        name: 'caterpi',
        attacks: [attacks.Tackle,attacks.Flamethrower]
    },
    Charmander: {
        position: {
            x: 150,
            y: 400
        },
        image: {
            src: './img/charmanderBattle1d.png'
        },
        frames: {
            max: 10,
            hold: 15,
            
        },
        animate: true,
        name: 'charmander',
        attacks: [attacks.Tackle,attacks.Flamethrower]
    }
}