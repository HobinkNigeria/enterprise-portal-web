'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spacer } from '@nextui-org/react';
import { CustomButton } from '@/components/customButton';
import OtpInput from 'react-otp-input';
import { notify, saveJsonItemToLocalStorage } from '@/lib/utils';
import { confirmEmail } from '@/app/api/controllers/auth';
import { AUTH } from '@/app/api/api-url';
import api from '@/app/api/apiService';
import { IoMdRefresh } from 'react-icons/io';
import toast from 'react-hot-toast';
import { useGlobalContext } from '@/hooks/globalProvider';
const ConfirmEmailForm = () => {
  const { userData } = useGlobalContext();
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOtpChange = (newOtp: React.SetStateAction<string>) => {
    setOtp(newOtp);
  };

  const checkOtpLength = otp.length < 6 ? true : false;

  const payload = {
    otp,
    purpose: 0,
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    email: userData?.email,
    password: userData?.password,
    isActive: true,
  };

  const submitFormData = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    const data = await confirmEmail(payload);
    setLoading(false);
    if (data?.data?.isSuccessful) {
      saveJsonItemToLocalStorage('userInformation', data?.data?.data);
      router.push('/auth/business-information');
    } else if (data?.data?.error) {
      notify({
        title: 'Error!',
        text: data?.data?.error,
        type: 'error',
      });
    }
  };

  const resendOtp = async () => {
    const payload = {
      email: userData.email,
      purpose: 0,
    };
    try {
      setIsLoading(true);

      await api.post(AUTH.generateToken, payload);
      setIsLoading(false);

      toast.success('Check your email for the verification code');
    } catch (error) {
      setIsLoading(false);
      if (!error.response.data.isSuccessfull) {
        toast.error('Failed to generate otp');
      }
    }
  };

  return (
    <>
      <p className='text-sm md:w-[400px] w-full  text-center text-grey600 mb-10'>
        We sent a verification code to {userData?.email}. Enter the code here to
        confirm your email address.
      </p>
      <form onSubmit={submitFormData} autoComplete='off'>
        <Spacer y={6} />
        <div className='flex flex-col items-center justify-center'>
          <OtpInput
            value={otp}
            onChange={handleOtpChange}
            numInputs={6}
            renderInput={(props) => (
              <input
                className='bg-none focus:border focus:border-primary100'
                {...props}
              />
            )}
            inputStyle={{
              width: '3rem',
              height: '3rem',
              margin: '0 .3rem',
              fontSize: '2rem',
              borderRadius: 5,
              backgroundColor: 'white',
              outline: '1px solid #C3ADFF',
              // border: '1px solid rgba(0,0,0,0.3)',
            }}
          />
          <div className='flex items-center mt-2 gap-2'>
            <p className='text-grey400 text-xs m-0'>{"Didn't get the code?"}</p>
            {isLoading ? (
              <IoMdRefresh className='text-grey400 animate-spin' />
            ) : (
              <span
                onClick={resendOtp}
                className='text-primaryColor cursor-pointer underline text-sm'
              >
                Click to resend
              </span>
            )}
          </div>
        </div>

        <Spacer y={8} />

        <CustomButton
          loading={loading}
          disabled={checkOtpLength || loading}
          type='submit'
        >
          Proceed
        </CustomButton>
      </form>
    </>
  );
};

export default ConfirmEmailForm;
