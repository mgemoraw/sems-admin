import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
  SimpleGrid,
  ThemeIcon,
  Avatar,
  Badge,
  Divider,
  Progress,
  RingProgress,
  Paper,
  Skeleton,
  Alert,
  ScrollArea,
  rem,
} from "@mantine/core";
import {
  IconUsers,
  IconBuildingCommunity,
  IconQuestionMark,
  IconChartBar,
  IconSchool,
  IconCalendarStats,
  IconCheckbox,
  IconArrowUpRight,
  IconArrowDownRight,
  IconUserCheck,
  IconClipboardList,
  IconTrophy,
  IconClock,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AppLayout from "../layouts/AppLayout";

dayjs.extend(relativeTime);

// Types
interface DashboardStats {
  total_users: number;
  active_users: number;
  total_departments: number;
  total_questions: number;
  questions_by_department: Array<{
    department: string;
    count: number;
    percentage: number;
  }>;
  recent_activity: Array<{
    id: number;
    action: string;
    user: string;
    timestamp: string;
  }>;
  completion_rate: number;
  pending_approvals: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  department?: string;
  avatar?: string;
}

export default function Dashboard() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const loadDashboardStats = async () => {
      setLoading(true);
      try {
        const response = await api.get(`${API_DEV_URL}/dashboard/stats`);
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
        notifications.show({
          title: "Error",
          message: "Failed to load dashboard data",
          color: "red",
        });
        // Mock data for demo
        setStats({
          total_users: 1248,
          active_users: 892,
          total_departments: 12,
          total_questions: 3456,
          questions_by_department: [
            { department: "Computer Science", count: 1245, percentage: 36 },
            { department: "Engineering", count: 987, percentage: 28.5 },
            { department: "Business", count: 756, percentage: 21.9 },
            { department: "Medicine", count: 468, percentage: 13.6 },
          ],
          recent_activity: [
            { id: 1, action: "New question added", user: "John Doe", timestamp: new Date().toISOString() },
            { id: 2, action: "Exam completed", user: "Jane Smith", timestamp: new Date().toISOString() },
            { id: 3, action: "Department updated", user: "Admin", timestamp: new Date().toISOString() },
          ],
          completion_rate: 78,
          pending_approvals: 23,
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  const StatCard = ({ title, value, icon, color, trend, subtitle }: any) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="stat-card">
      <Group justify="space-between" align="flex-start">
        <Stack gap={5} style={{ flex: 1 }}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Text fw={700} size="32px" style={{ fontSize: "2rem", lineHeight: 1.2 }}>
            {loading ? <Skeleton height={32} width={60} /> : value}
          </Text>
          {subtitle && (
            <Text size="xs" c="dimmed">
              {subtitle}
            </Text>
          )}
          {trend && (
            <Badge 
              color={trend > 0 ? "green" : "red"} 
              size="sm" 
              variant="light"
              leftSection={trend > 0 ? <IconArrowUpRight size={12} /> : <IconArrowDownRight size={12} />}
            >
              {Math.abs(trend)}% from last month
            </Badge>
          )}
        </Stack>
        <ThemeIcon size={54} radius="md" color={color} variant="light">
          {icon}
        </ThemeIcon>
      </Group>
    </Card>
  );

  return (
    <AppLayout>
      <Container size="xl" py="xl">
        {/* Welcome Section */}
        <Paper 
          shadow="xs" 
          p="xl" 
          radius="md" 
          withBorder 
          mb="xl"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Group justify="space-between" align="center">
            <Stack gap="xs">
              <Text size="sm" opacity={0.8}>
                {greeting} 👋
              </Text>
              <Title order={1} size="2rem" style={{ color: "white" }}>
                Welcome back, {user?.username}!
              </Title>
              <Text size="md" opacity={0.9} maw={600}>
                Track your academic progress, manage questions, and monitor department performance all in one place.
              </Text>
              <Group gap="md" mt="md">
                <Badge size="lg" variant="white" color="dark">
                  Role: {user?.role?.toUpperCase()}
                </Badge>
                {user?.department && (
                  <Badge size="lg" variant="white" color="dark">
                    Department: {user.department}
                  </Badge>
                )}
              </Group>
            </Stack>
            <Avatar 
              size={100} 
              radius="xl" 
              color="blue"
              style={{ border: "3px solid white" }}
            >
              {user?.username?.[0]?.toUpperCase()}
            </Avatar>
          </Group>
        </Paper>

        {/* System Overview Section */}
        <Title order={2} mb="md">
          System Overview
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
          <StatCard
            title="Total Users"
            value={stats?.total_users?.toLocaleString() || 0}
            icon={<IconUsers size={28} />}
            color="blue"
            trend={12}
            subtitle="Active: 892"
          />
          <StatCard
            title="Departments"
            value={stats?.total_departments || 0}
            icon={<IconBuildingCommunity size={28} />}
            color="teal"
            subtitle="Active departments"
          />
          <StatCard
            title="Total Questions"
            value={stats?.total_questions?.toLocaleString() || 0}
            icon={<IconQuestionMark size={28} />}
            color="violet"
            trend={8}
          />
          <StatCard
            title="Pending Approvals"
            value={stats?.pending_approvals || 0}
            icon={<IconClipboardList size={28} />}
            color="orange"
            subtitle="Awaiting review"
          />
        </SimpleGrid>

        {/* Questions by Department Section */}
        <Grid gutter="md" mb="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={700} size="lg">
                  Questions by Department
                </Text>
                <Button 
                  variant="subtle" 
                  size="xs"
                  onClick={() => navigate("/questions")}
                >
                  View All Questions
                </Button>
              </Group>
              <Stack gap="md">
                {stats?.questions_by_department?.map((dept) => (
                  <div key={dept.department}>
                    <Group justify="space-between" mb="xs">
                      <Group gap="xs">
                        <ThemeIcon size="sm" color="blue" variant="light">
                          <IconSchool size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={500}>
                          {dept.department}
                        </Text>
                      </Group>
                      <Text size="sm" fw={700}>
                        {dept.count.toLocaleString()} questions ({dept.percentage}%)
                      </Text>
                    </Group>
                    <Progress 
                      value={dept.percentage} 
                      size="md" 
                      radius="xl"
                      color={dept.percentage > 30 ? "green" : dept.percentage > 20 ? "blue" : "orange"}
                    />
                  </div>
                ))}
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text fw={700} size="lg" mb="md">
                Overall Progress
              </Text>
              <Stack align="center" gap="md">
                <RingProgress
                  size={180}
                  thickness={12}
                  label={
                    <Text size="xl" ta="center" fw={700}>
                      {stats?.completion_rate || 0}%
                    </Text>
                  }
                  sections={[{ value: stats?.completion_rate || 0, color: "teal" }]}
                />
                <Divider w="100%" />
                <Group justify="space-between" w="100%">
                  <Text size="sm" c="dimmed">Target Completion</Text>
                  <Text fw={700}>85%</Text>
                </Group>
                <Progress value={78} size="sm" radius="xl" color="teal" w="100%" />
                <Button 
                  variant="light" 
                  fullWidth 
                  mt="md"
                  onClick={() => navigate("/analytics")}
                >
                  View Detailed Analytics
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Recent Activity & Quick Actions */}
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={700} size="lg">
                  Recent Activity
                </Text>
                <IconClock size={18} color="gray" />
              </Group>
              <ScrollArea h={300}>
                <Stack gap="md">
                  {stats?.recent_activity?.map((activity) => (
                    <Group key={activity.id} wrap="nowrap">
                      <ThemeIcon size="md" radius="xl" color="blue" variant="light">
                        <IconCheckbox size={14} />
                      </ThemeIcon>
                      <div style={{ flex: 1 }}>
                        <Text size="sm">{activity.action}</Text>
                        <Text size="xs" c="dimmed">
                          by {activity.user} • {dayjs(activity.timestamp).fromNow()}
                        </Text>
                      </div>
                    </Group>
                  ))}
                  {(!stats?.recent_activity || stats.recent_activity.length === 0) && (
                    <Text c="dimmed" ta="center" py="xl">
                      No recent activity
                    </Text>
                  )}
                </Stack>
              </ScrollArea>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text fw={700} size="lg" mb="md">
                Quick Actions
              </Text>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Button 
                  variant="light" 
                  leftSection={<IconQuestionMark size={18} />}
                  onClick={() => navigate("/questions/create")}
                  fullWidth
                >
                  Create Question
                </Button>
                <Button 
                  variant="light" 
                  leftSection={<IconChartBar size={18} />}
                  onClick={() => navigate("/analytics")}
                  fullWidth
                >
                  View Analytics
                </Button>
                <Button 
                  variant="light" 
                  leftSection={<IconUsers size={18} />}
                  onClick={() => navigate("/users")}
                  fullWidth
                >
                  Manage Users
                </Button>
                <Button 
                  variant="light" 
                  leftSection={<IconClipboardList size={18} />}
                  onClick={() => navigate("/reports")}
                  fullWidth
                >
                  Generate Reports
                </Button>
              </SimpleGrid>

              <Divider my="md" />

              {/* System Info */}
              <Stack gap="xs">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  System Information
                </Text>
                <Group justify="space-between">
                  <Text size="sm">Version</Text>
                  <Badge variant="light">v2.0.0</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Last Updated</Text>
                  <Text size="sm">December 2024</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Active Sessions</Text>
                  <Text size="sm" fw={700}>{stats?.active_users || 0}</Text>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Achievement Section (Optional) */}
        <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
          <Group justify="space-between" align="center">
            <Group gap="md">
              <ThemeIcon size="xl" radius="xl" color="yellow" variant="light">
                <IconTrophy size={28} />
              </ThemeIcon>
              <div>
                <Text fw={700} size="lg">Achievement Unlocked</Text>
                <Text size="sm" c="dimmed">You've helped create over 3,000 questions in the system!</Text>
              </div>
            </Group>
            <Badge size="xl" variant="gradient" gradient={{ from: 'gold', to: 'orange' }}>
              Top Contributor
            </Badge>
          </Group>
        </Card>
      </Container>

      <style>{`
        .stat-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </AppLayout>
  );
}