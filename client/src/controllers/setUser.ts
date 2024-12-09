import { User } from "./../models/userModel";

export const registerToDB = async (clientData: User) => {
    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error setting user:', error);
        throw error;
    }
};