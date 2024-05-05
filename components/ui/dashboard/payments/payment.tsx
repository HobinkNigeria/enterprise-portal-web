'use client';

import React, { useState } from 'react';

import {
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { HiOutlineDotsVertical } from 'react-icons/hi';

import { GrFormView } from 'react-icons/gr';
import { columns, statusColorMap, statusDataMap } from './data';

import moment from 'moment';

import usePagination from '@/hooks/usePagination';
import { formatPrice } from '@/lib/utils';
import ApprovePayment from './approvePayment';
import Filters from './filters';
import PaymentCard from './paymentCard';

const INITIAL_VISIBLE_COLUMNS = [
  'totalAmount',
  'qrName',
  'reference',
  'treatedBy',
  'dateCreated',
  'customer',
  'status',
  'actions',
];
const PaymentsList = ({ payments, onOpen, getAllPayments }: any) => {
  const [singlePayment, setSinglePayment] = React.useState('');
  const [isOpen, setIsOpen] = React.useState<Boolean>(false);

  const [filteredPayment, setFilteredMenu] = React.useState(
    payments[0]?.payments
  );
  const {
    bottomContent,
    headerColumns,
    setSelectedKeys,
    sortedItems,
    selectedKeys,
    sortDescriptor,
    setSortDescriptor,
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    classNames,
    hasSearchFilter,
  } = usePagination(filteredPayment, columns, INITIAL_VISIBLE_COLUMNS);

  const toggleApproveModal = (payment: any) => {
    setSinglePayment(payment);
    setIsOpen(!isOpen);
  };

  const [value, setValue] = useState('');

  const handleTabChange = (index) => {
    setValue(index);
  };

  const handleTabClick = (index) => {
    const filteredMenu = payments.filter((item) => item.name === index);
    setFilteredMenu(filteredMenu[0]?.payments);
  };

  const renderCell = React.useCallback((payment, columnKey) => {
    const cellValue = payment[columnKey];

    switch (columnKey) {
      case 'totalAmount':
        return (
          <div className='text-textGrey text-sm'>
            <p>{formatPrice(payment.totalAmount)}</p>
          </div>
        );
      case 'qrName':
        return (
          <div className='flex text-textGrey text-sm'>{payment.qrName}</div>
        );
      case 'reference':
        return <div className='text-textGrey text-sm'>{payment.reference}</div>;
      case 'treatedBy':
        return <div className='text-textGrey text-sm'>{payment.treatedBy}</div>;
      case 'dateCreated':
        return (
          <div className='text-textGrey text-sm'>
            {moment(payment.dateCreated).format('MMMM Do YYYY, h:mm:ss a')}
          </div>
        );
      case 'customer':
        return <div className='text-textGrey text-sm'>{payment.customer}</div>;
      case 'status':
        return (
          <Chip
            className='capitalize'
            color={statusColorMap[payment.status]}
            size='sm'
            variant='bordered'
          >
            {statusDataMap[cellValue]}
          </Chip>
        );

      case 'actions':
        return (
          <div className='relative flexjustify-center items-center gap-2'>
            <Dropdown className=''>
              <DropdownTrigger aria-label='actions'>
                <div className='cursor-pointer flex justify-center items-center text-black'>
                  <HiOutlineDotsVertical className='text-[22px] ' />
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label='Approve payment' className='text-black'>
                <DropdownItem
                  onClick={() => {
                    toggleApproveModal(payment);
                  }}
                  aria-label='update order'
                >
                  <div className={` flex gap-2  items-center text-grey500`}>
                    <GrFormView className='text-[20px]' />
                    <p>View</p>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <Filters
        onOpen={onOpen}
        payments={payments}
        handleTabChange={handleTabChange}
        value={value}
        handleTabClick={handleTabClick}
      />
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    filteredPayment.length,
    hasSearchFilter,
  ]);

  return (
    <>
      <PaymentCard payments={payments} />
      <Spacer y={5} />
      <section className='border border-primaryGrey rounded-lg'>
        <Table
          radius='lg'
          isCompact
          removeWrapper
          allowsSorting
          aria-label='list of payments'
          bottomContent={bottomContent}
          bottomContentPlacement='outside'
          classNames={classNames}
          selectedKeys={selectedKeys}
          // selectionMode='multiple'
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement='outside'
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === 'actions' ? 'center' : 'start'}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={'No payments found'} items={sortedItems}>
            {(item) => (
              <TableRow key={item?.name}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ApprovePayment
          singlePayment={singlePayment}
          isOpen={isOpen}
          toggleApproveModal={toggleApproveModal}
        />
      </section>
    </>
  );
};

export default PaymentsList;
