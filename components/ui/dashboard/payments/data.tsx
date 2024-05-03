import React from 'react';
const columns = [
  { name: 'Amount', uid: 'totalAmount' },
  { name: 'Table', uid: 'qrName' },
  //   { name: 'Order ID', uid: 'orderID' },
  { name: 'Order ID', uid: 'reference' },
  { name: 'Staff', uid: 'treatedBy' },
  { name: 'Date Created', uid: 'dateCreated' },
  { name: 'Customer', uid: 'customer' },
  { name: 'Status', uid: 'status' },
  { name: 'Payment method', uid: 'paymentMethod' },
  { name: 'Payment reference', uid: 'paymentReference' },
  { name: '', uid: 'actions' },
];
export const statusColorMap: Record<
  number,
  'warning' | 'success' | 'danger' | 'secondary'
> = {
  0: 'warning',
  1: 'success',
  2: 'danger',
  3: 'secondary',
};
export const paymentMethodMap: Record<
  number,
  'Cash' | 'POS' | 'Bank transfer' | 'Checkout'
> = {
  0: 'Cash',
  1: 'POS',
  2: 'Bank transfer',
  3: 'Checkout',
};

export const availableOptions = {
  pending: ['Approve payment'],
  confirmed: [],
  cancelled: [],
  'awaiting confirmation': ['Generate Invoice', 'Checkout'],
};
export const statusDataMap: Record<
  number,
  'pending' | 'confirmed' | 'cancelled' | 'awaiting confirmation'
> = {
  0: 'pending',
  1: 'confirmed',
  2: 'cancelled',
  3: 'awaiting confirmation',
};

const getTableClasses = () => {
  return React.useMemo(
    () => ({
      wrapper: ['max-h-[382px]', 'max-w-3xl'],

      th: [
        'bg-transparent',
        'text-default-500',
        'border-b',
        'border-[#E4E7EC]',
      ],
      tr: ' border-b border-[#E4E7EC]',
      td: [
        // changing the rows border radius
        // first
        'py-3',
        'group-data-[first=true]:first:before:rounded-none',
        'group-data-[first=true]:last:before:rounded-none',
        // middle
        'group-data-[middle=true]:before:rounded-none',
        // last
        'group-data-[last=true]:first:before:rounded-none',
        'group-data-[last=true]:last:before:rounded-none',
      ],
    }),
    []
  );
};

export { columns, getTableClasses };
