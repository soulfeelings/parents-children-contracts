import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ContractsPage } from "./pages/Contracts/ContractsPage";
import { TasksPage } from "./pages/Tasks/TasksPage";
import { RewardsPage } from "./pages/Rewards/RewardsPage";
import { SettingsPage } from "./pages/Settings/SettingsPage";
import { LoginPage } from "./pages/Auth/LoginPage";
import { RegisterPage } from "./pages/Auth/RegisterPage";
import { ChildrenPage } from "./pages/ChildrenPage";
import { useSelector } from "react-redux";
import { RootState } from "./store";

// Компонент для защиты маршрутов
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useSelector((state: RootState) => state.auth);

  console.log("token", token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "contracts",
        element: <ContractsPage />,
      },
      {
        index: true,
        element: <ChildrenPage />,
      },
      {
        path: "tasks",
        element: <TasksPage />,
      },
      {
        path: "rewards",
        element: <RewardsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
