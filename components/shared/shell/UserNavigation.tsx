import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import NavigationItems from './NavigationItems';
import { MenuItem, NavigationProps } from './NavigationItems';

const UserNavigation = ({ activePathname }: NavigationProps) => {
  const { t } = useTranslation('common');

  const menus: MenuItem[] = [
    {
      name: t('my-petitions'),
      href: '/petitions/my-petitions',
      icon: DocumentTextIcon,
      active: activePathname === '/petitions/my-petitions',
    },
    {
      name: t('discover-petitions'),
      href: '/petitions/discover',
      icon: MagnifyingGlassIcon,
      active: activePathname === '/petitions/discover',
    },
    {
      name: t('create-petition'),
      href: '/petitions/create',
      icon: PlusIcon,
      active: activePathname === '/petitions/create',
    },
    {
      name: t('account'),
      href: '/settings/account',
      icon: UserCircleIcon,
      active: activePathname === '/settings/account',
    },
    {
      name: t('security'),
      href: '/settings/security',
      icon: ShieldCheckIcon,
      active: activePathname === '/settings/security',
    },
  ];

  return <NavigationItems menus={menus} />;
};

export default UserNavigation;
