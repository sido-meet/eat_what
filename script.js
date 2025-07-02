document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const foodInput = document.getElementById('food-input');
    const addButton = document.getElementById('add-button');
    const searchInput = document.getElementById('search-input');
    const foodList = document.getElementById('food-list');
    const openTurntableButton = document.getElementById('open-turntable-button');
    
    const modal = document.getElementById('turntable-modal');
    const closeButton = document.querySelector('.close-button');
    const spinButton = document.getElementById('spin-button');
    const turntable = document.getElementById('turntable');
    const resultDisplay = document.getElementById('result');

    // --- State ---
    let foods = JSON.parse(localStorage.getItem('foods')) || ['兰州拉面', '东吴面馆', '肯德基', '汉堡王', '藏书羊肉', '次坞打面', '麻辣烫', '香锅'];
    let currentRotation = 0;

    // --- Functions ---

    /**
     * Renders the food list to the UI
     */
    const renderFoodList = () => {
        foodList.innerHTML = '';
        foods.forEach((food, index) => {
            const li = document.createElement('li');
            li.textContent = food;
            li.dataset.index = index;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.className = 'delete-button';
            
            li.appendChild(deleteButton);
            foodList.appendChild(li);
        });
    };

    /**
     * Saves the current food list to local storage
     */
    const saveFoods = () => {
        localStorage.setItem('foods', JSON.stringify(foods));
    };

    /**
     * Adds a new food item
     */
    const addFood = () => {
        const newFood = foodInput.value.trim();
        if (newFood && !foods.includes(newFood)) {
            foods.push(newFood);
            saveFoods();
            renderFoodList();
            foodInput.value = '';
        } else if (foods.includes(newFood)) {
            alert('这个已经添加过了！');
        }
    };

    /**
     * Deletes a food item
     */
    const deleteFood = (index) => {
        foods.splice(index, 1);
        saveFoods();
        renderFoodList();
    };

    /**
     * Filters the food list based on search input
     */
    const filterList = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const listItems = foodList.querySelectorAll('li');
        listItems.forEach(item => {
            const foodName = item.textContent.replace('删除', '').toLowerCase();
            if (foodName.includes(searchTerm)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    };

    /**
     * Updates the turntable's visual appearance based on the food list
     */
    const updateTurntableAppearance = () => {
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
        turntable.style.background = gradient;
    };

    /**
     * Spins the turntable to a random item
     */
    const spinTurntable = () => {
        if (foods.length === 0) {
            resultDisplay.textContent = '列表是空的，快去添加吧！';
            return;
        }

        resultDisplay.textContent = '...';
        spinButton.disabled = true;

        const randomIndex = Math.floor(Math.random() * foods.length);
        const selectedFood = foods[randomIndex];
        const degreesPerItem = 360 / foods.length;
        // Calculate rotation to point to the middle of the slice
        const targetRotation = 360 * 5 + (360 - (randomIndex * degreesPerItem + degreesPerItem / 2));
        
        currentRotation = targetRotation;
        turntable.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
            resultDisplay.textContent = `结果: ${selectedFood}`;
            spinButton.disabled = false;
        }, 4000); // Corresponds to the transition duration in CSS
    };

    // --- Event Listeners ---
    addButton.addEventListener('click', addFood);
    foodInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addFood();
        }
    });

    foodList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            const index = e.target.parentElement.dataset.index;
            deleteFood(index);
        }
    });

    searchInput.addEventListener('input', filterList);

    openTurntableButton.addEventListener('click', () => {
        updateTurntableAppearance();
        resultDisplay.textContent = '';
        modal.classList.add('visible');
    });

    closeButton.addEventListener('click', () => {
        modal.classList.remove('visible');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('visible');
        }
    });

    spinButton.addEventListener('click', spinTurntable);

    // --- Initial Load ---
    renderFoodList();
});
