import { fetchFoods, addFood, deleteFood } from './api.js';
import { renderFoodList, filterFoodList, updateTurntableAppearance, spinTurntable, showModal, hideModal } from './ui.js';

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

    // --- State ---
    let foods = []; // Initialize as empty, will be loaded from API

    // --- Functions ---

    const loadAndRenderFoods = async () => {
        foods = await fetchFoods();
        renderFoodList(foods, foodList, handleDeleteFood);
    };

    const handleAddFood = async () => {
        const newFoodName = newFoodNameInput.value.trim();
        const newFoodImage = newFoodImageInput.value.trim();
        const newFoodLocation = newFoodLocationInput.value.trim();
        const newFoodTags = newFoodTagsInput.value.trim().split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        if (!newFoodName) {
            alert('美食名称不能为空！');
            return;
        }

        try {
            await addFood({ name: newFoodName, image: newFoodImage, location: newFoodLocation, tags: newFoodTags });
            hideModal(addFoodModal);
            newFoodNameInput.value = '';
            newFoodImageInput.value = '';
            newFoodLocationInput.value = '';
            newFoodTagsInput.value = '';
            loadAndRenderFoods(); // Reload and render foods after adding
        } catch (error) {
            // Error handled in api.js, just log here if needed
            console.error('Failed to add food in main.js:', error);
        }
    };

    const handleDeleteFood = async (event) => {
        if (event.target.classList.contains('delete-button')) {
            const foodCard = event.target.closest('.food-card');
            if (foodCard) {
                const foodId = foodCard.dataset.id;
                if (!foodId) {
                    console.error('Food ID is missing for deletion.');
                    alert('无法删除美食：美食信息不完整。');
                    return;
                }
                try {
                    await deleteFood(foodId);
                    alert('美食删除成功！');
                    loadAndRenderFoods(); // Reload and render foods after deleting
                } catch (error) {
                    console.error('Failed to delete food in main.js:', error);
                }
            }
        }
    };

    // --- Event Listeners ---

    foodList.addEventListener('click', handleDeleteFood);

    searchInput.addEventListener('input', () => filterFoodList(searchInput, foodList));

    openTurntableButton.addEventListener('click', () => {
        updateTurntableAppearance(foods, turntable, 0); // Pass 0 for initial rotation
        resultDisplay.textContent = '';
        showModal(turntableModal);
    });

    turntableCloseButton.addEventListener('click', () => {
        hideModal(turntableModal);
    });

    window.addEventListener('click', (e) => {
        if (e.target === turntableModal) {
            hideModal(turntableModal);
        }
    });

    spinButton.addEventListener('click', () => spinTurntable(foods, turntable, resultDisplay, spinButton));

    // Add Food Modal Event Listeners
    if (openAddFoodModalButton) {
        openAddFoodModalButton.addEventListener('click', () => {
            showModal(addFoodModal);
        });
    }

    if (addFoodCloseButton) {
        addFoodCloseButton.addEventListener('click', () => {
            hideModal(addFoodModal);
        });
    }

    if (confirmAddFoodButton) {
        confirmAddFoodButton.addEventListener('click', handleAddFood);
    }

    // Close add food modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addFoodModal) {
            hideModal(addFoodModal);
        }
    });

    // --- Initial Load ---
    loadAndRenderFoods();
});
