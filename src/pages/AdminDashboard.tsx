import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  Badge,
  Loader,
  Alert,
  ThemeIcon,
  Divider,
  Skeleton,
  Avatar,
  Progress,
  Paper,
  SimpleGrid,
  Tooltip,
  ActionIcon,
  Menu,
  Drawer,
  Tabs,
  RingProgress,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconUser,
  IconLogout,
  IconQuestionMark,
  IconDashboard,
  IconChartBar,
  IconSettings,
  IconBell,
  IconTimeline,
  IconUsers,
  IconFileText,
  IconCheckbox,
  IconMenu2,
  IconRefresh,
  IconEye,
  IconEdit,
  IconTrash,
  IconFilter,
  IconSearch,
  IconAlertCircle,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { DataTable } from "mantine-datatable";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime);

// Types
interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "user" | "qa" | "apo" | "dean" | "admin";
  program?: string;
  department?: string;
  avatar?: string;
  last_active?: string;
  permissions: string[];
}

interface Question {
  id: number;
  title: string;
  body: string;
  status: "draft" | "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  author_id: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  views: number;
  answers_count: number;
}

interface DashboardStats {
  total_questions: number;
  pending_reviews: number;
  approved_questions: number;
  active_users: number;
  completion_rate: number;
  recent_activity: Array<{
    id: number;
    action: string;
    user: string;
    timestamp: string;
  }>;
}

// Custom StatCard component (since Mantine doesn't export 'Stat')
const StatCard = ({ title, value, icon, color, trend, loading }: any) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Group justify="space-between" align="flex-start">
      <Stack gap={5}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
          {title}
        </Text>
        <Text fw={700} size="xl">
          {loading ? <Skeleton height={28} width={60} /> : value}
        </Text>
        {trend !== undefined && trend !== null && (
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
  const { user: authUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [opened, { open, close }] = useDisclosure(false);

  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>("overview");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  // Role-based permissions
  const hasPermission = useCallback((permission: string) => {
    const rolePermissions: Record<string, string[]> = {
      user: ["view_own_questions", "create_questions"],
      qa: ["view_all_questions", "review_questions", "approve_questions", "view_own_questions", "create_questions", "edit_questions", "delete_questions"],
      apo: ["view_all_questions", "view_analytics", "manage_programs", "view_reports"],
      dean: ["view_all_questions", "view_analytics", "manage_faculty", "view_reports", "approve_programs"],
      admin: ["*"],
    };
    
    if (authUser?.role === "admin") return true;
    return rolePermissions[authUser?.role || "user"]?.includes(permission) || false;
  }, [authUser?.role]);

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "red",
      dean: "orange",
      apo: "green",
      qa: "blue",
      user: "gray",
    };
    return colors[role] || "gray";
  };

  const getQuestionStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "gray",
      pending: "yellow",
      approved: "green",
      rejected: "red",
    };
    return colors[status] || "gray";
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Parallel API calls for better performance
        const [userRes, questionsRes, statsRes] = await Promise.all([
          api.get("/users/me"),
          api.get("/questions", { params: { limit: 10, sort: "-created_at" } }),
          api.get("/dashboard/stats"),
        ]);

        setUser(userRes.data);
        setQuestions(questionsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        notifications.show({
          title: "Error",
          message: "Failed to load dashboard data",
          color: "red",
          icon: <IconAlertCircle size={16} />,
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    modals.openConfirmModal({
      title: "Confirm Logout",
      children: <Text size="sm">Are you sure you want to logout?</Text>,
      labels: { confirm: "Logout", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        await logout();
        navigate("/login");
        notifications.show({
          title: "Logged out",
          message: "You have been successfully logged out",
          color: "blue",
        });
      },
    });
  };

  const handleDeleteQuestion = async (questionId: number) => {
    modals.openConfirmModal({
      title: "Delete Question",
      children: <Text size="sm">This action cannot be undone. Are you sure?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await api.delete(`/questions/${questionId}`);
          setQuestions(prev => prev.filter(q => q.id !== questionId));
          notifications.show({
            title: "Deleted",
            message: "Question deleted successfully",
            color: "green",
          });
        } catch (error) {
          notifications.show({
            title: "Error",
            message: "Failed to delete question",
            color: "red",
          });
        }
      },
    });
  };

  if (loading && !user) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" justify="center" h="50vh">
          <Loader size="xl" variant="dots" />
          <Text c="dimmed">Loading your dashboard...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title="Menu"
        padding="md"
        size="md"
        position="left"
      >
        <Stack gap="md">
          {hasPermission("view_analytics") && (
            <Button variant="light" leftSection={<IconChartBar size={18} />} fullWidth>
              Analytics
            </Button>
          )}
          <Button variant="light" leftSection={<IconSettings size={18} />} fullWidth>
            Settings
          </Button>
          <Button variant="light" color="red" leftSection={<IconLogout size={18} />} fullWidth onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Drawer>

      <Container size="xl" py="xl">
        {/* Header */}
        <Paper shadow="xs" p="md" radius="md" withBorder mb="lg" bg="white">
          <Group justify="space-between" wrap="nowrap">
            <Group>
              {isMobile && (
                <ActionIcon variant="subtle" onClick={open} size="lg">
                  <IconMenu2 size={20} />
                </ActionIcon>
              )}
              <div>
                <Title order={2}>Dashboard</Title>
                <Text size="sm" c="dimmed">
                  Welcome back, {user?.first_name} {user?.last_name}
                </Text>
              </div>
            </Group>

            <Group>
              <Tooltip label="Notifications">
                <ActionIcon variant="subtle" size="lg">
                  <IconBell size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Refresh">
                <ActionIcon
                  variant="subtle"
                  size="lg"
                  onClick={() => window.location.reload()}
                >
                  <IconRefresh size={20} />
                </ActionIcon>
              </Tooltip>
              <Divider orientation="vertical" />
              <Group gap="xs">
                <Avatar
                  src={user?.avatar}
                  alt={user?.first_name}
                  radius="xl"
                  size="md"
                  color={getRoleColor(user?.role || "user")}
                >
                  {user?.first_name?.[0]}
                </Avatar>
                <div style={{ display: isMobile ? "none" : "block" }}>
                  <Text size="sm" fw={500}>
                    {user?.first_name} {user?.last_name}
                  </Text>
                  <Badge color={getRoleColor(user?.role || "user")} size="xs">
                    {user?.role?.toUpperCase()}
                  </Badge>
                </div>
                <Menu shadow="md" width={200} position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="subtle" size="sm">
                      <IconSettings size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Account</Menu.Label>
                    <Menu.Item leftSection={<IconUser size={14} />}>
                      Profile Settings
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout size={14} />}
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Group>
        </Paper>

        {/* Role Banner */}
        {user?.role === "qa" && (
          <Alert
            icon={<IconCheckbox size={16} />}
            title="Quality Assurance Mode"
            color="blue"
            mb="lg"
            withCloseButton
          >
            You have {stats?.pending_reviews || 0} questions pending review. Please ensure all content meets quality standards.
          </Alert>
        )}

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
          <StatCard
            title="Total Questions"
            value={stats?.total_questions || 0}
            icon={<IconQuestionMark size={28} />}
            color="blue"
            trend={12}
            loading={loading}
          />
          <StatCard
            title="Pending Reviews"
            value={stats?.pending_reviews || 0}
            icon={<IconTimeline size={28} />}
            color="yellow"
            loading={loading}
          />
          <StatCard
            title="Approved"
            value={stats?.approved_questions || 0}
            icon={<IconCheckbox size={28} />}
            color="green"
            loading={loading}
          />
          <StatCard
            title="Active Users"
            value={stats?.active_users || 0}
            icon={<IconUsers size={28} />}
            color="teal"
            trend={5}
            loading={loading}
          />
        </SimpleGrid>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconDashboard size={16} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="questions" leftSection={<IconQuestionMark size={16} />}>
              Questions
            </Tabs.Tab>
            {hasPermission("view_analytics") && (
              <Tabs.Tab value="analytics" leftSection={<IconChartBar size={16} />}>
                Analytics
              </Tabs.Tab>
            )}
            <Tabs.Tab value="activity" leftSection={<IconTimeline size={16} />}>
              Activity
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">
                      Recent Questions
                    </Text>
                    <Button
                      variant="subtle"
                      size="xs"
                      onClick={() => setActiveTab("questions")}
                    >
                      View All
                    </Button>
                  </Group>
                  <Stack gap="md">
                    {questions.slice(0, 5).map((question) => (
                      <Paper
                        key={question.id}
                        p="sm"
                        radius="md"
                        withBorder
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedQuestion(question);
                          openDrawer();
                        }}
                      >
                        <Group justify="space-between" wrap="nowrap">
                          <div style={{ flex: 1 }}>
                            <Group gap="xs" mb="xs">
                              <Badge color={getQuestionStatusColor(question.status)}>
                                {question.status}
                              </Badge>
                              <Badge variant="light">{question.category}</Badge>
                              <Badge variant="outline" size="xs">
                                {question.difficulty}
                              </Badge>
                            </Group>
                            <Text fw={600} size="md">
                              {question.title}
                            </Text>
                            <Text size="sm" c="dimmed" lineClamp={2}>
                              {question.body}
                            </Text>
                            <Group gap="xs" mt="xs">
                              <Text size="xs" c="dimmed">
                                {dayjs(question.created_at).fromNow()}
                              </Text>
                              <Text size="xs" c="dimmed">
                                • {question.views} views
                              </Text>
                              <Text size="xs" c="dimmed">
                                • {question.answers_count} answers
                              </Text>
                            </Group>
                          </div>
                          {hasPermission("edit_questions") && (
                            <ActionIcon variant="subtle" color="red" onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(question.id);
                            }}>
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
                  <Text fw={700} size="lg" mb="md">
                    Progress
                  </Text>
                  <Stack gap="md">
                    <div>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm">Completion Rate</Text>
                        <Text size="sm" fw={700}>
                          {stats?.completion_rate || 0}%
                        </Text>
                      </Group>
                      <Progress
                        value={stats?.completion_rate || 0}
                        size="lg"
                        radius="xl"
                        color="teal"
                      />
                    </div>
                    <Divider />
                    <RingProgress
                      size={120}
                      thickness={8}
                      sections={[
                        { value: 40, color: "cyan", tooltip: "Approved" },
                        { value: 25, color: "yellow", tooltip: "Pending" },
                        { value: 35, color: "gray", tooltip: "Draft" },
                      ]}
                      label={
                        <Text size="xs" ta="center">
                          Question Status
                        </Text>
                      }
                    />
                  </Stack>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text fw={700} size="lg" mb="md">
                    Quick Actions
                  </Text>
                  <Stack gap="sm">
                    <Button
                      variant="filled"
                      leftSection={<IconQuestionMark size={16} />}
                      fullWidth
                      onClick={() => navigate("/questions/create")}
                    >
                      Create New Question
                    </Button>
                    <Button
                      variant="light"
                      leftSection={<IconFileText size={16} />}
                      fullWidth
                    >
                      View Reports
                    </Button>
                    {hasPermission("review_questions") && (
                      <Button
                        variant="light"
                        color="yellow"
                        leftSection={<IconCheckbox size={16} />}
                        fullWidth
                      >
                        Review Pending ({stats?.pending_reviews || 0})
                      </Button>
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="questions" pt="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={700} size="lg">
                  All Questions
                </Text>
                <Group>
                  <Button
                    variant="subtle"
                    leftSection={<IconFilter size={16} />}
                    size="xs"
                  >
                    Filter
                  </Button>
                  <Button
                    variant="subtle"
                    leftSection={<IconSearch size={16} />}
                    size="xs"
                  >
                    Search
                  </Button>
                </Group>
              </Group>
              
              <DataTable
                withTableBorder
                borderRadius="md"
                highlightOnHover
                records={questions}
                columns={[
                  { accessor: "title", width: 200 },
                  { accessor: "category", width: 120 },
                  {
                    accessor: "status",
                    width: 100,
                    render: (record) => (
                      <Badge color={getQuestionStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    ),
                  },
                  { accessor: "views", width: 80, textAlign: "right" },
                  {
                    accessor: "created_at",
                    width: 120,
                    render: (record) => dayjs(record.created_at).format("MMM D, YYYY"),
                  },
                  {
                    accessor: "actions",
                    title: "",
                    width: 80,
                    render: (record) => (
                      <Group gap="xs" wrap="nowrap">
                        <Tooltip label="View">
                          <ActionIcon variant="subtle" size="sm">
                            <IconEye size={14} />
                          </ActionIcon>
                        </Tooltip>
                        {hasPermission("edit_questions") && (
                          <Tooltip label="Edit">
                            <ActionIcon variant="subtle" size="sm">
                              <IconEdit size={14} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                        {hasPermission("delete_questions") && (
                          <Tooltip label="Delete">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              size="sm"
                              onClick={() => handleDeleteQuestion(record.id)}
                            >
                              <IconTrash size={14} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Group>
                    ),
                  },
                ]}
              />
            </Card>
          </Tabs.Panel>

          {hasPermission("view_analytics") && (
            <Tabs.Panel value="analytics" pt="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text fw={700} size="lg" mb="md">
                      Question Trends
                    </Text>
                    <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Text c="dimmed" ta="center">
                        Chart component would go here
                      </Text>
                    </div>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text fw={700} size="lg" mb="md">
                      Category Distribution
                    </Text>
                    <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Text c="dimmed" ta="center">
                        Pie chart would go here
                      </Text>
                    </div>
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
          )}

          <Tabs.Panel value="activity" pt="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text fw={700} size="lg" mb="md">
                Recent Activity
              </Text>
              <Stack gap="md">
                {stats?.recent_activity?.map((activity) => (
                  <Group key={activity.id} wrap="nowrap">
                    <ThemeIcon size="md" radius="xl" color="blue" variant="light">
                      <IconTimeline size={14} />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text size="sm">{activity.action}</Text>
                      <Text size="xs" c="dimmed">
                        {activity.user} • {dayjs(activity.timestamp).fromNow()}
                      </Text>
                    </div>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Tabs.Panel>
        </Tabs>

        {/* Question Detail Drawer */}
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          title="Question Details"
          padding="lg"
          size="lg"
          position="right"
        >
          {selectedQuestion && (
            <Stack gap="md">
              <Badge color={getQuestionStatusColor(selectedQuestion.status)} size="lg">
                {selectedQuestion.status}
              </Badge>
              <Title order={3}>{selectedQuestion.title}</Title>
              <Group gap="xs">
                <Badge>{selectedQuestion.category}</Badge>
                <Badge variant="outline">{selectedQuestion.difficulty}</Badge>
              </Group>
              <Divider />
              <Text>{selectedQuestion.body}</Text>
              <Divider />
              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  Tags: {selectedQuestion.tags?.join(", ")}
                </Text>
              </Group>
              {hasPermission("review_questions") && selectedQuestion.status === "pending" && (
                <Group gap="sm" mt="md">
                  <Button color="green" fullWidth>Approve</Button>
                  <Button color="red" variant="light" fullWidth>Reject</Button>
                </Group>
              )}
            </Stack>
          )}
        </Drawer>
      </Container>
    </>
  );
}