import { Center, Stack, Loader, Text, Paper } from "@mantine/core";

export default function FullScreenLoader({
  message = "Loading your dashboard...",
}: {
  message?: string;
}) {
  return (
    <Center
      style={{
        height: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
      }}
    >
      <Paper
        shadow="md"
        radius="lg"
        p="xl"
        style={{
          minWidth: 280,
          textAlign: "center",
        }}
      >
        <Stack align="center" gap="md">
          <Loader size="lg" variant="dots" />

          <Text fw={600} size="md">
            SMEES System
          </Text>

          <Text size="sm" c="dimmed">
            {message}
          </Text>
        </Stack>
      </Paper>
    </Center>
  );
}