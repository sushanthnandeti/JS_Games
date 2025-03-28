// game logic  --> adding eventlistener to the window load, for classes gets initialized as soon as window loads 

window.addEventListener('load', function() {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.height = 720;
    canvas.width = 1280;
    ctx.fillStyle = 'white';    
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';

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
}

class Egg {
    constructor(game) {
        this.game = game;
        this.collisionX = Math.random() * this.game.width;
        this.collisionY = Math.random() * this.game.height;
        this.collisionRadius = 40;
        this.spriteWidth = 110;
        this.spriteHeight = 135;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight; 
        this.spriteX = this.collisionX + this.width * 0.5; 
        this.spriteY = this.collisionY + this.height * 0.5;
        this.image = document.getElementById("egg");
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
        this.eggInterval = 500;
        this.interval = 1000/this.fps;
        this.player = new Player(this);
        this.mouse = {
            x : this.width * 0.5,
            y : this.height * 0.5,
            pressed : false
        }
        this.numberOfObstacles = 5;
        this.obstacles = [];
        this.eggs = [];
        this.maxEggs = 10;

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

            if(e.key == 'd') {
                this.debug = !this.debug;
            }        
        }); 
    }
    
    render(context, deltaTime) {

        if(this.timer > this.interval) {
            //animate the next frame
            ctx.clearRect(0,0,canvas.width, canvas.height);
            this.obstacles.forEach(obstacle => obstacle.draw(context));
            this.eggs.forEach(egg => egg.draw(context));
            this.player.draw(context);
            this.player.update();
            this.timer = 0
        }
        
        this.timer+=deltaTime;

        // add eggs periodically 

        if (this.eggTimer < this.eggInterval && this.eggs.length < this.maxEggs) {
            this.addEgg();
            this.eggTimer = 0;
            console.log(this.eggs);
        }
        else {  
            this.eggTimer += deltaTime;
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
    init() {
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