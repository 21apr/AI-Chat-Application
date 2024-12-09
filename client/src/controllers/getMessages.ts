export const getMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/api/users/${chatId}/messages`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("getMessages", data);
        return data;
      }

    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };