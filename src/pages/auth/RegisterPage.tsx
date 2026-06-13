import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Title,
  Text,
  Grid,
  Select,
  Progress,
  Checkbox,
  Anchor,
  Group,
  LoadingOverlay,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/client";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const [universities, setUniversities] = useState([]);
  const [departments, setDepartments] = useState([]);

  const form = useForm({
    initialValues: {
      username: "",
      fname: "",
      mname: "",
      lname: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      university_id: "",
      department_id: "",
      agree: false,
    },

    validate: {
      fname: (v) => (!v ? "Required" : null),
      lname: (v) => (!v ? "Required" : null),
      username: (v) => (!v ? "Required" : null),
      email: (v) =>
        /^\S+@\S+$/.test(v) ? null : "Invalid email address",
      password: (v) =>
        v.length >= 8 ? null : "Minimum 8 characters",
      confirmPassword: (v, values) =>
        v === values.password
          ? null
          : "Passwords do not match",
      university_id: (v) =>
        !v ? "Select university" : null,
      department_id: (v) =>
        !v ? "Select department" : null,
      agree: (v) =>
        v ? null : "Please accept terms",
    },
  });

  useEffect(() => {
    loadUniversities();
    loadDepartments();
  }, []);

  const loadUniversities = async () => {
    try {
      const res = await api.get(
        "/universities"
      );

      setUniversities(
        res.data.map((item: any) => ({
          value: String(item.id),
          label: item.name,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadDepartments = async () => {
    try {
      const res = await api.get(
        "/departments?limit=0"
      );

      setDepartments(
        res.data.map((item: any) => ({
          value: String(item.id),
          label: item.name,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getPasswordStrength = () => {
    const password = form.values.password;

    let score = 0;

    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;

    return score;
  };

  const handleSubmit = async (
    values: typeof form.values
  ) => {
    try {
      setLoading(true);

      const departmentName =
        departments.find(
          (d: any) =>
            d.value === values.department_id
        )?.label || "";

      await axios.post(
        "/api/v1/auth/users/register",
        {
          username: values.username,
          fname: values.fname,
          mname: values.mname,
          lname: values.lname,
          email: values.email,
          phone: values.phone,
          password: values.password,
          confirmPassword:
            values.confirmPassword,

          role: "user",

          university_id: Number(
            values.university_id
          ),

          department: departmentName,

          department_id: Number(
            values.department_id
          ),

          sendWelcomeEmail: true,
        }
      );

      alert("Registration successful");
    } catch (err: any) {
      alert(
        err?.response?.data?.detail ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      shadow="lg"
      radius="xl"
      p="xl"
      maw={900}
      mx="auto"
      mt={40}
      pos="relative"
    >
      <LoadingOverlay visible={loading} />

      <Grid>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack h="100%" justify="center">
            <Title order={2}>
              Create Your Account
            </Title>

            <Text c="dimmed">
              Join thousands of students
              preparing for exams and
              managing academic progress.
            </Text>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <form
            onSubmit={form.onSubmit(
              handleSubmit
            )}
          >
            <Stack>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="First Name"
                    {...form.getInputProps(
                      "fname"
                    )}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    label="Middle Name"
                    {...form.getInputProps(
                      "mname"
                    )}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    label="Last Name"
                    {...form.getInputProps(
                      "lname"
                    )}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    label="Username"
                    {...form.getInputProps(
                      "username"
                    )}
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Email"
                {...form.getInputProps(
                  "email"
                )}
              />

              <TextInput
                label="Phone Number"
                {...form.getInputProps(
                  "phone"
                )}
              />

              <Select
                searchable
                label="University"
                data={universities}
                {...form.getInputProps(
                  "university_id"
                )}
              />

              <Select
                searchable
                label="Department"
                data={departments}
                {...form.getInputProps(
                  "department_id"
                )}
              />

              <PasswordInput
                label="Password"
                {...form.getInputProps(
                  "password"
                )}
              />

              <Progress
                value={getPasswordStrength()}
              />

              <PasswordInput
                label="Confirm Password"
                {...form.getInputProps(
                  "confirmPassword"
                )}
              />

              <Checkbox
                label="I agree to Terms and Conditions"
                {...form.getInputProps(
                  "agree",
                  { type: "checkbox" }
                )}
              />

              <Button
                loading={loading}
                size="md"
                radius="md"
                type="submit"
                fullWidth
              >
                Create Account
              </Button>

              <Group justify="center">
                <Text size="sm">
                  Already have an account?
                </Text>

                <Anchor href="/login">
                  Login
                </Anchor>
              </Group>
            </Stack>
          </form>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}