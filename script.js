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
        this.collisionRadius = 30
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
        this.speedX = (this.game.mouse.x - this.collisionX)/20;
        this.speedY = (this.game.mouse.y - this.collisionY)/20;
        this.collisionX += this.speedX;
        this.collisionY += this.speedY;
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

            this.mouse.x = e.offsetX; 
            this.mouse.y = e.offsetY;
        
        }); 
    }
    
    render(context) {
        this.player.draw(context);
        this.player.update();
    }
}

const game = new Game(canvas);

function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    game.render(ctx);
    window.requestAnimationFrame(animate);
}

animate();

})