// 当页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 创建星空背景
    createStars();
    
    // 初始化爱情计时器
    initLoveCounter();
    
    // 初始化照片展示
    loadPhotos();
    
    // 添加页面动画效果
    addAnimations();
    
    // 计算特殊日期
    calculateSpecialDates();
    
    // 添加点击生成爱心效果
    initHeartClickEffect();
    
    // 初始化背景音乐
    initBackgroundMusic();
    
    // 初始化入口页面交互
    initEntranceScreen();
});

// 计算特殊日期
function calculateSpecialDates() {
    // 设置相识日期和正式开始日期
    const meetDate = new Date('2025-03-30T00:00:00'); // 相识日期
    const startDate = new Date('2025-04-25T00:00:00'); // 正式开始日期
    
    const loveStoryEl = document.getElementById('love-story');
    
    function updateDateCounters() {
        // 获取当前日期和时间
        const now = new Date();
        
        // 计算到正式开始日期的毫秒差异和天数
        const differenceToStart = startDate - now;
        const daysToStart = Math.ceil(differenceToStart / (1000 * 60 * 60 * 24));
        
        // 计算相识日期到正式开始日期的天数
        const meetToStartDays = Math.ceil((startDate - meetDate) / (1000 * 60 * 60 * 24));
        
        // 计算相识到今天的状态文本
        if (now < meetDate) {
            // 如果当前日期在相识日期之前
            const daysToMeet = Math.ceil((meetDate - now) / (1000 * 60 * 60 * 24));
            loveStoryEl.innerHTML = `距离我们相遇还有 <span class="highlight">${daysToMeet}</span> 天<br>
                                   缘分将在 <span class="highlight">${meetToStartDays}</span> 天后开花结果`;
        } else if (now >= meetDate && now < startDate) {
            // 如果当前日期在相识日期之后但在正式开始日期之前
            const daysSinceMeet = Math.floor((now - meetDate) / (1000 * 60 * 60 * 24));
            const daysToStart = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
            loveStoryEl.innerHTML = `我们相识已经 <span class="highlight">${daysSinceMeet}</span> 天<br>
                                   再过 <span class="highlight">${daysToStart}</span> 天，我们的旅程正式开始`;
        } else {
            // 如果当前日期在正式开始日期之后
            const daysSinceMeet = Math.floor((now - meetDate) / (1000 * 60 * 60 * 24));
            const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
            loveStoryEl.innerHTML = `我们相识已经 <span class="highlight">${daysSinceMeet}</span> 天<br>
                                   正式在一起已有 <span class="highlight">${daysSinceStart}</span> 天`;
        }
    }
    
    // 立即更新一次
    updateDateCounters();
    
    // 每秒更新一次
    setInterval(updateDateCounters, 1000);
}

// 初始化背景音乐
function initBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let hasInteracted = false;
    
    // 尝试播放音乐（可能会被浏览器阻止）
    try {
        // 音量渐入效果
        bgMusic.volume = 0;
        var promise = bgMusic.play();
        
        if (promise !== undefined) {
            promise.then(_ => {
                // 自动播放成功
                console.log('自动播放成功');
                fadeInVolume();
            }).catch(error => {
                // 自动播放被阻止
                console.log('自动播放被阻止:', error);
                musicToggle.classList.remove('playing');
                musicToggle.classList.add('paused');
                
                // 在用户首次交互时播放音乐
                document.addEventListener('click', function initialPlay() {
                    if (!hasInteracted) {
                        bgMusic.play();
                        fadeInVolume();
                        musicToggle.classList.add('playing');
                        musicToggle.classList.remove('paused');
                        hasInteracted = true;
                    }
                    // 移除这个一次性监听器
                    document.removeEventListener('click', initialPlay);
                }, { once: true });
            });
        }
    } catch (error) {
        console.log('音频播放出错:', error);
        musicToggle.classList.remove('playing');
        musicToggle.classList.add('paused');
    }
    
    // 音量渐入效果
    function fadeInVolume() {
        let vol = 0;
        const interval = setInterval(function() {
            if (vol < 0.3) { // 最大音量设为0.3
                vol += 0.01;
                bgMusic.volume = vol;
            } else {
                clearInterval(interval);
            }
        }, 100);
    }
    
    // 音乐控制按钮点击事件
    musicToggle.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play();
            fadeInVolume();
            this.classList.add('playing');
            this.classList.remove('paused');
        } else {
            bgMusic.pause();
            bgMusic.currentTime = 0;
            this.classList.remove('playing');
            this.classList.add('paused');
        }
    });
}

// 点击生成爱心效果
function initHeartClickEffect() {
    // 监听整个文档的点击事件
    document.addEventListener('click', function(event) {
        // 创建爱心元素
        createHeart(event.clientX, event.clientY);
    });
    
    // 为触摸设备添加触摸反馈
    document.addEventListener('touchstart', function(event) {
        // 阻止默认行为，避免长按弹出菜单等
        if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'A') {
            event.preventDefault();
        }
        
        // 获取第一个触摸点
        const touch = event.touches[0];
        
        // 创建爱心元素在触摸位置
        createHeart(touch.clientX, touch.clientY);
    }, { passive: false });
}

// 创建爱心并设置动画
function createHeart(x, y) {
    // 创建爱心元素
    const heart = document.createElement('img');
    heart.src = 'images/heart.png';
    heart.className = 'floating-heart';
    
    // 设置爱心初始位置（减去图片尺寸的一半，使点击点在图片中心）
    heart.style.left = (x - 15) + 'px'; // 假设图片宽度为30px
    heart.style.top = (y - 15) + 'px'; // 假设图片高度为30px
    
    // 添加到body
    document.body.appendChild(heart);
    
    // 随机设置一些动画变量，使每个爱心的动画略有不同
    const duration = Math.random() * 2 + 1; // 1-3秒的动画时间
    const distance = Math.random() * 100 + 100; // 上升100-200像素
    const rotation = Math.random() * 60 - 30; // -30到30度的旋转
    const horizontalShift = Math.random() * 60 - 30; // 左右偏移-30到30像素
    const scale = Math.random() * 0.5 + 0.5; // 0.5-1倍大小
    
    // 设置动画CSS
    heart.style.animation = `floatingHeart ${duration}s ease-out forwards`;
    
    // 创建动画样式
    const animStyle = document.createElement('style');
    animStyle.textContent = `
        @keyframes floatingHeart {
            0% {
                transform: translate(0, 0) rotate(0deg) scale(${scale});
                opacity: 1;
            }
            100% {
                transform: translate(${horizontalShift}px, -${distance}px) rotate(${rotation}deg) scale(${scale * 1.2});
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(animStyle);
    
    // 动画结束后移除元素，避免内存泄漏
    setTimeout(() => {
        heart.remove();
        animStyle.remove();
    }, duration * 1000);
}

// 爱情计时器功能
function initLoveCounter() {
    // 设置恋爱开始的日期
    const startDate = new Date('2025-04-25T00:00:00'); // 正式开始日期：2025年4月25日
    
    // 初始化计时器DOM结构
    const counterTitle = document.querySelector('.love-counter h2');
    const counterDisplay = document.querySelector('.counter');
    
    // 首次设置标题和HTML结构
    updateInitialStructure();
    
    // 根据日期设置初始结构
    function updateInitialStructure() {
        const now = new Date();
        const isBeforeStart = now < startDate;
        
        // 设置标题
        counterTitle.textContent = isBeforeStart ? 
            '我们的冒险即将开始' : 
            '我们的冒险已经开始';
        
        // 设置HTML结构，保持ID不变
        if (isBeforeStart) {
            counterDisplay.innerHTML = `还有 <span id="days">0</span> 天
                <span id="hours">0</span> 小时
                <span id="minutes">0</span> 分钟
                <span id="seconds">0</span> 秒`;
        } else {
            counterDisplay.innerHTML = `<span id="days">0</span> 天
                <span id="hours">0</span> 小时
                <span id="minutes">0</span> 分钟
                <span id="seconds">0</span> 秒`;
        }
    }
    
    // 更新计时器显示
    function updateCounter() {
        const now = new Date();
        let difference;
        
        // 确定时间差值
        if (now < startDate) {
            difference = startDate - now;
        } else {
            difference = now - startDate;
        }
        
        // 计算天数、小时、分钟和秒数
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // 只更新数值，不改变结构
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }
    
    // 初次调用
    updateCounter();
    
    // 每秒更新一次
    setInterval(updateCounter, 1000);
}

// 加载照片功能
function loadPhotos() {
    // 照片数据 - 替换为您自己的照片路径和描述
    const photos = [
        { src: 'images/genshin1.jpg', alt: '提瓦特回忆 1' },
        { src: 'images/genshin2.jpg', alt: '提瓦特回忆 2' },
        { src: 'images/genshin3.jpg', alt: '提瓦特回忆 3' },
        { src: 'images/genshin4.jpg', alt: '提瓦特回忆 4' },
        { src: 'images/genshin5.jpg', alt: '提瓦特回忆 5' },
        { src: 'images/genshin6.jpg', alt: '提瓦特回忆 6' },
        { src: 'images/genshin7.jpg', alt: '提瓦特回忆 7' },
        { src: 'images/genshin8.jpg', alt: '提瓦特回忆 8' },
        { src: 'images/genshin9.jpg', alt: '提瓦特回忆 9' }
    ];
    
    const photoContainer = document.querySelector('.photos');
    
    // 为每张照片创建HTML元素
    photos.forEach(photo => {
        // 创建照片容器
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-item';
        
        // 创建图片元素
        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt;
        img.loading = 'lazy'; // 延迟加载图片提高性能
        
        // 将图片添加到容器
        photoDiv.appendChild(img);
        
        // 将容器添加到照片墙
        photoContainer.appendChild(photoDiv);
    });
}

// 添加页面动画效果
function addAnimations() {
    // 为爱的告白添加打字机效果
    const loveLetter = document.querySelector('.love-letter');
    const text = '亲爱的毅馨，想告诉你 —— 我真的很喜欢你。\n\n这段时间的相处里，哪怕偶尔会闹小情绪，心底的喜欢也从未动摇过。记得你总在察觉我情绪低落时，立刻打来电话轻声安慰，那些温柔的话语像春日里融化冰河的暖阳，总让我鼻尖发酸却又格外心安。\n\n这是我们相伴的第一个 520，却仿佛已经走过了漫长的时光。我总在想，命运一定是偏爱我的，才让我在枯燥单调的日子里遇见了你 —— 曾经的我，不过是捧着手机刷着重复的视频，在空洞的消遣里打发时光；而你的出现，像一束光突然照进灰扑扑的生活，让每个平凡的日子都变得鲜活热烈起来。我开始期待每一次消息提示音，贪恋每一通电话里的絮语，原来有人分享喜怒、有人满心牵挂的感觉，竟如此让人着迷。你说早安的语气像刚融化的焦糖，你哪怕隔着屏幕也想哄我开心的笨拙模样...... 原来爱真的能让齿轮重新转动，让每个平凡的瞬间都沾满蜜糖：我开始期待暮色里的晚安电话，贪恋对话框里跳动的 "正在输入"，甚至觉得连等待回复的间隙，都带着毛茸茸的温柔。\n\n虽然我们现在隔着屏幕相恋，但我始终相信，真心能跨越所有距离。我不擅长用甜言蜜语堆砌承诺，更愿意用实实在在的行动告诉你：无论未来会遇到多少风雨，我都不会松开牵着你的手。你早已是我心底的唯一，是我不想失去的温暖，这份爱远比我能说出口的更深、更浓。我不喜欢用 "永远""永远" 画饼，却敢在心底悄悄埋下一颗种子：想和你从键盘上的 "我爱你"，走到现实里的 "在一起"；想在未来的某一天，能真正触碰到你的眉眼。\n\n当然，我知道自己并不完美，身上藏着许多小毛病。如果你愿意告诉我，我一定会认真倾听、努力改正 —— 因为我太珍惜这段感情，太想和你一起，把日子过成我们向往的模样：平淡却闪着光，快乐且充满底气。\n\n往后的路还很长很长，就让我们慢慢走、慢慢爱，从第一个 520 开始，走到无数个 "以后" 吧。\n这第一个 520，我不想说太多热烈的誓言。\n只想告诉你：你是我枯燥宇宙里的玫瑰星云，是我荒芜心田里的第一株春苗。\n而我，想做那个陪你数遍人间晨昏的人 ——\n从键盘到掌心，从屏幕到眼底，从这一个 520，到每一个有你的朝暮四季。';
    
    // 清空原有内容
    loveLetter.textContent = '';
    
    // 逐个字符添加
    let index = 0;
    
    function typeWriter() {
        if (index < text.length) {
            // 处理换行符
            if (text.charAt(index) === '\n') {
                loveLetter.innerHTML += '<br>';
            } else {
                loveLetter.innerHTML += text.charAt(index);
            }
            index++;
            setTimeout(typeWriter, 20); // 加快打字速度，从50毫秒改为20毫秒
        }
    }
    
    // 启动打字机效果
    typeWriter();
    
    // 给照片添加淡入效果
    setTimeout(function() {
        const photoItems = document.querySelectorAll('.photo-item');
        photoItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('fade-in');
            }, index * 300);
        });
    }, 2000); // 等待打字机效果完成后再显示照片
    
    // 添加元素视觉效果
    addVisualElements();
}

// 添加原神风格的视觉元素
function addVisualElements() {
    // 创建漂浮的元素
    const elements = ['风', '岩', '雷', '水', '火', '冰', '草'];
    const colors = ['#74c2a8', '#e9b568', '#8e79cb', '#69c0df', '#de7b7b', '#9fd6e3', '#8bc99b'];
    
    const container = document.querySelector('.container');
    
    // 创建10个随机元素
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * elements.length);
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.textContent = elements[randomIndex];
        element.style.color = colors[randomIndex];
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(element);
    }
}

// 为漂浮元素和照片添加样式
const style = document.createElement('style');
style.textContent = `
    .photo-item {
        width: 200px;
        height: 200px;
        margin: 10px;
        overflow: hidden;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
        border: 3px solid #c9a063;
    }
    
    .photo-item.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .photo-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    .photo-item:hover img {
        transform: scale(1.1);
    }
    
    .floating-element {
        position: absolute;
        font-size: 24px;
        opacity: 0.5;
        pointer-events: none;
        animation: float 15s infinite linear;
        font-family: 'HYWenHei', sans-serif;
    }
    
    @keyframes float {
        0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
        }
        25% {
            opacity: 0.5;
        }
        75% {
            opacity: 0.5;
        }
        100% {
            transform: translate(100px, -100px) rotate(360deg);
            opacity: 0;
        }
    }
`;

document.head.appendChild(style);

// 创建星空背景
function createStars() {
    const starsContainer = document.getElementById('stars-container');
    const starsCount = 100; // 星星数量
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // 随机位置
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        
        // 随机大小
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // 随机动画延迟
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        starsContainer.appendChild(star);
    }
}

// 初始化入口页面交互
function initEntranceScreen() {
    const entranceScreen = document.getElementById('entrance');
    const mainContent = document.getElementById('mainContent');
    
    // 点击入口页面时的处理
    entranceScreen.addEventListener('click', function() {
        // 隐藏入口引导页
        entranceScreen.style.opacity = '0';
        setTimeout(function() {
            entranceScreen.style.display = 'none';
            
            // 显示主内容
            mainContent.classList.remove('hidden');
            
            // 添加淡入动画效果
            mainContent.style.opacity = '0';
            mainContent.style.transition = 'opacity 1s ease';
            
            setTimeout(function() {
                mainContent.style.opacity = '1';
            }, 100);
        }, 800);
    });
} 