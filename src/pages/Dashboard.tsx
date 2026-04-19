import { useEffect, useState, useContext } from "react";
import api, { API_DEV_URL } from "../api/client";
import { AuthContext } from "../context/AuthContext";

import {
  Card,
  Text,
  Button,
  Grid,
  Container,
  Group,
  Title,
  Stack,
} from "@mantine/core";
import AppLayout from "../layouts/AppLayout";

export default function Dashboard() {
  const { logout, user } = useContext(AuthContext);

  // const [user, setUser] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      // const u = await api.get(`${API_DEV_URL}/auth/me`);
      const q = await api.get(`${API_DEV_URL}/questions/1?year=2022`);

      // setUser(u.data);
      setQuestions(q.data);
    };

    load();
  }, []);

  return (
    <AppLayout>

    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>User Dashboard</Title>

        <Button color="red" onClick={logout}>
          Logout
        </Button>
      </Group>

      {user && (
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
          <Stack gap={5}>
            <Text fw={700} size="lg">
              Welcome {user.username}
            </Text>
            <Text>{user.email}</Text>
            <Text size="sm" c="dimmed">
              {user.role}
            </Text>
          </Stack>
        </Card>
      )}

      <Title order={4} mb="md">
        Available Questions
      </Title>

      <Grid>
        {questions.map((q) => (
          <Grid.Col key={q.id} span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="xs" align="left">
                <Text size="sm" c="dimmed">
                  {q.id}: {q.content}
                </Text>
              </Stack>
              
              {JSON.parse(q.options).map((op) => (
              <Group gap="xs" justify="start">
                <Text fw={600} size="sm" c="dimmed">{op.label}. {op.content}</Text>
                
              </Group>
              ))}
              
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
    </AppLayout>

  );
}
