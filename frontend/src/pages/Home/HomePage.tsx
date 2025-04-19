import styled from 'styled-components';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const HomePage = () => {
  return (
    <div>
      <PageTitle>Добро пожаловать в Семейные Контракты</PageTitle>
      
      <ActionButtons>
        <Button size="large">Создать новый контракт</Button>
        <Button size="large" variant="outline">Посмотреть все контракты</Button>
      </ActionButtons>

      <StatsGrid>
        <StatCard>
          <CardContent>
            <StatValue>5</StatValue>
            <StatLabel>Активных контрактов</StatLabel>
          </CardContent>
        </StatCard>
        
        <StatCard>
          <CardContent>
            <StatValue>12</StatValue>
            <StatLabel>Выполненных задач</StatLabel>
          </CardContent>
        </StatCard>
        
        <StatCard>
          <CardContent>
            <StatValue>3</StatValue>
            <StatLabel>Полученных наград</StatLabel>
          </CardContent>
        </StatCard>
      </StatsGrid>

      <Card>
        <CardHeader>
          <CardTitle>Последние активности</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Здесь будет список последних активностей...</p>
        </CardContent>
      </Card>
    </div>
  );
}; 