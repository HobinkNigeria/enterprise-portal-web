"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
  Chip,
} from "@nextui-org/react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { VscEye } from "react-icons/vsc";
import InvoiceSection from "./Invoice";
import moment from "moment";
import { addCommasToNumber } from "@/lib/utils";
import usePagination from "@/hooks/usePagination";



const SubscriptionTable = ({ subscriptions, searchQuery }: any) => {
  const [filteredData, setFilteredData] = useState(subscriptions);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  useEffect(() => {
    if (subscriptions && searchQuery) {
      const filtered = subscriptions.filter((item: any) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(subscriptions);
    }
  }, [searchQuery, subscriptions]);


  const INITIAL_VISIBLE_COLUMNS = [
    'plan',
    'billDate',
    'amount',
    'duration',
    'invoice',
  ];

   const columns = [
    { name: 'ID', uid: 'id' },
    { name: 'Plan', uid: 'plan' },
    { name: 'Bill Date', uid: 'billDate' },
    { name: 'Amount', uid: 'amount' },
    { name: 'Duration', uid: 'duration' },
    { name: 'Invoice', uid: 'invoice' },
    // { name: '', uid: 'actions' },
  ];
  
  
  const {
    bottomContent,
    headerColumns,
    setSelectedKeys,

    selectedKeys,
    sortDescriptor,
    setSortDescriptor,

    classNames,
  } = usePagination(subscriptions, columns, INITIAL_VISIBLE_COLUMNS);


  useEffect(() => {
   
    console.log("header columns",headerColumns)
    console.log("bottomStuff",bottomContent)
  }, [headerColumns, bottomContent])
  


  const mapPlan = (plan: number) => {
    return ["Unknown", "Premium", "Professional", "Starter"][plan] || "Unknown";
  };

  const mapAmount = (amount: number) => `₦${addCommasToNumber(amount)}`


  
  // const am = (amount: number) => {
  //   console.log("AAMAMAMA",amount)

  //   return `₦${addCommasToNumber(amount)}`
  // }

  const mapPaymentPeriod = (paymentPeriod: number) =>
    paymentPeriod === 0 ? "Monthly" : "Annually";

  const renderCell = useCallback((item: any, columnKey: string) => {
    switch (columnKey) {
      case "subscriptionEndDate":
        return moment(item[columnKey]).isValid()
          ? moment(item[columnKey]).format("DD/MM/YYYY hh:mm A")
          : "N/A";
      case "isActive":
        return (
          <Chip
            className={`text-xs h-6 font-bold ${
              item[columnKey]
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {item[columnKey] ? "Active" : "Inactive"}
          </Chip>
        );
      case "invoice":
        return (
          <div className="flex flex-row gap-3">
            <button
              className="text-blue-500 flex items-center gap-1 hover:underline"
              onClick={() => openInvoiceModal(item)}
            >
              <VscEye />
              View
            </button>
            <button
              className="text-primaryColor flex items-center gap-1 hover:underline"
              onClick={() => openInvoiceModal(item)}
            >
              <AiOutlineCloudDownload />
              Download
            </button>
          </div>
        );
        case "plan":
      return mapPlan(item[columnKey]);
    case "amount":
      return mapAmount(item[columnKey]);
    case "paymentPeriod":
      return mapPaymentPeriod(item[columnKey]);
      default:
        return item[columnKey] || "N/A";
    }
  }, [])


  const downloadInvoice = () => {

  }

  const openInvoiceModal = (details: any) => {
    setInvoiceDetails(details);
    onOpen();
  };

  return (
    <section className=" rounded-lg">
      <Table
        aria-label="Subscription List"
        radius="lg"
        isCompact
        removeWrapper
        allowsSorting
        bottomContentPlacement="outside"
        bottomContent={bottomContent}
        classNames={classNames}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        // className="table-auto border-collapse"
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      
      >
        <TableHeader columns={headerColumns}>
          {/* <TableColumn>Plan</TableColumn>
          <TableColumn>Bill Date</TableColumn>
          <TableColumn>Duration</TableColumn>
          <TableColumn>Amount</TableColumn>
          <TableColumn >Invoice</TableColumn> */}


          {(column) => (
            <TableColumn
              key={column.uid}
              // align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={filteredData}   emptyContent={'No subscriptions found'}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell className="text-left font-medium">
                {mapPlan(item.plan)}
              </TableCell>
              <TableCell>{renderCell(item, "subscriptionEndDate")}</TableCell>
              <TableCell>{mapPaymentPeriod(item.paymentPeriod)}</TableCell>
              <TableCell>{mapAmount(item.totalAmount)}</TableCell>
              <TableCell className="text-center">
                {renderCell(item, "invoice")}
              </TableCell>
            </TableRow>
          )}
          {/* {(item) => (
            <TableRow key={item?.name}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )} */}

          
        </TableBody>
      </Table>

      {invoiceDetails && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <div className="fixed inset-0 flex items-center justify-center">
            <ModalContent className="w-full max-w-[90%] sm:max-w-[600px] h-auto max-h-[90%] bg-white shadow-lg rounded-lg overflow-hidden">
              <ModalBody className="p-4 overflow-y-auto max-h-[80vh]">
                <InvoiceSection data={invoiceDetails} />
              </ModalBody>
            </ModalContent>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default SubscriptionTable;
