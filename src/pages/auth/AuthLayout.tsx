import { Outlet } from "react-router-dom";
import {
  AppShell,
  Paper,
  Stack,
  Title,
  Text,
  Box,
  Center,
  ThemeIcon,
  Grid,
  Burger,
  Group,
  AppShellNavbar,
} from "@mantine/core";
import { Icon123, IconLinkOff, IconShieldCheck } from "@tabler/icons-react";
import sems_icon from "../../assets/icons/sems_logo.png";
import bdu_logo from "../../assets/icons/bdu_logo.webp";
import { useDisclosure } from "@mantine/hooks";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function AuthLayout() {
  const [opened, {toggle}] = useDisclosure();
  const {user, isAuthenticated} = useContext(AuthContext);

  return (
    <AppShell
      padding="md"
      header={{height: 60}}
      withBorder = {true}
      navbar={{
        width: 0,
        breakpoint: "sm", 
        collapsed: {mobile: !opened}
      }}
    >
      <AppShell.Header>
        <Group justify="start" px="md" style={{ height: "100%" }}>
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />

        <div>
          <img src={sems_icon} alt="SEMS Logo" style={{ width: '40px', height: '40px' }} />
        </div>
        </Group>
      </AppShell.Header>

      
      isAuthenticated ? (
      <AppShell.Navbar 
        withBorder={false}
         p={0} w={{ base: 0, md: 0, lg: 0, xl: 120 }} bg="transparent">
      Navbar
      
      
      </AppShell.Navbar>
      ) : (
      <></>
      )


      <AppShell.Footer p={0} h={{ base: 0, md: 0, lg: 0, xl: 0 }} bg="transparent">
      Footer
      </AppShell.Footer>
      <AppShell.Aside p={0} w={{ base: 0, md: 0, lg: 0, xl: 100 }} bg="transparent">
      Aside
      </AppShell.Aside>
      
      <AppShell.Main 
        
        pt={20} m={0} style={{ minHeight: "100vh", backgroundColor: "var(--mantine-color-body)", width: "100%", margin: 0,  }}>
        {/* SimpleGrid automatically handles the split screen responsive break points */}

        <Grid 
          gutter={0}
          mih="100vh"
          w="100%"
          style={{ margin: 0, padding: 0 }}
        >
          {/* LEFT PANEL: 5/12 of the screen width (Slightly narrower billboard) */}
          <Grid.Col
            span={{ base: 4, md: 4 }} // Hidden or stacked on mobile, takes 5 parts on desktop
            visibleFrom="md"
            bg="linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-blue-5))"
            p="xl"
          >

          <Box
            visibleFrom="md" // Mantine built-in utility to hide component below md breakpoint
            bg="linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-blue-5))"
            p="xl"
          >
            <Center h="100%" w="100%">
              <Stack align="center" ta="center" c="white" maxW={460} gap="md">
                <ThemeIcon size={64} radius="xl" color="white" variant="outline" style={{ borderWidth: '2px' }}>
                  <img src={sems_icon} alt="SEMS Logo" style={{ width: '120px', height: '120px' }} />
                </ThemeIcon>
                <Box pb={20}>
                  <Title order={1} fw={900} size="xl" style={{ fontSize: '2.0rem', lineHeight: 1.2 }}>
                    SEMS Portal
                  </Title>
                  <Text mt="md" size="lg" opacity={0.9} lh={1.6} style={{color: 'var(--mantine-color-gray-0)'}}>
                    Secure, robust, and intuitive digital examination management. Access your tests, matrices, and evaluation reports seamlessly.
                  </Text>
                </Box>

                <ThemeIcon size={64} radius="xl" color="white" variant="outline" style={{ borderWidth: '2px' }}>
                  <img src={bdu_logo} alt="BDU Logo" style={{ width: '120px', height: '120px' }} />
                </ThemeIcon>

                <Box>
                  <Title order={1} fw={900} size="xl" style={{ fontSize: '2.0rem', lineHeight: 1.2 }}>
                    Bahir Dar Institute of Technology
                  </Title>
                  <Text mt="md" size="lg" opacity={0.9} lh={1.6} style={{color: 'var(--mantine-color-gray-0)'}}>
                    Bahir Dar University.
                  </Text>
                </Box>
              </Stack>
            </Center>
          </Box>
          </Grid.Col>

          {/* RIGHT PANEL: 7/12 of the screen width (Much bigger for forms) */}
          <Grid.Col 
            span={{ base: 10, md: 10, lg: 8, xl: 8 }} // Full width on mobile, takes 7 parts on desktop
            bg="var(--mantine-color-body)" 
          >
          <Box bg="var(--mantine-color-body)">
            <Center h="100%" p="md" w="100%">
              <Paper
                w="100%"
                maxW={460} // Holds form constraint safely on desktop panels
                p={{ base: 'xs', sm: 'md' }}
                bg="transparent" // Drops container border line on desktop since the layout scales beautifully
              >
                {/* Header branding visible for everyone, essential when Left Panel hides on Mobile */}
                <Stack gap="xs" mb={30} ta={{ base: 'center', md: 'left' }}>
                  <Title 
                    order={2} 
                    fw={800}
                    size="h2"
                    style={{ letterSpacing: '-0.5px', alignSelf: 'center'}}

                  >
                    Welcome to <span style={{ color: 'var(--mantine-color-blue-6)' }}>
                      <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>SEMS</a></span>
                  </Title>
                  <Text c="dimmed" size="sm" style={{alignSelf: 'center'}}>
                    BiT's Student Exam Management System
                  </Text>
                </Stack>

                {/* Sub-form inputs populate dynamically inside this block */}
                <Outlet />
              </Paper>
            </Center>
          </Box>

        </Grid.Col>
        </Grid>
      </AppShell.Main>

    
       <AppShell.Aside p={0} w={{ base: 0, md: 0, lg: 0, xl: 0 }} bg="transparent">
      
      </AppShell.Aside>
      
    </AppShell>
  );
}