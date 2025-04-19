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

const LoginCard = styled(Card)`
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

const ForgotPassword = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  text-decoration: none;
  margin-top: ${({ theme }) => theme.spacing.xs};
  text-align: right;

  &:hover {
    text-decoration: underline;
  }
`;

const RegisterLink = styled.div`
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

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // TODO: Implement actual login logic
      console.log("Login attempt with:", formData);
      navigate("/contracts");
    } catch (err) {
      setError("Неверный email или пароль");
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
      <LoginCard>
        <CardHeader>
          <CardTitle>Вход в систему</CardTitle>
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
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Пароль</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введите ваш пароль"
                required
              />
              <ForgotPassword to="/forgot-password">
                Забыли пароль?
              </ForgotPassword>
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Button type="submit">Войти</Button>

            <RegisterLink>
              Нет аккаунта?
              <Link to="/register">Зарегистрироваться</Link>
            </RegisterLink>
          </Form>
        </CardContent>
      </LoginCard>
    </PageContainer>
  );
};
