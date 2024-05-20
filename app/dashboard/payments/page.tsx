'use client';
import Container from '../../../components/dashboardContainer';

import React, { useMemo, useState } from 'react';

import { CustomLoading } from '@/lib/utils';

import { CustomInput } from '@/components/CustomInput';
import Error from '@/components/error';
import NoPaymentsScreen from '@/components/ui/dashboard/payments/noPayments';
import PaymentsList from '@/components/ui/dashboard/payments/payment';
import usePayment from '@/hooks/usePayment';
import { downloadCSV } from '@/lib/downloadToExcel';
import { Button, ButtonGroup, Chip, useDisclosure } from '@nextui-org/react';
import { IoSearchOutline } from 'react-icons/io5';
import { MdOutlineFileDownload } from 'react-icons/md';

const Payments: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { payments, error, isLoading, getAllPayments } = usePayment();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredItems = useMemo(() => {
    return payments
      ?.map((item) => ({
        ...item,
        orders: item?.payments?.filter(
          (item) =>
            item?.qrName?.toLowerCase().includes(searchQuery) ||
            String(item?.totalAmount)?.toLowerCase().includes(searchQuery) ||
            item?.dateCreated?.toLowerCase().includes(searchQuery) ||
            item?.reference?.toLowerCase().includes(searchQuery) ||
            item?.treatedBy?.toLowerCase().includes(searchQuery) ||
            item?.paymentReference?.toLowerCase().includes(searchQuery) ||
            item?.customer?.toLowerCase().includes(searchQuery)
        ),
      }))
      .filter((item) => item?.payments?.length > 0);
  }, [payments, searchQuery]);

  const getScreens = () => {
    if (payments?.length > 0) {
      return (
        <PaymentsList
          payments={filteredItems}
          onOpen={onOpen}
          searchQuery={searchQuery}
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
            <>
              <div>
                <CustomInput
                  classnames={'w-[242px]'}
                  label=''
                  size='md'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  isRequired={false}
                  startContent={<IoSearchOutline />}
                  type='text'
                  placeholder='Search here...'
                />
              </div>
              <ButtonGroup className='border-2 border-primaryGrey divide-x-2 divide-primaryGrey rounded-lg'>
                <Button
                  onClick={() => downloadCSV(newArray)}
                  className='flex text-grey600 bg-white'
                >
                  <MdOutlineFileDownload className='text-[22px]' />
                  <p>Export csv</p>
                </Button>
              </ButtonGroup>
            </>
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
