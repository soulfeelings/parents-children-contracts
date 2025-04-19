import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Avatar } from "../../common/Avatar/Avatar";

const SidebarContainer = styled.aside`
  width: 280px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.white};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg} 0;
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
  font-size: 16px;
  font-weight: 500;
`;

const UserRole = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

const Navigation = styled.nav`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }

  &.active {
    background-color: ${({ theme }) => `${theme.colors.primary}10`};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
`;

export const Sidebar = () => {
  return (
    <SidebarContainer>
      <UserSection>
        <Avatar size="large" fallback="John Doe" />
        <UserInfo>
          <UserName>John Doe</UserName>
          <UserRole>Родитель</UserRole>
        </UserInfo>
      </UserSection>

      <Navigation>
        <NavItem to="/" end>
          Главная
        </NavItem>
        <NavItem to="/contracts">Контракты</NavItem>
        <NavItem to="/tasks">Задачи</NavItem>
        <NavItem to="/rewards">Награды</NavItem>
        <NavItem to="/settings">Настройки</NavItem>
      </Navigation>
    </SidebarContainer>
  );
};
