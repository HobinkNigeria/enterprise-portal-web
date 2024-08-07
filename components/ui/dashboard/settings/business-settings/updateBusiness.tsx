'use client';
import { updateBusiness } from '@/app/api/controllers/dashboard/settings';
import { CustomInput } from '@/components/CustomInput';
import CustomImageUpload from '@/components/CustomUpload';
import { CustomButton } from '@/components/customButton';
import SelectInput from '@/components/selectInput';
import useGetBusiness from '@/hooks/cachedEndpoints/useGetBusiness';
import useGetBusinessByCooperate from '@/hooks/cachedEndpoints/useGetBusinessByCooperate';
import useUploadFile from '@/hooks/useUploadFile';
import {
  SmallLoader,
  clearItemLocalStorage,
  getJsonItemFromLocalStorage,
  notify,
} from '@/lib/utils';
import { Spacer } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import States from '../../../../../lib/cities.json';

const UpdateBusiness = ({ setActiveScreen }: any) => {
  const { data, isLoading } = useGetBusiness();
  const { refetch } = useGetBusinessByCooperate();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const businessInformation = getJsonItemFromLocalStorage('business');
  const userInformation = getJsonItemFromLocalStorage('userInformation');

  const [businessSettingFormData, setbusinessSettingFormData] = useState({
    resistrationNumber: data?.resistrationNumber || '',
    resistrationCertificateImageReference:
      data?.resistrationCertificateImageReference || '',
    nin: data?.nin || '',
    identificationImageReference: data?.identificationImageReference || '',
    primaryBrandColour: data?.primaryBrandColour || '',
    secondaryBrandColour: data?.secondaryBrandColour || '',
    logoImageReference: data?.logoImageReference || '',
    cooperateID: data?.cooperateID || userInformation?.cooperateID,
    address: data?.address || businessInformation[0]?.businessAddress,
    state: data?.state || businessInformation[0]?.state,
    city: data?.city || businessInformation[0]?.city,
    name: data?.name || businessInformation[0]?.businessName,
    contactEmailAddress:
      data?.contactEmailAddress ||
      businessInformation[0]?.businessContactEmail ||
      '',
    contactPhoneNumber:
      data?.contactPhoneNumber ||
      businessInformation[0]?.businessContactNumber ||
      '',
  });

  useEffect(() => {
    if (data) {
      setbusinessSettingFormData({
        resistrationNumber: data?.resistrationNumber || '',
        resistrationCertificateImageReference:
          data?.resistrationCertificateImageReference || '',
        nin: data?.nin || '',
        identificationImageReference: data?.identificationImageReference || '',
        primaryBrandColour: data?.primaryBrandColour || '',
        secondaryBrandColour: data?.secondaryBrandColour || '',
        logoImageReference: data?.logoImageReference || '',
        cooperateID: data?.cooperateID || userInformation?.cooperateID,
        address: data?.address || businessInformation[0]?.businessAddress || '',
        state: data?.state || businessInformation[0]?.state || '',
        city: data?.city || businessInformation[0]?.city || '',
        name: data?.name || businessInformation[0]?.businessName || '',
        contactEmailAddress:
          data?.contactEmailAddress ||
          businessInformation[0]?.contactEmailAddress ||
          '',
        contactPhoneNumber:
          data?.contactPhoneNumber ||
          businessInformation[0]?.contactPhoneNumber ||
          '',
      });
    }
  }, [data]);
  const {
    isLoadingImage,
    selectedImages,
    removeUploadedFile,
    handleImageChange,
    imageReferences,
  } = useUploadFile();

  const handleInputChange = (e) => {
    setResponse(null);
    const { name, value } = e.target;
    setbusinessSettingFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const submitFormData = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setLoading(true);

    const response = await updateBusiness(
      {
        ...businessSettingFormData,
        resistrationCertificateImageReference:
          imageReferences?.resistrationCertificateImageReference ||
          businessSettingFormData.resistrationCertificateImageReference,
        identificationImageReference:
          imageReferences?.identificationImageReference ||
          businessSettingFormData.identificationImageReference,
        logoImageReference:
          imageReferences?.logoImageReference ||
          businessSettingFormData.logoImageReference,
      },
      businessInformation[0]?.businessId
    );

    setLoading(false);
    setResponse(response);

    if (response?.data?.isSuccessful) {
      toast.success('Your business information has been updated');
      //   setbusinessSettingFormData({
      // resistrationNumber: '',
      // resistrationCertificateImageReference: '',
      // nin: '',
      // identificationImageReference: '',
      // primaryBrandColour: '',
      // secondaryBrandColour: '',
      // logoImageReference: '',
      //   });
      refetch();
      clearItemLocalStorage('businessSettingPrompt');
      setActiveScreen(3);
    } else if (response?.data?.error) {
      notify({
        title: 'Error!',
        text: response?.data?.error,
        type: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col  items-center my-10`}>
        <SmallLoader />
      </div>
    );
  }
  const getStates = () => {
    return States.map((state) => ({
      label: state.name,
      value: state.name,
    }));
  };

  const getCities = () => {
    const state = States.find(
      (state) => state.name === businessSettingFormData.state
    );

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
    <section>
      <div className='flex md:flex-row flex-col justify-between md:items-center items-start'>
        <div>
          <h1 className='text-[16px] leading-8 font-semibold'>
            Business Information
          </h1>
          <p className='text-sm  text-grey600 md:mb-10 mb-4'>
            Update your business details here
          </p>
        </div>
        <CustomButton
          loading={loading}
          disabled={loading}
          onClick={submitFormData}
          className='py-2 px-4 md:mb-0 mb-4 text-white'
          backgroundColor='bg-primaryColor'
        >
          Save Changes
        </CustomButton>
      </div>
      <form autoComplete='off'>
        <CustomInput
          errorMessage={response?.errors?.address?.[0]}
          value={businessSettingFormData?.address}
          onChange={handleInputChange}
          name='address'
          type='text'
          label='Business address'
          placeholder='Enter your business address'
        />
        <Spacer y={6} />
        <div className='flex flex-col md:flex-row  gap-3'>
          <SelectInput
            errorMessage={response?.errors?.state?.[0]}
            label={'Business state'}
            name='state'
            onChange={handleInputChange}
            value={businessSettingFormData.state}
            selectedKeys={[businessSettingFormData.state]}
            placeholder={'Select a state'}
            contents={getStates()}
          />

          <SelectInput
            errorMessage={response?.errors?.city?.[0]}
            label={'Business city'}
            name='city'
            onChange={handleInputChange}
            selectedKeys={[businessSettingFormData?.city]}
            value={businessSettingFormData.city}
            placeholder={'Select a city'}
            contents={getCities()}
          />
        </div>
        <Spacer y={6} />
        <div className='flex flex-col md:flex-row  gap-3'>
          <CustomInput
            errorMessage={response?.errors?.contactEmailAddress?.[0]}
            value={businessSettingFormData?.contactEmailAddress}
            onChange={handleInputChange}
            name='contactEmailAddress'
            type='text'
            label='Business email address'
            placeholder='Enter your business email address'
          />

          <CustomInput
            errorMessage={response?.errors?.contactPhoneNumber?.[0]}
            value={businessSettingFormData?.contactPhoneNumber}
            onChange={handleInputChange}
            name='contactPhoneNumber'
            type='text'
            label='Business phone number'
            placeholder='Enter your business phone number'
          />
        </div>
        <Spacer y={6} />
        <CustomInput
          errorMessage={response?.errors?.resistrationNumber?.[0]}
          value={businessSettingFormData?.resistrationNumber}
          onChange={handleInputChange}
          name='resistrationNumber'
          type='text'
          label='CAC Registration Number'
          placeholder='Enter registration number'
        />
        <Spacer y={6} />
        <div>
          <label
            className={`font-[500]  text-sm ${
              response?.errors?.resistrationCertificateImageReference?.[0]
                ? 'text-danger-500'
                : 'text-black'
            }`}
          >
            Upload Certificate of Registration
          </label>
          <Spacer y={1} />
          <CustomImageUpload
            setResponse={setResponse}
            type='resistrationCertificateImageReference'
            handleImageChange={handleImageChange}
            selectedImage={
              selectedImages['resistrationCertificateImageReference']
            }
            removeUploadedFile={() =>
              removeUploadedFile(
                'resistrationCertificateImageReference',
                data?.resistrationCertificateImageReference
              )
            }
            referenceId={data?.resistrationCertificateImageReference}
            isLoadingImage={
              isLoadingImage['resistrationCertificateImageReference']
            }
            errorMessage={
              response?.errors?.resistrationCertificateImageReference?.[0]
            }
            existingImageUrl={
              data?.resistrationCertificateImage &&
              `data:image/jpeg;base64,${data?.resistrationCertificateImage}`
            }
          />
        </div>
        <Spacer y={6} />
        <CustomInput
          errorMessage={response?.errors?.nin?.[0]}
          value={businessSettingFormData?.nin}
          onChange={handleInputChange}
          name='nin'
          type='text'
          label='Enter NIN'
          placeholder='23435465656'
        />
        <Spacer y={6} />
        <div>
          <label
            className={`font-[500]  text-sm ${
              response?.errors?.identificationImageReference?.[0]
                ? 'text-danger-500'
                : 'text-black'
            }`}
          >
            Upload means of identification
          </label>
          <Spacer y={1} />
          <CustomImageUpload
            setResponse={setResponse}
            type='identificationImageReference'
            handleImageChange={handleImageChange}
            selectedImage={selectedImages['identificationImageReference']}
            removeUploadedFile={() =>
              removeUploadedFile(
                'identificationImageReference',
                data?.identificationImageReference
              )
            }
            isLoadingImage={isLoadingImage['identificationImageReference']}
            errorMessage={response?.errors?.identificationImageReference?.[0]}
            existingImageUrl={
              data?.identificationImage &&
              `data:image/jpeg;base64,${data?.identificationImage}`
            }
            referenceId={data?.identificationImageReference}
          />
        </div>
        <Spacer y={6} />
        <CustomInput
          errorMessage={response?.errors?.primaryBrandColour?.[0]}
          value={businessSettingFormData?.primaryBrandColour}
          onChange={handleInputChange}
          startContent={
            <div
              style={{
                height: '20px',
                border: '1px solid #F0F2F5',
                width: '20px',
                borderRadius: '5px',
                backgroundColor: businessSettingFormData?.primaryBrandColour
                  ? businessSettingFormData?.primaryBrandColour
                  : 'transparent',
              }}
            />
          }
          name='primaryBrandColour'
          type='text'
          label='Primary brand colour (Hex code)'
          placeholder='Enter primary color'
        />
        <Spacer y={6} />
        <CustomInput
          startContent={
            <div
              style={{
                height: '20px',
                border: '1px solid #F0F2F5',
                width: '20px',
                borderRadius: '5px',
                backgroundColor: businessSettingFormData?.secondaryBrandColour
                  ? businessSettingFormData?.secondaryBrandColour
                  : 'transparent',
              }}
            />
          }
          errorMessage={response?.errors?.secondaryBrandColour?.[0]}
          value={businessSettingFormData?.secondaryBrandColour}
          onChange={handleInputChange}
          name='secondaryBrandColour'
          type='text'
          label='Secondary brand colour (Hex code)'
          placeholder='Enter secondary color'
        />
        <Spacer y={6} />
        <div>
          <label
            className={`font-[500]  text-sm ${
              response?.errors?.logoImageReference?.[0]
                ? 'text-danger-500'
                : 'text-black'
            }`}
          >
            Upload business logo
          </label>
          <Spacer y={1} />
          <CustomImageUpload
            type='logoImageReference'
            setResponse={setResponse}
            handleImageChange={handleImageChange}
            selectedImage={selectedImages['logoImageReference']}
            removeUploadedFile={() =>
              removeUploadedFile('logoImageReference', data?.logoImageReference)
            }
            isLoadingImage={isLoadingImage['logoImageReference']}
            errorMessage={response?.errors?.logoImageReference?.[0]}
            existingImageUrl={
              data?.logoImage && `data:image/jpeg;base64,${data?.logoImage}`
            }
            referenceId={data?.logoImageReference}
          />
        </div>
      </form>
    </section>
  );
};

export default UpdateBusiness;
