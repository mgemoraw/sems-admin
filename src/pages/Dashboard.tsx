import { useEffect, useState, useContext } from "react";
import api from "../api/client";
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

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  const [user, setUser] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const u = await api.get("/users/me");
      const q = await api.get("/questions");

      setUser(u.data);
      setQuestions(q.data);
    };

    load();
  }, []);

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Student Dashboard</Title>

        <Button color="red" onClick={logout}>
          Logout
        </Button>
      </Group>

      {user && (
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
          <Stack gap={5}>
            <Text fw={700} size="lg">
              Welcome {user.first_name}
            </Text>
            <Text>{user.email}</Text>
            <Text size="sm" c="dimmed">
              {user.program}
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
              <Stack gap="xs">
                <Text fw={600}>{q.title}</Text>
                <Text size="sm" c="dimmed">
                  {q.body}
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
