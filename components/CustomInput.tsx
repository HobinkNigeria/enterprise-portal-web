'use client';

import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

import { useState } from 'react';
import { Input } from '@nextui-org/react';

interface CustomInputProps {
  type?: string;
  label?: string;
  value?: string;
  name?: string;
  errorMessage?: any;
  size?: 'lg' | 'md' | 'sm';
  classnames?: string;
  placeholder?: string;
  endContent?: JSX.Element | null;
  isRequired?: boolean;
  onChange?: any;
  startContent?: string | JSX.Element;
}

export const CustomInput = ({
  type = 'text',
  label,
  value,
  placeholder,
  endContent,
  name,
  onChange,
  isRequired,
  startContent,
  classnames,
  errorMessage,
  size = 'lg',
}: CustomInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const passwordType = isVisible ? 'text' : 'password';
  const passwordEndContent = (
    <button
      className='focus:outline-none'
      type='button'
      onClick={toggleVisibility}
    >
      {isVisible ? (
        <IoEyeOutline className='text-foreground-500 text-lg' />
      ) : (
        <IoEyeOffOutline className='text-foreground-500 text-lg' />
      )}
    </button>
  );

  return (
    <Input
      key='outside'
      type={type === 'password' ? passwordType : type}
      label={label}
      value={value}
      name={name}
      onChange={onChange}
      variant='bordered'
      classNames={{
        label: 'text-[#000] font-[500] text-[14px]',
        base: 'bg-none',
        inputWrapper: [
          `${classnames}  bg-none rounded-[6px] shadow-none  hover:border-[#C3ADFF] focus:border-[#C3ADFF]`,
        ],
        innerWrapper: 'bg-none border-none',
        input: ['bg-none', 'text-black placeholder:text-[14px]'],
      }}
      aria-haspopup='false'
      autoCorrect='off'
      placeholder={placeholder}
      labelPlacement='outside'
      isRequired={isRequired}
      spellCheck='false'
      ng-model='name'
      autoComplete='new-password'
      errorMessage={errorMessage}
      isInvalid={errorMessage && true}
      size={size}
      endContent={type === 'password' ? passwordEndContent : endContent}
      startContent={startContent}
    />
  );
};
