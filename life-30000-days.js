// 获取DOM元素
const birthdateInput = document.getElementById('birthdate');
const calculateBtn = document.getElementById('calculate');
const statsSection = document.getElementById('statsSection');
const gridSection = document.getElementById('gridSection');
const gridContainer = document.getElementById('gridContainer');
const gridInfoText = document.getElementById('gridInfoText');

// 统计数据元素
const daysLivedEl = document.getElementById('daysLived');
const daysRemainingEl = document.getElementById('daysRemaining');
const percentageEl = document.getElementById('percentage');
const countdownDaysEl = document.getElementById('countdownDays');
const countdownHoursEl = document.getElementById('countdownHours');
const countdownMinutesEl = document.getElementById('countdownMinutes');
const countdownSecondsEl = document.getElementById('countdownSeconds');

// 总天数
const TOTAL_DAYS = 30000;
const TOTAL_WEEKS = Math.ceil(TOTAL_DAYS / 7);

// 当前视图模式
let currentView = 'week';

// 倒计时定时器
let countdownInterval = null;

// 存储当前已过天数
let currentDaysLived = 0;

// 从localStorage加载生日
window.addEventListener('DOMContentLoaded', () => {
    const savedBirthdate = localStorage.getItem('birthdate');
    if (savedBirthdate) {
        birthdateInput.value = savedBirthdate;
        calculateLifeDays();
    }

    // 添加切换按钮事件监听
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            switchView(view);

            // 更新按钮状态
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});

// 计算按钮点击事件
calculateBtn.addEventListener('click', () => {
    const birthdate = birthdateInput.value;
    if (!birthdate) {
        alert('请输入出生日期');
        return;
    }

    // 保存到localStorage
    localStorage.setItem('birthdate', birthdate);
    calculateLifeDays();
});

// 计算人生天数
function calculateLifeDays() {
    const birthdate = new Date(birthdateInput.value);
    const now = new Date();

    // 计算已过天数
    const diffTime = now - birthdate;
    const daysLived = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 保存当前已过天数
    currentDaysLived = daysLived;

    // 计算剩余天数
    const daysRemaining = TOTAL_DAYS - daysLived;

    // 计算百分比
    const percentage = ((daysLived / TOTAL_DAYS) * 100).toFixed(2);

    // 更新统计数据
    daysLivedEl.textContent = daysLived.toLocaleString();
    daysRemainingEl.textContent = daysRemaining.toLocaleString();
    percentageEl.textContent = percentage + '%';

    // 显示统计区域
    statsSection.style.display = 'grid';
    gridSection.style.display = 'block';

    // 生成网格
    generateGrid(currentView);

    // 启动倒计时
    startCountdown(birthdate);
}

// 切换视图
function switchView(view) {
    currentView = view;
    generateGrid(view);
}

// 生成网格
function generateGrid(view) {
    // 清空现有网格
    gridContainer.innerHTML = '';

    if (view === 'week') {
        // 按周展示
        gridContainer.classList.remove('day-view');
        gridInfoText.textContent = '每个方块代表 1 周 (7天)';

        const weeksLived = Math.floor(currentDaysLived / 7);

        for (let i = 0; i < TOTAL_WEEKS; i++) {
            const block = document.createElement('div');
            block.className = 'day-block';

            if (i < weeksLived) {
                block.classList.add('lived');
                block.title = `第 ${i + 1} 周 (已度过)`;
            } else {
                block.classList.add('remaining');
                block.title = `第 ${i + 1} 周 (未来)`;
            }

            gridContainer.appendChild(block);
        }
    } else {
        // 按日展示
        gridContainer.classList.add('day-view');
        gridInfoText.textContent = '每个方块代表 1 天';

        for (let i = 0; i < TOTAL_DAYS; i++) {
            const block = document.createElement('div');
            block.className = 'day-block';

            if (i < currentDaysLived) {
                block.classList.add('lived');
                block.title = `第 ${i + 1} 天 (已度过)`;
            } else {
                block.classList.add('remaining');
                block.title = `第 ${i + 1} 天 (未来)`;
            }

            gridContainer.appendChild(block);
        }
    }
}

// 启动倒计时
function startCountdown(birthdate) {
    // 清除之前的定时器
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    // 计算目标日期（出生后30000天）
    const targetDate = new Date(birthdate);
    targetDate.setDate(targetDate.getDate() + TOTAL_DAYS);

    // 更新倒计时
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            countdownDaysEl.textContent = '0';
            countdownHoursEl.textContent = '0';
            countdownMinutesEl.textContent = '0';
            countdownSecondsEl.textContent = '0';
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownDaysEl.textContent = days.toLocaleString();
        countdownHoursEl.textContent = hours;
        countdownMinutesEl.textContent = minutes;
        countdownSecondsEl.textContent = seconds;
    }

    // 立即更新一次
    updateCountdown();

    // 每秒更新
    countdownInterval = setInterval(updateCountdown, 1000);
}
