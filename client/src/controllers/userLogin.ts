export const loginToDB = async (clientData: { email: string; password: string }) => {
    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });

        if (!response.ok) {
            alert('Login or Password is failed');
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error setting user:', error);
        throw error;
    }
};
