import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import {
  IoMenuOutline,
  IoCloseOutline,
  IoHomeOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoCheckboxOutline,
  IoGiftOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { Avatar } from "../common/Avatar/Avatar";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const Sidebar = styled.nav<{ $isOpen: boolean }>`
  width: 280px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-right: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  display: flex;
  flex-direction: column;
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

const UserSection = styled.div`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
`;

const UserRole = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  font-size: 0.875rem;
`;

const Navigation = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `0 ${theme.spacing.sm}`};
`;

const NavItem = styled.a<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme, $isActive }) =>
    $isActive ? "white" : theme.colors.text.primary};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all 0.2s ease;
  gap: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : "transparent"};
  cursor: pointer;

  svg {
    font-size: 1.25rem;
    color: ${({ theme, $isActive }) =>
      $isActive ? "white" : theme.colors.text.secondary};
  }

  &:hover {
    background-color: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary : theme.colors.background.secondary};
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const MenuButton = styled.button`
  display: none;
  position: fixed;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  z-index: 1001;
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    display: flex;
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
  backdrop-filter: blur(4px);
  z-index: 999;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  }
`;

const menuItems = [
  { path: "/", icon: <IoPeopleOutline />, label: "Дети" },
  { path: "/contracts", icon: <IoDocumentTextOutline />, label: "Контракты" },
  { path: "/tasks", icon: <IoCheckboxOutline />, label: "Задачи" },
  { path: "/rewards", icon: <IoGiftOutline />, label: "Награды" },
  { path: "/settings", icon: <IoSettingsOutline />, label: "Настройки" },
];

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState(window.location.pathname);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigation = (path: string) => {
    setActivePath(path);
    closeSidebar();
    navigate(path);
  };

  return (
    <LayoutContainer>
      <MenuButton onClick={toggleSidebar}>
        {isSidebarOpen ? <IoCloseOutline /> : <IoMenuOutline />}
      </MenuButton>
      <Overlay $isOpen={isSidebarOpen} onClick={closeSidebar} />
      <Sidebar $isOpen={isSidebarOpen}>
        <UserSection>
          <Avatar size="large" fallback="ИИ" />
          <UserInfo>
            <UserName>Иван Иванов</UserName>
            <UserRole>Родитель</UserRole>
          </UserInfo>
        </UserSection>

        <Navigation>
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              $isActive={
                item.path === "/"
                  ? activePath === "/"
                  : activePath.startsWith(item.path)
              }
              onClick={() => handleNavigation(item.path)}
            >
              {item.icon}
              {item.label}
            </NavItem>
          ))}
        </Navigation>
      </Sidebar>
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};
