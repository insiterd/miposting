'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { AddProviderComponent } from '@gitroom/frontend/components/launches/add.provider.component';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useUser } from '@gitroom/frontend/components/layout/user.context';

export const MobileIntegration: FC = () => {
  const [integrations, setIntegrations] = useState(null as any);
  const fetch = useFetch();
  const user = useUser();

  const loadIntegrations = useCallback(async () => {
    const tier = user?.tier?.current || '';
    setIntegrations(
      await (
        await fetch(`/integrations${tier ? `?tier=${tier}` : ''}`)
      ).json()
    );
  }, [user]);

  useEffect(() => {
    loadIntegrations();
  }, []);

  if (!integrations) {
    return null;
  }

  return (
    <AddProviderComponent
      isMobile={true}
      invite={false}
      update={() => {}}
      {...integrations}
    />
  );
};
