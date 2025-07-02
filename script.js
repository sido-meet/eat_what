document.addEventListener('DOMContentLoaded', () => {
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
    

    // --- State ---
    let foods = []; // Initialize as empty, will be loaded from JSON or localStorage
    let currentRotation = 0;

    const DEFAULT_FOOD_IMAGE = 'https://via.placeholder.com/150?text=No+Image'; // Default image URL

    // --- Functions ---

    /**
     * Loads food data from foods.json or localStorage
     */
    const loadFoods = async () => {
        try {
            const response = await fetch('data/foods.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonFoods = await response.json();
            foods = jsonFoods;
            // If localStorage has data, merge it or prioritize it
            const localFoods = JSON.parse(localStorage.getItem('foods'));
            if (localFoods && localFoods.length > 0) {
                // Simple merge: add local foods not present in JSON
                localFoods.forEach(localFood => {
                    if (!foods.some(food => food.name === localFood.name)) {
                        foods.push(localFood);
                    }
                });
            }
        } catch (error) {
            console.error('Could not load foods from JSON, falling back to localStorage or default:', error);
            foods = JSON.parse(localStorage.getItem('foods')) || [
                {
                    name: '兰州拉面',
                    image: '',
                    location: '东吴面馆旁边',
                    tags: ['清真', '面食']
                },
                {
                    name: '东吴面馆',
                    image: '',
                    location: '兰州拉面旁边',
                    tags: ['苏式', '面食']
                },
                {
                    name: '肯德基',
                    image: '',
                    location: '校门口',
                    tags: ['快餐', '炸鸡']
                }
            ];
        }
        renderFoodList();
    };

    // --- Initial Load ---
    loadFoods();
});
