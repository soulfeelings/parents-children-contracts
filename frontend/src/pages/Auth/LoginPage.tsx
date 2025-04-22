import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import styled from "styled-components";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/common/Card/Card";
import { Button } from "../../components/common/Button/Button";
import { Input } from "../../components/common/Input/Input";
import { loginThunk } from "../../store/thunks/authThunks";
import { RootState } from "../../store";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
`;

const LoginForm = styled.div`
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
  color: ${({ theme }) => theme.colors.status.error};
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
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      await dispatch(loginThunk(formData)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <PageContainer>
      <LoginCard>
        <CardHeader>
          <CardTitle>Вход в систему</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm>
            <FormGroup>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Введите ваш email"
                required
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
                onKeyPress={handleKeyPress}
                placeholder="Введите ваш пароль"
                required
                disabled={isLoading}
              />
              <ForgotPassword to="/forgot-password">
                Забыли пароль?
              </ForgotPassword>
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </Button>

            <RegisterLink>
              Нет аккаунта?
              <Link to="/register">Зарегистрироваться</Link>
            </RegisterLink>
          </LoginForm>
        </CardContent>
      </LoginCard>
    </PageContainer>
  );
};
