import {
  Button,
  Stack,
  TextInput,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { useState } from "react";
import api from "../../api/client";


export default function ForgotPasswordPage() {
  const [loading, setLoading] =
    useState(false);

  const form = useForm({
    initialValues: {
      email: "",
    },
  });

  const submit = async (
    values: typeof form.values
  ) => {
    try {
      setLoading(true);

      await api.post(
        "/api/v1/auth/forgot-password",
        values
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(
        submit
      )}
    >
      <Stack>
        <TextInput
          label="Email"
          {...form.getInputProps(
            "email"
          )}
        />

        <Button
          loading={loading}
          type="submit"
        >
          Send Reset Link
        </Button>
      </Stack>
    </form>
  );
}