import React, { useState } from "react";
import styled from "styled-components";
import { Modal } from "../components/common/Modal/Modal";
import { ManageParents } from "../components/children/ManageParents";

interface Child {
  id: string;
  name: string;
  email?: string;
  parents: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
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

const ChildrenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ChildCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const ChildName = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ParentsList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ParentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.tertiary};

  &:last-child {
    border-bottom: none;
  }
`;

const AddChildForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
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

const ManageButton = styled.button`
  background: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  font-weight: 500;
  margin-top: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.background.tertiary};
  }
`;

export const ChildrenPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageParentsModalOpen, setIsManageParentsModalOpen] =
    useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [newChildData, setNewChildData] = useState({ name: "", email: "" });

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    const newChild: Child = {
      id: Date.now().toString(),
      name: newChildData.name,
      email: newChildData.email || undefined,
      parents: [],
    };
    setChildren([...children, newChild]);
    setNewChildData({ name: "", email: "" });
    setIsAddModalOpen(false);
  };

  const handleAddParent = (
    childId: string,
    parent: { name: string; email: string }
  ) => {
    setChildren(
      children.map((child) => {
        if (child.id === childId) {
          return {
            ...child,
            parents: [
              ...child.parents,
              { id: Date.now().toString(), ...parent },
            ],
          };
        }
        return child;
      })
    );
  };

  const handleRemoveParent = (childId: string, parentId: string) => {
    setChildren(
      children.map((child) => {
        if (child.id === childId) {
          return {
            ...child,
            parents: child.parents.filter((p) => p.id !== parentId),
          };
        }
        return child;
      })
    );
  };

  const openManageParents = (child: Child) => {
    setSelectedChild(child);
    setIsManageParentsModalOpen(true);
  };

  const modalFooter = (
    <>
      <ModalFooterButton onClick={() => setIsAddModalOpen(false)}>
        Отмена
      </ModalFooterButton>
      <ModalFooterButton primary onClick={handleAddChild}>
        Добавить
      </ModalFooterButton>
    </>
  );

  return (
    <PageContainer>
      <Header>
        <Title>Дети</Title>
        <AddButton onClick={() => setIsAddModalOpen(true)}>
          Добавить ребенка
        </AddButton>
      </Header>

      <ChildrenGrid>
        {children.map((child) => (
          <ChildCard key={child.id}>
            <ChildName>{child.name}</ChildName>
            {child.email && <div>{child.email}</div>}
            <ParentsList>
              <h4>Родители:</h4>
              {child.parents.length === 0 ? (
                <div>Родители не добавлены</div>
              ) : (
                child.parents.map((parent) => (
                  <ParentItem key={parent.id}>
                    <div>{parent.name}</div>
                    <div>{parent.email}</div>
                  </ParentItem>
                ))
              )}
            </ParentsList>
            <ManageButton onClick={() => openManageParents(child)}>
              Управление родителями
            </ManageButton>
          </ChildCard>
        ))}
      </ChildrenGrid>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Добавить ребенка"
        footer={modalFooter}
      >
        <AddChildForm onSubmit={handleAddChild}>
          <div>
            <label htmlFor="childName">Имя ребенка</label>
            <Input
              id="childName"
              type="text"
              value={newChildData.name}
              onChange={(e) =>
                setNewChildData({ ...newChildData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="childEmail">Email (необязательно)</label>
            <Input
              id="childEmail"
              type="email"
              value={newChildData.email}
              onChange={(e) =>
                setNewChildData({ ...newChildData, email: e.target.value })
              }
            />
          </div>
        </AddChildForm>
      </Modal>

      {selectedChild && (
        <Modal
          isOpen={isManageParentsModalOpen}
          onClose={() => {
            setIsManageParentsModalOpen(false);
            setSelectedChild(null);
          }}
          title={`Управление родителями - ${selectedChild.name}`}
        >
          <ManageParents
            childId={selectedChild.id}
            childName={selectedChild.name}
            parents={selectedChild.parents}
            onAddParent={(parent) => handleAddParent(selectedChild.id, parent)}
            onRemoveParent={(parentId) =>
              handleRemoveParent(selectedChild.id, parentId)
            }
          />
        </Modal>
      )}
    </PageContainer>
  );
};
