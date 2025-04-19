import { Suspense } from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import { Loader } from "../../common/Loader/Loader";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Layout = () => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </MainContent>
    </LayoutContainer>
  );
};
