import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import NotFound from "../pages/NotFound";
import About from "../pages/About";
import Edit from "../pages/Edit";
import Passwords from "../pages/Passwords";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            {path: '/home', element: <Home />},
            {path: '/about', element: <About />},
            {path: '/edit', element: <Edit />},
            {path: '/passwords', element: <Passwords />},
            {path: '/not-found', element: <NotFound />},
            {path: '/', element: <Navigate replace to='home' />},
            {path: '*', element: <Navigate replace to='/not-found' />}
        ]
    }
]

export const router = createBrowserRouter(routes);