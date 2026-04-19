import { useState, useContext } from "react";
import api from "../api/client";
import { API_BASE_URL, API_DEV_URL } from "../api/client";
import { AuthContext } from "../context/AuthContext";

import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Stack,
  Text,
} from "@mantine/core";

export default function Auth() {
  const { login } = useContext(AuthContext);
  const params = new URLSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);

    try {
      params.append("username", form.username);
      params.append("password", form.password);

      if (isLogin) {
        // const res = await api.post(`${API_DEV_URL}/auth/token`, params, {
        //   headers: {
        //     "Content-Type": "Application/x-www-form-urlencoded",
        // },
        // });
        // login(res.data.access_token);
        login(form);
      } else {
        await api.post(`${API_DEV_URL}/auth/signup`, form);
        setIsLogin(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={80}>
      <Title ta="center" mb="lg">
        {isLogin ? "Welcome! Login to Continue" : "Create New Account"}
      </Title>

      <Paper shadow="md" p="xl" radius="md">
        <Stack>
          <TextInput
            label="User ID"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          {!isLogin && (
            <>
              <TextInput
                label="Email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <TextInput
                label="First Name"
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
              />

              <TextInput
                label="Last Name"
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
              />

              <TextInput
                label="Program"
                onChange={(e) => setForm({ ...form, program: e.target.value })}
              />
            </>
          )}

          <PasswordInput
            label="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button loading={loading} onClick={submit} fullWidth>
            {isLogin ? "Login" : "Sign Up"}
          </Button>

          <Text
            ta="center"
            size="sm"
            c="blue"
            style={{ cursor: "pointer" }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create new account" : "Already have an account?"}
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
