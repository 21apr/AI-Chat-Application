import React from "react";
import { useUser } from "./../../../contexts/UserContext"; // Подключаем контекст

const Authorization: React.FC = () => {
  const { user, loading, error } = useUser(); // Получаем данные из контекста

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {user ? (
        <p>Hello, {user.firstName}!</p>
      ) : (
        <div style={{ display: "flex" , flexDirection: "row", alignItems: "center", gap: "10px", justifyContent: "right" }}>
          <p><strong>ATTENTION!</strong> You are not logged in. Your data will be lost!</p>
          <a href="/login" style={{ display: "block" }}>
            <button>Login</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Authorization;