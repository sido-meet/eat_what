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

});

document.addEventListener('DOMContentLoaded', () => {
    loadFoods();

    // --- Event Listeners ---
    openAddFoodModalButton.addEventListener('click', () => {
        addFoodModal.style.display = 'block';
    });

    addFoodCloseButton.addEventListener('click', () => {
        addFoodModal.style.display = 'none';
    });

    confirmAddFoodButton.addEventListener('click', () => {
        const name = newFoodNameInput.value.trim();
        const image = newFoodImageInput.value.trim();
        const location = newFoodLocationInput.value.trim();
        const tags = newFoodTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

        if (name) {
            addFood({ name, image, location, tags });
            newFoodNameInput.value = '';
            newFoodImageInput.value = '';
            newFoodLocationInput.value = '';
            newFoodTagsInput.value = '';
            addFoodModal.style.display = 'none';
        } else {
            alert('美食名称是必填项！');
        }
    });

    searchInput.addEventListener('input', filterFoods);

    // Close modals if user clicks outside of them
    window.addEventListener('click', (event) => {
        if (event.target === addFoodModal) {
            addFoodModal.style.display = 'none';
        }
        if (event.target === turntableModal) {
            turntableModal.style.display = 'none';
        }
    });
});

/**
 * Renders the list of foods to the DOM.
 * @param {Array<Object>} [foodArray=foods] - The array of foods to render. Defaults to the global foods array.
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
 * Adds a new food item to the list and saves to localStorage.
 * @param {Object} newFood - The new food object to add.
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
 * Saves the current foods array to localStorage.
 */
const saveFoods = () => {
    localStorage.setItem('foods', JSON.stringify(foods));
};

/**
 * Filters the food list based on search input.
 */
const filterFoods = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = foods.filter(food =>
        food.name.toLowerCase().includes(searchTerm) ||
        (food.location && food.location.toLowerCase().includes(searchTerm)) ||
        (food.tags && food.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
    renderFoodList(filtered);
};
