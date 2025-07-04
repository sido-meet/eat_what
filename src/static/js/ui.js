export const renderFoodList = (foods, foodListElement, deleteCallback) => {
    foodListElement.innerHTML = '';
    foods.forEach((food, index) => {
        const li = document.createElement('li');
        li.className = 'food-card';
        li.dataset.id = food.id; // Use food.id instead of index

        const imageUrl = food.image; // No default image here

        li.innerHTML = `
            ${imageUrl ? `<img src="${imageUrl}" alt="${food.name}" class="food-image">` : `<div class="food-image no-image"></div>`}
            <div class="food-card-content">
                <strong class="food-name">${food.name}</strong>
                <div class="food-details">
                    ${food.location ? `<span class="food-location">${food.location}</span>` : ''}
                    <div class="tags">
                        ${food.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
            <button class="delete-button">删除</button>
            <button class="edit-button">编辑</button>
        `;
        
        foodListElement.appendChild(li);
    });
};

export const filterFoodList = (searchInput, foodListElement) => {
    const searchTerm = searchInput.value.toLowerCase();
    const listItems = foodListElement.querySelectorAll('.food-card');
    listItems.forEach(item => {
        const foodName = item.querySelector('.food-name').textContent.toLowerCase();
        if (foodName.includes(searchTerm)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
};

export const updateTurntableAppearance = (foods, turntableElement) => {
    turntableElement.innerHTML = ''; // Clear existing content

    // Create 4 fixed sectors
    for (let i = 0; i < 4; i++) {
        const sector = document.createElement('div');
        sector.className = 'turntable-sector';
        sector.id = `sector-${i}`;
        if (foods.length > 0) {
            const randomFood = foods[Math.floor(Math.random() * foods.length)];
            sector.textContent = randomFood.name;
        } else {
            sector.textContent = '添加美食'; // Default text if no foods
        }
        turntableElement.appendChild(sector);
    }
};

export const spinTurntable = (foods, turntableElement, resultDisplayElement, spinButtonElement) => {
    if (foods.length === 0) {
        resultDisplayElement.textContent = '列表是空的，快去添加吧！';
        return;
    }

    resultDisplayElement.textContent = '...';
    spinButtonElement.disabled = true;

    const sectors = Array.from(turntableElement.querySelectorAll('.turntable-sector'));
    sectors.forEach(sector => sector.classList.remove('highlight'));

    const pointerElement = document.getElementById('pointer');

    // 1. Pre-select the final winning food and its sector
    const finalSelectedFood = foods[Math.floor(Math.random() * foods.length)];
    const finalSelectedSectorIndex = Math.floor(Math.random() * sectors.length);

    let flashInterval;
    let flashCount = 0;
    const totalFlashDuration = 3000; // Flash for 3 seconds
    const flashSpeed = 100; // Flash every 100ms

    // Start flashing food names
    flashInterval = setInterval(() => {
        const flashDurationElapsed = flashCount;
        const isSettlingPhase = flashDurationElapsed >= totalFlashDuration * 0.8; // Last 20% of flash duration

        sectors.forEach((sector, index) => {
            if (isSettlingPhase && index === finalSelectedSectorIndex) {
                sector.textContent = finalSelectedFood.name; // Settle the final food in its sector
            } else {
                const randomFood = foods[Math.floor(Math.random() * foods.length)];
                sector.textContent = randomFood.name;
            }
        });
        flashCount += flashSpeed;
        if (flashCount >= totalFlashDuration) {
            clearInterval(flashInterval);
        }
    }, flashSpeed);

    // Spin the pointer
    const totalSpinDuration = 4000; // Spin for 4 seconds

    // Define target angles for each sector (center of the sector's angular range)
    // Sector 0 (Top-Left): 270-360/0 -> center 315
    // Sector 1 (Top-Right): 0-90 -> center 45
    // Sector 2 (Bottom-Left): 180-270 -> center 225
    // Sector 3 (Bottom-Right): 90-180 -> center 135
    const sectorTargetAngles = [315, 45, 225, 135];
    const targetAngleForPointer = sectorTargetAngles[finalSelectedSectorIndex];

    // Add multiple full rotations to make it spin, and then land on the target angle
    // Add a small random offset to make it feel less predictable, but still within the sector
    const finalPointerRotation = 360 * 5 + targetAngleForPointer + (Math.random() * 30 - 15); // +/- 15 degrees wobble

    pointerElement.style.transition = 'none'; // Reset transition
    pointerElement.style.transform = `translateX(-50%) rotate(0deg)`; // Reset pointer rotation

    setTimeout(() => {
        pointerElement.style.transition = `transform ${totalSpinDuration / 1000}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        pointerElement.style.transform = `translateX(-50%) rotate(${finalPointerRotation}deg)`;
    }, 50); // Small delay to ensure transition reset takes effect

    // Determine and display final result after spin and flash
    setTimeout(() => {
        clearInterval(flashInterval); // Ensure flashing stops

        sectors.forEach((sector, index) => {
            if (index === finalSelectedSectorIndex) { // Use finalSelectedSectorIndex directly
                sector.textContent = finalSelectedFood.name;
                sector.classList.add('highlight');
            } else {
                sector.textContent = ''; // Clear other sectors
            }
        });

        resultDisplayElement.innerHTML = `<span style="font-size: 64px">😋</span>`;
        spinButtonElement.disabled = false;
    }, Math.max(totalFlashDuration, totalSpinDuration) + 500); // Wait for both flash and spin to complete + buffer
};

export const showModal = (modalElement) => {
    modalElement.classList.add('visible');
};

export const hideModal = (modalElement) => {
    modalElement.classList.remove('visible');
};
