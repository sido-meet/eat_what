const DEFAULT_FOOD_IMAGE = 'https://via.placeholder.com/150?text=No+Image';

export const renderFoodList = (foods, foodListElement, deleteCallback) => {
    foodListElement.innerHTML = '';
    foods.forEach((food, index) => {
        const li = document.createElement('li');
        li.className = 'food-card';
        li.dataset.id = food.id; // Use food.id instead of index

        const imageUrl = food.image || DEFAULT_FOOD_IMAGE;

        li.innerHTML = `
            <img src="${imageUrl}" alt="${food.name}" class="food-image">
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

export const updateTurntableAppearance = (foods, turntableElement, currentRotation) => {
    const itemCount = foods.length;
    if (itemCount === 0) return;
    const angleStep = 360 / itemCount;
    const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];
    
    let gradient = 'conic-gradient(';
    foods.forEach((food, i) => {
        const startAngle = i * angleStep;
        const endAngle = (i + 1) * angleStep;
        gradient += `${colors[i % colors.length]} ${startAngle}deg ${endAngle}deg`;
        if (i < itemCount - 1) {
            gradient += ', ';
        }
    });
    gradient += ')';
    turntableElement.style.transform = `rotate(${currentRotation}deg)`;

    const existingLabels = turntableElement.querySelectorAll('.food-label');
    existingLabels.forEach(label => label.remove());

    foods.forEach((food, i) => {
        const angle = (i + 0.5) * angleStep;
        const label = document.createElement('div');
        label.className = 'food-label';
        label.textContent = food.name;
        
        const radius = turntableElement.offsetWidth / 2 - 30; 
        const x = radius * Math.cos(angle * Math.PI / 180);
        const y = radius * Math.sin(angle * Math.PI / 180);
        
        label.style.transform = `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`;
        turntableElement.appendChild(label);
    });
};

export const spinTurntable = (foods, turntableElement, resultDisplayElement, spinButtonElement) => {
    if (foods.length === 0) {
        resultDisplayElement.textContent = '列表是空的，快去添加吧！';
        return;
    }

    resultDisplayElement.textContent = '...';
    spinButtonElement.disabled = true;

    const randomIndex = Math.floor(Math.random() * foods.length);
    const selectedFood = foods[randomIndex];
    const degreesPerItem = 360 / foods.length;
    const targetRotation = 360 * 5 + (360 - (randomIndex * degreesPerItem + degreesPerItem / 2));
    
    turntableElement.style.transform = `rotate(${targetRotation}deg)`;

    setTimeout(() => {
        resultDisplayElement.textContent = `结果: ${selectedFood.name}`;
        spinButtonElement.disabled = false;
    }, 4000); 
};

export const showModal = (modalElement) => {
    modalElement.classList.add('visible');
};

export const hideModal = (modalElement) => {
    modalElement.classList.remove('visible');
};
