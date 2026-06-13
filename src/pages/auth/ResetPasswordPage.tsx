import {
  PasswordInput,
  Button,
  Stack,
} from "@mantine/core";

import { useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import api from "../../api/client";

export default function ResetPasswordPage() {
  const { token } = useParams();

  const form = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const submit = async (
    values: typeof form.values
  ) => {
    await api.post(
      "/api/v1/auth/reset-password",
      {
        token,
        password: values.password,
      }
    );
  };

  return (
    <form
      onSubmit={form.onSubmit(
        submit
      )}
    >
      <Stack>
        <PasswordInput
          label="Password"
          {...form.getInputProps(
            "password"
          )}
        />

        <PasswordInput
          label="Confirm Password"
          {...form.getInputProps(
            "confirmPassword"
          )}
        />

        <Button type="submit">
          Reset Password
        </Button>
      </Stack>
    </form>
  );
}