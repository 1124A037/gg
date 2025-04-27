const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');
const connectButton = document.getElementById('connectButton');

// 自動調整 canvas 大小
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let waveHeight = 50; // 當前波浪高度
let targetWaveHeight = 50; // 目標波浪高度
let stars = []; // 儲存星星的數據
let nebulas = []; // 儲存星雲的數據

// 初始化星星和星雲
function initializeBackground() {
    stars = [];
    nebulas = [];

    // 初始化星星
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            alpha: Math.random() * 0.8 + 0.2,
            alphaChange: (Math.random() * 0.02 - 0.01) // 緩慢變化
        });
    }

    // 初始化星雲
    for (let i = 0; i < 50; i++) {
        nebulas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 100 + 50,
            alpha: Math.random() * 0.2 + 0.05,
            alphaChange: (Math.random() * 0.01 - 0.005) // 緩慢變化
        });
    }
}

// 繪製銀河背景
function drawGalaxyBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0b0033'); // 深藍色
    gradient.addColorStop(0.5, '#220066'); // 紫色
    gradient.addColorStop(1, '#0b0033'); // 深藍色
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 繪製星雲
    nebulas.forEach((nebula) => {
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${nebula.alpha})`;
        ctx.fill();

        // 更新透明度，並限制範圍
        nebula.alpha += nebula.alphaChange;
        if (nebula.alpha <= 0.05 || nebula.alpha >= 0.25) {
            nebula.alphaChange *= -1;
        }
    });

    // 繪製星星
    stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();

        // 更新透明度，並限制範圍
        star.alpha += star.alphaChange;
        if (star.alpha <= 0.2 || star.alpha >= 1) {
            star.alphaChange *= -1;
        }
    });
}

// 繪製多層波浪
function drawGalaxyWave() {
    drawGalaxyBackground();

    const waveColors = [
        'rgba(255, 255, 255, 0.6)',
        'rgba(200, 200, 255, 0.4)',
        'rgba(150, 150, 255, 0.2)'
    ];

    waveColors.forEach((color, index) => {
        ctx.beginPath();
        const offset = index * 20; // 每層波浪的偏移
        for (let x = 0; x < canvas.width; x++) {
            const y =
                canvas.height / 2 +
                waveHeight * Math.sin((x + Date.now() / (50 + offset)) / (50 + offset));
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 + index; // 每層波浪的寬度
        ctx.stroke();
    });

    // 平滑過渡，增加阻尼效果
    const dampingFactor = 0.02; // 阻尼係數
    const stabilityThreshold = 1; // 穩定區域閾值
    const difference = targetWaveHeight - waveHeight;

    if (Math.abs(difference) > stabilityThreshold) {
        waveHeight += difference * dampingFactor;
    }

    requestAnimationFrame(drawGalaxyWave);
}

// 使用 Web Serial API 接收 Arduino 數據
async function connectSerial() {
    try {
        console.log('嘗試連接串口...');
        const port = await navigator.serial.requestPort();
        console.log('串口已選擇:', port);
        await port.open({ baudRate: 9600 });
        console.log('串口已打開');

        const reader = port.readable.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const data = new TextDecoder().decode(value).trim();
            console.log('接收到數據:', data);
            const parsedValue = parseInt(data);
            if (!isNaN(parsedValue)) {
                targetWaveHeight = Math.min(Math.max(parsedValue / 10, 10), 100); // 限制波浪高度
            }
        }
    } catch (error) {
        console.error('串口連接失敗:', error.message);
    }
}

// 綁定按鈕點擊事件
connectButton.addEventListener('click', connectSerial);

initializeBackground();
drawGalaxyWave();