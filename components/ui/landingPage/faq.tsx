'use client';
import { cn } from '@/lib/utils';
import { ArrowUp, FaqIcon } from '@/public/assets/svg';
import { Transition } from './transition';

export default function FAQs({ className }: { className?: string }) {
  const faq: { title: string; description: string }[] = [
    {
      title: 'How secure is my data on Hobink?',
      description:
        'Security is our top priority. Hobink uses industry-standard encryption and regular security audits to ensure your business and customer data are always protected.',
    },
    {
      title: 'Can I manage multiple locations with Hobink?',
      description:
        'Security is our top priority. Hobink uses industry-standard encryption and regular security audits to ensure your business and customer data are always protected.',
    },
    {
      title: 'Does Hobink offer real-time data and reporting?',
      description:
        'Security is our top priority. Hobink uses industry-standard encryption and regular security audits to ensure your business and customer data are always protected.',
    },
    {
      title: 'Is Hobink available on mobile devices?',
      description:
        'Security is our top priority. Hobink uses industry-standard encryption and regular security audits to ensure your business and customer data are always protected.',
    },
    {
      title: 'What types of businesses benefit from Hobink?',
      description:
        'Security is our top priority. Hobink uses industry-standard encryption and regular security audits to ensure your business and customer data are always protected.',
    },
  ];

  return (
    <section className={cn('bg-white py-8 lg:py-16 font-satoshi space-y-2 px-6 lg:px-12', className)}>
      <div className="flex items-center w-fit space-x-2 text-primaryColor bg-[#6840D50D] border-[#5F35D24D] border px-4 py-1.5 rounded-full text-xs shadow-custom-inset">
        <FaqIcon />
        <p className="font-normal">FAQ</p>
      </div>
      <div className="w-[100%] text-left">
        <h2 className="text-[24px] lg:text-[40px] text-[#161618] lg:leading-[64px] font-bricolage_grotesque">Your Top Questions About Hobink</h2>
      </div>

      <div className="space-y-6">
        {faq.map((each) => (
          <Transition>
            <div
              className="bg-[#F6F5FE] px-4 lg:px-8 py-6 rounded-2xl border border-[#5F35D24D] flex items-start justify-between font-bricolage_grotesque"
              key={each.title}
            >
              <div className="space-y-2 text-left w-[80%]">
                <p className="text-[#252525] font-medium text-base lg:text-[20px]">{each.title}</p>
                <p className="text-[#677182] font-satoshi text-sm lg:text-base">{each.description}</p>
              </div>
              <div className="border border-[#5F35D2] bg-[#EAE8FD] rounded-full lg:h-12 lg:w-12 w-8 h-8 flex items-center justify-center" role="button">
                <ArrowUp />
              </div>
            </div>
          </Transition>
        ))}
      </div>
    </section>
  );
}
