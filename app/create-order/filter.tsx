'use client';
import { Chip, Tab, Tabs } from '@nextui-org/react';

const Filters = ({
  menus,

  handleTabClick,
}: any) => {
  return (
    <>
      <div className='flex relative top-3  w-full border-b border-divider px-2 justify-between'>
        <Tabs
          classNames={{
            tabList: 'gap-x-6  relative rounded-none py-0 flex flex-wrap',
            cursor: 'w-full bg-primaryColor',
            tab: 'max-w-fit px-0 py-0 h-10',
            tabContent: 'group-data-[selected=true]:text-primaryColor m-0',
          }}
          variant={'underlined'}
          aria-label='menu filter'
        >
          {menus?.map((menu: any) => {
            return (
              <Tab
                key={menu.name}
                title={
                  <div
                    onClick={() => handleTabClick(menu.name)}
                    className='flex items-center h-10 space-x-2 capitalize'
                  >
                    <span>{menu.name}</span>

                    <Chip
                      classNames={{
                        base: `text-xs h-5  w-3 text-white group-data-[selected=true]:bg-primaryColor`,
                      }}
                    >
                      {menu?.totalCount}
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
