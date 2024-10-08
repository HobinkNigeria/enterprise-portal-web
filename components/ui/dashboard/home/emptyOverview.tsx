import Image from 'next/image';
import Link from 'next/link';
import { GoPlus } from 'react-icons/go';
import noImage from '../../../../public/assets/images/no-menu.png';

const EmptyOverview = ({
  title,
  buttonText,
  href,
  image,
}: {
  title: string;
  buttonText?: string;
  href?: any;
  buttonWidth?: string;
  image?: any;
}) => {
  return (
    <div className=' my-10 grid place-content-center gap-2 text-sm px-1 text-grey500'>
      <div className='w-full grid place-content-center'>
        <Image
          src={image || noImage}
          width={20}
          height={20}
          className='object-cover rounded-lg w-[55px] h-[55px]'
          aria-label='empty overview'
          alt='empty overview'
        />
      </div>
      <p className='text-center'>There are no {title}</p>
      {buttonText && (
        <div className='justify-center items-center flex'>
          <Link
            href={href}
            className={`text-white bg-primaryColor hover:opacity-80 transition-all  font-[700]  flex justify-center items-center rounded-lg py-2 px-3 text-sm gap-1`}
          >
            <GoPlus className='text-[20px] font-[700]' />
            <span>{buttonText}</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmptyOverview;
