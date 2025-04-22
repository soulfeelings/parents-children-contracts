import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/common/Card/Card";
import { Button } from "../../components/common/Button/Button";
import { Input } from "../../components/common/Input/Input";
import { registerThunk } from "../../store/thunks/authThunks";
import { RootState } from "../../store";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const FormLabel = styled.label`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 14px;
  margin-top: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 768px) {
    font-size: 12px;
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

const RoleSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const RoleOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    margin-left: ${({ theme }) => theme.spacing.xs};

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    margin-top: ${({ theme }) => theme.spacing.md};
    font-size: 12px;

    a {
      margin-left: ${({ theme }) => theme.spacing.xs};
    }
  }
`;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    first_name: "",
    last_name: "",
    role: "parent" as "parent" | "child",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (formData.password !== confirmPassword) {
      setValidationError("Пароли не совпадают");
      return;
    }

    try {
      await dispatch(registerThunk(formData)).unwrap();
      navigate("/");
    } catch (error) {
      // Ошибка уже обработана в thunk
      console.error("Registration failed:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value as "parent" | "child",
    }));
  };

  return (
    <PageContainer>
      <RegisterCard>
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Введите ваш email"
                required
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Имя пользователя</FormLabel>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Придумайте имя пользователя"
                required
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Имя</FormLabel>
              <Input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Введите ваше имя"
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Фамилия</FormLabel>
              <Input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Введите вашу фамилию"
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Пароль</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Придумайте пароль"
                required
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Подтверждение пароля</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                required
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Я хочу зарегистрироваться как</FormLabel>
              <RoleSelector>
                <RoleOption>
                  <input
                    type="radio"
                    name="role"
                    value="parent"
                    checked={formData.role === "parent"}
                    onChange={handleRoleChange}
                    disabled={isLoading}
                  />
                  Родитель
                </RoleOption>
                <RoleOption>
                  <input
                    type="radio"
                    name="role"
                    value="child"
                    checked={formData.role === "child"}
                    onChange={handleRoleChange}
                    disabled={isLoading}
                  />
                  Ребенок
                </RoleOption>
              </RoleSelector>
            </FormGroup>

            {(error || validationError) && (
              <ErrorMessage>{error || validationError}</ErrorMessage>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>

            <LoginLink>
              Уже есть аккаунт?
              <Link to="/login">Войти</Link>
            </LoginLink>
          </Form>
        </CardContent>
      </RegisterCard>
    </PageContainer>
  );
};
