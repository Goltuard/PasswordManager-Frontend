import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import NotFound from "../pages/NotFound";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            {path: '/', element: <Home />},
            {path: '/not-found', element: <NotFound />},
            {path: '*', element: <Navigate replace to='/not-found' />}
        ]
    }
]

export const router = createBrowserRouter(routes);