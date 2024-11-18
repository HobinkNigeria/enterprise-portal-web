'use client'
import React, { useEffect, useState } from "react";
import { FcLock, FcOk } from "react-icons/fc";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  CardHeader,
  Spinner,
} from "@nextui-org/react";

import {
  PlanDetails,
  Plans,
  PlansFromParent,
  TabContentProps,
  PaymentDetails,
  PAYMENT_PLAN,
} from "./Interfaces";
import { MdVerified } from "react-icons/md";
import { getJsonItemFromLocalStorage, notify } from "@/lib/utils";
import { initializeTransactionv2 } from "@/app/api/controllers/dashboard/settings";
// import PaystackPop from 'paystack-inline-ts';
import PaystackPop from "paystack-inline-ts";
import {usePaystackPayment} from  'react-paystack'
// import {PaystackPop} from '../Paystack'



import LoadingSpinner from "@/app/dashboard/reservation/[reservationId]/loading";

export const PricingCards: React.FC<PlansFromParent> = ({
  plans,
  disableButtons,
}) => {
  const userInformation = getJsonItemFromLocalStorage("userInformation");
  const popup = new PaystackPop();
  
  const token = userInformation?.token;
  const cooperateID = userInformation?.cooperateID;
  const businessID = userInformation?.businesses[0]?.businessId;
  const userId = userInformation?.id;
  const emailAddress = userInformation?.email;
  const [activeTab, setActiveTab] = useState<string>("Monthly");
  const [professionalPlan, setProfessionalPlan] = useState<PlanDetails | null>(
    null
  );
  const [starterPlan, setStarterPlan] = useState<PlanDetails | null>(null);
  const [premiumPlan, setPremiumPlan] = useState<PlanDetails | null>(null);
  const [starterLoading, setStarterLoading] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [professionalLoading, setProfessionalLoading] = useState(false);
  const [hasActive, setHasActive] = useState(false);

  // useEffect(() => {
  //   if(disableButtons){

  //     setHasActive(disableButtons)
  //   }
  // }, [disableButtons]);

  //* SET THE PLANS FROM THE PARENT COMPONENT *//
  useEffect(() => {
    setProfessionalPlan(plans?.Professional || null);
    setPremiumPlan(plans?.Premium || null);
    setStarterPlan(plans?.Starter || null);
  }, [plans]);

  const tabs: TabContentProps[] = [
    { id: "Monthly", label: "Monthly" },
    { id: "Yearly", label: "Yearly" },
  ];
  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue);
  };

  const handleIcons = (can: Boolean) => {
    if (can == true) return <FcOk />;

    return <FcLock />;
  };

  // Destructure data from the hook, but only call the hook when there's a payload

  const initializeTrnx = (selectedPlan: number, e: any) => {
    console.log("initializeTrnx", selectedPlan)
    e.preventDefault();

     // Align plans array with selectedPlan (1-based indexing)
  const plans = [null, starterPlan, professionalPlan, premiumPlan];
  const setLoading = [null, setStarterLoading, setProfessionalLoading, setPremiumLoading];

  // Boundary check for selectedPlan
  if (selectedPlan < 1 || selectedPlan >= plans.length) {
    return notify({
      title: "Payment Plan Error",
      text: "Invalid payment plan selected.",
      type: "error",
    });
  }

  // Activate the loader for the selected plan
  setLoading[selectedPlan]?.(true);

  const amount = activeTab === "Monthly"
    ? plans[selectedPlan]?.monthlyFee || 0
    : plans[selectedPlan]?.yearlyFee || 0;


    // Error handling for undefined or null plans
    if (!plans[selectedPlan]) {
      const notificationBody = {
        title: "Payment Plan Error",
        text: "Invalid payment plan selected.",
        type: "error",
      };
      return notify(notificationBody);
    }

    const body = {
      businessID,
      cooperateID,
      userId,
      emailAddress,
      amount,
      plan: selectedPlan,
      paymentPeriod: activeTab === "Monthly" ? 0 : 1,
    };
    console.log("BODY", body);

    init(body);
  };

  const init = async (payload: any) => {


    const token = getJsonItemFromLocalStorage("userInformation").token;
    const initializedTransaction = await initializeTransactionv2(
      businessID,
      payload,
      token
    );
    console.log("INITIALIZED TRANSACTION", initializedTransaction);
    const access_code = initializedTransaction.access_code;

    popup.resumeTransaction({
      accessCode: access_code,
      onSuccess:() => window.location.reload()
    });

    
    // popup.resumeTransaction(access_code);

    setPremiumLoading(false);
    setStarterLoading(false);
    setProfessionalLoading(false);
  };

  const activePlan = () => {
    const notificationBody = {
      title: "Active Plan",
      text: "You have an active plan",
      type: "warning",
    };
    return notify(notificationBody);
  };

  return (
    <div className="border border-secondaryGrey w-full rounded-lg flex flex-col ">
      <div className="p-4 px-6 border-b border-secondaryGrey">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold">Plans</h2>

          <Tabs
            aria-label="Dynamic tabs"
            onSelectionChange={(e) => handleTabChange(e.toString())} // Trigger handler on tab change
          >
            {tabs.map((item) => (
              <Tab key={item.id} title={item.label} value={item.id} />
            ))}
          </Tabs>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 border-r border-secondaryGrey p-4 gap-4">
          {/* Content for the first part */}
          <div className="flex flex-row gap-4">
            <p className="font-extrabold ">Starter Plan</p>

            <button
              disabled
              className="text-[10px] bg-[#EAECF0] px-3 py-1 rounded-sm"
            >
              RECOMMEND
            </button>
          </div>

          <div className="flex flex-row gap-4 mt-6">
            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "Monthly" ? "opacity-100" : "opacity-0"
              }`}
            >
              {activeTab === "Monthly" ? (
                <p className="font-extrabold text-2xl">
                  ₦{starterPlan?.monthlyFee}{" "}
                  <span className="text-[#ACB5BB] font-normal">/month</span>
                </p>
              ) : null}
            </div>

            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "Yearly" ? "opacity-100" : "opacity-0"
              }`}
            >
              {activeTab === "Yearly" ? (
                <p className="font-extrabold text-2xl">
                  ₦{starterPlan?.yearlyFee}{" "}
                  <span className="text-[#ACB5BB] font-normal">/year</span>
                </p>
              ) : null}
            </div>
          </div>

          <p className="text-sm mt-4">
            Lorem ipsum dolor sit amet consectetur. Mi aliquam amet velit felis.
          </p>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-secondaryGrey" />
            <span className="mx-4 text-xs text-[#ACB5BB]">
              WHAT YOU WILL GET
            </span>
            <hr className="flex-grow border-t border-secondaryGrey" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(true)}
              <p>Maximum users - {starterPlan?.maxUsers}</p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(starterPlan?.canAccessDashboard!)}
              <p>Can Access Dashboard </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(starterPlan?.canAccessDashboard!)}
              <p>Can Access Dashboard </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(starterPlan?.canAccessMenu!)}
              <p>Can Access Menu </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(starterPlan?.canAccessOrders!)}
              <p>Can Access Orders </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(starterPlan?.canAccessPayments!)}
              <p>Can Access Payments </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(starterPlan?.canAccessSettings!)}
              <p>Can Access Settings </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(starterPlan?.canAccessQR!)}
              <p>Can Access QR </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(starterPlan?.canAccessReservations!)}
              <p>Can Access Reservations </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(starterPlan?.canAccessNotifications!)}
              <p>Can Access Notifications </p>
            </div>

            <div className="flex flex-row gap-3 items-center">
              {handleIcons(starterPlan?.canAccessBookings!)}
              <p>Can Access Bookings </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(starterPlan?.canAccessCampaigns!)}
              <p>Can Access Campaigns </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(starterPlan?.canAccessReports!)}
              <p>Can Access Reports </p>
            </div>

            <div className="flex flex-row gap-3 items-center">
              {handleIcons(starterPlan?.canAccessMultipleLocations!)}
              <p>Can Access Multiple Locations </p>
            </div>
          </div>

          {hasActive === false ? (
            <button
              onClick={(e) => initializeTrnx(1, e)}
              className="mt-6 w-64 mx-auto border-1 border-secondary-500 rounded-lg px-8 py-2 font-normal text-sm text-secondary-500 hover:bg-secondary-500 hover:text-white"
            >
              {starterLoading ? <Spinner size="sm" /> : "Select Plan"}
            </button>
          ) : (
            <button
              onClick={(e) => activePlan()}
              className="mt-6 w-64 mx-auto border-1 border-secondary-500 rounded-lg px-8 py-2 font-normal text-sm text-secondary-500 hover:bg-secondary-500 hover:text-white"
            >
              {starterLoading ? <Spinner size="sm"  /> : "Select Plan"}
            </button>
          )}
        </div>

        <div className="flex-1 border border-[#5F35D2] bg-gradient-to-br from-[#F6F3FF] to-[#FFFFFF] p-4">
          <div className="flex flex-row gap-4 items-center">
            <p className="font-extrabold ">Premium Plan</p>

            <button
              disabled
              className="text-[10px] bg-[#EAECF0] px-3 py-1 rounded-sm"
            >
              RECOMMEND
            </button>

            <MdVerified className="text-primaryColor" />
          </div>
          <div className="flex flex-row gap-4 mt-6">
            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "Monthly" ? "opacity-100" : "opacity-0"
              }`}
            >
              {activeTab === "Monthly" ? (
                <p className="font-extrabold text-2xl">
                  ₦{premiumPlan?.monthlyFee}{" "}
                  <span className="text-[#ACB5BB] font-normal">/month</span>
                </p>
              ) : null}
            </div>

            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "Yearly" ? "opacity-100" : "opacity-0"
              }`}
            >
              {activeTab === "Yearly" ? (
                <p className="font-extrabold text-2xl">
                  ₦{premiumPlan?.yearlyFee}{" "}
                  <span className="text-[#ACB5BB] font-normal">/year</span>
                </p>
              ) : null}
            </div>
          </div>

          <p className="text-sm mt-4">
            Lorem ipsum dolor sit amet consectetur. Mi aliquam amet velit felis.
          </p>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-secondaryGrey" />
            <span className="mx-4 text-xs text-[#ACB5BB]">
              WHAT YOU WILL GET
            </span>
            <hr className="flex-grow border-t border-secondaryGrey" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(true)}
              <p>Maximum users - {premiumPlan?.maxUsers}</p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(premiumPlan?.canAccessDashboard!)}
              <p>Can Access Dashboard </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(premiumPlan?.canAccessDashboard!)}
              <p>Can Access Dashboard </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(premiumPlan?.canAccessMenu!)}
              <p>Can Access Menu </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(premiumPlan?.canAccessOrders!)}
              <p>Can Access Orders </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(premiumPlan?.canAccessPayments!)}
              <p>Can Access Payments </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(premiumPlan?.canAccessSettings!)}
              <p>Can Access Settings </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(premiumPlan?.canAccessQR!)}
              <p>Can Access QR </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(premiumPlan?.canAccessReservations!)}
              <p>Can Access Reservations </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(premiumPlan?.canAccessNotifications!)}
              <p>Can Access Notifications </p>
            </div>

            <div className="flex flex-row gap-3 items-center">
              {handleIcons(premiumPlan?.canAccessBookings!)}
              <p>Can Access Bookings </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(premiumPlan?.canAccessCampaigns!)}
              <p>Can Access Campaigns </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(premiumPlan?.canAccessReports!)}
              <p>Can Access Reports </p>
            </div>

            <div className="flex flex-row gap-3 items-center">
              {handleIcons(premiumPlan?.canAccessMultipleLocations!)}
              <p>Can Access Multiple Locations </p>
            </div>
          </div>

          {hasActive === false ? (
            <button
              onClick={(e) => initializeTrnx(3, e)}
            
              className="mt-6 w-64 mx-auto border-1 border-secondary-500 rounded-lg px-8 py-2 font-normal text-sm text-secondary-500 hover:bg-secondary-500 hover:text-white"
            >
              {premiumLoading ? <Spinner size="sm" /> : "Select Plan"}
            </button>
          ) : (
            <button
            onClick={(e) => activePlan()}
              className="mt-6 w-64 mx-auto border-1 border-secondary-500 rounded-lg px-8 py-2 font-normal text-sm text-secondary-500 hover:bg-secondary-500 hover:text-white"
            >
              {premiumLoading ? <Spinner  size="sm" /> : "Select Plan"}
            </button>
          )}
        </div>

        <div className="flex-1 p-4">
          <div className="flex flex-row gap-4">
            <p className="font-extrabold ">Professional Plan</p>

            <button
              disabled
              className="text-[10px] bg-[#EAECF0] px-3 py-1 rounded-sm"
            >
              RECOMMEND
            </button>
          </div>

          <div className="flex flex-row gap-4 mt-6">
            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "Monthly" ? "opacity-100" : "opacity-0"
              }`}
            >
              {activeTab === "Monthly" ? (
                <p className="font-extrabold text-2xl">
                  ₦{professionalPlan?.monthlyFee}{" "}
                  <span className="text-[#ACB5BB] font-normal">/month</span>
                </p>
              ) : null}
            </div>

            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "Yearly" ? "opacity-100" : "opacity-0"
              }`}
            >
              {activeTab === "Yearly" ? (
                <p className="font-extrabold text-2xl">
                  ₦{professionalPlan?.yearlyFee}{" "}
                  <span className="text-[#ACB5BB] font-normal">/year</span>
                </p>
              ) : null}
            </div>
          </div>

          <p className="text-sm mt-4">
            Lorem ipsum dolor sit amet consectetur. Mi aliquam amet velit felis.
          </p>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-secondaryGrey" />
            <span className="mx-4 text-xs text-[#ACB5BB]">
              WHAT YOU WILL GET
            </span>
            <hr className="flex-grow border-t border-secondaryGrey" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(true)}
              <p>Maximum users - {professionalPlan?.maxUsers}</p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(professionalPlan?.canAccessDashboard!)}
              <p>Can Access Dashboard </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(professionalPlan?.canAccessDashboard!)}
              <p>Can Access Dashboard </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(professionalPlan?.canAccessMenu!)}
              <p>Can Access Menu </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(professionalPlan?.canAccessOrders!)}
              <p>Can Access Orders </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(professionalPlan?.canAccessPayments!)}
              <p>Can Access Payments </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(professionalPlan?.canAccessSettings!)}
              <p>Can Access Settings </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(professionalPlan?.canAccessQR!)}
              <p>Can Access QR </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(professionalPlan?.canAccessReservations!)}
              <p>Can Access Reservations </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(professionalPlan?.canAccessNotifications!)}
              <p>Can Access Notifications </p>
            </div>

            <div className="flex flex-row gap-3 items-center">
              {handleIcons(professionalPlan?.canAccessBookings!)}
              <p>Can Access Bookings </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(professionalPlan?.canAccessCampaigns!)}
              <p>Can Access Campaigns </p>
            </div>
            <div className="flex flex-row gap-3 items-center">
              {handleIcons(professionalPlan?.canAccessReports!)}
              <p>Can Access Reports </p>
            </div>

            <div className="flex flex-row gap-3 items-center">
              {handleIcons(professionalPlan?.canAccessMultipleLocations!)}
              <p>Can Access Multiple Locations </p>
            </div>
          </div>

          {hasActive === false ? (
            <button
              onClick={(e) => initializeTrnx(2, e)}
          
              className="mt-6 w-64 mx-auto border-1 border-secondary-500 rounded-lg px-8 py-2 font-normal text-sm text-secondary-500 hover:bg-secondary-500 hover:text-white"
            >
              {professionalLoading ? <Spinner size="sm" /> : "Select Plan"}
            </button>
          ) : (
            <button
            onClick={(e) => activePlan()}
              className="mt-6 w-64 mx-auto border-1 border-secondary-500 rounded-lg px-8 py-2 font-normal text-sm text-secondary-500 hover:bg-secondary-500 hover:text-white"
            >
              {professionalLoading ? <Spinner size="sm"  /> : "Select Plan"}
            </button>
          )}
        </div>
      </div>
      <script src="https://js.paystack.co/v1/inline.js"></script>
    </div>
  );
};
