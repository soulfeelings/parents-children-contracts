import { useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../store/hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/common/Card/Card";
import { Button } from "../../components/common/Button/Button";
import { Avatar } from "../../components/common/Avatar/Avatar";
import { Modal } from "../../components/common/Modal/Modal";
import { CreateContractForm } from "../../components/features/Contracts/CreateContractForm";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ContractsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ContractCard = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const ContractStatus = styled.span<{ status: string }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case "active":
        return `${theme.colors.primary}20`;
      case "completed":
        return `${theme.colors.success}20`;
      case "failed":
        return `${theme.colors.error}20`;
      default:
        return `${theme.colors.text.tertiary}20`;
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case "active":
        return theme.colors.primary;
      case "completed":
        return theme.colors.success;
      case "failed":
        return theme.colors.error;
      default:
        return theme.colors.text.tertiary;
    }
  }};
`;

const ContractParticipants = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => `${theme.spacing.md} 0`};
`;

const ParticipantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ParticipantName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
`;

const ParticipantRole = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 12px;
`;

const TasksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => `${theme.spacing.md} 0`};
`;

const TaskItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} 0`};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;

  &:before {
    content: "•";
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const RewardInfo = styled.div`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

export const ContractsPage = () => {
  // В реальном приложении данные будут приходить из Redux
  const contracts = useAppSelector((state) => state.contracts.items);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateContract = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div>
      <PageHeader>
        <PageTitle>Контракты</PageTitle>
        <Button onClick={handleCreateContract}>Создать контракт</Button>
      </PageHeader>

      <ContractsGrid>
        {contracts.length === 0 ? (
          <Card>
            <CardContent>
              <p>У вас пока нет контрактов. Создайте первый контракт!</p>
            </CardContent>
          </Card>
        ) : (
          contracts.map((contract) => (
            <ContractCard key={contract.id} clickable>
              <CardHeader>
                <CardTitle>{contract.title}</CardTitle>
                <ContractStatus status={contract.status}>
                  {contract.status === "active" && "Активный"}
                  {contract.status === "completed" && "Выполнен"}
                  {contract.status === "failed" && "Не выполнен"}
                  {contract.status === "pending" && "Ожидает"}
                </ContractStatus>
              </CardHeader>

              <CardContent>
                <ContractParticipants>
                  <ParticipantInfo>
                    <Avatar size="small" fallback="John Doe" />
                    <div>
                      <ParticipantName>John Doe</ParticipantName>
                      <ParticipantRole>Родитель</ParticipantRole>
                    </div>
                  </ParticipantInfo>
                  <ParticipantInfo>
                    <Avatar size="small" fallback="Jane Doe" />
                    <div>
                      <ParticipantName>Jane Doe</ParticipantName>
                      <ParticipantRole>Ребенок</ParticipantRole>
                    </div>
                  </ParticipantInfo>
                </ContractParticipants>

                <TasksList>
                  {contract.tasks.map((task) => (
                    <TaskItem key={task.id}>{task.title}</TaskItem>
                  ))}
                </TasksList>

                <RewardInfo>
                  Награда: {contract.reward.value}
                  {contract.reward.amount && ` (${contract.reward.amount})`}
                </RewardInfo>
              </CardContent>

              <CardFooter>
                <Button variant="outline" size="small">
                  Подробнее
                </Button>
                {contract.status === "active" && (
                  <Button size="small">Отметить выполненным</Button>
                )}
              </CardFooter>
            </ContractCard>
          ))
        )}
      </ContractsGrid>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        title="Создание нового контракта"
      >
        <CreateContractForm
          onSubmit={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};
