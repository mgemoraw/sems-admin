import { Outlet } from "react-router-dom";
import {
  AppShell,
  Box,
  Center,
  Paper,
  Stack,
  Title,
  Text,
} from "@mantine/core";

export default function AuthLayout() {
  return (
    <AppShell>
      <AppShell.Main>
        <Center
          mih="100vh"
          bg="var(--mantine-color-gray-0)"
        >
          <Paper
            radius="xl"
            shadow="lg"
            w={500}
            p="xl"
          >
            <Stack gap="xs" mb="xl">
              <Title order={2}>
                SMEES
              </Title>

              <Text c="dimmed">
                Student Management & Exam
                Evaluation System
              </Text>
            </Stack>

            <Outlet />
          </Paper>
        </Center>
      </AppShell.Main>
    </AppShell>
  );
}