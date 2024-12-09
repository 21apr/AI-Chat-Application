import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Chat } from "../models/chatModel";
import { User } from "../models/userModel";

type UserContextType = {
  user: User | null; 
  userChats: Chat[] | null;
  loading: boolean;  
  error: string | null; 
  updateUser: (user: User) => void; 
  updateChats: (chats: Chat[]) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users/getUser");

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setUserChats(data.chats);
        } else if (response.status === 401) {
          setUser(null);
        } else {
          throw new Error("Failed to fetch user");
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  const updateChats = (newChats: Chat[]) => {
    setUserChats(newChats);
  };

  return (
    <UserContext.Provider value={{ user, loading, error, updateUser, updateChats, userChats }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};