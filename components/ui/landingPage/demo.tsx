'use client';
import { FlashIcon } from '@/public/assets/svg';
import { Transition } from './transition';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ITab {
  title: string;
  description: string;
  linkId: string;
}

const tabs: ITab[] = [
  {
    title: 'Sample Headline 1',
    description: 'Sample description of the first item we want to demo',
    linkId: '5OeASZGN0iw',
  },
  {
    title: 'Sample Headline 2',
    description: 'Sample description of the first item we want to demo',
    linkId: 'GWaQiFeQ87g',
  },
  {
    title: 'Sample Headline 3',
    description: 'Sample description of the first item we want to demo',
    linkId: 'SR__amDl1c8',
  },
];

export default function Demo() {
  const [selectedTab, setSelectedTab] = useState<ITab>(tabs[0]);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const sectionHeaderClass: string =
    'flex items-center w-fit space-x-2 text-primaryColor bg-[#6840D50D] border-[#5F35D24D] border px-4 py-1 rounded-full text-xs lg:mx-auto shadow_custom-inset';
  return (
    <section className="bg-white py-8 lg:py-16 font-satoshi space-y-4 lg:space-y-8 px-6 lg:px-12">
      <div className={sectionHeaderClass}>
        <FlashIcon />
        <p className="font-normal">Demo</p>
      </div>

      <div className="lg:w-[85%] lg:mx-auto mx-0">
        <h2 className="text-[24px] lg:text-center lg:text-[40px] text-[#161618] lg:leading-[64px] font-bricolage_grotesque">How our Application Works</h2>
        <p className="px-8 lg:px-56 text-[#44444A]">Sample description to speak about the header above</p>
      </div>
      <div className="lg:flex lg:space-x-16 mt-6 lg:mt-12 items-center">
        <div className="w-full lg:w-[35%]">
          <Transition>
            <div className="w-full">
              {tabs.map((tab, index) => (
                <div key={tab.title}>
                  <div
                    className={cn('p-4 rounded-2xl flex space-x-4 items-center', selectedTab.title === tab.title ? 'bg-[#F5F2FC]' : 'bg-[FBFBFC]')}
                    role="button"
                    onClick={() => setSelectedTab(tab)}
                  >
                    <div
                      className={cn(
                        'text-white text-[14px] lg:text-[20px] font-medium flex items-center justify-center rounded-full lg:h-[50px] lg:w-[50px] h-[35px] w-[35px]',
                        selectedTab.title === tab.title ? 'bg-[#744BE3]' : 'bg-white border border-[#808B9F] text-[#808B9F]'
                      )}
                    >
                      0{index + 1}.
                    </div>
                    <div className="text-left">
                      <p className="font-bricolage_grotesque text-[18px] lg:text-[24px] text-[#101928]">{tab.title}</p>
                      <p className="text-[#808B9F] text-xs lg:text-sm font-satoshi">{tab.title}</p>
                    </div>
                  </div>
                  {index !== 2 && <div className="h-6 lg:h-16 border border-[#DEE1E6] w-[1px] ml-10 my-1.5 lg:my-4" />}
                </div>
              ))}
            </div>
          </Transition>
        </div>
        <div className="w-full lg:w-[65%]">
          <Transition>
            <iframe
              width="100%"
              height={isDesktop ? '500px' : '300px'}
              src={`https://www.youtube.com/embed/${selectedTab.linkId}?controls=1&showinfo=0&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="text-center justify-center rounded-2xl shadow-custom border-[14px] border-white"
            ></iframe>
          </Transition>
        </div>
      </div>
    </section>
  );
}
