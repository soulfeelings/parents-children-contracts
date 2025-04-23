import React, { useState } from "react";
import styled from "styled-components";
import { Modal } from "../common/Modal/Modal";

interface Parent {
  id: string;
  name: string;
  email: string;
}

interface ManageParentsProps {
  childId: string;
  childName: string;
  parents: Parent[];
  onAddParent: (parent: { name: string; email: string }) => void;
  onRemoveParent: (parentId: string) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ParentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ParentCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const ParentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ParentName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ParentEmail = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.status.error};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  &:hover {
    background: ${({ theme }) => theme.colors.background.tertiary};
  }
`;

const AddButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  font-weight: 500;

  &:hover {
    opacity: 0.9;
  }
`;

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

const ModalFooterButton = styled.button<{ primary?: boolean }>`
  background: ${({ theme, primary }) =>
    primary ? theme.colors.primary : "transparent"};
  color: ${({ theme, primary }) =>
    primary ? "white" : theme.colors.text.primary};
  border: 1px solid
    ${({ theme, primary }) =>
      primary ? "transparent" : theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  font-weight: 500;

  &:hover {
    opacity: 0.9;
  }
`;

export const ManageParents: React.FC<ManageParentsProps> = ({
  childName,
  parents,
  onAddParent,
  onRemoveParent,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newParentData, setNewParentData] = useState({ name: "", email: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddParent(newParentData);
    setNewParentData({ name: "", email: "" });
    setIsAddModalOpen(false);
  };

  const modalFooter = (
    <>
      <ModalFooterButton onClick={() => setIsAddModalOpen(false)}>
        Отмена
      </ModalFooterButton>
      <ModalFooterButton primary onClick={handleSubmit}>
        Добавить
      </ModalFooterButton>
    </>
  );

  return (
    <Container>
      <div>
        <h2>Родители {childName}</h2>
        <AddButton onClick={() => setIsAddModalOpen(true)}>
          Добавить родителя
        </AddButton>
      </div>

      <ParentsList>
        {parents.map((parent) => (
          <ParentCard key={parent.id}>
            <ParentInfo>
              <ParentName>{parent.name}</ParentName>
              <ParentEmail>{parent.email}</ParentEmail>
            </ParentInfo>
            <RemoveButton onClick={() => onRemoveParent(parent.id)}>
              Удалить
            </RemoveButton>
          </ParentCard>
        ))}
        {parents.length === 0 && (
          <div>У ребенка пока нет добавленных родителей</div>
        )}
      </ParentsList>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Добавить родителя"
        footer={modalFooter}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="parentName">Имя родителя</Label>
            <Input
              id="parentName"
              type="text"
              value={newParentData.name}
              onChange={(e) =>
                setNewParentData({ ...newParentData, name: e.target.value })
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="parentEmail">Email родителя</Label>
            <Input
              id="parentEmail"
              type="email"
              value={newParentData.email}
              onChange={(e) =>
                setNewParentData({ ...newParentData, email: e.target.value })
              }
              required
            />
          </FormGroup>
        </Form>
      </Modal>
    </Container>
  );
};
