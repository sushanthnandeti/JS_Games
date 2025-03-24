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
        this.dx;
        this.dy;
    }

    draw(context) {
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

    update() {
        this.dx = this.game.mouse.x - this.collisionX;
        this.dy = this.game.mouse.y - this.collisionY;
        const distance = Math.hypot(this.dy, this.dx);

        if(distance > this.speedModifier) {
            this.speedX = this.dx/distance || 0;
            this.speedY = this.dy/distance || 0;
        }
        else {
            this.speedX = 0;
            this.speedY = 0;
        }

        this.collisionX += this.speedX;
        this.collisionY += this.speedY;
        this.speedModifier = 20;
    }
}

class Obstacle {
    constructor (game) {
        this.game = game
        this.collisionX = Math.random() * this.game.width; 
        this.collisionY = Math.random() * this.game.height;
        this.collisionRadius = 60;
        this.image = document.getElementById("obstacles");
        this.spriteWidth = 250; 
        this.spriteHeight = 250; 
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.spriteX = this.collisionX - this.width * 0.5; 
        this.spriteY = this.collisionY - this.height * 0.5 - 50; 
    }

    draw(context) {
        context.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
        context.beginPath();
        context.arc( this.collisionX,  this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save();             // saves the state of the canvas
        context.globalAlpha = 0.5;  // property to set the transparency on the drawings made on the canvas
        context.fill();
        context.restore();  // restore to the save state above
        context.stroke();
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.height = this.canvas.height;
        this.width = this.canvas.width;
        this.player = new Player(this);
        this.mouse = {
            x : this.width * 0.5,
            y : this.height * 0.5,
            pressed : false
        }
        this.numberOfObstacles = 2;
        this.obstacles = [];

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
    }
    
    render(context) {
        this.player.draw(context);
        this.player.update();
        this.obstacles.forEach(obstacle => obstacle.draw(context));
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
                const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius;
                
                if (distance < sumOfRadii) {
                    overlap = true;
                }
            });
            if (!overlap) {
                this.obstacles.push(testObstacle);
            }
            attempts++;
        }
        }
    }

const game = new Game(canvas);
game.init()
console.log(game)


function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    game.render(ctx);
    window.requestAnimationFrame(animate);
}

animate();

})