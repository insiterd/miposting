'use client';
import { FC } from 'react';
import { useMenuItem } from '@gitroom/frontend/components/layout/top.menu';
import { MenuItem } from '@gitroom/frontend/components/new-layout/menu-item';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { useVariables } from '@gitroom/react/helpers/variable.context';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

const MoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <circle cx="4" cy="10" r="1.8" fill="currentColor" />
    <circle cx="10" cy="10" r="1.8" fill="currentColor" />
    <circle cx="16" cy="10" r="1.8" fill="currentColor" />
  </svg>
);

export const MobileBottomNav: FC = () => {
  const user = useUser();
  const { firstMenu, secondMenu } = useMenuItem();
  const { isGeneral, billingEnabled } = useVariables();
  const { openModal } = useModals();
  const t = useT();

  const filterItem = (f: (typeof firstMenu)[number]) => {
    if (f.hide) return false;
    if (f.requireBilling && !billingEnabled) return false;
    if (f.name === 'Billing' && user?.isLifetime) return false;
    if (f.role) return f.role.includes(user?.role!);
    return true;
  };

  const visibleFirstMenu = firstMenu.filter(filterItem);
  const visibleSecondMenu = secondMenu.filter(filterItem);

  const openMore = () => {
    openModal({
      title: t('more', 'Más'),
      children: (
        <div className="flex flex-col gap-[8px] min-w-[220px]">
          {visibleSecondMenu.map((item) => (
            <MenuItem
              key={item.name}
              path={item.path}
              label={item.name}
              icon={item.icon}
              onClick={item.onClick}
            />
          ))}
        </div>
      ),
    });
  };

  if (
    !user?.orgId ||
    // @ts-ignore
    (user.tier === 'FREE' && isGeneral && billingEnabled)
  ) {
    return null;
  }

  return (
    <div className="flex lg:hidden fixed bottom-0 start-0 end-0 z-40 bg-newBgColorInner border-t border-blockSeparator px-[8px] overflow-x-auto">
      {visibleFirstMenu.map((item) => (
        <div className="flex-1 min-w-[64px] shrink-0" key={item.name}>
          <MenuItem
            path={item.path}
            label={item.name}
            icon={item.icon}
            onClick={item.onClick}
          />
        </div>
      ))}
      {visibleSecondMenu.length > 0 && (
        <div className="flex-1 min-w-[64px] shrink-0">
          <MenuItem path="#" label={t('more', 'Más')} icon={<MoreIcon />} onClick={openMore} />
        </div>
      )}
    </div>
  );
};
