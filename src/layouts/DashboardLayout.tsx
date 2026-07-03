import { useDisclosure } from '@mantine/hooks';
import { 
  AppShell, 
  Burger, 
  Group, 
  Text, 
  ScrollArea, 
  Stack, 
  NavLink, 
  Card, 
  ThemeIcon, 
  Title,
  Box
} from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { 
  IconGauge, 
  IconFileText, 
  IconBulb, 
  IconInfoCircle,
  IconCertificate,
  IconSettings
} from '@tabler/icons-react';

export default function DashboardLayout() {
  // state hooks managing the toggle state of the navigation column
  const [opened, { toggle }] = useDisclosure(true);

  // Recommended platform advice mock matrix
  const systemTips = [
    { title: 'Secure Browser Lockdown', text: 'Ensure mandatory browser tracking checks are enabled for end-term assessment rows.', color: 'blue' },
    { title: 'Randomized Question Pools', text: 'Distribute unique, non-consecutive questions to students by enabling shuffled arrays inside test setup.', color: 'teal' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        // Dynamically shift width values smoothly depending on burger button toggle state
        width: opened ? 260 : 70,
        breakpoint: 'sm',
      }}
      aside={{
        width: 300,
        breakpoint: 'md', // Hides entirely on mobile/tablet widths below 'md' to prevent squishing
      }}
      padding="md"
    >
      {/* 1. TOP HEADER REGION */}
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} size="sm" />
          <Text fw={800} size="lg" style={{ letterSpacing: '-0.5px' }}>
            SEMS <Text component="span" fw={400} size="sm" c="dimmed">Console</Text>
          </Text>
        </Group>
      </AppShell.Header>

      {/* 2. LEFT COLLAPSIBLE NAVIGATION BAR */}
      <AppShell.Navbar p="xs">
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap="xs">
            <NavLink
              label={opened ? "Dashboard Overview" : null}
              leftSection={<IconGauge size={20} stroke={1.5} />}
              active
            />
            <NavLink
              label={opened ? "Manage Examination Lists" : null}
              leftSection={<IconFileText size={20} stroke={1.5} />}
            />
            <NavLink
              label={opened ? "Grading & Certificates" : null}
              leftSection={<IconCertificate size={20} stroke={1.5} />}
            />
            <NavLink
              label={opened ? "System Configuration" : null}
              leftSection={<IconSettings size={20} stroke={1.5} />}
            />
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* 3. CENTER ACTIVE VIEWPORT MAIN SECTION */}
      <AppShell.Main bg="var(--mantine-color-gray-0)">
        {/* Dynamic nested layout rendering via standard router elements */}
        <Box style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <Outlet />
        </Box>
      </AppShell.Main>

      {/* 4. RIGHT MINI COLUMN: TIPS & SYSTEM INSIGHTS */}
      <AppShell.Aside p="md" visibleFrom="md">
        <Stack gap="md">
          <Group gap="xs" mb="xs">
            <ThemeIcon variant="light" color="amber" radius="md">
              <IconBulb size={18} />
            </ThemeIcon>
            <Title order={5} fw={700}>System Recommendations</Title>
          </Group>

          {systemTips.map((tip, idx) => (
            <Card key={idx} padding="md" radius="md" withBorder shadow="0">
              <Group gap="xs" mb="xs" wrap="nowrap" align="flex-start">
                <IconInfoCircle size={16} style={{ marginTop: 2, flexShrink: 0 }} color={`var(--mantine-color-${tip.color}-6)`} />
                <Text fw={700} size="sm">{tip.title}</Text>
              </Group>
              <Text size="xs" c="dimmed" lh={1.4}>
                {tip.text}
              </Text>
            </Card>
          ))}
        </Stack>
      </AppShell.Aside>
    </AppShell>
  );
}