'use client';
import { Chip, Tab, Tabs } from '@nextui-org/react';
import React from 'react';

const Filters = ({ onOpen, menus, handleTabChange, handleTabClick }: any) => {
  return (
    <>
      <div className='flex  relative w-full top-4 px-3 py-1 border-b border-primaryGrey justify-between'>
        <Tabs
          classNames={{
            tabList:
              'gap-6  relative rounded-none p-0 lg:w-[70%] w-[100%]  overflow-scroll',
            cursor: 'w-full bg-primaryColor',
            tab: 'max-w-fit px-0 h-10',
            tabContent: 'group-data-[selected=true]:text-primaryColor',
          }}
          variant={'underlined'}
          aria-label='menu filter'
          onChange={handleTabChange}
        >
          {menus.map((menu: any) => {
            return (
              <Tab
                key={menu.name}
                title={
                  <div
                    onClick={() => handleTabClick(menu.name)}
                    className='flex items-center space-x-2'
                  >
                    <span>{menu.name}</span>

                    <Chip
                      classNames={{
                        base: `text-xs h-5 w-3 text-white group-data-[selected=true]:bg-primaryColor`,
                      }}
                    >
                      {menu?.orders?.length}
                    </Chip>
                  </div>
                }
              />
            );
          })}
        </Tabs>
      </div>
    </>
  );
};

export default Filters;