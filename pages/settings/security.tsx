import env from '@/lib/env';
import { UpdatePassword } from '@/components/account';
import ManageSessions from '@/components/account/ManageSessions';

const Security = () => {
  const sessionStrategy = env.nextAuth.sessionStrategy;
  
  return (
    <div className="flex gap-10 flex-col">
      <UpdatePassword />
      {sessionStrategy === 'database' && <ManageSessions />}
    </div>
  );
};

export default Security;
