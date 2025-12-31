// countdown.js - 简单倒计时 + 粒子效果

// 获取系统时间并计算倒计时
class SimpleCountdown {
    constructor(targetDate) {
        // 目标时间：2024年12月31日 14:00:00
        this.targetDate = new Date('2026-01-01T00:00:00');
        
        // 获取显示元素
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        
        // 粒子系统相关
        this.particles = [];
        this.particlesActive = false;
        this.animationFrameId = null;
        
        // 如果找不到元素，则退出
        if (!this.daysElement || !this.hoursElement || !this.minutesElement || !this.secondsElement) {
            console.warn('倒计时元素未找到，请检查HTML结构');
            return;
        }
        
        // 初始化粒子Canvas
        this.initParticlesCanvas();
        
        // 立即开始倒计时
        this.startCountdown();
    }
    
    initParticlesCanvas() {
        // 检查是否已有Canvas
        let canvas = document.getElementById('particlesCanvas');
        
        if (!canvas) {
            // 创建新的Canvas元素
            canvas = document.createElement('canvas');
            canvas.id = 'particlesCanvas';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '1';
            
            // 添加到倒计时容器中
            const countdownSection = document.querySelector('.countdown-section');
            if (countdownSection) {
                countdownSection.appendChild(canvas);
            }
        }
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 设置Canvas尺寸
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    startCountdown() {
        // 立即更新一次
        this.updateCountdown();
        
        // 每秒更新一次
        setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
    
    updateCountdown() {
        const now = new Date();
        const timeDiff = this.targetDate.getTime() - now.getTime();
        
        // 如果时间已过
        if (timeDiff < 0) {
            this.showExpired();
            return;
        }
        
        // 计算天、时、分、秒
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        // 更新显示
        this.daysElement.textContent = this.padNumber(days);
        this.hoursElement.textContent = this.padNumber(hours);
        this.minutesElement.textContent = this.padNumber(minutes);
        this.secondsElement.textContent = this.padNumber(seconds);
        
        // 在最后10秒时添加闪烁效果
        if (timeDiff < 10000 && timeDiff > 0) {
            this.addLastSecondsEffect();
        }
    }
    
    showExpired() {
        this.daysElement.textContent = '00';
        this.hoursElement.textContent = '00';
        this.minutesElement.textContent = '00';
        this.secondsElement.textContent = '00';
        
        // 显示活动已开始
        const timerContainer = document.getElementById('countdownTimer');
        if (timerContainer) {
            timerContainer.classList.add('countdown-ended');
            timerContainer.innerHTML = '<div class="event-ended">欢迎来到2026年!!!!!</div>';
        }
        
        // 启动粒子效果
        this.startParticlesEffect();
        
        // 添加庆祝横幅
        this.addCelebrationBanner();
        
        // 添加音效提示（可选）
        this.playCelebrationSound();
    }
    
    startParticlesEffect() {
        if (this.particlesActive) return;
        
        this.particlesActive = true;
        this.particles = [];
        
        // 创建大量粒子
        this.createParticles(200);
        
        // 开始动画循环
        this.animateParticles();
        
        // 30秒后停止粒子效果
        setTimeout(() => {
            this.stopParticlesEffect();
        }, 30000);
    }
    
    createParticles(count) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', 
            '#118AB2', '#EF476F', '#FFD166', '#06D6A0'
        ];
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 5 + 1,
                speedX: (Math.random() - 0.5) * 5,
                speedY: (Math.random() - 0.5) * 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.5 + 0.5,
                life: 100 + Math.random() * 100
            });
        }
    }
    
    animateParticles() {
        if (!this.particlesActive) return;
        
        // 清除Canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制每个粒子
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // 更新位置
            p.x += p.speedX;
            p.y += p.speedY;
            
            // 生命值减少
            p.life -= 0.5;
            
            // 边界检测，粒子反弹
            if (p.x <= 0 || p.x >= this.canvas.width) p.speedX *= -0.8;
            if (p.y <= 0 || p.y >= this.canvas.height) p.speedY *= -0.8;
            
            // 如果粒子生命值耗尽，重新生成
            if (p.life <= 0) {
                p.x = Math.random() * this.canvas.width;
                p.y = Math.random() * this.canvas.height;
                p.life = 100 + Math.random() * 100;
                p.speedX = (Math.random() - 0.5) * 5;
                p.speedY = (Math.random() - 0.5) * 5;
            }
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha * (p.life / 200);
            this.ctx.fill();
            
            // 添加光晕效果
            this.ctx.beginPath();
            const gradient = this.ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.size * 3
            );
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = p.alpha * (p.life / 200) * 0.3;
            this.ctx.fill();
        }
        
        // 绘制连接线
        this.drawConnections();
        
        // 重置透明度
        this.ctx.globalAlpha = 1;
        
        // 继续动画循环
        this.animationFrameId = requestAnimationFrame(() => this.animateParticles());
    }
    
    drawConnections() {
        const maxDistance = 100;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * (1 - distance / maxDistance)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    stopParticlesEffect() {
        this.particlesActive = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // 淡出粒子
        let opacity = 1;
        const fadeOut = () => {
            opacity -= 0.02;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (opacity > 0) {
                this.ctx.globalAlpha = opacity;
                for (const p of this.particles) {
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    this.ctx.fillStyle = p.color;
                    this.ctx.fill();
                }
                requestAnimationFrame(fadeOut);
            } else {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        };
        
        fadeOut();
    }
    
    addCelebrationBanner() {
        const banner = document.createElement('div');
        banner.className = 'celebration-banner';
        banner.innerHTML = `
            <div class="celebration-text">
                欢迎来到2026年!!!!!
            </div>
        `;
        
        const countdownContainer = document.querySelector('.countdown-container');
        if (countdownContainer) {
            countdownContainer.appendChild(banner);
            
            // 10秒后移除横幅
            setTimeout(() => {
                banner.remove();
            }, 10000);
        }
    }
    
    addLastSecondsEffect() {
        const timeUnits = document.querySelectorAll('.time-unit');
        timeUnits.forEach(unit => {
            unit.style.animation = 'pulse 0.5s infinite alternate';
            unit.style.background = 'rgba(255, 107, 107, 0.3)';
        });
    }
    
    playCelebrationSound() {
        // 创建简单的音效（使用Web Audio API）
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('音频播放失败:', e);
        }
    }
    
    padNumber(num) {
        return num.toString().padStart(2, '0');
    }
}

// 页面加载后初始化倒计时
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否在首页（有倒计时元素）
    if (document.getElementById('days')) {
        new SimpleCountdown();
        console.log('倒计时已启动');
        
        // 添加测试按钮（开发用）
        //const testBtn = document.createElement('button');
        //testBtn.className = 'test-btn';
        //testBtn.textContent = '测试粒子效果';
        //testBtn.style.position = 'absolute';
        //testBtn.style.bottom = '20px';
        //testBtn.style.left = '50%';
        //testBtn.style.transform = 'translateX(-50%)';
        //testBtn.style.zIndex = '10';
        
        testBtn.addEventListener('click', () => {
            const countdown = new SimpleCountdown();
            countdown.showExpired();
        });
        
        const countdownSection = document.querySelector('.countdown-section');
        if (countdownSection) {
            countdownSection.appendChild(testBtn);
            
            // 10秒后移除测试按钮
            setTimeout(() => {
                testBtn.remove();
            }, 10000);
        }
    }
});