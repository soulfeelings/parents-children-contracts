import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { ContractsPage } from "./pages/Contracts/ContractsPage";
import { TasksPage } from "./pages/Tasks/TasksPage";
import { RewardsPage } from "./pages/Rewards/RewardsPage";
import { SettingsPage } from "./pages/Settings/SettingsPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ContractsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="rewards" element={<RewardsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};
