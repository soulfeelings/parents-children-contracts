import { Outlet, Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.nav`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  padding: 10px;
  text-decoration: none;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.text.primary : theme.colors.text.secondary};
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.background.primary : "transparent"};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export const Layout = () => {
  const location = useLocation();

  return (
    <LayoutContainer>
      <Sidebar>
        <NavLink to="/" $isActive={location.pathname === "/"}>
          Контракты
        </NavLink>
        <NavLink to="/tasks" $isActive={location.pathname === "/tasks"}>
          Задачи
        </NavLink>
        <NavLink to="/rewards" $isActive={location.pathname === "/rewards"}>
          Награды
        </NavLink>
        <NavLink to="/settings" $isActive={location.pathname === "/settings"}>
          Настройки
        </NavLink>
      </Sidebar>
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};
