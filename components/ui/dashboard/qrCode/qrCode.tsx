'use client';

import React, { useEffect } from 'react';

import usePagination from '@/hooks/usePagination';
import { saveJsonItemToLocalStorage } from '@/lib/utils';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { FaRegEdit } from 'react-icons/fa';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { MdOutlineFileDownload } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { columns } from './data';
import DeleteQRModal from './deleteModal';
import EditQrModal from './editQrModal';
import ViewQrModal from './viewQrModal';

const INITIAL_VISIBLE_COLUMNS = [
  'name',
  'allOrdersCount',
  'openOrdersCount',

  'dateCreated',
  'actions',
];
const QrList = ({ qr, searchQuery }: any) => {
  const router = useRouter();

  const [singleOrder, setSingleOrder] = React.useState('');

  const [isOpenDelete, setIsOpenDelete] = React.useState<Boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = React.useState<Boolean>(false);
  const [isOpenView, setIsOpenView] = React.useState<Boolean>(false);
  const [isOpenConfirmOrder, setIsOpenConfirmOrder] =
    React.useState<Boolean>(false);
  const [filteredQr, setFilteredQr] = React.useState(qr);

  const toggleQRmodalModal = () => {
    setIsOpenDelete(!isOpenDelete);
  };
  const toggleQRmodalEdit = () => {
    setIsOpenEdit(!isOpenEdit);
  };
  const toggleQRmodalView = () => {
    setIsOpenView(!isOpenView);
  };

  useEffect(() => {
    if (qr && searchQuery) {
      const filteredData = qr
        ?.filter(
          (item) =>
            item?.name?.toLowerCase().includes(searchQuery) ||
            String(item?.allOrdersCount)?.includes(searchQuery) ||
            String(item?.openOrdersCount)?.includes(searchQuery) ||
            item?.dateCreated?.toLowerCase().includes(searchQuery)
        )
        .filter((item) => Object.keys(item).length > 0);
      setFilteredQr(filteredData.length > 0 ? filteredData : []);
    } else {
      setFilteredQr(qr);
    }
  }, [searchQuery, qr]);

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
  } = usePagination(filteredQr, columns, INITIAL_VISIBLE_COLUMNS);

  const toggleCancelModal = (order: any) => {
    setSingleOrder(order);
    setIsOpenCancelOrder(!isOpenCancelOrder);
  };
  const toggleConfirmModal = (order: any) => {
    setSingleOrder(order);
    setIsOpenConfirmOrder(!isOpenConfirmOrder);
  };

  const renderCell = React.useCallback((qr, columnKey) => {
    const cellValue = qr[columnKey];

    switch (columnKey) {
      case 'name':
        return <div className='flex text-textGrey text-sm'>{qr.name}</div>;

      case 'dateCreated':
        return (
          <div className='text-textGrey text-sm'>
            {moment(qr.dateCreated).format('MMMM Do YYYY, h:mm:ss a')}
          </div>
        );

      case 'actions':
        return (
          <div className='relative flexjustify-center items-center gap-2'>
            <Dropdown aria-label='drop down' className=''>
              <DropdownTrigger aria-label='actions'>
                <div className='cursor-pointer flex justify-center items-center text-black'>
                  <HiOutlineDotsVertical className='text-[22px] ' />
                </div>
              </DropdownTrigger>
              <DropdownMenu className='text-black'>
                <DropdownItem
                  onClick={() => {
                    saveJsonItemToLocalStorage('qr', qr);
                    toggleQRmodalView();
                  }}
                  aria-label='View QR'
                >
                  <div className={` flex gap-3  items-center text-grey500`}>
                    <MdOutlineFileDownload className='text-[18px]' />
                    <p>View QR</p>
                  </div>
                </DropdownItem>

                <DropdownItem
                  onClick={() => {
                    saveJsonItemToLocalStorage('qr', qr);
                    toggleQRmodalEdit();
                  }}
                  aria-label='Edit QR'
                >
                  <div className={`flex gap-3 items-center text-grey500`}>
                    <FaRegEdit />
                    <p>Edit QR</p>
                  </div>
                </DropdownItem>

                <DropdownItem
                  onClick={() => {
                    toggleQRmodalModal();
                    saveJsonItemToLocalStorage('qr', qr);
                  }}
                  aria-label='delete QR'
                >
                  <div className={` text-danger-500 flex  items-center gap-3 `}>
                    <RiDeleteBin6Line />

                    <p>Delete QR</p>
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

  return (
    <section className='border border-primaryGrey rounded-lg'>
      <Table
        radius='lg'
        isCompact
        removeWrapper
        allowsSorting
        aria-label='list of orders'
        bottomContent={bottomContent}
        bottomContentPlacement='outside'
        classNames={classNames}
        selectedKeys={selectedKeys}
        // selectionMode='multiple'
        sortDescriptor={sortDescriptor}
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
        <TableBody emptyContent={'No qr found'} items={sortedItems}>
          {(item) => (
            <TableRow key={item?.name}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteQRModal
        isOpenDelete={isOpenDelete}
        setIsOpenDelete={setIsOpenDelete}
        toggleQRmodalModal={toggleQRmodalModal}
      />
      <EditQrModal
        isOpenEdit={isOpenEdit}
        setIsOpenEdit={setIsOpenEdit}
        toggleQRmodalEdit={toggleQRmodalEdit}
      />
      <ViewQrModal
        isOpenView={isOpenView}
        setIsOpenView={setIsOpenView}
        toggleQRmodalView={toggleQRmodalView}
      />
    </section>
  );
};

export default QrList;
