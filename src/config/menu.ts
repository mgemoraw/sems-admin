import {
  IconDashboard,
  IconQuestionMark,
  IconUsers,
  IconChartBar,
  IconSettings,
} from "@tabler/icons-react";

export interface MenuItem {
  label: string;
  path: string;
  icon: any;
  roles: string[];
}

export const menuItems: MenuItem[] = [
    

  {
    label: "Dashboard",
    path: "/",
    icon: IconDashboard,
    roles: ["user", "qa", "apo", "dean", "admin"],
  },
  {
    label: "Questions",
    path: "/questions",
    icon: IconQuestionMark,
    roles: ["qa", "admin"],
  },
  {
    label: "Users",
    path: "/users",
    icon: IconUsers,
    roles: ["admin"],
  },
  {
    label: "Reports",
    path: "/reports",
    icon: IconChartBar,
    roles: ["apo", "dean", "admin"],
  },
  {
    label: "Settings",
    path: "/settings",
    icon: IconSettings,
    roles: ["admin"],
  },
];

export const menuGroups = [
    {
        title: "Main",
        items: [
            {label: "Dashboard", path: "/", roles: ['all']},
            {label: "Questions", path: "/questions", roles: ['all']},
            {label: "Users", path: "/users", roles: ['all']},
        ]
    },
    {
        title: "Management",
        items: [
            {label: "Reports", path: "/reports", roles: ['all']},
            {label: "Settings", path: "/settings", roles: ['all']},
        ]
    
    }
]