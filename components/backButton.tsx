import Link from 'next/link';

import React from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';

interface BackButtonProps {
  url: string;
}

const BackButton: React.FC<BackButtonProps> = ({ url }) => {
  return (
    <Link
      href={url}
      className='p-4 cursor-pointer text-black flex items-center'
    >
      <IoIosArrowRoundBack className='text-2xl' />
      <span className='text-sm'>Back</span>
    </Link>
  );
};

export default BackButton;
