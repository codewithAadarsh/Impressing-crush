function isLaptop() {
    // Check the screen size
    const minLaptopWidth = 1024;  // Minimum width for laptops in pixels
    const minLaptopHeight = 768;  // Minimum height for laptops in pixels

    if (window.innerWidth >= minLaptopWidth && window.innerHeight >= minLaptopHeight) {
        // Check the user agent string
        const userAgent = navigator.userAgent.toLowerCase();

        // List of keywords often found in laptop user agents
        const laptopKeywords = ['windows nt', 'macintosh', 'mac os'];

        for (let keyword of laptopKeywords) {
            if (userAgent.includes(keyword)) {
                return true;
            }
        }

        // Check for touch capability
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // If the device does not have touch capability, it's more likely to be a laptop
        if (!isTouchDevice) {
            return true;
        }
    }

    return false;
}

class Paper {
    constructor() {
        this.holdingPaper = false;
        this.mouseTouchX = 0;
        this.mouseTouchY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        this.velX = 0;
        this.velY = 0;
        this.rotation = Math.random() * 30 - 15;
        this.currentPaperX = 0;
        this.currentPaperY = 0;
        this.rotating = false;
    }

    init(paper, isTouch) {
        if (isTouch) {
            this.addTouchEventListeners(paper);
        } else {
            this.addMouseEventListeners(paper);
        }
    }

    addMouseEventListeners(paper) {
        document.addEventListener('mousemove', (e) => {
            if (!this.rotating) {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                
                this.velX = this.mouseX - this.prevMouseX;
                this.velY = this.mouseY - this.prevMouseY;
            }
            
            const { dirNormalizedX, dirNormalizedY } = this.getDirection(e.clientX, e.clientY);

            const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
            let degrees = 180 * angle / Math.PI;
            degrees = (360 + Math.round(degrees)) % 360;
            if (this.rotating) {
                this.rotation = degrees;
            }

            if (this.holdingPaper) {
                if (!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                }
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;

                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        });

        paper.addEventListener('mousedown', (e) => {
            if (this.holdingPaper) return; 
            this.holdingPaper = true;
            
            paper.style.zIndex = ++highestZ;
            
            if (e.button === 0) {
                this.mouseTouchX = this.mouseX;
                this.mouseTouchY = this.mouseY;
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
            }
            if (e.button === 2) {
                this.rotating = true;
            }
        });

        window.addEventListener('mouseup', () => {
            this.holdingPaper = false;
            this.rotating = false;
        });
    }

    addTouchEventListeners(paper) {
        paper.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.rotating) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
                
                this.velX = this.mouseX - this.prevMouseX;
                this.velY = this.mouseY - this.prevMouseY;
            }
            
            const { dirNormalizedX, dirNormalizedY } = this.getDirection(e.touches[0].clientX, e.touches[0].clientY);

            const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
            let degrees = 180 * angle / Math.PI;
            degrees = (360 + Math.round(degrees)) % 360;
            if (this.rotating) {
                this.rotation = degrees;
            }

            if (this.holdingPaper) {
                if (!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                }
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;

                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        });

        paper.addEventListener('touchstart', (e) => {
            if (this.holdingPaper) return; 
            this.holdingPaper = true;
            
            paper.style.zIndex = ++highestZ;
            
            this.mouseTouchX = e.touches[0].clientX;
            this.mouseTouchY = e.touches[0].clientY;
            this.prevMouseX = this.mouseTouchX;
            this.prevMouseY = this.mouseTouchY;
        });

        paper.addEventListener('touchend', () => {
            this.holdingPaper = false;
            this.rotating = false;
        });

        paper.addEventListener('gesturestart', (e) => {
            e.preventDefault();
            this.rotating = true;
        });

        paper.addEventListener('gestureend', () => {
            this.rotating = false;
        });
    }

    getDirection(x, y) {
        const dirX = x - this.mouseTouchX;
        const dirY = y - this.mouseTouchY;
        const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
        return {
            dirNormalizedX: dirX / dirLength,
            dirNormalizedY: dirY / dirLength
        };
    }
}

let highestZ = 1;
const papers = Array.from(document.querySelectorAll('.paper'));
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

papers.forEach(paper => {
    const p = new Paper();
    p.init(paper, isTouchDevice);
});
