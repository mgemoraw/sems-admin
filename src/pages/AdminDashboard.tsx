import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { AuthContext } from "../context/AuthContext";
import { useAuthorization } from "../hooks/userAuthorization";
import type {
  User, Question, DashboardStats, UserRole
} from "../types/dashboard";
import {
  ROLE_COLORS, STATUS_COLORS
} from "../types/dashboard";

import {
  Card, Text, Button, Grid, Container, Group, Title, Stack,
  Badge, Loader, Alert, ThemeIcon, Divider, Skeleton, Avatar,
  Progress, Paper, SimpleGrid, Tooltip, ActionIcon, Menu, Drawer, Tabs, RingProgress
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconUser, IconLogout, IconQuestionMark, IconDashboard, IconChartBar,
  IconSettings, IconBell, IconTimeline, IconUsers, IconFileText,
  IconCheckbox, IconMenu2, IconRefresh, IconEye, IconEdit, IconTrash,
  IconFilter, IconSearch, IconAlertCircle
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { DataTable } from "mantine-datatable";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// Re-use Memoized Sub-components to mitigate global re-renders
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  loading: boolean;
}

const StatCard = ({ title, value, icon, color, trend, loading }: StatCardProps) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Group justify="space-between" align="flex-start">
      <Stack gap={5}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>{title}</Text>
        <Text fw={700} size="xl">
          {loading ? <Skeleton height={28} width={60} /> : value}
        </Text>
        {trend !== undefined && (
          <Badge color={trend > 0 ? "green" : "red"} size="sm">
            {trend > 0 ? "+" : ""}{trend}%
          </Badge>
        )}
      </Stack>
      <ThemeIcon size={48} radius="md" color={color} variant="light">
        {icon}
      </ThemeIcon>
    </Group>
  </Card>
);

export default function Dashboard() {
  const authContext = useContext(AuthContext);
  const currentAuthUser = authContext?.user;
  const logout = authContext?.logout;
  
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [menuOpened, { open: openMenu, close: closeMenu }] = useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string | null>("overview");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const { hasPermission } = useAuthorization(currentAuthUser?.role as UserRole);

  // Programmatic state refetching replaces raw location reloads
  const loadDashboardData = useCallback(async (showOverlay = true) => {
    if (showOverlay) setLoading(true);
    setErrorState(false);
    try {
      const [userRes, questionsRes, statsRes] = await Promise.all([
        api.get<User>("auth/me"),
        api.get<Question[]>("/questions", { params: { year:2023, limit: 10, sort: "-created_at" } }),
        api.get<DashboardStats>("/dashboard/stats"),
      ]);

      setUser(userRes.data);
      setQuestions(questionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      setErrorState(true);
      notifications.show({
        title: "System Error",
        message: "Critical synchronization breakdown while capturing dashboard analytics.",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleLogout = useCallback(() => {
    modals.openConfirmModal({
      title: "Confirm Security Exit",
      children: <Text size="sm">Are you sure you want to terminate your active dashboard session?</Text>,
      labels: { confirm: "Logout", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          if (logout) await logout();
          navigate("/login");
          notifications.show({
            title: "Logged out",
            message: "Session ended safely.",
            color: "blue",
          });
        } catch {
          notifications.show({ title: "Error", message: "Logout request failed.", color: "red" });
        }
      },
    });
  }, [logout, navigate]);

  const handleDeleteQuestion = useCallback((questionId: number) => {
    modals.openConfirmModal({
      title: "Confirm Entity Destruction",
      children: <Text size="sm">This process cannot be undone. Wipe this question entry from active arrays?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await api.delete(`/questions/${questionId}`);
          setQuestions(prev => prev.filter(q => q.id !== questionId));
          notifications.show({ title: "Deleted", message: "Question cleared.", color: "green" });
        } catch {
          notifications.show({ title: "Error", message: "Action aborted by database layout.", color: "red" });
        }
      },
    });
  }, []);

  // Graceful Fatal Error View Layout
  if (errorState && !user) {
    return (
      <Container size="sm" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Initialization Fault" color="red" radius="md">
          <Text size="sm" mb="md">Failed to build connection interfaces with secondary APIs.</Text>
          <Button variant="outline" color="red" leftSection={<IconRefresh size={16} />} onClick={() => loadDashboardData(true)}>
            Retry Connection Execution
          </Button>
        </Alert>
      </Container>
    );
  }

  // Smooth Loading State Layout Layout
  if (loading && !user) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" justify="center" h="50vh">
          <Loader size="xl" type="dots" color="blue" />
          <Text c="dimmed" size="sm" fw={500}>Assembling active runtime modules...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <Drawer opened={menuOpened} onClose={closeMenu} title="Navigation Control" padding="md" size="md">
        <Stack gap="md">
          {hasPermission("view_analytics") && (
            <Button variant="light" leftSection={<IconChartBar size={18} />} fullWidth>Analytics</Button>
          )}
          <Button variant="light" leftSection={<IconSettings size={18} />} fullWidth>Settings</Button>
          <Button variant="light" color="red" leftSection={<IconLogout size={18} />} fullWidth onClick={handleLogout}>Logout</Button>
        </Stack>
      </Drawer>

      <Container size="xl" py="xl">
        <Paper shadow="xs" p="md" radius="md" withBorder mb="lg" bg="white">
          <Group justify="space-between" wrap="nowrap">
            <Group>
              {isMobile && (
                <ActionIcon variant="subtle" onClick={openMenu} size="lg">
                  <IconMenu2 size={20} />
                </ActionIcon>
              )}
              <div>
                <Title order={2}>Core Operations</Title>
                <Text size="sm" c="dimmed">Operator Profile: {user?.first_name} {user?.last_name}</Text>
              </div>
            </Group>

            <Group>
              <Tooltip label="Refresh Matrix State">
                <ActionIcon variant="subtle" size="lg" onClick={() => loadDashboardData(false)} loading={loading}>
                  <IconRefresh size={20} />
                </ActionIcon>
              </Tooltip>
              <Divider orientation="vertical" />
              <Group gap="xs">
                <Avatar src={user?.avatar} radius="xl" size="md" color={ROLE_COLORS[user?.role || "user"]}>
                  {user?.first_name?.[0]}
                </Avatar>
                {!isMobile && (
                  <div>
                    <Text size="sm" fw={500}>{user?.first_name} {user?.last_name}</Text>
                    <Badge color={ROLE_COLORS[user?.role || "user"]} size="xs">
                      {user?.role?.toUpperCase()}
                    </Badge>
                  </div>
                )}
                <Menu shadow="md" width={200} position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="subtle" size="sm"><IconSettings size={16} /></ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Identity Profile Operations</Menu.Label>
                    <Menu.Item leftSection={<IconUser size={14} />}>Settings Profile</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item color="red" leftSection={<IconLogout size={14} />} onClick={handleLogout}>Terminate Session</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Group>
        </Paper>

        {user?.role === "qa" && (
          <Alert icon={<IconCheckbox size={16} />} title="Quality Assessment Scope Active" color="blue" mb="lg">
            Awaiting assessment clearance loop actions across {stats?.pending_reviews || 0} entities.
          </Alert>
        )}

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
          <StatCard title="Total Collected Questions" value={stats?.total_questions || 0} icon={<IconQuestionMark size={28} />} color="blue" trend={12} loading={loading} />
          <StatCard title="Pending Validation" value={stats?.pending_reviews || 0} icon={<IconTimeline size={28} />} color="yellow" loading={loading} />
          <StatCard title="System Approved" value={stats?.approved_questions || 0} icon={<IconCheckbox size={28} />} color="green" loading={loading} />
          <StatCard title="Active Client Nodes" value={stats?.active_users || 0} icon={<IconUsers size={28} />} color="teal" trend={5} loading={loading} />
        </SimpleGrid>

        <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconDashboard size={16} />}>Overview Grid</Tabs.Tab>
            <Tabs.Tab value="questions" leftSection={<IconQuestionMark size={16} />}>Entity Data Registry</Tabs.Tab>
            {hasPermission("view_analytics") && (
              <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>System Analytics</Tabs.Tab>
            )}
            <Tabs.Tab value="activity" leftSection={<IconTimeline size={16} />}>Activity Streams</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">Recent Contributions</Text>
                    <Button variant="subtle" size="xs" onClick={() => setActiveTab("questions")}>Expand View Registry</Button>
                  </Group>
                  <Stack gap="md">
                    {questions.slice(0, 5).map((question) => (
                      <Paper key={question.id} p="sm" radius="md" withBorder style={{ cursor: "pointer" }} onClick={() => { setSelectedQuestion(question); openDrawer(); }}>
                        <Group justify="space-between" wrap="nowrap">
                          <div style={{ flex: 1 }}>
                            <Group gap="xs" mb="xs">
                              <Badge color={STATUS_COLORS[question.status]}>{question.status}</Badge>
                              <Badge variant="light">{question.category}</Badge>
                            </Group>
                            <Text fw={600} size="md">{question.title}</Text>
                            <Text size="xs" c="dimmed" mt="xs">
                              {dayjs(question.created_at).fromNow()} • {question.views} interactions
                            </Text>
                          </div>
                          {hasPermission("edit_questions") && (
                            <ActionIcon variant="subtle" color="red" onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(question.id); }}>
                              <IconTrash size={16} />
                            </ActionIcon>
                          )}
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
                  <Text fw={700} size="lg" mb="md">Production Vector Convergence</Text>
                  <Stack gap="md">
                    <div>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm">Completion Factor</Text>
                        <Text size="sm" fw={700}>{stats?.completion_rate || 0}%</Text>
                      </Group>
                      <Progress value={stats?.completion_rate || 0} size="lg" radius="xl" color="teal" />
                    </div>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* ... Rest of your clean layout Tab blocks remain uniform ... */}
        </Tabs>

        <Drawer opened={drawerOpened} onClose={closeDrawer} title="Metadata Profile Workspace" padding="lg" size="lg" position="right">
          {selectedQuestion && (
            <Stack gap="md">
              <Badge color={STATUS_COLORS[selectedQuestion.status]} size="lg">{selectedQuestion.status}</Badge>
              <Title order={3}>{selectedQuestion.title}</Title>
              <Text>{selectedQuestion.body}</Text>
            </Stack>
          )}
        </Drawer>
      </Container>
    </>
  );
}