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
  Box,
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
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email address"),
      password: (v) => (v.length >= 8 ? null : "Minimum 8 characters"),
      confirmPassword: (v, values) =>
        v === values.password ? null : "Passwords do not match",
      university_id: (v) => (!v ? "Select university" : null),
      department_id: (v) => (!v ? "Select department" : null),
      agree: (v) => (v ? null : "Please accept terms"),
    },
  });

  useEffect(() => {
    loadUniversities();
    loadDepartments();
  }, []);

  const loadUniversities = async () => {
    try {
      const res = await api.get("/universities");
      setUniversities(
        res.data.map((item) => ({
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
      const res = await api.get("/departments?limit=0");
      setDepartments(
        res.data.map((item) => ({
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

  const getStrengthColor = (score) => {
    if (score <= 25) return "red";
    if (score <= 50) return "orange";
    if (score <= 75) return "yellow";
    return "teal";
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const departmentName =
        departments.find((d) => d.value === values.department_id)?.label || "";

      await axios.post("/api/v1/auth/users/register", {
        username: values.username,
        fname: values.fname,
        mname: values.mname,
        lname: values.lname,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: "user",
        university_id: Number(values.university_id),
        department: departmentName,
        department_id: Number(values.department_id),
        sendWelcomeEmail: true,
      });

      alert("Registration successful");
    } catch (err) {
      alert(err?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <Paper
      shadow="md"
      radius="lg"
      p={{ base: "lg", sm: "xl" }}
      w="100%"
      maxW={520}
      mx="auto"
      pos="relative"
      bg="transparent"
      style={{ border: "none" }}
    >
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

      {/* HEADER SECTION */}
      <Stack align="center" ta="center" mb="xl" gap="xs">
        <Title order={2} fw={800} style={{ letterSpacing: "-0.5px" }}>
          Create Your Account
        </Title>
        <Text c="dimmed" size="sm" lh={1.4}>
          Join the Smart Exam Management System to manage your assessments and academic tracking logs.
        </Text>
      </Stack>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* NAME FIELD MATRIX */}
          <Grid gutter="sm">
            <Grid.Col span={6}>
              <TextInput
                label="First Name"
                placeholder="John"
                required
                {...form.getInputProps("fname")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Middle Name"
                placeholder="Edward"
                {...form.getInputProps("mname")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Last Name"
                placeholder="Doe"
                required
                {...form.getInputProps("lname")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Username (ID Number)"
                placeholder="johndoe1"
                required
                {...form.getInputProps("username")}
              />
            </Grid.Col>
          </Grid>

          {/* CONTACT INFO */}
          <TextInput
            label="Email Address"
            placeholder="your@email.com"
            required
            {...form.getInputProps("email")}
          />

          <TextInput
            label="Phone Number"
            placeholder="+123999888"
            {...form.getInputProps("phone")}
          />

          {/* INSTITUTION dropdowns */}
          <Select
            searchable
            label="University"
            placeholder="Select your university"
            data={universities}
            required
            {...form.getInputProps("university_id")}
          />

          <Select
            searchable
            label="Department"
            placeholder="Select your major department"
            data={departments}
            required
            {...form.getInputProps("department_id")}
          />

          {/* SECURE PASSWORDS */}
          <Box>
            <PasswordInput
              label="Password"
              placeholder="Minimum 8 characters"
              required
              {...form.getInputProps("password")}
            />
            {form.values.password && (
              <Progress
                value={strength}
                color={getStrengthColor(strength)}
                size="xs"
                mt={6}
                animated
              />
            )}
          </Box>

          <PasswordInput
            label="Confirm Password"
            placeholder="Re-type your password"
            required
            {...form.getInputProps("confirmPassword")}
          />

          {/* PRODUCTION TERMS & SERVICES CHECKBOX */}
          <Checkbox
            {...form.getInputProps("agree", { type: "checkbox" })}
            label={
              <Text size="sm" c="dimmed">
                I read, understand, and agree to the{" "}
                <Anchor href="/terms" size="sm" fw={600} onClick={(e) => e.stopPropagation()}>
                  Terms of Service
                </Anchor>{" "}
                and academic integrity declarations.
              </Text>
            }
          />

          {/* ACTIONS */}
          <Button
            loading={loading}
            size="md"
            radius="md"
            type="submit"
            fullWidth
            mt="xs"
          >
            Create Account
          </Button>

          <Group justify="center" gap={6} mt="xs">
            <Text size="sm" c="dimmed">
              Already have an account?
            </Text>
            <Anchor href="/login" size="sm" fw={600}>
              Sign In
            </Anchor>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}