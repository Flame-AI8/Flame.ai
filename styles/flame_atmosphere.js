window.onload = function() {
    const canvas = document.getElementById('fireCanvas');
    const ctx = canvas.getContext('2d');
    const buttons = document.querySelectorAll('.glow-target');

    canvas.width = 1350;
    canvas.height = 1350;

    let particles = [];
    let sparks = [];

    const sparkSound = new Audio('https://www.myinstants.com/media/sounds/spark.mp3');
    function playSpark() {
        const s = sparkSound.cloneNode();
        s.volume = 0.1;
        s.playbackRate = 0.8 + Math.random();
        s.play().catch(() => {});
    }

    class FireParticle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * 250;
            this.y = canvas.height;
            this.size = Math.random() * 80 + 40;
            this.speedY = Math.random() * 5 + 3;
            this.speedX = Math.random() * 4 + 1; // Diagonal
            this.life = 1;
            this.decay = Math.random() * 0.007 + 0.003;
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.life -= this.decay;
            if (this.life <= 0) this.reset();
        }
        draw() {
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = `rgba(255, ${this.life * 150}, 0, ${this.life})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Spark {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * 150;
            this.y = canvas.height - 100;
            this.sx = (Math.random() - 0.1) * 15;
            this.sy = -(Math.random() * 20 + 5);
            this.life = 1;
        }
        update() {
            this.x += this.sx;
            this.y += this.sy;
            this.sy += 0.3; // Gravity
            this.life -= 0.02;
            if (this.life <= 0) {
                this.reset();
                if(Math.random() > 0.85) playSpark();
            }
        }
        draw() {
            ctx.fillStyle = `rgba(255, 200, 50, ${this.life})`;
            ctx.fillRect(this.x, this.y, 2, 2);
        }
    }

    for(let i=0; i<120; i++) particles.push(new FireParticle());
    for(let i=0; i<15; i++) sparks.push(new Spark());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Lighting flash logic
        let flash = Math.random() > 0.985;
        if (flash) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(0,0, canvas.width, canvas.height);
        }

        particles.forEach(p => { p.update(); p.draw(); });
        sparks.forEach(s => { s.update(); s.draw(); });

        // Pulse the Blue buttons based on fire "energy"
        buttons.forEach(btn => {
            if (flash || Math.random() > 0.8) btn.classList.add('active-glow');
            else btn.classList.remove('active-glow');
        });

        requestAnimationFrame(animate);
    }

    animate();
};
