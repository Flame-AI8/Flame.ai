window.onload = function() {
    const canvas = document.getElementById('fireCanvas');
    const ctx = canvas.getContext('2d');
    const buttons = document.querySelectorAll('.glow-target');

    canvas.width = 1400;
    canvas.height = 1400;

    let particles = [];
    let sparks = [];

    const sparkSound = new Audio('https://www.myinstants.com');
    
    function playSpark() {
        const s = sparkSound.cloneNode();
        s.volume = 0.05;
        s.playbackRate = 0.8 + Math.random();
        s.play().catch(() => {});
    }

    class FireParticle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * 300;
            this.y = canvas.height;
            this.size = Math.random() * 100 + 50;
            this.speedY = Math.random() * 4 + 2;
            this.speedX = Math.random() * 3 + 1;
            this.life = 1;
            this.decay = Math.random() * 0.006 + 0.002;
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.life -= this.decay;
            if (this.life <= 0) this.reset();
        }
        draw() {
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = `rgba(255, ${this.life * 140}, 0, ${this.life})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Spark {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * 200;
            this.y = canvas.height - 50;
            this.sx = (Math.random() - 0.1) * 12;
            this.sy = -(Math.random() * 18 + 4);
            this.life = 1;
        }
        update() {
            this.x += this.sx;
            this.y += this.sy;
            this.sy += 0.25;
            this.life -= 0.015;
            if (this.life <= 0) {
                this.reset();
                if(Math.random() > 0.92) playSpark();
            }
        }
        draw() {
            ctx.fillStyle = `rgba(255, 210, 80, ${this.life})`;
            ctx.fillRect(this.x, this.y, 2.5, 2.5);
        }
    }

    for(let i=0; i<100; i++) particles.push(new FireParticle());
    for(let i=0; i<20; i++) sparks.push(new Spark());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let flash = Math.random() > 0.99;
        if (flash) {
            ctx.fillStyle = 'rgba(255, 100, 0, 0.08)';
            ctx.fillRect(0,0, canvas.width, canvas.height);
        }

        particles.forEach(p => { p.update(); p.draw(); });
        sparks.forEach(s => { s.update(); s.draw(); });

        buttons.forEach(btn => {
            if (flash || Math.random() > 0.97) {
                btn.classList.add('active-glow');
            } else if (Math.random() > 0.8) {
                btn.classList.remove('active-glow');
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
};
