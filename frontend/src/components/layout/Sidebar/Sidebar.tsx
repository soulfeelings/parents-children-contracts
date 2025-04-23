import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Avatar } from "../../common/Avatar/Avatar";
import {
  IoHomeOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoCheckboxOutline,
  IoGiftOutline,
  IoSettingsOutline,
} from "react-icons/io5";

const SidebarContainer = styled.aside`
  width: 280px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-right: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  display: flex;
  flex-direction: column;
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

const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `0 ${theme.spacing.sm}`};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all 0.2s ease;
  gap: ${({ theme }) => theme.spacing.md};

  svg {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;

    svg {
      color: white;
    }
  }
`;

const menuItems = [
  { path: "/", icon: <IoHomeOutline />, label: "Главная" },
  { path: "/children", icon: <IoPeopleOutline />, label: "Дети" },
  { path: "/contracts", icon: <IoDocumentTextOutline />, label: "Контракты" },
  { path: "/tasks", icon: <IoCheckboxOutline />, label: "Задачи" },
  { path: "/rewards", icon: <IoGiftOutline />, label: "Награды" },
  { path: "/settings", icon: <IoSettingsOutline />, label: "Настройки" },
];

export const Sidebar = () => {
  return (
    <SidebarContainer>
      <UserSection>
        <Avatar size="large" fallback="JD" />
        <UserInfo>
          <UserName>Иван Иванов</UserName>
          <UserRole>Родитель</UserRole>
        </UserInfo>
      </UserSection>

      <Navigation>
        {menuItems.map((item) => (
          <NavItem key={item.path} to={item.path} end={item.path === "/"}>
            {item.icon}
            {item.label}
          </NavItem>
        ))}
      </Navigation>
    </SidebarContainer>
  );
};
