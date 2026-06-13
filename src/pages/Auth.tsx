import { useState, useContext, FormEvent } from "react";
import { notifications } from "@mantine/notifications";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Stack,
  Anchor,
  Box,
} from "@mantine/core";

import api, { API_BASE_URL, API_DEV_URL } from "../api/client";
import { AuthContext } from "../context/AuthContext";

// Define strong types for form states
interface AuthFormState {
  username?: string;
  password?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  program?: string;
}

const INITIAL_FORM_STATE: AuthFormState = {
  username: "",
  password: "",
  email: "",
  first_name: "",
  last_name: "",
  program: "",
};

export default function Auth() {
  const auth = useContext(AuthContext);
  
  if (!auth) {
    throw new Error("Auth component must be used within an AuthProvider");
  }

  const { login } = auth;

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState<AuthFormState>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);

  // Safely switch form modes and scrub previous input data
  const handleModeToggle = () => {
    setIsLogin((prev) => !prev);
    setForm(INITIAL_FORM_STATE);
  };

  const handleInputChange = (field: keyof AuthFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent native browser page reloads

    // Simple production validation guard
    if (!form.username || !form.password) {
      notifications.show({
        title: "Validation Error",
        message: "User ID and Password are required.",
        color: "yellow",
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Safe execution of custom login flow
        const resp = await login({ username: form.username, password: form.password });
        if (resp) {
          notifications.show({
            title: "Login Successful",
            message: "Welcome back!",
            color: "green",
          });
        }
      } else {
        await api.post(`${API_BASE_URL}/auth/signup`, form);

        notifications.show({
          title: "Account Created",
          message: "Your registration was successful. You can now sign in.",
          color: "green",
        });
        
        setIsLogin(true);
        setForm(INITIAL_FORM_STATE);
      }
    } catch (error: any) {
      notifications.show({
        title: "Authentication Failed",
        message: error?.response?.data?.detail || "Username / password incorrect. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={460} my={80}>
      <Title ta="center" mb="lg" order={2}>
        {isLogin ? "Welcome! Login to Continue" : "Create New Account"}
      </Title>

      {/* HTML <form> element allows users to submit the form using the 'Enter' key */}
      <Paper component="form" onSubmit={handleSubmit} shadow="md" p="xl" radius="md" withBorder>
        <Stack gap="md">
          <TextInput
            label="User ID"
            placeholder="Enter your user ID"
            required
            value={form.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
          />

          {!isLogin && (
            <>
              <TextInput
                label="Email"
                type="email"
                placeholder="name@example.com"
                required
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />

              <TextInput
                label="First Name"
                placeholder="John"
                required
                value={form.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
              />

              <TextInput
                label="Last Name"
                placeholder="Doe"
                required
                value={form.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
              />

              <TextInput
                label="Program"
                placeholder="Engineering, Business, etc."
                value={form.program}
                onChange={(e) => handleInputChange("program", e.target.value)}
              />
            </>
          )}

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            required
            value={form.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />

          <Button 
            type="submit"
            loading={loading} 
            fullWidth 
            mt="md"
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>

          <Box ta="center" mt="xs">
            <Anchor
              component="button"
              type="button"
              size="sm"
              onClick={handleModeToggle}
            >
              {isLogin ? "Create new account" : "Already have an account?"}
            </Anchor>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}