import { getOrder } from '@/app/api/controllers/dashboard/orders';
import { confirmPayment } from '@/app/api/controllers/dashboard/payment';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/customButton';
import usePermission from '@/hooks/cachedEndpoints/usePermission';
import { formatPrice, getJsonItemFromLocalStorage, notify } from '@/lib/utils';
import {
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  Spacer,
  Spinner,
} from '@nextui-org/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { HiArrowLongLeft } from 'react-icons/hi2';
import noImage from '../../../../public/assets/images/no-image.svg';
import Success from '../../../../public/assets/images/success.png';
import { paymentMethodMap } from './data';

const ApprovePayment = ({
  singlePayment,
  isOpen,
  toggleApproveModal,
  refetch,
}: any) => {
  const { userRolePermissions, role } = usePermission();

  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState([]);
  const userData = getJsonItemFromLocalStorage('userInformation');
  const businessInformation = getJsonItemFromLocalStorage('business');
  const [isOpenSuccess, setIsOpenSuccess] = useState(false);

  const toggleSuccessModal = () => {
    setIsOpenSuccess(!isOpenSuccess);
  };

  const finalizeOrder = async () => {
    setIsLoading(true);

    const payload = {
      id: singlePayment.id,
      paymentReference: singlePayment.paymentReference,
      confirmedBy: `${userData.firstName} ${userData.lastName}`,
    };

    const data = await confirmPayment(
      businessInformation[0]?.businessId,
      payload
    );
    setIsLoading(false);

    if (data?.data?.isSuccessful) {
      refetch();
      toggleApproveModal();
      toggleSuccessModal();
    } else if (data?.data?.error) {
      notify({
        title: 'Error!',
        text: data?.data?.error,
        type: 'error',
      });
    }
  };

  const getOrderDetails = async () => {
    const data = await getOrder(singlePayment.orderID);

    if (data?.data?.isSuccessful) {
      setOrder(data?.data?.data);
    } else if (data?.data?.error) {
    }
  };

  useEffect(() => {
    if (singlePayment?.orderID) {
      getOrderDetails();
    }
  }, [singlePayment?.orderID]);
  return (
    <>
      <Modal
        isDismissable={false}
        size='4xl'
        isOpen={isOpen}
        onOpenChange={() => {
          setOrder([]);
          toggleApproveModal();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className='flex justify-center'>
                <div className='p-5'>
                  <div className='flex flex-row flex-wrap  justify-between'>
                    <div>
                      <h2 className='text-[18px] text-black leading-8 font-semibold'>
                        Order ID: {singlePayment.reference}
                      </h2>

                      <Chip
                        classNames={{
                          base: ` text-xs h-7 font-[600] w-5 bg-[#EAE5FF] text-primaryColor`,
                        }}
                      >
                        {singlePayment.qrName}
                      </Chip>
                    </div>
                    <div>
                      <p className='font-[600] text-sm text-black'>
                        Total value
                      </p>

                      <h2 className='text-[18px] text-black leading-8 font-semibold'>
                        {formatPrice(singlePayment.totalAmount)}
                      </h2>
                    </div>
                  </div>

                  <Spacer y={5} />
                  <div className='flex gap-6'>
                    <div className='overflow-y-scroll max-h-[305px] w-[60%] rounded-lg border border-[#E4E7EC80] p-2 '>
                      {order?.length === 0 ? (
                        <div className={`grid h-full place-content-center`}>
                          <Spinner />
                          <p className='text-center mt-1 text-[14px] text-grey400'>
                            Fetching order details...
                          </p>
                        </div>
                      ) : (
                        <>
                          {order?.orderDetails?.map((item, index) => {
                            return (
                              <>
                                <div
                                  key={item.id}
                                  className='flex justify-between'
                                >
                                  <div className='w-[250px] rounded-lg text-black  flex'>
                                    <div
                                      className={`grid place-content-center`}
                                    >
                                      <Image
                                        src={
                                          item?.image
                                            ? `data:image/jpeg;base64,${item?.image}`
                                            : noImage
                                        }
                                        width={60}
                                        height={60}
                                        className={
                                          'bg-cover h-[60px] rounded-lg w-[60px]'
                                        }
                                        aria-label='uploaded image'
                                        alt='uploaded image(s)'
                                      />
                                    </div>
                                    <div className='p-3 flex  flex-col text-sm justify-center'>
                                      <p className='font-[600]'>
                                        {item.menuName}
                                      </p>
                                      <Spacer y={2} />
                                      <p className='text-grey600'>
                                        {item.itemName}
                                      </p>

                                      <p className='text-sm'>
                                        {item.iquantity}
                                      </p>
                                    </div>
                                  </div>
                                  <div className='text-black flex items-center text-[12px]'>
                                    <span>QTY:</span>
                                    <span className='font-[600]'>
                                      {' '}
                                      {item.quantity}
                                    </span>
                                  </div>
                                  <div className='text-black w-[150px] grid place-content-center'>
                                    <h3 className='font-[600]'>
                                      {formatPrice(item?.unitPrice)}
                                    </h3>
                                  </div>
                                </div>
                                {index !== order?.orderDetails?.length - 1 && (
                                  <Divider className='bg-primaryGrey' />
                                )}
                              </>
                            );
                          })}
                        </>
                      )}
                    </div>
                    <div className='flex-grow'>
                      <CustomInput
                        type='text'
                        value={paymentMethodMap[singlePayment.paymentMethod]}
                        disabled={true}
                        label='Channel'
                        placeholder='Channel'
                      />

                      <Spacer y={3} />
                      <CustomInput
                        type='text'
                        value={singlePayment.treatedBy}
                        disabled={true}
                        label='Staff'
                        placeholder='Staff'
                      />

                      <Spacer y={3} />
                      {(role === 0 ||
                        userRolePermissions?.canEditPayment === true) &&
                        singlePayment.status === 0 && (
                          <>
                            <CustomInput
                              type='text'
                              value={reference}
                              onChange={(e) => setReference(e.target.value)}
                              name='itemName'
                              label='Enter ref'
                              placeholder='Provide payment reference'
                            />

                            <Spacer y={5} />

                            <CustomButton
                              loading={isLoading}
                              disabled={isLoading}
                              onClick={finalizeOrder}
                              className='text-white w-full h-[50px]'
                            >
                              <div className='flex gap-2 items-center justify-center'>
                                <p>{'Confirm payment'} </p>
                                <HiArrowLongLeft className='text-[22px] rotate-180' />
                              </div>
                            </CustomButton>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenSuccess} onOpenChange={toggleSuccessModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className='grid place-content-center mt-8'>
                  <Image src={Success} alt='success' />
                </div>

                <h2 className='text-[16px] text-center leading-3 mt-3 text-black font-semibold'>
                  Awesome!
                </h2>
                <h3 className='text-sm text-center text-grey600     mb-4'>
                  Your payment has been confirmed
                </h3>

                <CustomButton
                  className='text-white h-[49px]  flex-grow w-full'
                  onClick={() => {
                    toggleSuccessModal();
                  }}
                  type='submit'
                >
                  Go to payments
                </CustomButton>

                <Spacer y={4} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ApprovePayment;
