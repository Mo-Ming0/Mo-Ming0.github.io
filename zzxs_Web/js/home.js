// home.js - 全屏滚动功能

class FullpageScroll {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.currentSection = 0;
        this.isScrolling = false;
        this.scrollDelay = 1000; // 滚动延迟时间（毫秒）
        

        
        this.init();
    }
    setupNavLinks() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const sectionId = href.substring(1);
                const targetSection = document.getElementById(sectionId);
                
                if (targetSection) {
                    // 使用 FullpageScroll 的滚动方法
                    const sectionIndex = Array.from(this.sections).indexOf(targetSection);
                    if (sectionIndex !== -1) {
                        this.scrollToSection(sectionIndex);
                    }
                }
            }
        });
    });
}
    
    init() {
     // 初始化滚动事件
    this.setupScrollEvents();
    
    // 初始化导航点点击事件
    this.setupNavDots();
    
    // 初始化导航栏链接点击事件
    this.setupNavLinks();
    
    // 初始化倒计时
    this.initCountdown();
    
    // 更新导航点状态
    this.updateNavDots();
    
    // 监听滚动事件更新当前section
    this.setupScrollListener();
    
    // 监听hash变化（浏览器前进后退）
    window.addEventListener('hashchange', () => {
        this.scrollToSectionFromHash();
    });
}
    
    setupScrollEvents() {
        // 鼠标滚轮事件
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            if (this.isScrolling) return;
            
            if (e.deltaY > 0) {
                // 向下滚动
                this.scrollToSection(this.currentSection + 1);
            } else {
                // 向上滚动
                this.scrollToSection(this.currentSection - 1);
            }
        }, { passive: false });
        
        // 键盘上下键事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.scrollToSection(this.currentSection + 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.scrollToSection(this.currentSection - 1);
            }
        });
    }
    
    setupNavDots() {
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection(index);
            });
        });
    }
    
    setupScrollListener() {
        // 使用Intersection Observer监听section进入视口
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        const sectionNumber = parseInt(sectionId.replace('section', '')) - 1;
                        
                        if (!isNaN(sectionNumber)) {
                            this.currentSection = sectionNumber;
                            this.updateNavDots();
                            this.updateURLHash(sectionId);
                        }
                    }
                });
            },
            {
                threshold: 0.5, // 当50%进入视口时触发
                rootMargin: '-70px 0px 0px 0px' // 减去导航栏高度
            }
        );
        
        // 观察所有section
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    scrollToSection(sectionIndex) {
        // 边界检查
        if (sectionIndex < 0 || sectionIndex >= this.sections.length) {
            return;
        }
        
        // 防止连续滚动
        if (this.isScrolling) return;
        this.isScrolling = true;
        
        // 更新当前section
        this.currentSection = sectionIndex;
        
        // 获取目标section
        const targetSection = this.sections[sectionIndex];
        const sectionId = targetSection.id;
        
        // 平滑滚动到目标section
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // 更新导航点和URL
        this.updateNavDots();
        this.updateURLHash(sectionId);
        
        // 滚动完成后重置标志
        setTimeout(() => {
            this.isScrolling = false;
        }, this.scrollDelay);
    }
    
    scrollToSectionFromHash() {
        const hash = window.location.hash;
        if (hash) {
            const sectionId = hash.substring(1);
            const targetSection = document.getElementById(sectionId);
            
            if (targetSection) {
                const sectionIndex = Array.from(this.sections).indexOf(targetSection);
                if (sectionIndex !== -1) {
                    this.currentSection = sectionIndex;
                    this.updateNavDots();
                    
                    // 滚动到目标section
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    }
    
    updateNavDots() {
        this.navDots.forEach((dot, index) => {
            if (index === this.currentSection) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    updateURLHash(sectionId) {
        // 更新URL hash，但不触发滚动
        if (history.pushState) {
            history.pushState(null, null, `#${sectionId}`);
        } else {
            window.location.hash = sectionId;
        }
    }
    
}


// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化全屏滚动
    const fullpage = new FullpageScroll();
    
    // 为按钮添加点击事件
    setupButtonEvents();
    
    
    // 添加视差滚动效果
    setupParallax();
});

// 设置按钮事件
function setupButtonEvents() {
    // "了解更多"按钮
    const learnMoreBtn = document.querySelector('.btn-more');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            // 滚动到关于部分
            document.getElementById('section2').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    // 活动详情按钮
    const activityBtns = document.querySelectorAll('.btn-activity');
    activityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const activityTitle = this.closest('.activity-card').querySelector('h3').textContent;
            alert(`正在加载"${activityTitle}"的详细信息...`);
            // 这里可以替换为实际跳转逻辑
        });
    });
    
    // 报名按钮
    const registerBtn = document.querySelector('.btn-register');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            alert('跳转到报名页面...');
            // 这里可以替换为实际报名逻辑
        });
    }
    
    // 导航栏链接点击事件（平滑滚动）
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// 设置视差滚动效果
function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // 为第一部分的大图添加视差效果
        const heroImage = document.querySelector('.hero-image img');
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        // 为其他元素添加视差效果
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// 添加页面加载动画
window.addEventListener('load', () => {
    // 添加加载完成后的淡入效果
    document.body.classList.add('loaded');
    
    // 为每个section添加延迟显示效果
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
    });
    
    // 触发重排以应用transition
    document.body.offsetHeight;
    
    // 显示sections
    setTimeout(() => {
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }, 100);
});