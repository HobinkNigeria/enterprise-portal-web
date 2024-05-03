'use client';
import {
  completeOrder,
  getOrder,
} from '@/app/api/controllers/dashboard/orders';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/customButton';
import { formatPrice, getJsonItemFromLocalStorage, notify } from '@/lib/utils';
import {
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spacer,
  Spinner,
} from '@nextui-org/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { HiArrowLongLeft } from 'react-icons/hi2';
import { MdKeyboardArrowRight } from 'react-icons/md';

const ConfirmOrderModal = ({
  getAllOrders,
  singleOrder,
  isOpenConfirmOrder,
  toggleConfirmModal,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [screen, setScreen] = useState(1);
  const [order, setOrder] = useState([]);
  const [reference, setReference] = useState('');

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(0);

  const handleClick = (methodId: number) => {
    setSelectedPaymentMethod(methodId);
    setScreen(3);
  };

  const paymentMethods = [
    { text: 'Pay with cash', id: 0 },
    { text: 'Pay with Pos', id: 1 },
    { text: 'Pay with bank transfer', id: 2 },
  ];

  const getOrderDetails = async () => {
    const data = await getOrder(singleOrder.id);

    if (data?.data?.isSuccessful) {
      setOrder(data?.data?.data);
    } else if (data?.data?.error) {
    }
  };

  const finalizeOrder = async () => {
    setIsLoading(true);
    const payload = {
      treatedBy: singleOrder.placedByName,
      paymentMethod: selectedPaymentMethod,
      paymentReference: reference,
      status: 1,
    };

    const data = await completeOrder(payload, singleOrder?.id);
    setIsLoading(false);

    if (data?.data?.isSuccessful) {
      notify({
        title: 'Payment made!',
        text: 'Payment has been made, awaiting confirmation',
        type: 'success',
      });
      toggleConfirmModal();
      window.location.reload();
    } else if (data?.data?.error) {
      notify({
        title: 'Error!',
        text: data?.data?.error,
        type: 'error',
      });
    }
  };

  useEffect(() => {
    if (singleOrder?.id) {
      getOrderDetails();
    }
  }, [singleOrder?.id]);
  return (
    <Modal
      size={screen === 1 ? '5xl' : 'md'}
      isOpen={isOpenConfirmOrder}
      onOpenChange={() => {
        setScreen(1);
        toggleConfirmModal();
        setReference('');
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {screen === 1 && (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  <div className='flex flex-row flex-wrap  justify-between'>
                    <div>
                      <div className='text-[24px] leading-8 font-semibold'>
                        <span className='text-black'>
                          {singleOrder.reference}
                        </span>
                      </div>
                      <p className='text-sm  text-grey600 xl:mb-8 w-full mb-4'>
                        Confirm order before checkout
                      </p>
                    </div>
                    <div className='flex items-center justify-center gap-3'>
                      <CustomButton
                        onClick={toggleConfirmModal}
                        className='py-2 px-4 mb-0 bg-white border border-primaryGrey'
                      >
                        Update order
                      </CustomButton>

                      <CustomButton
                        onClick={() => setScreen(2)}
                        className='py-2 px-4 mb-0 text-white'
                        backgroundColor='bg-primaryColor'
                      >
                        <div className='flex gap-2 items-center justify-center'>
                          <p>
                            Checkout {formatPrice(singleOrder.totalAmount)}{' '}
                          </p>
                          <HiArrowLongLeft className='text-[22px] rotate-180' />
                        </div>
                      </CustomButton>
                    </div>
                  </div>
                  <Divider className='bg-primaryGrey' />
                </ModalHeader>
                <ModalBody>
                  <div className='flex lg:flex-row flex-col gap-3 mb-4'>
                    <div className='lg:w-[60%] max-h-[300px] overflow-y-scroll  w-full rounded-lg border border-[#E4E7EC80] p-2 '>
                      {order.length === 0 ? (
                        <div className={`grid h-full place-content-center`}>
                          <Spinner />
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
                                    <div className='p-3 flex  flex-col text-sm justify-center'>
                                      <p className='font-[600]'>
                                        {item.menuName}
                                      </p>
                                      <Spacer y={2} />
                                      <p className='text-grey600'>
                                        {item.itemName}
                                      </p>

                                      <p className=''>{item.iquantity}</p>
                                    </div>
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
                    <div className='flex-grow bg-[#F7F6FA] z-10 rounded-lg p-4'>
                      <div className='flex justify-between items-center'>
                        <div className='text-sm'>
                          <p className='font-[600] text-black'>
                            {singleOrder.placedByName}
                          </p>
                          <p className='text-grey500'>
                            {singleOrder.placedByPhoneNumber}
                          </p>
                        </div>
                        <div>
                          <span className='rounded-full text-sm px-4 py-2 bg-[#EAE5FF] text-primaryColor'>
                            {singleOrder.qrReference}
                          </span>
                        </div>
                      </div>
                      <Spacer y={5} />
                      <div className='text-sm'>
                        <p className='font-[600] text-black'>Comment</p>
                        <p className='text-grey500'>
                          {singleOrder.comment
                            ? singleOrder.comment
                            : 'no comment'}
                        </p>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </>
            )}
            {screen === 2 && (
              <div className='p-5'>
                <div>
                  <div className=' text-[18px] leading-8 font-semibold'>
                    <span className='text-black'>Select payment method</span>
                  </div>
                  <p className='text-sm  text-primaryColor xl:mb-8 w-full mb-4'>
                    {formatPrice(singleOrder.totalAmount)}
                  </p>
                </div>
                <div className='flex flex-col gap-1 text-black'>
                  {paymentMethods.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleClick(item.id)}
                      className={`flex  cursor-pointer items-center gap-2 p-4 rounded-lg justify-between  ${
                        selectedPaymentMethod === item.id
                          ? 'bg-[#EAE5FF80]'
                          : ''
                      } `}
                    >
                      <div>
                        <p className='font-semibold'>{item.text}</p>
                        <p className='text-sm text-grey500'>
                          Accept payment using cash
                        </p>
                      </div>
                      <MdKeyboardArrowRight />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {screen === 3 && (
              <div className='p-5'>
                <div>
                  <div className=' text-[18px] leading-8 font-semibold'>
                    <span className='text-black'>Confirm payment</span>
                  </div>
                  <p className='text-sm  text-grey500 xl:mb-8 w-full mb-4'>
                    confirm that customer has paid for order
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 p-4 rounded-lg justify-between bg-[#EAE5FF80]`}
                >
                  <div>
                    <p className='text-sm text-grey500'>TOTAL ORDER</p>
                    <p className='font-bold text-black text-[20px]'>
                      {' '}
                      {formatPrice(singleOrder.totalAmount)}
                    </p>
                  </div>
                  <MdKeyboardArrowRight />
                </div>
                <Spacer y={4} />
                <CustomInput
                  type='text'
                  // defaultValue={menuItem?.itemName}
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  name='itemName'
                  label='Enter ref'
                  placeholder='Provide payment reference'
                />
                <Spacer y={5} />
                <div className='flex gap-5'>
                  <CustomButton
                    onClick={toggleConfirmModal}
                    className='bg-white h-[50px] w-full border border-primaryGrey'
                  >
                    Cancel
                  </CustomButton>
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
                </div>
              </div>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmOrderModal;
