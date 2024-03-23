'use client';
import { Checkbox, Spacer } from '@nextui-org/react';
import { FaRegEnvelope } from 'react-icons/fa6';
import Image from 'next/image';
import hobink from '../../../public/assets/images/hobink.png';
import Link from 'next/link';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/customButton';
import { lexend } from '@/utilities/ui-config/fonts';
import HobinkLogo from '@/components/logo';
import { useRouter } from 'next/navigation';

// export const metadata = {
//   title: 'Log in to Hobink',
//   description: 'Streamline your business processes',
// };

export default function Login() {
  const router = useRouter();
  return (
    <main className='bg-secondaryColor'>
      <div className='lg:grid  md:w-3/4 xl:max-w-[912px] mx-auto px-4 lg:px-0 w-full lg:place-content-center min-h-screen '>
        <HobinkLogo
          textColor='text-white'
          containerClass='flex lg:hidden gap-2 items-center pt-8 mb-10'
        />
        <div className='flex flex-col lg:flex-row'>
          {/* Left Card: Text Content */}
          <div className='login-background flex-1 h-full relative  lg:flex flex-col justify-between hidden  text-white p-10 rounded-tl-3xl rounded-bl-3xl '>
            <HobinkLogo
              textColor='text-white'
              containerClass='flex gap-2 items-center mb-4'
            />
            <div className='flex flex-col justify-between'>
              <h2 className='text-[32px] font-[600] leading-9 mb-3'>
                Streamline your business processes{' '}
              </h2>
              <p className='text-foreground-400 font-[400]'>
                Increase efficiency and improve user experience, from
                reservation to checkout. Manage orders and inventory like a pro.
              </p>
            </div>
          </div>

          {/* Right Card: Login Form */}
          <div className='flex-1 mb-10 md:mb-0 bg-white text-black lg:p-7 py-12 px-6  lg:rounded-tr-3xl lg:rounded-br-3xl lg:rounded-none rounded-lg'>
            <h2 className='text-[28px] font-bold mb-2'>Log In</h2>
            <p className='text-sm  text-grey500 mb-14'>
              Enter your credentials to access your account
            </p>
            <form action={() => router.push('/dashboard')} autoComplete='off'>
              <CustomInput
                type='email'
                label='Email Address'
                placeholder='Enter Email'
                // isRequired={true}
                endContent={
                  <FaRegEnvelope className='text-foreground-500 text-l' />
                }
              />

              <Spacer y={6} />
              <CustomInput
                type='password'
                label='password'
                placeholder='Enter password'
                // isRequired={true}
              />

              <Spacer y={6} />
              <div className='flex items-center justify-between'>
                <Checkbox size='sm' className='rounded-lg' color='default'>
                  Remember me
                  {/* for 30 days */}
                </Checkbox>
                <Link
                  className='text-primaryColor text-sm'
                  href='/auth/forget-password'
                >
                  Forget Password?
                </Link>
              </div>
              <Spacer y={6} />
              <CustomButton type='submit'>Log into Account</CustomButton>
            </form>
            <Spacer y={8} />
            <div className='flex items-center gap-2'>
              <p className='text-grey400 text-xs m-0'>{`Don't  have an account?`}</p>
              <Link className='text-primaryColor text-sm' href='/auth/signup'>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
