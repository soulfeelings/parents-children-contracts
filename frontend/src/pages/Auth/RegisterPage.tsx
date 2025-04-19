import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/common/Card/Card";
import { Button } from "../../components/common/Button/Button";
import { Input } from "../../components/common/Input/Input";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 400px;
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

const FormLabel = styled.label`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 14px;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const RoleSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const RoleOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
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
`;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "parent", // 'parent' или 'child'
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      // TODO: Implement actual registration logic
      console.log("Registration attempt with:", formData);
      navigate("/contracts");
    } catch (err) {
      setError("Ошибка при регистрации. Попробуйте другой email.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
              <FormLabel>Имя</FormLabel>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Введите ваше имя"
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Фамилия</FormLabel>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Введите вашу фамилию"
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Введите ваш email"
                required
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
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Подтверждение пароля</FormLabel>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Повторите пароль"
                required
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
                    onChange={handleChange}
                  />
                  Родитель
                </RoleOption>
                <RoleOption>
                  <input
                    type="radio"
                    name="role"
                    value="child"
                    checked={formData.role === "child"}
                    onChange={handleChange}
                  />
                  Ребенок
                </RoleOption>
              </RoleSelector>
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Button type="submit">Зарегистрироваться</Button>

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
