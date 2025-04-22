import { useState } from "react";
import styled from "styled-components";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/common/Card/Card";
import { Button } from "../../components/common/Button/Button";
import { Input } from "../../components/common/Input/Input";
import { Switch } from "../../components/common/Switch/Switch";
import { Avatar } from "../../components/common/Avatar/Avatar";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SettingsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SettingsSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: 18px;
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const AvatarInfo = styled.div`
  flex: 1;
`;

const AvatarName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const AvatarRole = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SwitchGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const SwitchLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SwitchDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    contractUpdates: true,
    taskReminders: true,
    rewardAlerts: true,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div>
      <PageHeader>
        <PageTitle>Настройки</PageTitle>
      </PageHeader>

      <SettingsContainer>
        <Card>
          <CardHeader>
            <CardTitle>Профиль</CardTitle>
          </CardHeader>
          <CardContent>
            <AvatarSection>
              <Avatar size="large" fallback="John Doe" />
              <AvatarInfo>
                <AvatarName>John Doe</AvatarName>
                <AvatarRole>Родитель</AvatarRole>
              </AvatarInfo>
              <Button variant="outline" size="small">
                Изменить фото
              </Button>
            </AvatarSection>

            <FormGroup>
              <FormLabel>Имя</FormLabel>
              <Input defaultValue="John" />
            </FormGroup>

            <FormGroup>
              <FormLabel>Фамилия</FormLabel>
              <Input defaultValue="Doe" />
            </FormGroup>

            <FormGroup>
              <FormLabel>Email</FormLabel>
              <Input type="email" defaultValue="john@example.com" />
            </FormGroup>

            <Button style={{ marginTop: "16px" }}>Сохранить изменения</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Уведомления</CardTitle>
          </CardHeader>
          <CardContent>
            <SwitchGroup>
              <div>
                <SwitchLabel>Email уведомления</SwitchLabel>
                <SwitchDescription>
                  Получать уведомления на email
                </SwitchDescription>
              </div>
              <Switch
                checked={notifications.email}
                onChange={() => handleNotificationChange("email")}
              />
            </SwitchGroup>

            <SwitchGroup>
              <div>
                <SwitchLabel>Push уведомления</SwitchLabel>
                <SwitchDescription>
                  Получать push уведомления в браузере
                </SwitchDescription>
              </div>
              <Switch
                checked={notifications.push}
                onChange={() => handleNotificationChange("push")}
              />
            </SwitchGroup>

            <SwitchGroup>
              <div>
                <SwitchLabel>Обновления контрактов</SwitchLabel>
                <SwitchDescription>
                  Уведомления об изменениях в контрактах
                </SwitchDescription>
              </div>
              <Switch
                checked={notifications.contractUpdates}
                onChange={() => handleNotificationChange("contractUpdates")}
              />
            </SwitchGroup>

            <SwitchGroup>
              <div>
                <SwitchLabel>Напоминания о задачах</SwitchLabel>
                <SwitchDescription>
                  Уведомления о сроках выполнения задач
                </SwitchDescription>
              </div>
              <Switch
                checked={notifications.taskReminders}
                onChange={() => handleNotificationChange("taskReminders")}
              />
            </SwitchGroup>

            <SwitchGroup>
              <div>
                <SwitchLabel>Уведомления о наградах</SwitchLabel>
                <SwitchDescription>
                  Уведомления о получении наград
                </SwitchDescription>
              </div>
              <Switch
                checked={notifications.rewardAlerts}
                onChange={() => handleNotificationChange("rewardAlerts")}
              />
            </SwitchGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Безопасность</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGroup>
              <FormLabel>Текущий пароль</FormLabel>
              <Input type="password" />
            </FormGroup>

            <FormGroup>
              <FormLabel>Новый пароль</FormLabel>
              <Input type="password" />
            </FormGroup>

            <FormGroup>
              <FormLabel>Подтверждение пароля</FormLabel>
              <Input type="password" />
            </FormGroup>

            <Button style={{ marginTop: "16px" }}>Изменить пароль</Button>
          </CardContent>
        </Card>
      </SettingsContainer>
    </div>
  );
};
