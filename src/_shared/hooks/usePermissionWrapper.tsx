import { useAbility } from '@casl/react';
import { AbilityContext } from '../utils/casl';
import { Actions } from '../stores/auth.store';

const PermissionWrapper = ({ 
  action, 
  subject, 
  children, 
  fallback = null 
}: { 
  action: Actions; 
  subject: string; 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) => {
  const ability = useAbility(AbilityContext);
  
  return ability.can(action, subject) ? <>{children}</> : <>{fallback}</>;
};

export default PermissionWrapper;