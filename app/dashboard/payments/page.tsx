'use client';
import Container from '../../../components/dashboardContainer';

import React, { useEffect, useState } from 'react';

import { CustomLoading, getJsonItemFromLocalStorage } from '@/lib/utils';

import { Button, ButtonGroup, Chip, useDisclosure } from '@nextui-org/react';
import { MdOutlineFileDownload } from 'react-icons/md';

import { getPaymentByBusiness } from '@/app/api/controllers/dashboard/payment';
import Error from '@/components/error';
import NoPaymentsScreen from '@/components/ui/dashboard/payments/noPayments';
import PaymentsList from '@/components/ui/dashboard/payments/payment';
import { downloadCSV } from '@/lib/downloadToExcel';

interface Payment {
  id: string;
  customer: string;
  reference: string;
  treatedBy: string;
  totalAmount: number;
  orderID: string;
  qrName: string;
  paymentMethod: number;
  paymentReference: string;
  status: number;
  dateCreated: string;
  cooperateID: string;
  businessID: string;
}

interface OrderSummary {
  name: string;
  totalAmount: number;
  payments: Payment[];
}
const Payments: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [payments, setPayments] = useState<OrderSummary[]>([]);

  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [error, setError] = useState<Boolean>(false);
  const businessInformation = getJsonItemFromLocalStorage('business');

  const getAllPayments = async (checkLoading = true) => {
    setIsLoading(checkLoading);
    setError(false);
    const data = await getPaymentByBusiness(businessInformation[0]?.businessId);
    setIsLoading(false);
    if (data?.data?.isSuccessful) {
      let response = data?.data?.data;

      setPayments(response);
    } else if (data?.data?.error) {
      setError(true);
    }
  };

  useEffect(() => {
    getAllPayments();
  }, []);

  const getScreens = () => {
    if (payments?.length > 0) {
      return (
        <PaymentsList
          payments={payments}
          onOpen={onOpen}
          getAllPayments={getAllPayments}
        />
      );
    } else if (error) {
      return <Error onClick={() => getAllPayments()} />;
    } else {
      return <NoPaymentsScreen />;
    }
  };

  const newArray = payments?.flatMap((item) =>
    item.payments.map((payment) => ({
      reference: payment.reference,
      totalAmount: payment.totalAmount,
      treatedBy: payment.treatedBy,
      dateCreated: payment.dateCreated,
      paymentReference: payment.paymentReference,
      qrName: payment.qrName,
      customer: payment.customer,
    }))
  );
  return (
    <Container>
      <div className='flex flex-row flex-wrap  justify-between'>
        <div>
          <div className='text-[24px] leading-8 font-semibold'>
            {payments?.length > 0 ? (
              <div className='flex items-center'>
                <span>All Payment</span>
                <Chip
                  classNames={{
                    base: ` ml-2 text-xs h-7 font-[600] w-5 bg-[#EAE5FF] text-primaryColor`,
                  }}
                >
                  {payments[0].payments?.length}
                </Chip>
              </div>
            ) : (
              <span>Payments</span>
            )}
          </div>
          <p className='text-sm  text-grey600  xl:w-[231px] xl:mb-8 w-full mb-4'>
            Showing all payments
          </p>
        </div>
        <div className='flex items-center gap-3'>
          {payments?.length > 0 && (
            <ButtonGroup className='border-2 border-primaryGrey divide-x-2 divide-primaryGrey rounded-lg'>
              <Button
                onClick={() => downloadCSV(newArray)}
                className='flex text-grey600 bg-white'
              >
                <MdOutlineFileDownload className='text-[22px]' />
                <p>Export csv</p>
              </Button>
            </ButtonGroup>
          )}

          {/* <CustomButton
            onClick={() => router.push('/dashboard/orders/place-order')}
            className='py-2 px-4 mb-0 text-white'
            backgroundColor='bg-primaryColor'
          >
            <div className='flex gap-2 items-center justify-center'>
              <IoAddCircleOutline className='text-[22px]' />
              <p>{'Create order'} </p>
            </div>
          </CustomButton> */}
        </div>
      </div>

      {isLoading ? <CustomLoading /> : <>{getScreens()}</>}
    </Container>
  );
};

export default Payments;