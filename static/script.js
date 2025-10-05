function selectColor(color) {
    const meepleImage = document.getElementById('meeple-image');

    meepleImage.style.transform = 'scale(0.9)';
    meepleImage.style.opacity = '0.7';

    setTimeout(() => {
        meepleImage.src = `/static/meeple-${color}.png`;
        meepleImage.style.transform = 'scale(1.1)';
        meepleImage.style.opacity = '1';

        setTimeout(() => {
            meepleImage.style.transform = 'scale(1)';
        }, 150);
    }, 100);

    document.querySelectorAll('.color-option').forEach(option => {
        const isSelected = option.dataset.color === color;
        option.classList.toggle('active', isSelected);
        option.setAttribute('aria-checked', isSelected.toString());
    });

    localStorage.setItem('selectedMeepleColor', color);
}

function updateGreeting() {
    const nameInput = document.getElementById('player-name');
    const greeting = document.getElementById('greeting');
    const startBtn = document.getElementById('start-btn');
    const nameHeader = document.getElementById('name-header');
    const inputContainer = document.getElementById('input-container');

    const hasContent = nameInput.value.trim() !== '';
    [greeting.style.opacity, startBtn.style.opacity, nameHeader.style.opacity] = hasContent ? ['1', '1', '0'] : ['0', '0', '1'];
    inputContainer.style.transform = hasContent ? 'translateY(-24px)' : 'translateY(0)';
    greeting.textContent = hasContent ? `Welcome to MeepleQuest, ${nameInput.value.trim()}!` : '';
}

function startQuest() {
    window.location.href = '/play.html';
}

function revealOrange() {
    const orangeOption = document.getElementById('orange-option');
    orangeOption.style.display = 'flex';
    orangeOption.style.transform = 'scale(0.8) rotate(-10deg)';
    orangeOption.style.opacity = '0';

    setTimeout(() => {
        orangeOption.style.opacity = '1';
        orangeOption.style.transform = 'scale(1.1) rotate(0deg)';

        setTimeout(() => {
            orangeOption.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }, 50);
}

document.addEventListener('contextmenu', e => {
    e.preventDefault();
    const menu = document.createElement('div');
    menu.innerHTML = `<div style="position:fixed;top:${e.clientY}px;left:${e.clientX}px;background:#333;color:#fff;padding:10px;border-radius:8px;z-index:9999;font-family:'Fredoka One',cursive;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.5);"><div style="margin-bottom:8px;"><b>Navigation</b></div><div onclick="window.location.href='/arcade-menu.html'" style="cursor:pointer;padding:4px 8px;border-radius:4px;margin:2px 0;">🎮 Arcade</div><div onclick="window.location.href='/play.html'" style="cursor:pointer;padding:4px 8px;border-radius:4px;margin:2px 0;">🏰 Hub</div><div onclick="window.location.href='/fishing-frenzy-menu.html'" style="cursor:pointer;padding:4px 8px;border-radius:4px;margin:2px 0;">🎣 Fishing</div>`;
    document.body.appendChild(menu);
    setTimeout(() => menu.remove(), 5000);
    document.addEventListener('click', () => menu.remove(), { once: true });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('player-name').addEventListener('input', updateGreeting);
    document.getElementById('m-letter').addEventListener('click', revealOrange);
});
