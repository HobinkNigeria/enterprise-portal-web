'use client';
import React, { useState } from 'react';
import BusinessSettings from './business-settings/businessSettings';
import BusinessProfile from './businessProfile';
import Password from './password';
import Profile from './profile';
import RolePrivileges from './rolePrivileges';

interface ListItemProps {
  title: string;
  screenNumber: number;
}

const li =
  'hover:bg-secondaryGrey text-[14px] font-[600] xl:p-3 px-4 py-2 xl:rounded-[4px] rounded-[6px] transition-all cursor-pointer';

const dashboardSettingUpdatePrompt = history.state;
const SettingsComponent: React.FC = () => {
  // const [activeScreen, setActiveScreen] = useState<number>(4);
  const [activeScreen, setActiveScreen] = useState<number>(
    dashboardSettingUpdatePrompt.prompt ? 4 : 1
  );

  const handleListItemClick = (screenNumber: number) => {
    setActiveScreen(screenNumber);
  };

  const listItems: ListItemProps[] = [
    { title: 'Profile', screenNumber: 1 },
    { title: 'Password', screenNumber: 2 },
    { title: 'Business profile', screenNumber: 3 },
    { title: 'Business settings', screenNumber: 4 },

    { title: 'Team', screenNumber: 5 },
    { title: 'Roles and Privileges', screenNumber: 6 },
  ];

  return (
    <>
      <article className='border max-h-[336px]  border-secondaryGrey w-full xl:w-[284px] p-3 rounded-[8px]'>
        <ul className='flex xl:flex-col flex-row xl:gap-1 gap-3'>
          {listItems.map((item) => (
            <li
              key={item.screenNumber}
              onClick={() => handleListItemClick(item.screenNumber)}
              className={`${li} ${
                activeScreen === item.screenNumber
                  ? 'bg-secondaryGrey text-black '
                  : 'text-[#98A2B3]'
              }`}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </article>
      <article className='border w-full border-secondaryGrey p-6 rounded-[8px]'>
        {activeScreen === 1 && <Profile />}
        {activeScreen === 2 && <Password />}
        {activeScreen === 3 && <BusinessProfile />}
        {activeScreen === 4 && (
          <BusinessSettings setActiveScreen={setActiveScreen} />
        )}
        {activeScreen === 6 && <RolePrivileges />}
      </article>
    </>
  );
};

export default SettingsComponent;
