import {
  ChartBarIcon,
  UsersIcon,
  ShieldExclamationIcon,
  DocumentCheckIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import NavigationItems from './NavigationItems';
import { MenuItem, NavigationProps } from './NavigationItems';

const AdminNavigation = ({ activePathname }: NavigationProps) => {
  const { t } = useTranslation('common');

  const menus: MenuItem[] = [
    {
      name: t('admin-dashboard'),
      href: '/admin/dashboard',
      icon: ChartBarIcon,
      active: activePathname === '/admin/dashboard',
    },
    {
      name: t('user-management'),
      href: '/admin/users',
      icon: UsersIcon,
      active: activePathname === '/admin/users',
    },
    {
      name: t('moderator-management'),
      href: '/admin/moderators',
      icon: ShieldExclamationIcon,
      active: activePathname === '/admin/moderators',
    },
    {
      name: t('petition-moderation'),
      href: '/admin/petitions',
      icon: DocumentCheckIcon,
      active: activePathname === '/admin/petitions',
    },
    {
      name: t('account'),
      href: '/settings/account',
      icon: Cog6ToothIcon,
      active: activePathname === '/settings/account',
    },
  ];

  return <NavigationItems menus={menus} />;
};

export default AdminNavigation;