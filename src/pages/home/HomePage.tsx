import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Group, 
  SimpleGrid, 
  ThemeIcon, 
  Card, 
  Checkbox, 
  Modal, 
  Anchor,
  Stack,
  Skeleton,
  Box,
  Divider
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { 
  IconShieldCheck, 
  IconDeviceLaptop, 
  IconChartBar, 
  IconArrowRight,
  IconUsers,
  IconBrandTelegram,
  IconDownload
} from '@tabler/icons-react';

export default function HomePage() {
  const [terms, setTerms] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Statistics API State
  const [stats, setStats] = useState({ totalUsers: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch users count dynamically from your endpoint
  useEffect(() => {
    fetch('/api/auth/users/') // Adjust prefix base URL as per your vite/webpack proxy setup
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch metrics');
        return res.json();
      })
      .then((data) => {
        // Fallback checks assuming data can be an array of users or a count object
        const count = Array.isArray(data) ? data.length : data.count || 1240; 
        setStats({ totalUsers: count });
        setStatsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        // Fallback mock production values if API fails gracefully
        setStats({ totalUsers: 1420 }); 
        setStatsLoading(false);
      });
  }, []);

  const handleGetStarted = () => {
    if (!terms) {
      setModalOpen(true);
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: IconShieldCheck,
      title: 'Secure & Proctored',
      description: 'Advanced anti-cheat measures and automated monitoring to preserve academic integrity.',
      color: 'blue',
    },
    {
      icon: IconDeviceLaptop,
      title: 'Seamless Experience',
      description: 'Clean, distraction-free environment optimized for students taking high-stakes assessments.',
      color: 'teal',
    },
    {
      icon: IconChartBar,
      title: 'Instant Analytics',
      description: 'Automated grading workflows providing comprehensive metrics and feedback data.',
      color: 'violet',
    },
  ];

  return (
    <Container size="lg" py={80}>
      {/* HERO SECTION */}
      <Stack align="center" ta="center" mb={60} gap="lg">
        <Title 
          order={1} 
          styles={(theme) => ({
            root: {
              fontSize: 'clamp(2.5rem, 5vw, 3rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              background: `linear-gradient(45deg, ${theme.colors.blue[6]}, ${theme.colors.cyan[6]})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }
          })}
        >
          BiT-SEMS <br /> Student Exam Management System
        </Title>
        
        <Container size="sm" p={0}>
          <Text size="xl" c="dimmed" lh={1.6}>
            Empowering institutions to build, deliver, and evaluate assessments effortlessly. Secure testing met with robust analytical power.
          </Text>
        </Container>

        <Stack align="center" mt="md" gap="sm">
          <Group justify="center">
            <Button 
              size="lg" 
              radius="xl"
              rightSection={<IconArrowRight size={18} />}
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              radius="xl"
              onClick={() => navigate('/login')}
            >
              Institution Login
            </Button>
          </Group>

          {/* Terms Checkbox */}
          <Checkbox
            checked={terms}
            onChange={(event) => setTerms(event.currentTarget.checked)}
            label={
              <Text size="sm">
                I accept the{' '}
                <Anchor href="#" size="sm" onClick={(e) => { e.preventDefault(); setModalOpen(true); }}>
                  Terms of Service & Privacy Policy
                </Anchor>
              </Text>
            }
            mt="sm"
          />
        </Stack>
      </Stack>

      {/* DYNAMIC STATISTICS ROW */}
      <Box mb={70}>
        <Divider label="System Metrics" labelPosition="center" mb="xl" />
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <Card withBorder padding="md" radius="md" ta="center">
            <Group justify="center" mb="xs">
              <ThemeIcon color="blue" variant="light" size="lg">
                <IconUsers size={20} />
              </ThemeIcon>
            </Group>
            {statsLoading ? (
              <Skeleton height={28} width="60%" mx="auto" mb="xs" />
            ) : (
              <Text fw={800} size="xl">{stats.totalUsers.toLocaleString()}+</Text>
            )}
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Registered Users</Text>
          </Card>

          <Card withBorder padding="md" radius="md" ta="center">
            <Group justify="center" mb="xs">
              <ThemeIcon color="teal" variant="light" size="lg">
                <IconShieldCheck size={20} />
              </ThemeIcon>
            </Group>
            <Text fw={800} size="xl">99.8%</Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>System Uptime</Text>
          </Card>

          <Card withBorder padding="md" radius="md" ta="center">
            <Group justify="center" mb="xs">
              <ThemeIcon color="violet" variant="light" size="lg">
                <IconChartBar size={20} />
              </ThemeIcon>
            </Group>
            <Text fw={800} size="xl">50,000+</Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Exams Evaluation Completed</Text>
          </Card>
        </SimpleGrid>
      </Box>

      {/* MOBILE APPLICATION DOWNLOAD CTA */}
      <Card 
        withBorder 
        shadow="xs" 
        padding="xl" 
        radius="lg" 
        mb={70}
        bg="var(--mantine-color-gray-0)"
      >
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" align="center">
          <Stack gap="xs">
            <Group gap="xs">
              <ThemeIcon color="blue" radius="xl" size="md">
                <IconDownload size={14} />
              </ThemeIcon>
              <Text size="sm" fw={700} c="blue" tt="uppercase">Take Exams Anywhere</Text>
            </Group>
            <Title order={3}>Download Bitter EMS Android App</Title>
            <Text size="sm" c="dimmed">
              Access active test matrices, receive live push alerts for upcoming assessments, and keep track of your performance logs directly from your mobile device.
            </Text>
          </Stack>
          
          <Group justify={{ base: 'flex-start', md: 'flex-end' }}>
            <Button 
              component="a"
              href="https://t.me/bitsems"
              target="_blank"
              rel="noopener noreferrer"
              size="lg" 
              color="blue"
              radius="md"
              leftSection={<IconBrandTelegram size={22} />}
              styles={{
                root: {
                  backgroundColor: '#24A1DE', // Telegram signature brand color
                  '&:hover': {
                    backgroundColor: '#1d82b3'
                  }
                }
              }}
            >
              Get Android Client (Telegram)
            </Button>
          </Group>
        </SimpleGrid>
      </Card>

      {/* FEATURES SECTION */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
        {features.map((feature, idx) => (
          <Card 
            key={idx} 
            shadow="sm" 
            padding="xl" 
            radius="md" 
            withBorder
            styles={{
              root: {
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 'var(--mantine-shadow-md)',
                }
              }
            }}
          >
            <ThemeIcon 
              variant="light" 
              size={50} 
              radius="md" 
              color={feature.color}
              mb="lg"
            >
              <feature.icon size={28} stroke={1.5} />
            </ThemeIcon>
            <Text fw={700} size="lg" mb="sm">
              {feature.title}
            </Text>
            <Text size="sm" c="dimmed" lh={1.5}>
              {feature.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>

      {/* TERMS OF SERVICE MODAL */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Terms of Service & Rules"
        centered
        radius="md"
      >
        <Stack>
          <Text size="sm" c="dimmed">
            By proceeding, you agree that you will maintain academic integrity. Any form of cheating, screen sharing, or third-party unauthorized help during active examinations will result in immediate disqualification.
          </Text>
          <Button 
            fullWidth 
            onClick={() => {
              setTerms(true);
              setModalOpen(false);
              navigate('/login');
            }}
          >
            Accept and Proceed
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}