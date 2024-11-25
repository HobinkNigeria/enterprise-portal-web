import React from "react";

import { SubscriptionHistory } from "./Interfaces";
import { addCommasToNumber, getJsonItemFromLocalStorage } from "@/lib/utils";
import moment from "moment";
import CompanyLogo from "@/components/logo";
import hobinkLogo from "../../../../../public/assets/images/hobink-logo.png";
// import hobinkLogo from '@public/assets/images/hobink-logo.png'
interface invoiceDetails {
  data: SubscriptionHistory | null;
  download: boolean;
}
const InvoiceSection: React.FC<invoiceDetails> = ({ data, download }) => {
  const userInformation = getJsonItemFromLocalStorage("userInformation");
  const business = userInformation?.businesses[0];

  const mapPlan = (plan: number) => {
    return ["Unknown", "Premium Plan", "Professional Plan", "Starter Plan"][plan] || "Unknown";
  };
   const mapAmount = (amount: number) => `₦${addCommasToNumber(amount)}`

  // export interface SubscriptionHistory {
  //   cooperateID: string;
  //   businessID: string;
  //   subcribedByID: string;
  //   plan: number;
  //   paymentPeriod: number;
  //   subscriptionStartDate: string;
  //   subscriptionEndDate: string;
  //   subscriptionPlanCode: string;
  //   isActive: boolean;
  //   isExpired: boolean;
  //   id: string;
  //   perAmount: number;
  //   totalAmount: number;
  // }

  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-2xl mx-auto py-0 md:py-16">
        <article className="shadow-none md:shadow-md md:rounded-md overflow-hidden">
          <div className="md:rounded-b-md bg-white">
            <div className="p-9 border-b border-gray-200">
              <div className="space-y-6">
                <div className="flex justify-between items-top">
                  <div className="space-y-4">
                    <div>
                      <CompanyLogo
                        textColor="text-white font-lexend text-[28px] font-[600]"
                        containerClass="flex gap-2 items-center "
                      />
                      <p className="font-bold text-lg">Invoice</p>
                      <p>Hobink</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-400">
                        Billed To
                      </p>
                      <p>{business?.businessName}</p>
                      <p>{business?.businessContactEmail}</p>
                      <p>{business?.businessContactNumber}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-sm text-gray-400">
                        Invoice Number
                      </p>
                      <p>{data?.subscriptionPlanCode}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-400">
                        Invoice Date
                      </p>
                      <p>
                        {moment(data?.subscriptionStartDate).format(
                          "DD/MM/YYYY"
                        )}
                      </p>
                    </div>
             
                  </div>
                </div>
              </div>
            </div>
            <div className="p-9 border-b border-gray-200">
              <p className="font-medium text-sm text-gray-400">Note</p>
              <p className="text-sm">Thank you for your order.</p>
            </div>
            <table className="w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="px-9 py-4 text-left font-semibold text-gray-400">
                    Item
                  </th>
                  <th className="py-3 text-left font-semibold text-gray-400"></th>
                  <th className="py-3 text-left font-semibold text-gray-400">
                    Amount
                  </th>
                  <th className="py-3 text-left font-semibold text-gray-400">
                    Discount
                  </th>
                  <th className="py-3 text-left font-semibold text-gray-400"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-9 py-5 whitespace-nowrap space-x-1 flex items-center">
                    <div>
                      <p>{mapPlan(data?.plan!)}</p>
                      {/* <p className="text-sm text-gray-400">
                        Nuclear-armed ICBM
                      </p> */}
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-gray-600 truncate"></td>
                  <td className="whitespace-nowrap text-gray-600 truncate">
                  {mapAmount(data?.totalAmount!)}
                  </td>
                  <td className="whitespace-nowrap text-gray-600 truncate">
                    0%
                  </td>
                </tr>
                {/* <tr>
                  <td className="px-9 py-5 whitespace-nowrap space-x-1 flex items-center">
                    <div>
                      <p>Pym Particles (Pack of 10,000)</p>
                      <p className="text-sm text-gray-400">
                        Redacted Description
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-gray-600 truncate"></td>
                  <td className="whitespace-nowrap text-gray-600 truncate">
                    $280,000.00
                  </td>
                  <td className="whitespace-nowrap text-gray-600 truncate">
                    0%
                  </td>
                </tr> */}
              </tbody>
            </table>
            <div className="p-9 border-b border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Subtotal</p>
                  </div>
                  <p className="text-gray-500 text-sm"> {mapAmount(data?.totalAmount!)}</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Tax</p>
                  </div>
                  <p className="text-gray-500 text-sm">$0.00</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total</p>
                  </div>
                  <p className="text-gray-500 text-sm"> {mapAmount(data?.totalAmount!)}</p>
                </div>
              </div>
            </div>
            <div className="p-9 border-b border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-black text-lg">Amount Paid</p>
                  </div>
                  <p className="font-bold text-black text-lg"> {mapAmount(data?.totalAmount!)}</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default InvoiceSection;
