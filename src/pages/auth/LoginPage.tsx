import { useContext, useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Anchor,
  Checkbox,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error(
      "LoginPage must be used within AuthProvider"
    );
  }

  const { login } = auth;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    initialValues: {
      username: "",
      password: "",
      rememberMe: false,
    },

    validate: {
      username: (value) =>
        value.trim().length < 3
          ? "Username is required"
          : null,

      password: (value) =>
        value.length < 6
          ? "Password is required"
          : null,
    },
  });

  const handleSubmit = async (
    values: LoginFormValues
  ) => {
     console.log("SUBMIT CALLED");
  console.log(values);
    setLoading(true);

    try {
      const resp = await login({
        username: values.username,
        password: values.password,
      });

      if (resp) {
        notifications.show({
          title: "Login Successful",
          message: "Welcome back!",
          color: "green",
        });

        navigate("/");
      }
    } catch (error: any) {
      notifications.show({
        title: "Authentication Failed",
        message:
          error?.response?.data?.detail ||
          "Invalid username or password",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e)=> {
        e.preventDefault();
        console.log("FORM SUBMITTED");
        handleSubmit(form.values);

      }}
    >
      <Stack gap="md">

        <TextInput
          label="Username"
          placeholder="Enter username"
          withAsterisk
          {...form.getInputProps(
            "username"
          )}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter password"
          withAsterisk
          {...form.getInputProps(
            "password"
          )}
        />

        <Group justify="space-between">

          <Checkbox
            label="Remember me"
            {...form.getInputProps(
              "rememberMe",
              {
                type: "checkbox",
              }
            )}
          />

          <Anchor
            component={Link}
            to="/forgot-password"
            size="sm"
          >
            Forgot password?
          </Anchor>

        </Group>

        <Button
          type="submit"
          loading={loading}
          size="md"
          fullWidth
        >
          Sign In
        </Button>

        <Anchor
          component={Link}
          to="/register"
          ta="center"
          size="sm"
        >
          Don't have an account?
          Create one
        </Anchor>

      </Stack>
    </form>
  );
}