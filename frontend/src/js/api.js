const API_BASE_URL = 'http://localhost:3000/api';

export const fetchFoods = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/foods`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Could not load foods from API:', error);
        alert('无法加载美食数据，请检查后端服务是否运行。');
        return [];
    }
};

export const addFood = async (foodData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/foods`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(foodData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding food:', error);
        alert(`添加美食失败: ${error.message}`);
        throw error; // Re-throw to allow calling function to handle
    }
};

export const deleteFood = async (foodId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/foods/${foodId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting food:', error);
        alert(`删除美食失败: ${error.message}`);
        throw error; // Re-throw to allow calling function to handle
    }
};

export const updateFood = async (foodId, foodData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/foods/${foodId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(foodData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating food:', error);
        alert(`更新美食失败: ${error.message}`);
        throw error; // Re-throw to allow calling function to handle
    }
};
