'use client';
import { TOKEN_EXPIRY_DURATION } from '@/app/api/apiService';
import {
  getBusinessDetails,
  loginUserSelectedBusiness,
} from '@/app/api/controllers/auth';
import useGetBusinessByCooperate from '@/hooks/cachedEndpoints/useGetBusinessByCooperate';
import { useGlobalContext } from '@/hooks/globalProvider';
import {
  SmallLoader,
  notify,
  saveJsonItemToLocalStorage,
  setTokenCookie,
} from '@/lib/utils';
import { Avatar, ScrollShadow } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SelectBusinessForm = () => {
  const router = useRouter();
  const { loginDetails } = useGlobalContext();
  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data, isLoading: loading } = useGetBusinessByCooperate();

  const callLogin = async (businessId: string) => {
    const data = await loginUserSelectedBusiness(loginDetails, businessId);
    if (data?.data?.isSuccessful) {
      saveJsonItemToLocalStorage('userInformation', {
        ...data?.data?.data,
        tokenExpiry: Date.now() + TOKEN_EXPIRY_DURATION,
      });

      setTokenCookie('token', data?.data?.data.token);
      router.push('/dashboard');
    } else if (data?.data?.error) {
      notify({
        title: 'Error!',
        text: data?.data?.error,
        type: 'error',
      });
    }
  };

  const handleSelectedBusiness = async (item: any) => {
    setIsLoading(true);

    setBusiness(item);
    const data = await getBusinessDetails(item);

    if (data?.data?.isSuccessful) {
      saveJsonItemToLocalStorage('business', [data?.data?.data]);
      await callLogin(data?.data?.data.businessId);

      setIsLoading(false);
    } else if (data?.data?.error) {
      setIsLoading(false);
    }
  };
  if (loading) {
    return (
      <div className='grid place-content-center'>
        <SmallLoader />
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 w-full`}>
      {data?.map((item: any) => {
        return (
          <ScrollShadow size={10} className='w-full max-h-[350px]'>
            <article
              className={`bg-[#F1F2F480] rounded-xl p-3 cursor-pointer ${
                isLoading &&
                item.name === business?.name &&
                'border-grey500 border'
              }`}
              onClick={() => handleSelectedBusiness(item)}
              key={item.name}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Avatar
                    showFallback={true}
                    size='lg'
                    src={`data:image/jpeg;base64,${item?.logoImage}`}
                    name={item?.name}
                  />
                  <div className='flex flex-col'>
                    <span className='font-[600] text-[14px]'>{item?.name}</span>

                    <span className='text-[12px] font-[400]'>
                      {item?.city}
                      {item?.city && ','} {item?.state}
                    </span>
                  </div>
                </div>
                {isLoading && item.name === business?.name && <SmallLoader />}
              </div>
            </article>
          </ScrollShadow>
        );
      })}
    </div>
  );
};

export default SelectBusinessForm;
