import { Outlet, Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.nav<{ $isOpen: boolean }>`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "-100%")});
  }
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

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const MenuButton = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  background: ${({ theme }) => theme.colors.background.secondary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};

  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  }
`;

export const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <LayoutContainer>
      <MenuButton onClick={toggleSidebar}>
        {isSidebarOpen ? "✕" : "☰"}
      </MenuButton>
      <Overlay $isOpen={isSidebarOpen} onClick={closeSidebar} />
      <Sidebar $isOpen={isSidebarOpen}>
        <NavLink
          to="/"
          $isActive={location.pathname === "/"}
          onClick={closeSidebar}
        >
          Контракты
        </NavLink>
        <NavLink
          to="/tasks"
          $isActive={location.pathname === "/tasks"}
          onClick={closeSidebar}
        >
          Задачи
        </NavLink>
        <NavLink
          to="/rewards"
          $isActive={location.pathname === "/rewards"}
          onClick={closeSidebar}
        >
          Награды
        </NavLink>
        <NavLink
          to="/settings"
          $isActive={location.pathname === "/settings"}
          onClick={closeSidebar}
        >
          Настройки
        </NavLink>
      </Sidebar>
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};
