import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import App from "../App";
import NotFound from "../pages/NotFound";
import Edit from "../pages/Edit";
import Passwords from "../pages/Passwords";
import LoginForm from "../pages/Login";
import RegisterForm from "../pages/Register";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            {path: '/edit', element: <Edit />},
            {path: '/edit/:id', element: <Edit />},
            {path: '/passwords', element: <Passwords />},
            {path: '/not-found', element: <NotFound />},
            {path: '/login', element: <LoginForm />},
            {path: '/register', element: <RegisterForm />},
            {path: '/', element: <Navigate replace to='passwords' />},
            {path: '*', element: <Navigate replace to='/not-found' />}
        ]
    }
]

export const router = createBrowserRouter(routes);