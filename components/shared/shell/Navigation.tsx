import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/firebase/AuthContext';
import UserNavigation from './UserNavigation';
import AdminNavigation from './AdminNavigation';

const Navigation = () => {
  const { asPath, isReady } = useRouter();
  const { userDocument } = useAuth();
  const [activePathname, setActivePathname] = useState<null | string>(null);

  useEffect(() => {
    if (isReady && asPath) {
      const activePathname = new URL(asPath, location.href).pathname;
      setActivePathname(activePathname);
    }
  }, [asPath, isReady]);

  // Show admin navigation for admin users
  const isAdmin = userDocument?.role === 'admin';

  return (
    <nav className="flex flex-1 flex-col">
      {isAdmin ? (
        <AdminNavigation activePathname={activePathname} />
      ) : (
        <UserNavigation activePathname={activePathname} />
      )}
    </nav>
  );
};

export default Navigation;
