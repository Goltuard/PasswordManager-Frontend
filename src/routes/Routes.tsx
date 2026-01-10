import { createBrowserRouter, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Passwords from "../pages/Passwords";
import Edit from "../pages/Edit";
import Login from "../pages/Login";
import Setup from "../pages/Setup";

import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../components/AppLayout";

function hasMasterPassword(): boolean {
  return !!localStorage.getItem("masterPasswordHash");
}

function RootRedirect() {
  return <Navigate to={hasMasterPassword() ? "/login" : "/setup"} replace />;
}

function SetupGate() {
  return hasMasterPassword() ? (
    <Navigate to="/login" replace />
  ) : (
    <AppLayout>
      <Setup />
    </AppLayout>
  );
}

function LoginGate() {
  return hasMasterPassword() ? (
    <AppLayout>
      <Login />
    </AppLayout>
  ) : (
    <Navigate to="/setup" replace />
  );
}

export const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },

  {
    path: "/home",
    element: (
      <AppLayout>
        <Home />
      </AppLayout>
    ),
  },
  {
    path: "/about",
    element: (
      <AppLayout>
        <About />
      </AppLayout>
    ),
  },

  { path: "/setup", element: <SetupGate /> },
  { path: "/login", element: <LoginGate /> },

  {
    path: "/passwords",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Passwords />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/passwords/new",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Edit />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/passwords/:id/edit",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Edit />
        </AppLayout>
      </ProtectedRoute>
    ),
  },

  { path: "*", element: <RootRedirect /> },
]);
