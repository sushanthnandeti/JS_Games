// game logic  --> adding eventlistener to the window load, for classes gets initialized as soon as window loads 

window.addEventListener('load', function() {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.height = 720;
    canvas.width = 1280;
    ctx.fillStyle = 'white';    
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.font = '40px Bangers';
    ctx.textAlign = 'center';

class Player {
    constructor(game) {
        this.game = game;
        this.collisionX = this.game.width * 0.5;
        this.collisionY = this.game.height * 0.5; 
        this.collisionRadius = 30;
        this.speedx = 0;
        this.speedY = 0;
        this.dx;
        this.dy;
        this.speedModifier = 10;
        this.spriteWidth = 255;
        this.spriteHeight = 256;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.spriteX = this.collisionX - this.width * 0.5;  
        this.spriteY = this.collisionY - this.height * 0.5;
        this.image = document.getElementById("bull");
        this.frameX = 0;
        this.frameY = 5;
        this.maxFrame = 58;
    
    }

    restart() {
        this.collisionX = this.game.width * 0.5;
        this.collisionY = this.game.height * 0.5; 
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5 - 100;

    }
    draw(context) {
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, 
                            this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
        if(this.game.debug) {
        context.beginPath();
        context.arc( this.collisionX,  this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save();             // saves the state of the canvas
        context.globalAlpha = 0.5;  // property to set the transparency on the drawings made on the canvas
        context.fill();
        context.restore();  // restore to the save state above
        context.stroke();
        context.beginPath();
        context.moveTo(this.collisionX, this.collisionY);
        context.lineTo(this.game.mouse.x, this.game.mouse.y);
        context.stroke();
        }
    }

    update() {
        this.dx = this.game.mouse.x - this.collisionX;
        this.dy = this.game.mouse.y - this.collisionY;

        // Sprite/ Player movement animation 

        const angle = Math.atan2(this.dy, this.dx);

        if (angle < -2.74 || angle > 2.74) this.frameY = 6;
        else if (angle < -1.96) this.frameY = 7;
        else if (angle < -1.17) this.frameY = 0;
        else if (angle < -0.39) this.frameY = 1;
        else if (angle < 0.39) this.frameY = 2;
        else if (angle < 1.17) this.frameY = 3;
        else if (angle < 1.96) this.frameY = 4;
        else if (angle < 2.74) this.frameY = 5;

        // player sprite animation --> Makes the player come alive

        if (this.frameX < this.maxFrame) {
            this.frameX++;
        }
        else {
            this.frameX = 0;
        }

        const distance = Math.hypot(this.dy, this.dx);
        this.speedModifier = 20;

        if(distance > this.speedModifier) {
            this.speedX = this.dx/distance || 0;
            this.speedY = this.dy/distance || 0;
        }
        else {
            this.speedX = 0;
            this.speedY = 0;
        }

        this.collisionX += this.speedX * this.speedModifier;
        this.collisionY += this.speedY * this.speedModifier;
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5 - 100;

        // horizontal boundaries 
        if(this.collisionX < this.collisionRadius) this.collisionX = this.collisionRadius; 
        else if (this.collisionX > this.game.width - this.collisionRadius) this.collisionX = this.game.width - this.collisionRadius; 

        // vertical boundaries
        if(this.collisionY < this.game.topMargin + this.collisionRadius) this.collisionY = this.game.topMargin + this.collisionRadius;
        else if (this.collisionY > this.game.height - this.collisionRadius) this.collisionY = this.game.height - this.collisionRadius;

        // Player collision with obstacles

        // [(sumOfRadii < distance), distance, sumOfRadii, dx, dy]

        this.game.obstacles.forEach( obstacle => {
            let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle);
            
            // let collision = game.checkCollision(this, obstacle)[0]
            // let distance = game.checkCollision(this, obstacle)[1]

            if(collision) {
                const unit_x = dx/distance; 
                const unit_y = dy/distance;
                this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
                this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;          
            }
        })
    }
}

class Obstacle {
    constructor (game) {
        this.game = game
        this.collisionX = Math.random() * this.game.width; 
        this.collisionY = Math.random() * this.game.height;
        this.collisionRadius = 40;
        this.image = document.getElementById("obstacles");
        this.spriteWidth = 250; 
        this.spriteHeight = 250; 
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.spriteX = this.collisionX - this.width * 0.5; 
        this.spriteY = this.collisionY - this.height * 0.5 - 50; 
        this.frameX = Math.floor(Math.random() * 4);
        this.frameY = Math.floor(Math.random() * 3);
        
    }

    draw(context) {
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, 
                          this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
        if (this.game.debug) {
        context.beginPath();
        context.arc( this.collisionX,  this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save();             // saves the state of the canvas
        context.globalAlpha = 0.5;  // property to set the transparency on the drawings made on the canvas
        context.fill();
        context.restore();  // restore to the save state above
        context.stroke();
        }
    }

    update() {

    }
}

class Egg {
    constructor(game) {
        this.game = game;
        this.image = document.getElementById("egg");
        this.collisionRadius = 40;
        this.margin = this.collisionRadius * 2;
        this.collisionX = this.margin + (Math.random() * (this.game.width - this.margin * 2));
        this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin - this.margin));
        this.spriteWidth = 110;
        this.spriteHeight = 135;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight; 
        this.spriteX;
        this.spriteY;
        this.gameObjects = [];
        this.hatchTimer = 0; 
        this.hatchInterval = 10000;
        this.markedForDeletion = false;
    }

    draw(context) {
        context.drawImage(this.image, this.spriteX, this.spriteY);
        if (this.game.debug) {
        context.beginPath();
        context.arc( this.collisionX,  this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save();             // saves the state of the canvas
        context.globalAlpha = 0.5;  // property to set the transparency on the drawings made on the canvas
        context.fill();
        context.restore();  // restore to the save state above
        context.stroke();
        const displayTimer = (this.hatchTimer * 0.001).toFixed(0);
        context.fillText(displayTimer, this.collisionX, this.collisionY - this.collisionRadius * 2.5);
}
    }

    update(deltaTime) {
        this.spriteX = this.collisionX - this.width * 0.5; 
        this.spriteY = this.collisionY - this.height * 0.5 - 30;

        // collisions logic
        let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.enemies];
        collisionObjects.forEach(object => {
            let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object);
            if (collision) {
                const unit_x = dx / distance; 
                const unit_y = dy / distance;
                this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x; 
                this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;

            }
        })

        // egg hatching logic 
        if (this.hatchTimer > this.hatchInterval || this.collisionY < this.game.topMargin) {
            this.game.hatchlings.push(new Larva(this.game, this.collisionX, this.collisionY));
            this.markedForDeletion = true; 
            this.game.removeGameObjects();
        }
        else {
            this.hatchTimer+= deltaTime;
        }
        
    }
}

class Enemy {
    constructor(game) {
        this.game = game;   
        this.speedX = Math.random() * 3 + 0.5;
        this.collisionRadius = 40;   
        this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin));
        this.spriteX; 
        this.spriteY;
        this.frameX = 0; 
        this.frameY = Math.floor(Math.random() * 4); 
        this.maxFrame = 38;
}

    draw(context) {
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight,
                           this.spriteX, this.spriteY, this.width, this.height);
        if (this.game.debug) {
            context.beginPath();
            context.arc( this.collisionX,  this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            context.save();             // saves the state of the canvas    
            context.globalAlpha = 0.5;  // property to set the transparency on the drawings made on the canvas
            context.fill();
            context.restore();  // restore to the save state above
            context.stroke();
        }
    }

    update() {

        // sprite animation 

        if (this.frameX < this.maxFrame) {
            this.frameX++;
        }
        else {
            this.frameX = 0;
        }
        this.spriteX = this.collisionX - this.width * 0.5;
        //this.spriteY = this.collisionY - this.height + 40;
        this.collisionX -= this.speedX;
        if (this.spriteX + this.width < 0 && !this.game.gameOver) {
            this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
            this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin));
            this.frameX = Math.floor(Math.random() * 2); 
            this.frameY = Math.floor(Math.random() * 4);
        }

        let collisionObjects = [this.game.player, ...this.game.obstacles];
        collisionObjects.forEach(object => {
            let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object);
            if (collision) {
                const unit_x = dx / distance; 
                const unit_y = dy / distance;
                this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x; 
                this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
            }
        })
     }

}

class Toadskin extends Enemy{
    constructor(game) {
        super(game);
        this.image = document.getElementById("toadskin");
        this.spriteHeight = 238; 
        this.spriteWidth = 154; 
        this.width = this.spriteWidth; 
        this.height = this.spriteHeight;
        this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
    }
    update() {
        super.update();
        this.spriteY = this.collisionY - this.height/2 - 90;
    }
}

class Barkskin extends Enemy {
    constructor(game) {
        super(game);
        this.image = document.getElementById("barkskin");
        this.spriteHeight = 280; 
        this.spriteWidth = 183; 
        this.width = this.spriteWidth; 
        this.height = this.spriteHeight;
        this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
    }
    update() {
        super.update();
        this.spriteY = this.collisionY - this.height/2 - 100;
    }
}

class Larva { 
    constructor(game, x, y) {
        this.game = game; 
        this.image = document.getElementById("larva_sprite");
        this.collisionRadius = 40;
        this.collisionX = x;
        this.collisionY = y; 
        this.spriteWidth = 150; 
        this.spriteHeight = 150;
        this.width = this.spriteWidth; 
        this.height = this.spriteWidth;
        this.spriteX; 
        this.spriteY;
        this.frameX = 0; 
        this.frameY = Math.floor(Math.random() * 2);
        this.speedY = 1 + Math.random();
        this.maxFrame = 38;
    }

    draw(context) {
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 
                            this.spriteX, this.spriteY, this.width, this.height );

        if (this.game.debug) {
            context.beginPath();
            context.arc( this.collisionX,  this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            context.save();             // saves the state of the canvas
            context.globalAlpha = 0.5;  // property to set the transparency on the drawings made on the canvas
            context.fill();``
            context.restore();  // restore to the save state above
            context.stroke();
        }
    }

    update() {
        this.collisionY-= this.speedY;
        this.spriteX = this.collisionX - this.width * 0.5; 
        this.spriteY = this.collisionY - this.width * 0.5 - 40;

        // move to safety 

        if (this.collisionY < this.game.topMargin) {
            this.markedForDeletion = true;
            this.game.removeGameObjects();
            if (!this.game.gameOver) this.game.score++;  // score is added only if the gameover is false

            // firefly appearance logice 
            for (let i = 0; i < 3 ; i++) {
                this.game.particles.push(new FireFly(this.game, this.collisionX, this.collisionY, 'yellow'));
            }      
        }

        // Larva sprite animation --> Makes the larva come alive

        if (this.frameX < this.maxFrame) {
            this.frameX++;
        }
        else {
            this.frameX = 0;
        }
        // collision with obstacles
        let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.eggs];
        collisionObjects.forEach(object => {
            let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object);
            if (collision) {
                const unit_x = dx / distance; 
                const unit_y = dy / distance;
                this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x; 
                this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;

            }
        })

        // collision with enemies

        this.game.enemies.forEach(enemy => {
            if (this.game.checkCollision(this, enemy)[0] && !this.game.gameOver) {
                this.markedForDeletion = true;
                this.game.removeGameObjects();
                this.game.lostHatchlings++;

                // when enemies eat the larvae
                for (let i = 0; i < 5 ; i++) {
                    this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY, 'blue'));
                }   

            }
        })
    }
}

class Particle {
    constructor(game, x, y, color) { 
        this.game = game; 
        this.collisionX  = x;
        this.collisionY = y; 
        this.color = color; 
        this.radius = Math.floor(Math.random() * 10 + 5);
        this.speedX = Math.random() * 6 - 3; 
        this.speedY = Math.random() * 2 + 0.5; 
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.001;  // angle velocity for each animation frame
        this.markedForDeletion = false;
    }

    draw(context) {
        context.save();
        context.fillStyle = this.color; 
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.restore();
    }
}

class FireFly extends Particle {
    
    update() {
        this.angle += this.va;
        this.collisionX += Math.cos(this.angle) * this.speedX; 
        this.collisionY -= this.speedY; 
        if (this.collisionY < 0 - this.radius) {
            this.markedForDeletion = true; 
            this.game.removeGameObjects();
        }   
    }
}

class Spark extends Particle {

    update() {
        this.angle += this.va; 
        this.collisionX -= Math.cos(this.angle) * this.speedX;
        this.collisionY -= Math.sin(this.angle) * this.speedY;

        if(this.radius > 0.1) this.radius -= 0.05; 
        if(this.radius < 0.2) {
            this.markedForDeletion = true; 
            this.game.removeGameObjects();
        }
    }
}


class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.height = this.canvas.height;
        this.width = this.canvas.width;
        this.topMargin = 260;
        this.debug = true;
        this.fps = 60;
        this.timer = 0;
        this.eggTimer = 0;
        this.eggInterval = 1000;
        this.interval = 1000/this.fps;
        this.player = new Player(this);
        this.mouse = {
            x : this.width * 0.5,
            y : this.height * 0.5,
            pressed : false
        }
        this.numberOfObstacles = 5;
        this.obstacles = [];
        this.enemies = [];
        this.eggs = [];
        this.maxEggs = 5;
        this.hatchlings = [];
        this.particles = [];
        this.score = 0;
        this.winningScore = 30;
        this.lostHatchlings = 0;
        this.gameOver = false;

        // ES6 arrow functions automatically inherit the 'this' keyword from the parent class/scope
        canvas.addEventListener('mousedown', (e) => {

                this.mouse.x = e.offsetX; 
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
        });  

        canvas.addEventListener('mouseup', (e) => {

                this.mouse.x = e.offsetX; 
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false; 
        });  
            
        canvas.addEventListener('mousemove', (e) => {

            if(this.mouse.pressed) {
                this.mouse.x = e.offsetX; 
                this.mouse.y = e.offsetY;
            }        
        }); 

        window.addEventListener('keydown', (e) => {

            if(e.key == 'd') this.debug = !this.debug;
            else if(e.key == 'r') this.restart();
            else if(e.key == 'c') console.log(this.gameObjects);
            else if(e.key == 'f') this.toggleFullScreen();
            
        }); 
    }
    
    render(context, deltaTime) {

        if(this.timer > this.interval) {
            //animate the next frame
            ctx.clearRect(0,0,canvas.width, canvas.height);
            this.gameObjects = [...this.obstacles, ...this.eggs, this.player, ...this.enemies, 
                                    ...this.hatchlings, ...this.particles];

            // sort the elements/objects based on the vertical values 

            this.gameObjects.sort((a,b) => {
                return a.collisionY - b.collisionY;
            });

            this.gameObjects.forEach(object => {
                object.draw(context);
                object.update(deltaTime);
            });
            
            this.timer = 0;
        }
        
        this.timer+=deltaTime;

        // add eggs periodically 

        if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs && !this.gameOver) {
            this.addEgg();
            this.eggTimer = 0;
        }
        else {  
            this.eggTimer += deltaTime;
        }

        // display the score status on the canvas 
        context.save();
        context.textAlign = 'left';
        context.fillText('Score: ' + this.score, 25, 50);
        if (this.debug) {
            context.fillText('Lost: ' + this.lostHatchlings, 25, 100);
        }
        context.fillText('Target: ' + this.winningScore, 25, 150);
        context.restore();

        // win or lose logic 

        if(this.score >= this.winningScore) {
            this.gameOver = true;
            context.save();
            context.fillStyle = 'rgba(0,0,0,0.5)';
            context.fillRect(0,0,this.width, this.height);
            context.restore();
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.shadowOffsetX = 4;
            context.shadowOffsetY = 4;
            context.shadowColor = 'black';
            let message1; 
            let message2; 

            if (this.lostHatchlings <= 2) {
                message1 = 'Congratulations!';
                message2 = 'You saved all the hatchlings!'
            }
            else{
                message1 = 'Damn Bruh!';
                message2 = ' You lost ' + this.lostHatchlings + 'hatchlings';
            }

            context.font = '120px Bangers';
            context.fillText(message1, this.width * 0.5, this.height * 0.5 - 20);
            context.font = '40px Bangers';
            context.fillText(message2, this.width * 0.5, this.height * 0.5 + 30);
            context.fillText("Final Score " + this.score +  ". Press 'R' to restart the game ",  
                                this.width * 0.5, this.height * 0.5 + 80);
            context.restore();
        }
    }

    checkCollision(a,b) {
        const dx = a.collisionX - b.collisionX;
        const dy = a.collisionY - b.collisionY;
        const distance = Math.hypot(dy,dx); 
        const sumOfRadii = a.collisionRadius + b.collisionRadius; 

        return [(distance < sumOfRadii), distance, sumOfRadii, dx, dy];
    }

    addEgg() {
        this.eggs.push(new Egg(this))
    }

    addEnemy() {
        if (Math.random() > 0.5) this.enemies.push(new Toadskin(this));
        else this.enemies.push(new Barkskin(this));
    }

    removeGameObjects() {
        this.eggs = this.eggs.filter(object => !object.markedForDeletion);
        this.hatchlings = this.hatchlings.filter(object => !object.markedForDeletion);
        this.particles = this.particles.filter(object => !object.markedForDeletion);
    }

    toggleFullScreen() {
        if(!document.fullscreenElement) {
            document.documentElement.fullscreenElement();
        }
        else if (document.fullscreenElement) {
            document.exitFullscreen;
        }
    }

    restart() {
        this.player.restart();  
        this.obstacles = [];
        this.enemies = [];
        this.eggs = [];
        this.maxEggs = 5;
        this.hatchlings = [];
        this.particles = [];
        this.mouse = {
            x : this.width * 0.5,
            y : this.height * 0.5,
            pressed : false
        }
        this.score = 0;
        this.lostHatchlings = 0;
        this.gameOver = false;
        this.init();
    }

    init() {
        for (let i=0; i<5; i++) {
            this.addEnemy();
            console.log(this.enemies);  
        }
        // Collision detection algorithm to avoid objects overlap
        let attempts = 0; 
        while (this.obstacles.length < this.numberOfObstacles && attempts <500) {
            let testObstacle = new Obstacle(this);
            let overlap = false;
            this.obstacles.forEach(obstacle => {    
                const dx = testObstacle.collisionX - obstacle.collisionX;
                const dy = testObstacle.collisionY - obstacle.collisionY;
                const distance = Math.hypot(dy,dx);
                const distanceBuffer = 100;
                const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffer;
                
                if (distance < sumOfRadii) {
                    overlap = true;
                }
            });

            const margin = testObstacle.collisionRadius * 3;

            if (!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width
                && testObstacle.collisionY > this.topMargin + margin && testObstacle.collisionY < this.height - margin) 
            {
                this.obstacles.push(testObstacle);
            }   
            attempts++;
        }
        }
    }

const game = new Game(canvas);
game.init()
console.log(game)

let lastTime = 0;

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.render(ctx, deltaTime);
    window.requestAnimationFrame(animate);
}

animate(0);

})