import { ReactNode, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  AppShell,
  Text,
  Button,
  Stack,
  Group,
  Avatar,
  Burger,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDashboard, IconMenu, IconQuestionMark } from "@tabler/icons-react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [opened, { toggle }] = useDisclosure();

  const hasRole = (roles: string[]) => {
    return roles.includes(user?.role);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 220,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      {/* ===== HEADER ===== */}
      <AppShell.Header>
        <Group justify="space-between" px="md" style={{ height: "100%" }}>
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={700}>SMEES Admin</Text>
          </Group>

          <Group>
            <Text size="sm">{user?.username}</Text>
            <Avatar radius="xl">{user?.username?.[0]}</Avatar>
            <Button size="xs" color="red" onClick={logout}>
              Logout
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      {/* ===== SIDEBAR ===== */}
      <AppShell.Navbar p="md">
        <Stack>

          <Button variant="subtle" onClick={() => navigate("/")} leftSection={<IconMenu size={16} />}>
            Dashboard
          </Button>

          {hasRole(["admin", "qa"]) && (
            <Button 
                variant="subtle"
                 onClick={() => navigate("/questions")}
                 leftSection={<IconQuestionMark size={16} />}
            >
              Questions
            </Button>
          )}

          {hasRole(["admin"]) && (
            <Button variant="subtle" onClick={() => navigate("/users")}>
              Users
            </Button>
          )}

          {hasRole(["dean", "apo", "admin"]) && (
            <Button variant="subtle" onClick={() => navigate("/reports")}>
              Reports
            </Button>
          )}

        </Stack>
      </AppShell.Navbar>

      {/* ===== MAIN CONTENT ===== */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}