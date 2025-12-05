import {
  FileText,
  LayoutDashboard,
  LogOut,
  SendHorizonalIcon,
} from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useLogout } from '@/hooks/services/auth'

const menuItems: Array<{
  tooltip: string
  path: string
  icon: LucideIcon
  label: string
}> = [
  {
    tooltip: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    tooltip: 'SMS Sender',
    path: '/sms-sender',
    icon: SendHorizonalIcon,
    label: 'SMS Sender',
  },
  {
    tooltip: 'Logs',
    path: '/logs',
    icon: FileText,
    label: 'Logs',
  },
]

export function AppSidebar() {
  const { logout } = useLogout()
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="h-16">
        <div className="flex h-full items-center justify-center gap-2 text-center">
          <h2 className="text-xl font-extrabold">SMS ADMIN</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  location.pathname === item.path ||
                  location.pathname.startsWith(item.path + '/')
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      tooltip={item.tooltip}
                      size="lg"
                      asChild
                      isActive={isActive}
                      className="[&>svg]:size-5 text-base"
                    >
                      <Link to={item.path}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
