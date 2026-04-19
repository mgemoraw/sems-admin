import { ReactNode, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

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
import { menuItems } from "../config/menu";

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
  <Stack gap="xs">
    {menuItems
      .filter((item) => item.roles.includes(user?.role))
      .map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={{ textDecoration: "none" }}
          >
            {({ isActive }) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  borderRadius: "6px",
                  background: isActive ? "#eef2ff" : "transparent",
                  cursor: "pointer",
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            )}
          </NavLink>
        );
      })}
  </Stack>
</AppShell.Navbar>
      
{/* 
      {/* ===== MAIN CONTENT ===== */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

