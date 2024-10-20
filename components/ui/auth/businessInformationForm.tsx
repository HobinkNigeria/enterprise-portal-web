'use client';
import { createBusiness } from '@/app/api/controllers/auth';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/customButton';
import SelectInput from '@/components/selectInput';
import { companyInfo } from '@/lib/companyInfo';
import {
  getJsonItemFromLocalStorage,
  notify,
  saveJsonItemToLocalStorage,
} from '@/lib/utils';
import { Spacer } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import States from '../../../lib/cities.json';

const BusinessInformationForm = () => {
  const router = useRouter();
  const userInformation = getJsonItemFromLocalStorage('userInformation');

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [businessFormData, setBusinessFormData] = useState({
    name: '',
    cooperateID: userInformation?.cooperateID,
    address: '',
    businessCategory: '',
    resistrationNumber: '',
    resistrationCertificateImageReference: '',
    nin: '',
    identificationImageReference: '',
    primaryBrandColour: '',
    secondaryBrandColour: '',
    logoImageReference: '',
    state: '',
    city: '',
    contactEmailAddress: '',
    contactPhoneNumber: '',
  });

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setResponse(null);
    const { name, value } = e.target;
    setBusinessFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const submitFormData = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setLoading(true);
    const data = await createBusiness({
      ...businessFormData,
      businessCategory: +businessFormData.businessCategory,
    });

    setLoading(false);
    setResponse(data);
    if (data?.data?.isSuccessful) {
      saveJsonItemToLocalStorage('business', [data?.data?.data]);
      router.push('/dashboard');
      notify({
        title: 'Success!',
        text: 'Registration completed',
        type: 'success',
      });
    } else if (data?.data?.error) {
      notify({
        title: 'Error!',
        text: data?.data?.error,
        type: 'error',
      });
    }
  };

  const getStates = () => {
    return States.map((state) => ({
      label: state.name,
      value: state.name,
    }));
  };

  const getCities = () => {
    const state = States.find((state) => state.name === businessFormData.state);

    if (state) {
      return state?.cities.map((city) => ({
        label: city,
        value: city,
      }));
    } else {
      return [];
    }
  };

  return (
    <form onSubmit={submitFormData} autoComplete='off'>
      <CustomInput
        type='text'
        name='name'
        label='Business name'
        errorMessage={response?.errors?.name?.[0]}
        onChange={handleInputChange}
        value={businessFormData.name}
        placeholder='Name of your business'
      />
      <Spacer y={4} />

      <div className='flex flex-col md:flex-row  gap-3'>
        <CustomInput
          type='email'
          name='contactEmailAddress'
          errorMessage={response?.errors?.contactEmailAddress?.[0]}
          onChange={handleInputChange}
          value={businessFormData.contactEmailAddress}
          label='Business email'
          placeholder={`${companyInfo.name}@gmail.com`}
        />
        <CustomInput
          type='text'
          name='contactPhoneNumber'
          errorMessage={response?.errors?.contactPhoneNumber?.[0]}
          onChange={handleInputChange}
          value={businessFormData.contactPhoneNumber}
          label='Business phone number'
          placeholder='09034545454'
        />
      </div>
      <Spacer y={4} />
      <CustomInput
        type='text'
        name='address'
        errorMessage={response?.errors?.address?.[0]}
        onChange={handleInputChange}
        value={businessFormData.address}
        label='Business address'
        placeholder='Where is your business located '
      />

      <Spacer y={4} />
      <div className='flex flex-col md:flex-row  gap-3'>
        <SelectInput
          errorMessage={response?.errors?.state?.[0]}
          label={'Business state'}
          name='state'
          onChange={handleInputChange}
          value={businessFormData.state}
          placeholder={'Select a state'}
          contents={getStates()}
        />

        <SelectInput
          errorMessage={response?.errors?.city?.[0]}
          label={'Business city'}
          name='city'
          onChange={handleInputChange}
          value={businessFormData.city}
          placeholder={'Select a city'}
          contents={getCities()}
        />
      </div>
      <Spacer y={4} />
      <SelectInput
        errorMessage={response?.errors?.businessCategory?.[0]}
        label={'Business category'}
        name='businessCategory'
        onChange={handleInputChange}
        value={businessFormData.businessCategory}
        placeholder={'Business category'}
        contents={[
          {
            label: 'Business center',
            value: 0,
          },
          {
            label: 'Logistics',
            value: 1,
          },
          {
            label: 'Bar',
            value: 2,
          },
          {
            label: 'Restaurant',
            value: 3,
          },
          {
            label: 'Club',
            value: 4,
          },
          {
            label: 'Cafe',
            value: 5,
          },
          {
            label: 'Hotel',
            value: 6,
          },
        ]}
      />

      <Spacer y={8} />
      <CustomButton loading={loading} disabled={loading} type='submit'>
        Proceed
      </CustomButton>
    </form>
  );
};

export default BusinessInformationForm;
