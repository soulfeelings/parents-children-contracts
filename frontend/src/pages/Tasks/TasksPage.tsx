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

const TasksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const TaskCard = styled(Card)<{ status: string }>`
  border-left: 4px solid
    ${({ status, theme }) => {
      switch (status) {
        case "completed":
          return theme.colors.success;
        case "failed":
          return theme.colors.error;
        default:
          return theme.colors.primary;
      }
    }};
`;

const TaskStatus = styled.span<{ status: string }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case "completed":
        return `${theme.colors.success}20`;
      case "failed":
        return `${theme.colors.error}20`;
      default:
        return `${theme.colors.primary}20`;
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case "completed":
        return theme.colors.success;
      case "failed":
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  }};
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

const TaskActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const FilterButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

type TaskFilter = "all" | "pending" | "completed" | "failed";

export const TasksPage = () => {
  const contracts = useAppSelector((state) => state.contracts.items);
  const [filter, setFilter] = useState<TaskFilter>("all");

  // Собираем все задачи из всех контрактов
  const allTasks = contracts.flatMap((contract) =>
    contract.tasks.map((task) => ({
      ...task,
      contractTitle: contract.title,
      contractId: contract.id,
    }))
  );

  // Фильтруем задачи
  const filteredTasks = allTasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <div>
      <PageHeader>
        <PageTitle>Задачи</PageTitle>
      </PageHeader>

      <FilterButtons>
        <Button
          variant={filter === "all" ? "primary" : "outline"}
          onClick={() => setFilter("all")}
        >
          Все
        </Button>
        <Button
          variant={filter === "pending" ? "primary" : "outline"}
          onClick={() => setFilter("pending")}
        >
          В процессе
        </Button>
        <Button
          variant={filter === "completed" ? "primary" : "outline"}
          onClick={() => setFilter("completed")}
        >
          Выполненные
        </Button>
        <Button
          variant={filter === "failed" ? "primary" : "outline"}
          onClick={() => setFilter("failed")}
        >
          Не выполненные
        </Button>
      </FilterButtons>

      <TasksContainer>
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent>
              <p>Нет задач, соответствующих выбранному фильтру.</p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} status={task.status}>
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
                <TaskStatus status={task.status}>
                  {task.status === "completed" && "Выполнено"}
                  {task.status === "failed" && "Не выполнено"}
                  {task.status === "pending" && "В процессе"}
                </TaskStatus>
              </CardHeader>

              <CardContent>
                <p>{task.description}</p>
                <TaskMeta>
                  <span>Контракт: {task.contractTitle}</span>
                  {task.dueDate && (
                    <span>
                      Срок: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </TaskMeta>

                {task.status === "pending" && (
                  <TaskActions>
                    <Button size="small">Отметить выполненным</Button>
                    <Button size="small" variant="outline">
                      Отметить проваленным
                    </Button>
                  </TaskActions>
                )}
              </CardContent>
            </TaskCard>
          ))
        )}
      </TasksContainer>
    </div>
  );
};
