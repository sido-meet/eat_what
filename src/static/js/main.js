import { fetchFoods, addFood, deleteFood, updateFood, uploadImage } from './api.js';
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
    const newFoodImageFileInput = document.getElementById('new-food-image-file');
    const newFoodLocationInput = document.getElementById('new-food-location');
    const newFoodTagsInput = document.getElementById('new-food-tags');
    const confirmAddFoodButton = document.getElementById('confirm-add-food-button');

    // Elements for Edit Food Modal
    const editFoodModal = document.getElementById('edit-food-modal');
    const editFoodCloseButton = document.querySelector('.edit-food-close-button');
    const editFoodIdInput = document.getElementById('edit-food-id');
    const editFoodNameInput = document.getElementById('edit-food-name');
    const editFoodImageInput = document.getElementById('edit-food-image');
    const editFoodImageFileInput = document.getElementById('edit-food-image-file');
    const editFoodLocationInput = document.getElementById('edit-food-location');
    const editFoodTagsInput = document.getElementById('edit-food-tags');
    const confirmEditFoodButton = document.getElementById('confirm-edit-food-button');

    // --- State ---
    let foods = []; // Initialize as empty, will be loaded from API

    // --- Functions ---

    const loadAndRenderFoods = async () => {
        foods = await fetchFoods();
        renderFoodList(foods, foodList);
    };

    const openEditFoodModal = (food) => {
        editFoodIdInput.value = food.id;
        editFoodNameInput.value = food.name;
        editFoodImageInput.value = food.image || '';
        editFoodLocationInput.value = food.location || '';
        editFoodTagsInput.value = food.tags.join(', ');
        showModal(editFoodModal);
    };

    const handleEditFood = async () => {
        const foodId = editFoodIdInput.value;
        const updatedFoodName = editFoodNameInput.value.trim();
        const updatedFoodLocation = editFoodLocationInput.value.trim();
        const updatedFoodTags = editFoodTagsInput.value.trim().split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        const updatedFoodImageFile = editFoodImageFileInput.files[0]; // Get the file object
        const updatedFoodImageUrl = editFoodImageInput.value.trim(); // Get the URL from text input

        if (!updatedFoodName) {
            alert('美食名称不能为空！');
            return;
        }

        let imageUrl = updatedFoodImageUrl; // Default to URL from text input
        if (updatedFoodImageFile) {
            try {
                const uploadResponse = await uploadImage(updatedFoodImageFile);
                imageUrl = uploadResponse.url; // Override with uploaded image URL
            } catch (error) {
                console.error('Failed to upload image:', error);
                alert('图片上传失败，请重试或不上传图片。');
                return; // Stop if image upload fails
            }
        }

        try {
            await updateFood(foodId, { name: updatedFoodName, image: imageUrl, location: updatedFoodLocation, tags: updatedFoodTags });
            hideModal(editFoodModal);
            editFoodImageInput.value = ''; // Clear text input
            editFoodImageFileInput.value = ''; // Clear file input
            loadAndRenderFoods(); // Reload and render foods after updating
        } catch (error) {
            console.error('Failed to update food in main.js:', error);
        }
    };

    const handleAddFood = async () => {
        const newFoodName = newFoodNameInput.value.trim();
        const newFoodLocation = newFoodLocationInput.value.trim();
        const newFoodTags = newFoodTagsInput.value.trim().split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        const newFoodImageFile = newFoodImageFileInput.files[0]; // Get the file object
        const newFoodImageUrl = newFoodImageInput.value.trim(); // Get the URL from text input

        if (!newFoodName) {
            alert('美食名称不能为空！');
            return;
        }

        let imageUrl = newFoodImageUrl; // Default to URL from text input
        if (newFoodImageFile) {
            try {
                const uploadResponse = await uploadImage(newFoodImageFile);
                imageUrl = uploadResponse.url; // Override with uploaded image URL
            } catch (error) {
                console.error('Failed to upload image:', error);
                alert('图片上传失败，请重试或不上传图片。');
                return; // Stop if image upload fails
            }
        }

        try {
            await addFood({ name: newFoodName, image: imageUrl, location: newFoodLocation, tags: newFoodTags });
            hideModal(addFoodModal);
            newFoodNameInput.value = '';
            newFoodImageInput.value = ''; // Clear text input
            newFoodImageFileInput.value = ''; // Clear file input
            newFoodLocationInput.value = '';
            newFoodTagsInput.value = '';
            loadAndRenderFoods(); // Reload and render foods after adding
        } catch (error) {
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

    foodList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            handleDeleteFood(e);
        } else if (e.target.classList.contains('edit-button')) {
            const foodCard = e.target.closest('.food-card');
            if (foodCard) {
                const foodId = foodCard.dataset.id;
                const foodToEdit = foods.find(food => food.id == foodId);
                if (foodToEdit) {
                    openEditFoodModal(foodToEdit);
                }
            }
        }
    });

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
        } else if (e.target === addFoodModal) {
            hideModal(addFoodModal);
        } else if (e.target === editFoodModal) {
            hideModal(editFoodModal);
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

    // Edit Food Modal Event Listeners
    if (editFoodCloseButton) {
        editFoodCloseButton.addEventListener('click', () => {
            hideModal(editFoodModal);
        });
    }

    if (confirmEditFoodButton) {
        confirmEditFoodButton.addEventListener('click', handleEditFood);
    }

    // --- Initial Load ---
    loadAndRenderFoods();
});
