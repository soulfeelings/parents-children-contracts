import React, { useState } from "react";
import styled from "styled-components";

interface Child {
  id: string;
  name: string;
}

interface CreateContractFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    childId?: string;
    tasks: string[];
    reward: {
      type: "money";
      description: string;
      amount: number;
    };
  }) => void;
  children: Child[];
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 1rem;
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const Textarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TaskInput = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AddTaskButton = styled.button`
  background: none;
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.xs};

  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
  }
`;

export const CreateContractForm: React.FC<CreateContractFormProps> = ({
  onSubmit,
  children,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    childId: "",
    tasks: [""],
    reward: {
      type: "money" as const,
      description: "",
      amount: 0,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      childId: formData.childId || undefined,
    });
  };

  const handleAddTask = () => {
    setFormData({
      ...formData,
      tasks: [...formData.tasks, ""],
    });
  };

  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...formData.tasks];
    newTasks[index] = value;
    setFormData({
      ...formData,
      tasks: newTasks,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="title">Название контракта</Label>
        <Input
          id="title"
          type="text"
          placeholder="Например: Хорошие оценки в школе"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="child">Ребенок (необязательно)</Label>
        <Select
          id="child"
          value={formData.childId}
          onChange={(e) =>
            setFormData({ ...formData, childId: e.target.value })
          }
        >
          <option value="">Выберите ребенка</option>
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          placeholder="Опишите условия контракта"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Задачи</Label>
        <TaskList>
          {formData.tasks.map((task, index) => (
            <TaskInput key={index}>
              <Input
                type="text"
                placeholder="Название задачи"
                value={task}
                onChange={(e) => handleTaskChange(index, e.target.value)}
                required
              />
            </TaskInput>
          ))}
        </TaskList>
        <AddTaskButton type="button" onClick={handleAddTask}>
          Добавить задачу
        </AddTaskButton>
      </FormGroup>

      <FormGroup>
        <Label>Награда</Label>
        <Input
          type="text"
          placeholder="Описание награды"
          value={formData.reward.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              reward: { ...formData.reward, description: e.target.value },
            })
          }
          required
        />
        <Input
          type="number"
          placeholder="Сумма"
          value={formData.reward.amount || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              reward: { ...formData.reward, amount: Number(e.target.value) },
            })
          }
          required
        />
      </FormGroup>
    </Form>
  );
};
