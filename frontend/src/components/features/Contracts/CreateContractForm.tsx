import { useState } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../../../store/hooks";
import { addContract } from "../../../store/slices/contractsSlice";
import { Button } from "../../common/Button/Button";
import {
  Input,
  InputGroup,
  InputLabel,
  InputError,
} from "../../common/Input/Input";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TaskItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
`;

const RemoveButton = styled.button`
  color: ${({ theme }) => theme.colors.error};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: 18px;
  line-height: 1;

  &:hover {
    opacity: 0.8;
  }
`;

interface FormData {
  title: string;
  description: string;
  tasks: { title: string; description: string }[];
  reward: {
    type: "money" | "privilege" | "item";
    value: string;
    amount?: number;
  };
}

interface CreateContractFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export const CreateContractForm: React.FC<CreateContractFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    tasks: [{ title: "", description: "" }],
    reward: {
      type: "money",
      value: "",
    },
  });

  const handleAddTask = () => {
    setFormData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { title: "", description: "" }],
    }));
  };

  const handleRemoveTask = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }));
  };

  const handleTaskChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task, i) =>
        i === index ? { ...task, [field]: value } : task
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // В реальном приложении здесь будет API запрос
    dispatch(
      addContract({
        id: Date.now().toString(),
        ...formData,
        parentId: "parent-id", // В реальном приложении будет браться из auth
        childId: "child-id", // В реальном приложении будет выбираться из списка
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );

    onSubmit();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <InputLabel>Название контракта</InputLabel>
        <Input
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Например: Хорошие оценки в школе"
          fullWidth
        />
      </InputGroup>

      <InputGroup>
        <InputLabel>Описание</InputLabel>
        <Input
          as="textarea"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Опишите условия контракта"
          fullWidth
        />
      </InputGroup>

      <InputGroup>
        <InputLabel>Задачи</InputLabel>
        <TaskList>
          {formData.tasks.map((task, index) => (
            <TaskItem key={index}>
              <div style={{ flex: 1 }}>
                <Input
                  value={task.title}
                  onChange={(e) =>
                    handleTaskChange(index, "title", e.target.value)
                  }
                  placeholder="Название задачи"
                  fullWidth
                />
              </div>
              {formData.tasks.length > 1 && (
                <RemoveButton
                  type="button"
                  onClick={() => handleRemoveTask(index)}
                >
                  &times;
                </RemoveButton>
              )}
            </TaskItem>
          ))}
        </TaskList>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddTask}
          style={{ marginTop: "8px" }}
        >
          Добавить задачу
        </Button>
      </InputGroup>

      <InputGroup>
        <InputLabel>Награда</InputLabel>
        <select
          value={formData.reward.type}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              reward: {
                ...prev.reward,
                type: e.target.value as "money" | "privilege" | "item",
              },
            }))
          }
        >
          <option value="money">Деньги</option>
          <option value="privilege">Привилегия</option>
          <option value="item">Вещь</option>
        </select>
        <Input
          value={formData.reward.value}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              reward: { ...prev.reward, value: e.target.value },
            }))
          }
          placeholder="Описание награды"
          fullWidth
        />
        {formData.reward.type === "money" && (
          <Input
            type="number"
            value={formData.reward.amount || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                reward: { ...prev.reward, amount: Number(e.target.value) },
              }))
            }
            placeholder="Сумма"
            fullWidth
          />
        )}
      </InputGroup>

      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit">Создать контракт</Button>
      </div>
    </Form>
  );
};
