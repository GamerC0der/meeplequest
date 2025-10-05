document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);

    // Helper functions for safe localStorage operations
    function safeGetItem(key, defaultValue = null) {
        try {
            return localStorage.getItem(key) || defaultValue;
        } catch (e) {
            console.warn('localStorage getItem failed:', e);
            return defaultValue;
        }
    }

    function safeSetItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn('localStorage setItem failed:', e);
        }
    }

    function safeRemoveItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('localStorage removeItem failed:', e);
        }
    }

    const selectedColor = safeGetItem('selectedMeepleColor', 'blue');
    const meeple = document.getElementById('player-meeple');
    const arcade = document.getElementById('arcade');
    const collectibleCoin = document.getElementById('collectible-coin');
    const coinCountElement = document.getElementById('coin-count');
    const newsModal = document.getElementById('news-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const mapBtn = document.getElementById('map-btn');
    const mapModal = document.getElementById('map-modal');
    const marketImg = document.getElementById('market');
    const marketModal = document.getElementById('market-modal');
    const closeMarketModalBtn = document.getElementById('close-market-modal-btn');
    const welcomeModal = document.getElementById('welcome-modal');
    const modalNewsBtn = document.getElementById('modal-news-btn');
    const closeWelcomeModalBtn = document.getElementById('close-welcome-modal-btn');
    const shopNewsBtn = document.getElementById('shop-news-btn');
    const marketTabs = document.querySelectorAll('.market-tab');
    const playerMenu = document.getElementById('player-menu');
    const menuMeepleImg = document.getElementById('menu-meeple-img');
    const inventoryBtn = document.getElementById('inventory-btn');
    const closePlayerMenuBtn = document.getElementById('close-player-menu-btn');
    const inventoryModal = document.getElementById('inventory-modal');
    const closeInventoryModalBtn = document.getElementById('close-inventory-modal-btn');
    const inventoryContent = document.getElementById('inventory-content');
    const inventorySearch = document.getElementById('inventory-search');
    const itemMenu = document.getElementById('item-menu');
    const equipBtn = document.getElementById('equip-btn');
    const closeItemMenuBtn = document.getElementById('close-item-menu-btn');
    const equippedHat = document.getElementById('equipped-hat');
    const crownAwardModal = document.getElementById('crown-award-modal');
    const closeCrownModalBtn = document.getElementById('close-crown-modal-btn');
    const arcadeModal = document.getElementById('arcade-modal');
    const catchGameBtn = document.getElementById('catch-game-btn');
    const fishingFrenzyBtn = document.getElementById('fishing-frenzy-btn');
    const arcadeBackBtn = document.getElementById('arcade-back-btn');
    let selectedItemForEquip = null;
    let currentlyEquippedItem = safeGetItem('currentlyEquippedItem', null);

    let mapScale = 1;
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');

    function updateMapTransform() {
        const mapImage = document.getElementById('map-image');
        const marketText = document.getElementById('market-text');
        const lighthouseText = document.getElementById('lighthouse-text');
        const transformValue = `scale(${mapScale})`;
        mapImage.style.transform = transformValue;
        if (marketText) marketText.style.transform = transformValue;
        if (lighthouseText) lighthouseText.style.transform = transformValue;
    }

    function zoomIn() {
        if (mapScale < 3) {
            mapScale = Math.min(mapScale * 1.2, 3);
            updateMapTransform();
        }
    }

    function zoomOut() {
        if (mapScale > 0.5) {
            mapScale = Math.max(mapScale / 1.2, 0.5);
            updateMapTransform();
        }
    }
    function updateHatDisplay() {
        if (currentlyEquippedItem) {
            if (currentlyEquippedItem === 'Hat') {
                equippedHat.src = '/static/hat.png';
            } else if (currentlyEquippedItem === 'Pirate Hat') {
                equippedHat.src = '/static/pirate_hat.png';
            } else if (currentlyEquippedItem === 'Crown') {
                equippedHat.src = '/static/crown.png';
            }
            equippedHat.style.display = 'block';
            positionHat();
        } else {
            equippedHat.style.display = 'none';
        }
    }
    function positionHat() {
        if (currentlyEquippedItem && equippedHat.style.display !== 'none') {
            const meepleRect = meeple.getBoundingClientRect();
            equippedHat.style.position = 'fixed';
            equippedHat.style.left = (meepleRect.left + meepleRect.width / 2 - 32) + 'px';
            equippedHat.style.top = (meepleRect.top - 10) + 'px';
            equippedHat.style.zIndex = '100';
        }
    }
    function equipItem(itemName) {
        currentlyEquippedItem = itemName;
        safeSetItem('currentlyEquippedItem', itemName);
        updateHatDisplay();
    }
    function unequipItem() {
        currentlyEquippedItem = null;
        safeRemoveItem('currentlyEquippedItem');
        updateHatDisplay();
    }
    function showArcadeModal() {
        arcadeModal.style.display = 'flex';
        const hasVisitedLighthouse = safeGetItem('hasVisitedLighthouse') === 'true';
        const fishingFrenzyBtn = document.getElementById('fishing-frenzy-btn');
        if (hasVisitedLighthouse) {
            fishingFrenzyBtn.style.background = 'rgba(0,0,0,0.8)';
            fishingFrenzyBtn.style.color = 'white';
            fishingFrenzyBtn.style.border = '2px solid #8B4513';
            fishingFrenzyBtn.style.cursor = 'pointer';
            fishingFrenzyBtn.textContent = 'Fishing Frenzy';
        } else {
            fishingFrenzyBtn.style.background = 'rgba(139, 69, 19, 0.6)';
            fishingFrenzyBtn.style.color = 'rgba(255,255,255,0.6)';
            fishingFrenzyBtn.style.border = '2px solid rgba(139, 69, 19, 0.4)';
            fishingFrenzyBtn.style.cursor = 'not-allowed';
            fishingFrenzyBtn.textContent = 'Fishing Frenzy 🔒';
        }
    }
    const newsPage1 = document.getElementById('news-page-1');
    const newsPage2 = document.getElementById('news-page-2');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const pageDot1 = document.getElementById('page-dot-1');
    const pageDot2 = document.getElementById('page-dot-2');
    let currentPage = 1;
    const lastCollectedTime = safeGetItem('lastCoinCollected');
    if (lastCollectedTime && Date.now() - parseInt(lastCollectedTime) < 30000) {
        collectibleCoin.style.display = 'none';
        const remainingTime = 30000 - (Date.now() - parseInt(lastCollectedTime));
        setTimeout(respawnCoin, remainingTime);
    }
    meeple.src = `/static/meeple-${selectedColor}.png`;
    menuMeepleImg.src = `/static/meeple-${selectedColor}.png`;
    meeple.style.left = '50%';
    meeple.style.top = '50%';
    meeple.style.transform = 'translate(-50%, -50%)';
    const balloons = document.getElementById('balloons');
    const now = new Date();
    const isOctoberFirstTwoWeeks = now.getMonth() === 9 && now.getDate() <= 14;
    const balloonsBottomRight = document.getElementById('balloons-bottom-right');
    const showBalloons = isOctoberFirstTwoWeeks;

    Object.assign(balloons.style, {
        left: '35%', top: '55%', transform: 'translate(-50%, -50%)',
        animation: 'balloonsFloat 5s ease-in-out infinite',
        display: showBalloons ? 'block' : 'none'
    });

    Object.assign(balloonsBottomRight.style, {
        right: '5%', bottom: '10%', transform: 'translate(50%, 50%)',
        animation: 'balloonsFloat 5s ease-in-out infinite',
        display: showBalloons ? 'block' : 'none'
    });
    setTimeout(() => {
        updateHatDisplay();
    }, 50);
    const crownEarned = safeGetItem('crownEarned') === 'true';
    const crownAwardShown = safeGetItem('crownAwardShown') === 'true';
    if (crownEarned && !crownAwardShown) {
        crownAwardModal.style.display = 'flex';
        safeSetItem('crownAwardShown', 'true');
    }

    const welcomeShown = safeGetItem('welcomeShown') === 'true';
    if (!welcomeShown) {
        setTimeout(() => {
            welcomeModal.style.display = 'flex';
            safeSetItem('welcomeShown', 'true');
        }, 1000);
    }

    if (urlParams.get('showArcade') === 'true') {
        setTimeout(() => {
            showArcadeModal();
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 500);
    }
    arcade.style.left = 'calc(50% + 100px + 25%)';
    arcade.style.top = '50%';
    arcade.style.transform = 'translate(-50%, -50%)';
    setTimeout(checkProximity, 100);
    const pixelsPerSecond = 600;
    const pixelArtText = document.getElementById('pixel-art-text');
    let hasEnteredArcade = false;
    let hasEnteredRightRoom = false;
    function checkProximity() {
        const meepleRect = meeple.getBoundingClientRect();
        const arcadeRect = arcade.getBoundingClientRect();
        const isOverlapping = !(meepleRect.right < arcadeRect.left ||
                               meepleRect.left > arcadeRect.right ||
                               meepleRect.bottom < arcadeRect.top ||
                               meepleRect.top > arcadeRect.bottom);
        if (isOverlapping && !hasEnteredArcade) {
            hasEnteredArcade = true;
            showArcadeModal();
            return;
        }
        if (meepleRect.left > window.innerWidth * 0.85 && !hasEnteredRightRoom) {
            hasEnteredRightRoom = true;
            window.location.href = '/play-2.html';
            return;
        }
        const meepleCenterX = meepleRect.left + meepleRect.width / 2;
        const meepleCenterY = meepleRect.top + meepleRect.height / 2;
        const arcadeCenterX = arcadeRect.left + arcadeRect.width / 2;
        const arcadeCenterY = arcadeRect.top + arcadeRect.height / 2;
        const distance = Math.sqrt(
            Math.pow(meepleCenterX - arcadeCenterX, 2) +
            Math.pow(meepleCenterY - arcadeCenterY, 2)
        );
        if (distance < 150 && !hasEnteredArcade) {
            pixelArtText.style.opacity = '1';
            pixelArtText.style.left = arcadeCenterX + 'px';
            pixelArtText.style.top = (arcadeRect.top - 40) + 'px';
            pixelArtText.style.transform = 'translateX(-50%)';
        } else {
            pixelArtText.style.opacity = '0';
        }
        checkCoinCollection();
    }
    function checkCoinCollection() {
        if (collectibleCoin.style.display === 'none') return;
        const meepleRect = meeple.getBoundingClientRect();
        const coinRect = collectibleCoin.getBoundingClientRect();
        const isOverlapping = !(meepleRect.right < coinRect.left ||
                               meepleRect.left > coinRect.right ||
                               meepleRect.bottom < coinRect.top ||
                               meepleRect.top > coinRect.bottom);
        if (isOverlapping) {
            collectCoin();
        }
    }
    function collectCoin() {
        collectibleCoin.style.display = 'none';
        safeSetItem('lastCoinCollected', Date.now().toString());
        const currentCoins = parseInt(safeGetItem('totalCoins', '0'));
        const newCoins = currentCoins + 1;
        safeSetItem('totalCoins', newCoins.toString());
        coinCountElement.textContent = newCoins;
        if (marketModal.style.display === 'flex') {
            updateMarketButtons();
        }
        if (playerMenu.style.display === 'block') {
            updatePlayerMenuCoins();
        }
        setTimeout(respawnCoin, Math.random() * 10000 + 5000);
    }
    function respawnCoin() {
        collectibleCoin.style.display = 'block';
    }
    function moveMeeple(targetX, targetY) {
        const playerWidth = 256;
        const playerHeight = 256;
        targetX = Math.max(0, Math.min(targetX, window.innerWidth - playerWidth));
        targetY = Math.max(0, Math.min(targetY, window.innerHeight - playerHeight));
        const rect = meeple.getBoundingClientRect();
        const currentX = rect.left;
        const currentY = rect.top;
        const distance = Math.sqrt(Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2));
        const duration = distance / pixelsPerSecond;
        meeple.style.transition = `all ${duration}s ease-in-out`;
        meeple.style.left = targetX + 'px';
        meeple.style.top = targetY + 'px';
        meeple.style.transform = 'none';
        if (currentlyEquippedItem) {
            equippedHat.style.transition = `all ${duration}s ease-in-out`;
            equippedHat.style.left = (targetX + meeple.clientWidth / 2 - 32) + 'px';
            equippedHat.style.top = (targetY + 10) + 'px';
        }
        setTimeout(function() {
            checkProximity();
            if (currentlyEquippedItem) {
                equippedHat.style.transition = '';
            }
        }, duration * 1000);
    }
    const totalCoins = parseInt(safeGetItem('totalCoins', '0'));
    document.getElementById('coin-count').textContent = totalCoins;

    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY, initialX, initialY, currentX, currentY;
        let animationId = null;

        element.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = element.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            currentX = initialX;
            currentY = initialY;
            element.style.cursor = 'grabbing';
            element.style.position = 'fixed';
        });

        function updatePosition() {
            if (!isDragging) {
                animationId = null;
                return;
            }
            const elementRect = element.getBoundingClientRect();
            const elementWidth = elementRect.width;
            const elementHeight = elementRect.height;
            currentX = Math.max(0, Math.min(currentX, window.innerWidth - elementWidth));
            currentY = Math.max(0, Math.min(currentY, window.innerHeight - elementHeight));
            element.style.left = currentX + 'px';
            element.style.top = currentY + 'px';
            element.style.right = 'auto';
            animationId = requestAnimationFrame(updatePosition);
        }

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                currentX = initialX + dx;
                currentY = initialY + dy;
                if (!animationId) {
                    animationId = requestAnimationFrame(updatePosition);
                }
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            element.style.cursor = 'move';
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    }

    makeDraggable(document.getElementById('coin-counter'));
    makeDraggable(document.getElementById('map-btn'));

    function updateMarketButtons() {
        const currentCoins = parseInt(safeGetItem('totalCoins', '0'));
        const hatBtn = document.getElementById('hat-buy-btn');
        const pirateHatBtn = document.getElementById('pirate-hat-buy-btn');
        const hatPurchased = safeGetItem('hatPurchased') === 'true';
        const pirateHatPurchased = safeGetItem('pirateHatPurchased') === 'true';
        if (hatPurchased) {
            hatBtn.textContent = 'Bought';
            hatBtn.style.background = 'rgba(34,139,34,0.8)';
            hatBtn.style.color = 'white';
            hatBtn.style.borderColor = '#228B22';
            hatBtn.style.cursor = 'default';
            hatBtn.disabled = true;
        } else if (currentCoins >= 100) {
            hatBtn.textContent = 'Buy';
            hatBtn.style.background = 'rgba(0,0,0,0.8)';
            hatBtn.style.color = 'white';
            hatBtn.style.borderColor = '#8B4513';
            hatBtn.style.cursor = 'pointer';
            hatBtn.disabled = false;
        } else {
            hatBtn.textContent = 'Buy';
            hatBtn.style.background = 'rgba(128,128,128,0.5)';
            hatBtn.style.color = 'rgba(255,255,255,0.5)';
            hatBtn.style.borderColor = 'rgba(139,69,19,0.5)';
            hatBtn.style.cursor = 'not-allowed';
            hatBtn.disabled = true;
        }
        if (pirateHatPurchased) {
            pirateHatBtn.textContent = 'Bought';
            pirateHatBtn.style.background = 'rgba(34,139,34,0.8)';
            pirateHatBtn.style.color = 'white';
            pirateHatBtn.style.borderColor = '#228B22';
            pirateHatBtn.style.cursor = 'default';
            pirateHatBtn.disabled = true;
        } else if (currentCoins >= 250) {
            pirateHatBtn.textContent = 'Buy';
            pirateHatBtn.style.background = 'rgba(0,0,0,0.8)';
            pirateHatBtn.style.color = 'white';
            pirateHatBtn.style.borderColor = '#8B4513';
            pirateHatBtn.style.cursor = 'pointer';
            pirateHatBtn.disabled = false;
        } else {
            pirateHatBtn.textContent = 'Buy';
            pirateHatBtn.style.background = 'rgba(128,128,128,0.5)';
            pirateHatBtn.style.color = 'rgba(255,255,255,0.5)';
            pirateHatBtn.style.borderColor = 'rgba(139,69,19,0.5)';
            pirateHatBtn.style.cursor = 'not-allowed';
            pirateHatBtn.disabled = true;
        }
    }
    function buyHat() {
        const currentCoins = parseInt(safeGetItem('totalCoins', '0'));
        if (currentCoins >= 100) {
            const newCoins = currentCoins - 100;
            safeSetItem('totalCoins', newCoins.toString());
            safeSetItem('hatPurchased', 'true');
            document.getElementById('coin-count').textContent = newCoins;
            updateMarketButtons();
            if (playerMenu.style.display === 'block') {
                updatePlayerMenuCoins();
            }
        }
    }
    function buyPirateHat() {
        const currentCoins = parseInt(safeGetItem('totalCoins', '0'));
        if (currentCoins >= 250) {
            const newCoins = currentCoins - 250;
            safeSetItem('totalCoins', newCoins.toString());
            safeSetItem('pirateHatPurchased', 'true');
            document.getElementById('coin-count').textContent = newCoins;
            updateMarketButtons();
            if (playerMenu.style.display === 'block') {
                updatePlayerMenuCoins();
            }
        }
    }
    modalNewsBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        welcomeModal.style.display = 'none';
        newsModal.style.display = 'flex';
        showPage(1);
    });
    shopNewsBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        marketModal.style.display = 'none';
        newsModal.style.display = 'flex';
        showPage(1);
    });
    closeWelcomeModalBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        welcomeModal.style.display = 'none';
    });
    mapBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        mapModal.style.display = 'flex';
        mapScale = 1;
        updateMapTransform();
        marketText.classList.add('current-location');
        lighthouseText.classList.remove('current-location');
    });

    zoomInBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        zoomIn();
    });

    zoomOutBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        zoomOut();
    });

    const marketText = document.getElementById('market-text');
    marketText.addEventListener('click', function(event) {
        event.stopPropagation();
        window.location.href = 'play.html';
    });
    const lighthouseText = document.getElementById('lighthouse-text');
    lighthouseText.addEventListener('click', function(event) {
        event.stopPropagation();
        window.location.href = 'play-2.html';
    });
    closeModalBtn.addEventListener('click', function() {
        newsModal.style.display = 'none';
    });
    const closeMapModalBtn = document.getElementById('close-map-modal-btn');
    closeMapModalBtn.addEventListener('click', function() {
        mapModal.style.display = 'none';
    });
    newsModal.addEventListener('click', function(event) {
        if (event.target === newsModal) {
            newsModal.style.display = 'none';
        }
    });
    mapModal.addEventListener('click', function(event) {
        if (event.target === mapModal) {
            mapModal.style.display = 'none';
        }
    });
    marketImg.addEventListener('click', function() {
        marketModal.style.display = 'flex';
        updateMarketButtons();
    });
    document.getElementById('hat-buy-btn').addEventListener('click', function() {
        if (!this.disabled) {
            buyHat();
        }
    });
    document.getElementById('pirate-hat-buy-btn').addEventListener('click', function() {
        if (!this.disabled) {
            buyPirateHat();
        }
    });
    function updatePlayerMenuCoins() {
        const currentCoins = parseInt(safeGetItem('totalCoins', '0'));
        document.getElementById('menu-coin-count').textContent = currentCoins;
    }
    function updateInventoryDisplay(searchTerm = '') {
        inventoryContent.innerHTML = '';
        const hatPurchased = safeGetItem('hatPurchased') === 'true';
        const pirateHatPurchased = safeGetItem('pirateHatPurchased') === 'true';
        const crownEarned = safeGetItem('crownEarned') === 'true';
        const items = [];
        if (hatPurchased) {
            items.push({ name: 'Hat', img: '/static/hat.png', rarity: 'common' });
        }
        if (pirateHatPurchased) {
            items.push({ name: 'Pirate Hat', img: '/static/pirate_hat.png', rarity: 'rare' });
        }
        if (crownEarned) {
            items.push({ name: 'Crown', img: '/static/crown.png', rarity: 'legendary' });
        }
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredItems.length === 0) {
            const noItemsDiv = document.createElement('div');
            noItemsDiv.style.gridColumn = '1 / -1';
            noItemsDiv.style.textAlign = 'center';
            noItemsDiv.style.padding = '3rem';
            noItemsDiv.innerHTML = `
                <div style="color: #8B4513; font-family: 'Georgia', serif; font-size: 1.2rem; font-style: italic; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                    ${searchTerm ? 'No treasures match your search' : 'No treasures collected yet'}
                </div>
                <div style="color: #666; font-family: 'Georgia', serif; font-size: 0.9rem; margin-top: 0.5rem;">
                    ${searchTerm ? 'Try a different search term' : 'Complete quests and games to earn items!'}
                </div>
            `;
            inventoryContent.appendChild(noItemsDiv);
        } else {
            filteredItems.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                const isEquipped = currentlyEquippedItem === item.name;
                const rarityColors = {
                    common: { bg: 'linear-gradient(135deg, rgba(220,220,220,0.9) 0%, rgba(200,200,200,0.9) 100%)', border: 'rgba(150,150,150,0.8)', glow: 'rgba(150,150,150,0.3)' },
                    rare: { bg: 'linear-gradient(135deg, rgba(220,220,220,0.9) 0%, rgba(200,200,200,0.9) 100%)', border: 'rgba(150,150,150,0.8)', glow: 'rgba(150,150,150,0.3)' },
                    legendary: { bg: 'linear-gradient(135deg, rgba(220,220,220,0.9) 0%, rgba(200,200,200,0.9) 100%)', border: 'rgba(150,150,150,0.8)', glow: 'rgba(150,150,150,0.3)' }
                };
                const colors = rarityColors[item.rarity] || rarityColors.common;
                itemDiv.style.background = colors.bg;
                itemDiv.style.border = `3px solid ${colors.border}`;
                itemDiv.style.borderRadius = '16px';
                itemDiv.style.padding = '1.5rem 1rem';
                itemDiv.style.cursor = 'pointer';
                itemDiv.style.boxShadow = isEquipped ? `0 0 15px ${colors.glow}, 0 4px 12px rgba(0,0,0,0.2)` : '0 4px 12px rgba(0,0,0,0.2)';
                itemDiv.style.position = 'relative';
                itemDiv.style.overflow = 'hidden';
                itemDiv.style.animation = `itemFadeIn 0.3s ease-out ${index * 0.05}s both`;
                if (isEquipped) {
                    itemDiv.style.borderColor = '#FFD700';
                    itemDiv.innerHTML = `
                        <div style="position: absolute; top: 8px; right: 8px; background: #FFD700; color: #8B4513; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">✓</div>
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
                            <img src="${item.img}" alt="${item.name}" style="width: 64px; height: 64px; image-rendering: pixelated; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
                            <div style="text-align: center;">
                                <div style="color: #2F1B14; font-family: 'Georgia', serif; font-size: 1rem; font-weight: bold; margin-bottom: 0.25rem;">${item.name}</div>
                                <div style="color: #FFD700; font-family: 'Georgia', serif; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Equipped</div>
                            </div>
                        </div>
                    `;
                } else {
                    itemDiv.innerHTML = `
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
                            <img src="${item.img}" alt="${item.name}" style="width: 64px; height: 64px; image-rendering: pixelated; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
                            <div style="text-align: center;">
                                <div style="color: #2F1B14; font-family: 'Georgia', serif; font-size: 1rem; font-weight: bold;">${item.name}</div>
                                <div style="color: ${colors.border}; font-family: 'Georgia', serif; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 0.25rem;">${item.rarity}</div>
                            </div>
                        </div>
                    `;
                }
                itemDiv.addEventListener('click', function(event) {
                    event.stopPropagation();
                    selectedItemForEquip = item.name;
                    const rect = itemDiv.getBoundingClientRect();
                    const modalRect = inventoryModal.getBoundingClientRect();
                    itemMenu.style.left = (rect.left - modalRect.left + rect.width / 2 - 75) + 'px';
                    itemMenu.style.top = (rect.top - modalRect.top - 60) + 'px';
                    if (currentlyEquippedItem === item.name) {
                        equipBtn.textContent = 'Unequip';
                        equipBtn.style.background = 'linear-gradient(135deg, rgba(139,69,19,0.9) 0%, rgba(101,67,33,0.9) 100%)';
                        equipBtn.style.borderColor = '#654321';
                        equipBtn.style.boxShadow = '0 4px 12px rgba(139,69,19,0.4)';
                    } else {
                        equipBtn.textContent = 'Equip';
                        equipBtn.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(30,30,30,0.9) 100%)';
                        equipBtn.style.borderColor = '#8B4513';
                        equipBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
                    }
                    itemMenu.style.display = 'block';
                    itemMenu.style.animation = 'menuPopIn 0.2s ease-out';
                });
                inventoryContent.appendChild(itemDiv);
            });
        }
    }
    inventoryBtn.addEventListener('click', function() {
        updateInventoryDisplay();
        inventoryModal.style.display = 'flex';
    });
    meeple.addEventListener('click', function(event) {
        event.stopPropagation();
        if (playerMenu.style.display === 'none' || playerMenu.style.display === '') {
            const meepleRect = meeple.getBoundingClientRect();
            playerMenu.style.left = (meepleRect.right + 20) + 'px';
            playerMenu.style.top = (meepleRect.top - 50) + 'px';
            updatePlayerMenuCoins();
            playerMenu.style.display = 'block';
        } else {
            playerMenu.style.display = 'none';
        }
    });
    closeMarketModalBtn.addEventListener('click', function() {
        marketModal.style.display = 'none';
    });
    marketTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            marketTabs.forEach(t => {
                t.classList.remove('active');
                t.style.background = 'rgba(139, 69, 19, 0.7)';
            });
            this.classList.add('active');
            this.style.background = 'rgba(139, 69, 19, 0.9)';
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            const activeContent = document.getElementById(tabType + '-content');
            if (activeContent) {
                activeContent.style.display = 'flex';
                activeContent.classList.add('active');
            }
        });
    });
    closePlayerMenuBtn.addEventListener('click', function() {
        playerMenu.style.display = 'none';
    });
    closeInventoryModalBtn.addEventListener('click', function() {
        inventoryModal.style.display = 'none';
        itemMenu.style.display = 'none';
    });
    inventoryModal.addEventListener('click', function(event) {
        if (event.target === inventoryModal) {
            inventoryModal.style.display = 'none';
        }
    });
    inventorySearch.addEventListener('input', function() {
        updateInventoryDisplay(this.value);
        itemMenu.style.display = 'none';
    });
    equipBtn.addEventListener('click', function() {
        if (selectedItemForEquip) {
            if (currentlyEquippedItem === selectedItemForEquip) {
                unequipItem();
                alert(`Unequipped ${selectedItemForEquip}!`);
            } else {
                equipItem(selectedItemForEquip);
                alert(`Equipped ${selectedItemForEquip}!`);
            }
            itemMenu.style.display = 'none';
            selectedItemForEquip = null;
        }
    });
    closeItemMenuBtn.addEventListener('click', function() {
        itemMenu.style.display = 'none';
        selectedItemForEquip = null;
    });
    closeCrownModalBtn.addEventListener('click', function() {
        crownAwardModal.style.display = 'none';
    });
    catchGameBtn.addEventListener('click', function() {
        window.location.href = '/arcade-1.html';
    });
    fishingFrenzyBtn.addEventListener('click', function() {
        const hasVisitedLighthouse = safeGetItem('hasVisitedLighthouse') === 'true';
        if (hasVisitedLighthouse) {
            window.location.href = '/fishing-frenzy-menu.html';
        }
    });
    arcadeBackBtn.addEventListener('click', function() {
        arcadeModal.style.display = 'none';
        hasEnteredArcade = false;
    });
    crownAwardModal.addEventListener('click', function(event) {
        if (event.target === crownAwardModal) {
            crownAwardModal.style.display = 'none';
        }
    });
    arcadeModal.addEventListener('click', function(event) {
        if (event.target === arcadeModal) {
            arcadeModal.style.display = 'none';
            hasEnteredArcade = false;
        }
    });
    inventoryModal.addEventListener('click', function(event) {
        if (event.target === inventoryModal) {
            inventoryModal.style.display = 'none';
            itemMenu.style.display = 'none';
        }
    });
    welcomeModal.addEventListener('click', function(event) {
        if (event.target === welcomeModal) {
            welcomeModal.style.display = 'none';
        }
    });
    marketModal.addEventListener('click', function(event) {
        if (event.target === marketModal) {
            marketModal.style.display = 'none';
        }
    });
    function showPage(pageNum) {
        currentPage = pageNum;
        if (pageNum === 1) {
            newsPage1.style.display = 'flex';
            newsPage2.style.display = 'none';
            prevPageBtn.style.display = 'none';
            nextPageBtn.style.display = 'block';
            pageDot1.style.background = 'white';
            pageDot2.style.background = 'rgba(255,255,255,0.5)';
        } else if (pageNum === 2) {
            newsPage1.style.display = 'none';
            newsPage2.style.display = 'flex';
            prevPageBtn.style.display = 'block';
            nextPageBtn.style.display = 'none';
            pageDot1.style.background = 'rgba(255,255,255,0.5)';
            pageDot2.style.background = 'white';
        }
    }
    nextPageBtn.addEventListener('click', function() {
        if (currentPage < 2) {
            showPage(currentPage + 1);
        }
    });
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });
    const moveSpeed = 300, keysPressed = {};
    let movementAnimationId = null;

    function updateMovement() {
        const rect = meeple.getBoundingClientRect();
        let deltaX = 0;
        let deltaY = 0;
        const currentSpeed = keysPressed['Shift'] ? moveSpeed * 2 : moveSpeed;
        if (keysPressed['w'] || keysPressed['W']) deltaY -= currentSpeed / 60;
        if (keysPressed['s'] || keysPressed['S']) deltaY += currentSpeed / 60;
        if (keysPressed['a'] || keysPressed['A']) deltaX -= currentSpeed / 60;
        if (keysPressed['d'] || keysPressed['D']) deltaX += currentSpeed / 60;

        let moved = false;
        if (deltaX !== 0 || deltaY !== 0) {
            let targetX = rect.left + deltaX;
            let targetY = rect.top + deltaY;
            const playerWidth = 256;
            const playerHeight = 256;
            targetX = Math.max(0, Math.min(targetX, window.innerWidth - playerWidth));
            targetY = Math.max(0, Math.min(targetY, window.innerHeight - playerHeight));
            meeple.style.left = targetX + 'px';
            meeple.style.top = targetY + 'px';
            meeple.style.transform = 'none';
            if (currentlyEquippedItem) {
                positionHat();
            }
            moved = true;
        }

        if (arcadeModal.style.display === 'flex') {
            const arcadeRect = arcade.getBoundingClientRect();
            const isStillOverlapping = !(rect.right < arcadeRect.left ||
                                       rect.left > arcadeRect.right ||
                                       rect.bottom < arcadeRect.top ||
                                       rect.top > arcadeRect.bottom);
            if (!isStillOverlapping) {
                arcadeModal.style.display = 'none';
                hasEnteredArcade = false;
            }
        }

        // Only continue animation if there are still keys pressed
        if (Object.keys(keysPressed).length > 0 && (keysPressed['w'] || keysPressed['W'] || keysPressed['s'] || keysPressed['S'] || keysPressed['a'] || keysPressed['A'] || keysPressed['d'] || keysPressed['D'])) {
            movementAnimationId = requestAnimationFrame(updateMovement);
        } else {
            movementAnimationId = null;
        }

        if (moved) {
            checkProximity();
        }
    }
    document.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase();
        if (key.match(/[wasd]/)) {
            keysPressed[event.key] = true;
            event.preventDefault();
            if (!movementAnimationId) {
                movementAnimationId = requestAnimationFrame(updateMovement);
            }
        }
        if (event.key === 'Shift') {
            keysPressed['Shift'] = true;
        }
    });
    document.addEventListener('keyup', function(event) {
        const key = event.key.toLowerCase();
        if (key.match(/[wasd]/)) {
            delete keysPressed[event.key];
            event.preventDefault();
        }
        if (event.key === 'Shift') {
            delete keysPressed['Shift'];
        }
    });

    // Cleanup function for memory management
    function cleanup() {
        if (movementAnimationId) {
            cancelAnimationFrame(movementAnimationId);
            movementAnimationId = null;
        }
    }

    // Clean up on page unload
    window.addEventListener('beforeunload', cleanup);

    window.addEventListener('resize', function() {
        const playerWidth = 256;
        const playerHeight = 256;
        const meepleRect = meeple.getBoundingClientRect();
        let newLeft = parseFloat(meeple.style.left) || meepleRect.left;
        let newTop = parseFloat(meeple.style.top) || meepleRect.top;
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - playerWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - playerHeight));
        meeple.style.left = newLeft + 'px';
        meeple.style.top = newTop + 'px';
        if (currentlyEquippedItem) {
            equippedHat.style.left = (newLeft + meeple.clientWidth / 2 - 32) + 'px';
            equippedHat.style.top = (newTop + 10) + 'px';
        }
    });
    document.addEventListener('click', function(event) {
        if (playerMenu.style.display === 'block' && !playerMenu.contains(event.target) && event.target !== meeple) {
            playerMenu.style.display = 'none';
        }
        const isButton = event.target.tagName === 'BUTTON' || event.target.closest('button');
        const isInteractive = event.target === marketImg || event.target === meeple || event.target === inventoryBtn;
        const isItemMenu = event.target.closest('#item-menu');
        if (!isButton && !isInteractive && !isItemMenu) {
            const rect = meeple.getBoundingClientRect();
            const arcadeRect = arcade.getBoundingClientRect();
            let targetX = event.clientX - 128;
            let targetY = event.clientY - 128;
            moveMeeple(targetX, targetY);
        }
    });
});
function createContextMenu(event) {
    event.preventDefault();
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: fixed; top: ${event.clientY}px; left: ${event.clientX}px;
        background: #333; color: #fff; padding: 10px; border-radius: 8px;
        z-index: 9999; font-family: 'Fredoka One', cursive; font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    `;
    menu.innerHTML = `
        <div style="margin-bottom: 8px;"><b>Navigation</b></div>
        <div onclick="window.location.href='/index.html'" style="cursor:pointer;padding:4px 8px;border-radius:4px;margin:2px 0;">🏠 Home</div>
        <div onclick="window.location.href='/arcade-menu.html'" style="cursor:pointer;padding:4px 8px;border-radius:4px;margin:2px 0;">🎮 Arcade</div>
        <div onclick="window.location.href='/fishing-frenzy-menu.html'" style="cursor:pointer;padding:4px 8px;border-radius:4px;margin:2px 0;">🎣 Fishing</div>
    `;
    document.body.appendChild(menu);
    setTimeout(() => menu.remove(), 5000);
    document.addEventListener('click', () => menu.remove(), { once: true });
}

document.addEventListener('contextmenu', createContextMenu);
