class Sprite {
    constructor({ position, velocity, image, frames = { max: 1, hold: 10, error: 0 }, sprites, animate = false, rotation = 0 }) {
        this.position = position;
        this.image = new Image()
        this.frames = { ...frames, val: 0, elapsed: 0 };
        this.image.onload = () => {
            // Calculate the width based on the image and frame count
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
        this.image.src = image.src
        
        this.animate = animate;
        this.sprites = sprites;
        this.opacity = 1;
        this.rotation = rotation
        
    }

    draw() {
        c.save();
        c.translate(this.position.x + this.width / 2,this.position.y + this.height/2)
        c.rotate(this.rotation)
        c.translate(-this.position.x - this.width / 2,-this.position.y - this.height/2)
        c.globalAlpha = this.opacity;

        // Draw the correct frame of the sprite
        c.drawImage(
            this.image,
            this.frames.val * this.width, // Source x-coordinate for the current frame
            0,
            this.width, // Width of the current frame
            this.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        c.restore();

        if (this.animate) {
            if (this.frames.max > 1) {
                this.frames.elapsed++;
            }

            // Update the frame when it's time to switch
            if (this.frames.elapsed % this.frames.hold === 0) {
                if (this.frames.val < this.frames.max - 1) {
                    this.frames.val++;
                } else {
                    this.frames.val = 0;
                }
            }
        }
    }

    
}

class Monster extends Sprite {
    constructor({
        position, velocity, image, frames = { max: 1, hold: 10, error: 0 }, sprites, animate = false, rotation = 0, isEnemy=false, name, attacks
    }){
        super({
            position,
      velocity,
      image,
      frames,
      sprites,
      animate,
      rotation
        })
        this.health = 100;
        this.isEnemy = isEnemy;
        this.name = name
        this.attacks = attacks
    }

    faint(){
        document.querySelector('#dialogueBox').innerHTML = this.name +" fainted! "
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this,{
            opacity: 0
        })
    }

    attack({ attack, recipient, renderedSprites }) {
        document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = this.name +" used "+ attack.name

        let healthBar = '#enemyHealthBar';
        if (this.isEnemy) healthBar = '#playerHealthBar';
        let rotation = 1
        if (this.isEnemy) rotation = -2
        recipient.health -= attack.damage;

        switch (attack.name) {
            case 'Flamethrower':
                const flamethrowerImage = new Image();
                flamethrowerImage.src = './img/fireball.png';
                console.log("Flamethrower attack triggered");

                // Create the fireball sprite
                const flamethrower = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: flamethrowerImage,
                    frames: {
                        max: 4, // Assume fireball has 4 frames
                        hold: 15 // Animation speed
                    },
                    animate: true,
                    rotation
                });

                console.log("Fireball created with frames:", flamethrower.frames);
                renderedSprites.splice(1,0,flamethrower)

                gsap.to(flamethrower.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    duration: 1.5,
                    onComplete: () => {
                        // Update health bar and handle recipient hit animation
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        });
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 25,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.09,
                        });
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.09
                        });
                        renderedSprites.splice(1,1)
                    }
                })

                break;

            case 'Tackle':
                const tl = gsap.timeline();
                
                let movementDistance = 20;
                if (this.isEnemy) movementDistance = -20;
                

                tl.to(this.position, {
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + 2 * movementDistance,
                    duration: 0.1,
                    onComplete: () => {
                        // Update health bar and handle recipient hit animation
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        });
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 25,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.09,
                        });
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.09
                        });
                    }
                }).to(this.position, {
                    x: this.position.x
                });

                break;
        }
    }

}

class Boundary{
    static width = 48
    static height = 48
    constructor({position}){
        this.position= position
        this.width= 48
        this.height = 48
    }
    draw(){
        c.fillStyle = 'rgba(255, 0, 0, 0.5)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}