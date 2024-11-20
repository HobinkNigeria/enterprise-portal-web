'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  ButtonGroup,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ScrollShadow,
  Spacer,
  Tooltip,
  useDisclosure
} from '@nextui-org/react';
import moment from 'moment';
import { SubscriptionTableProps, SubscriptionHistory } from './Interfaces';
import { addCommasToNumber } from '@/lib/utils';
import { AiOutlineCloudDownload } from "react-icons/ai";
import { VscEye } from "react-icons/vsc";
import InvoiceSection from './Invoice';


const SubscriptionTable: React.FC<SubscriptionTableProps> = ({ subscriptions, searchQuery }: any) => {
  const [filteredData, setFilteredData] = React.useState(subscriptions);
  const [showInvoice, setShowInvoice] = React.useState(false)
  const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();
  const [invoiceDetails, setInvoiceDetails] = useState<SubscriptionHistory | null>(null)


  useEffect(() => {
    if (showInvoice) {
      onOpen(); // Open modal if triggerModal is true
    }
  }, [ showInvoice,onOpen]);

  const handleClose = () => {
    onClose();
    setShowInvoice(false)
    // setTriggerIframe(false); // Set triggerIframe back to false when modal is closed
  };
  // Map numeric plans and payment periods to human-readable text
  const mapPlan = (plan: number) => {
    switch (plan) {
      case 1:
        return 'Premium';
      case 2:
        return 'Professional';
      case 3:
        return 'Starter';
      default:
        return 'Unknown';
    }
  };

  const mapAmount =(amount :number) => {
    return `₦${addCommasToNumber(amount)}`
  }

  const mapPaymentPeriod = (paymentPeriod: number) => {
    switch (paymentPeriod) {
      case 0:
        return 'Monthly';
      case 1:
        return 'Annually';
      default:
        return 'Unknown';
    }
  };

  // Filter data based on search query
  useEffect(() => {
    if (subscriptions && searchQuery) {
      const filtered = subscriptions.filter((item: any) =>
        Object.values(item)
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(subscriptions);
    }
  }, [searchQuery, subscriptions]);

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'subscriptionStartDate':
        case 'subscriptionEndDate':
        return (
          <div>
            {moment(item[columnKey]).isValid()
              ? moment(item[columnKey]).format('DD/MM/YYYY hh:mmA') // Format date here
              : 'N/A'}
          </div>
        );
      case 'isActive':
        return (
          <span
            className={` py-1 rounded ${
              item[columnKey] ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {item[columnKey] ? 'Active' : 'Inactive'}
          </span>
        );
      case 'isExpired':
        return (
          <span
            className={` py-1 rounded ${
              item[columnKey] ? 'bg-red-200 text-red-700' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {item[columnKey] ? 'Expired' : 'Valid'}
          </span>
        );
        case 'invoice': // Handle the Invoice column
        return (
          <div className="flex gap-5">
            <button
              className=" py-1 rounded flex flex-row gap-2 items-center"
              onClick={() => showInvoiceModal(item)}
            >
              <VscEye />
              View
            </button>
            <button
              className=" py-1 rounded text-primaryColor flex flex-row gap-2 items-center"
              onClick={() => showInvoiceModal(item)}
            >
            <AiOutlineCloudDownload /> Download
            </button>
          </div>
        );
      default:
        return item[columnKey] || 'N/A';
    }
  };

  const showInvoiceModal =(details: SubscriptionHistory) => {
    // console.log(details);
    setInvoiceDetails(details);
    setShowInvoice(true)
   
  } 

  return (
    <section className="border border-primaryGrey rounded-lg">
      <Table
        aria-label="Subscription List"
        radius="lg"
        isCompact
        bottomContentPlacement="outside"
        emptyContent="No subscriptions found"
      >
        <TableHeader>
          {/* <TableColumn>Cooperate ID</TableColumn>
          <TableColumn>Business ID</TableColumn>
          <TableColumn>Subscribed By</TableColumn> */}
          <TableColumn className='text-black'>Plan</TableColumn>
          <TableColumn className='text-black'>Bill Date</TableColumn>
          <TableColumn className='text-black'>Duration</TableColumn>
          {/* <TableColumn>Start Date</TableColumn> */}
          <TableColumn className='text-black'>Amount</TableColumn> 
          {/* <TableColumn>Status</TableColumn> */}
          <TableColumn className='text-black'>Invoice</TableColumn>
        </TableHeader>
        <TableBody items={filteredData}>
          {(item) => (
            <TableRow key={item.id}>
              {/* <TableCell>{item.cooperateID}</TableCell>
              <TableCell>{item.businessID}</TableCell> */}
              {/* <TableCell>{item.subcribedByID}</TableCell> */}
              <TableCell>{mapPlan(item.plan)}</TableCell>
              <TableCell>{renderCell(item, 'subscriptionEndDate')}</TableCell>
              <TableCell>{mapPaymentPeriod(item.paymentPeriod)}</TableCell>
              {/* <TableCell>{renderCell(item, 'subscriptionStartDate')}</TableCell> */}
              <TableCell>{mapAmount(item.totalAmount)}</TableCell>
              {/* <TableCell>{renderCell(item, 'isActive')}</TableCell> */}
              <TableCell>{renderCell(item, 'invoice')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {
        showInvoice && (
          <Modal
        isOpen={isOpen}
        onClose={handleClose}
        onOpenChange={onOpenChange}
        backdrop="blur"

        style={{ width: "1000px", height: "700px" }}
      >
        <ModalContent className="w-[600px] h-auto max-w-full">
          {(onClose) => (
            <>
              <ModalBody className='overflow-y-auto bg-[#fafafa]'>
                <InvoiceSection data={invoiceDetails} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
        )
      }
    </section>
  );
};

export default SubscriptionTable;
