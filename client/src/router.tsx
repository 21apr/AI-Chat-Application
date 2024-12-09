import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Register from "./view/pages/authorization/Register";
import Login from "./view/pages/authorization/Login";
import Chat from "./view/pages/chats/Chat";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/chats/:chatId",
        element: <Chat />
    }
])