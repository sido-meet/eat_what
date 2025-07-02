document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded.');

    // --- DOM Elements ---
    const searchInput = document.getElementById('search-input');
    const foodList = document.getElementById('food-list');
    const openTurntableButton = document.getElementById('open-turntable-button');
    
    const turntableModal = document.getElementById('turntable-modal');
    const turntableCloseButton = document.querySelector('#turntable-modal .close-button');
    const spinButton = document.getElementById('spin-button');
    const turntable = document.getElementById('turntable');
    const resultDisplay = document.getElementById('result');

    // New elements for Add Food Modal
    const openAddFoodModalButton = document.getElementById('open-add-food-modal-button');
    const addFoodModal = document.getElementById('add-food-modal');
    const addFoodCloseButton = document.querySelector('.add-food-close-button');
    const newFoodNameInput = document.getElementById('new-food-name');
    const newFoodImageInput = document.getElementById('new-food-image');
    const newFoodLocationInput = document.getElementById('new-food-location');
    const newFoodTagsInput = document.getElementById('new-food-tags');
    const confirmAddFoodButton = document.getElementById('confirm-add-food-button');

    console.log('DOM Elements:', {
        searchInput, foodList, openTurntableButton,
        turntableModal, turntableCloseButton, spinButton, turntable, resultDisplay,
        openAddFoodModalButton, addFoodModal, addFoodCloseButton,
        newFoodNameInput, newFoodImageInput, newFoodLocationInput, newFoodTagsInput, confirmAddFoodButton
    });
    

    // --- State ---
    let foods = []; // Initialize as empty, will be loaded from API
    let currentRotation = 0;

    const DEFAULT_FOOD_IMAGE = 'https://via.placeholder.com/150?text=No+Image'; // Default image URL

    // --- Functions ---

    /**
     * Loads food data from the backend API
     */
    const loadFoods = async () => {
        try {
            console.log('Fetching foods from API...');
            const response = await fetch('http://localhost:3000/api/foods');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const apiFoods = await response.json();
            foods = apiFoods;
            console.log('Foods loaded from API:', foods);
        } catch (error) {
            console.error('Could not load foods from API:', error);
            // Fallback to an empty array or display an error message to the user
            foods = []; 
            alert('无法加载美食数据，请检查后端服务是否运行。');
        }
        renderFoodList();
    };

    /**
     * Renders the food list to the UI
     */
    const renderFoodList = () => {
        console.log('Rendering food list...');
        foodList.innerHTML = '';
        foods.forEach((food, index) => {
            const li = document.createElement('li');
            li.className = 'food-card';
            li.dataset.index = index;

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
            
            foodList.appendChild(li);
        });
        console.log('Food list rendered.');
    };

    /**
     * Adds a new food item to the list.
     */
    const addFood = async () => {
        const newFoodName = newFoodNameInput.value.trim();
        const newFoodImage = newFoodImageInput.value.trim();
        const newFoodLocation = newFoodLocationInput.value.trim();
        const newFoodTags = newFoodTagsInput.value.trim().split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        if (!newFoodName) {
            alert('美食名称不能为空！');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/foods', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newFoodName, image: newFoodImage, location: newFoodLocation, tags: newFoodTags })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const addedFood = await response.json();
            foods.push(addedFood);
            renderFoodList();
            addFoodModal.classList.remove('visible'); // Close modal after adding
            // Clear input fields
            newFoodNameInput.value = '';
            newFoodImageInput.value = '';
            newFoodLocationInput.value = '';
            newFoodTagsInput.value = '';
        } catch (error) {
            console.error('Error adding food:', error);
            alert(`添加美食失败: ${error.message}`);
        }
    };

    /**
     * Deletes a food item
     */
    const deleteFood = async (index) => {
        const foodToDelete = foods[index];
        if (!foodToDelete || !foodToDelete.id) {
            console.error('Food to delete or its ID is missing.', foodToDelete);
            alert('无法删除美食：美食信息不完整。');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/foods/${foodToDelete.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            foods.splice(index, 1);
            renderFoodList();
            alert('美食删除成功！');
        } catch (error) {
            console.error('Error deleting food:', error);
            alert(`删除美食失败: ${error.message}`);
        }
    };

    /**
     * Filters the food list based on search input
     */
    const filterList = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const listItems = foodList.querySelectorAll('.food-card');
        listItems.forEach(item => {
            const foodName = item.querySelector('.food-name').textContent.toLowerCase();
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
        turntable.style.transform = `rotate(${currentRotation}deg)`;

        // Clear existing labels
        const existingLabels = turntable.querySelectorAll('.food-label');
        existingLabels.forEach(label => label.remove());

        // Add new labels
        foods.forEach((food, i) => {
            const angle = (i + 0.5) * angleStep;
            const label = document.createElement('div');
            label.className = 'food-label';
            label.textContent = food.name;
            
            const radius = turntable.offsetWidth / 2 - 30; // Adjust as needed
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);
            
            label.style.transform = `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`;
            turntable.appendChild(label);
        });
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
            resultDisplay.textContent = `结果: ${selectedFood.name}`;
            spinButton.disabled = false;
        }, 4000); // Corresponds to the transition duration in CSS
    };

    // --- Event Listeners ---

    foodList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            // Find the closest parent with class 'food-card' to get its dataset.index
            const foodCard = e.target.closest('.food-card');
            if (foodCard) {
                const index = foodCard.dataset.index;
                deleteFood(index);
            }
        }
    });

    searchInput.addEventListener('input', filterList);

    openTurntableButton.addEventListener('click', () => {
        updateTurntableAppearance();
        resultDisplay.textContent = '';
        turntableModal.classList.add('visible');
    });

    turntableCloseButton.addEventListener('click', () => {
        turntableModal.classList.remove('visible');
    });

    window.addEventListener('click', (e) => {
        if (e.target === turntableModal) {
            turntableModal.classList.remove('visible');
        }
    });

    spinButton.addEventListener('click', spinTurntable);

    // Add Food Modal Event Listeners
    if (openAddFoodModalButton) {
        openAddFoodModalButton.addEventListener('click', () => {
            if (addFoodModal) {
                addFoodModal.classList.add('visible');
            }
        });
    }

    if (addFoodCloseButton) {
        addFoodCloseButton.addEventListener('click', () => {
            if (addFoodModal) {
                addFoodModal.classList.remove('visible');
            }
        });
    }

    if (confirmAddFoodButton) {
        confirmAddFoodButton.addEventListener('click', addFood);
    }

    // Close add food modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addFoodModal) {
            addFoodModal.classList.remove('visible');
        }
    });

    // --- Initial Load ---
    loadFoods();
});