import { useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../store/hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/common/Card/Card";
import { Button } from "../../components/common/Button/Button";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RewardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const RewardCard = styled(Card)<{ status: string }>`
  border-left: 4px solid
    ${({ status, theme }) => {
      switch (status) {
        case "available":
          return theme.colors.success;
        case "pending":
          return theme.colors.primary;
        case "used":
          return theme.colors.text.tertiary;
        default:
          return theme.colors.border;
      }
    }};
`;

const RewardStatus = styled.span<{ status: string }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case "available":
        return `${theme.colors.success}20`;
      case "pending":
        return `${theme.colors.primary}20`;
      case "used":
        return `${theme.colors.text.tertiary}20`;
      default:
        return `${theme.colors.border}20`;
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case "available":
        return theme.colors.success;
      case "pending":
        return theme.colors.primary;
      case "used":
        return theme.colors.text.tertiary;
      default:
        return theme.colors.text.secondary;
    }
  }};
`;

const RewardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

const RewardValue = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FilterButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  & + & {
    margin-left: ${({ theme }) => theme.spacing.xl};
  }
`;

const FilterLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

type RewardType = "all" | "money" | "privilege" | "item";
type RewardStatus = "all" | "available" | "pending" | "used";

export const RewardsPage = () => {
  const contracts = useAppSelector((state) => state.contracts.items);
  const [typeFilter, setTypeFilter] = useState<RewardType>("all");
  const [statusFilter, setStatusFilter] = useState<RewardStatus>("all");

  // Собираем все награды из контрактов
  const allRewards = contracts.flatMap((contract) => ({
    ...contract.reward,
    contractTitle: contract.title,
    contractId: contract.id,
    status:
      contract.status === "completed"
        ? "available"
        : contract.status === "pending"
        ? "pending"
        : "used",
  }));

  // Фильтруем награды
  const filteredRewards = allRewards.filter((reward) => {
    const matchesType = typeFilter === "all" || reward.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || reward.status === statusFilter;
    return matchesType && matchesStatus;
  });

  return (
    <div>
      <PageHeader>
        <PageTitle>Награды</PageTitle>
      </PageHeader>

      <div style={{ display: "flex", marginBottom: "24px" }}>
        <FilterGroup>
          <FilterLabel>Тип награды</FilterLabel>
          <FilterButtons>
            <Button
              variant={typeFilter === "all" ? "primary" : "outline"}
              onClick={() => setTypeFilter("all")}
            >
              Все
            </Button>
            <Button
              variant={typeFilter === "money" ? "primary" : "outline"}
              onClick={() => setTypeFilter("money")}
            >
              Деньги
            </Button>
            <Button
              variant={typeFilter === "privilege" ? "primary" : "outline"}
              onClick={() => setTypeFilter("privilege")}
            >
              Привилегии
            </Button>
            <Button
              variant={typeFilter === "item" ? "primary" : "outline"}
              onClick={() => setTypeFilter("item")}
            >
              Вещи
            </Button>
          </FilterButtons>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Статус</FilterLabel>
          <FilterButtons>
            <Button
              variant={statusFilter === "all" ? "primary" : "outline"}
              onClick={() => setStatusFilter("all")}
            >
              Все
            </Button>
            <Button
              variant={statusFilter === "available" ? "primary" : "outline"}
              onClick={() => setStatusFilter("available")}
            >
              Доступные
            </Button>
            <Button
              variant={statusFilter === "pending" ? "primary" : "outline"}
              onClick={() => setStatusFilter("pending")}
            >
              Ожидают
            </Button>
            <Button
              variant={statusFilter === "used" ? "primary" : "outline"}
              onClick={() => setStatusFilter("used")}
            >
              Использованные
            </Button>
          </FilterButtons>
        </FilterGroup>
      </div>

      <RewardsContainer>
        {filteredRewards.length === 0 ? (
          <Card>
            <CardContent>
              <p>Нет наград, соответствующих выбранным фильтрам.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRewards.map((reward) => (
            <RewardCard key={reward.contractId} status={reward.status}>
              <CardHeader>
                <CardTitle>{reward.value}</CardTitle>
                <RewardStatus status={reward.status}>
                  {reward.status === "available" && "Доступна"}
                  {reward.status === "pending" && "Ожидает"}
                  {reward.status === "used" && "Использована"}
                </RewardStatus>
              </CardHeader>

              <CardContent>
                <RewardValue>
                  {reward.type === "money" && (
                    <>
                      <span>💰</span>
                      <span>{reward.amount} ₽</span>
                    </>
                  )}
                  {reward.type === "privilege" && <span>🌟</span>}
                  {reward.type === "item" && <span>🎁</span>}
                </RewardValue>

                <RewardMeta>
                  <span>Контракт: {reward.contractTitle}</span>
                </RewardMeta>

                {reward.status === "available" && (
                  <Button size="small" style={{ marginTop: "16px" }}>
                    Получить награду
                  </Button>
                )}
              </CardContent>
            </RewardCard>
          ))
        )}
      </RewardsContainer>
    </div>
  );
};
