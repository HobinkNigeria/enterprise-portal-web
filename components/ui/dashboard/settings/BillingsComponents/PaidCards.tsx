import React, { useEffect, useState } from "react";
import mastercardLogo from "../../../../../public/assets/images/mastercard-logo.svg";
import Image from "next/image";
import visa from "../../../../../public/assets/images/visa.png";
import verve from "../../../../../public/assets/images/verve.png";
import { PaidCardsData } from "./Interfaces";
import { capitalizeFirstLetterOfEachWord, getJsonItemFromLocalStorage } from "@/lib/utils";
import useManageSubscription from "@/hooks/cachedEndpoints/useManageSubscription";
import { manageSubscription, manageSubscriptionv2 } from "@/app/api/controllers/dashboard/settings";

export const PaidCards: React.FC<PaidCardsData> = ({
  cardDetails,
  currentSubscriptionDetails,
}) => {
  const userInformation = getJsonItemFromLocalStorage("userInformation");
  const businessID = userInformation?.businesses[0]?.businessId;

  const [manageSubUrl, setManageSubUrl] =useState(null)
  
  //* HANDLE TYPES
  const TYPE_OF_CARD = {
    VISA: <Image alt="Visa" src={visa} height={40} layout="intrinsic" />,
    VERVE: <Image alt="Verve" src={verve} layout="intrinsic" />,
    MASTERCARD: (
      <Image alt="Mastercard" src={mastercardLogo} layout="intrinsic" />
    ),
  };

  const TYPE_OF_PLAN = {
    1: "Premium",
    2: "Professional",
    3: "Starter",
  };

  //* SET VALUES
  let image;
  let plan;

  const cardBrand = cardDetails?.brand?.toUpperCase();
  const planType = currentSubscriptionDetails?.plan;

  image =
    cardBrand === "VISA"
      ? TYPE_OF_CARD.VISA
      : cardBrand === "VERVE"
      ? TYPE_OF_CARD.VERVE
      : TYPE_OF_CARD.MASTERCARD;

  plan =
    planType === 1
      ? TYPE_OF_PLAN[1]
      : planType === 2
      ? TYPE_OF_PLAN[2]
      : TYPE_OF_PLAN[3];

  const nextPayment =
    currentSubscriptionDetails?.nextPaymentDate?.split("T")[0];
  const isActive = currentSubscriptionDetails?.isActive ? "Active" : "False";


  //*================== MANAGE SUBSCRIPTION ==================






  
  const manageYourSubscription = async () => {
    const token = getJsonItemFromLocalStorage("userInformation").token;
    const data =  await manageSubscriptionv2(businessID, token)
    if(data !== null){

      setManageSubUrl(data)
    }
    
  }

useEffect(() => {
  console.log('manage', manageSubUrl)

 

}, [manageSubUrl])







  //*================== MANAGE SUBSCRIPTION ==================
  return (
    <div>
      <div className="flex gap-4">
        <div className="border border-secondaryGrey w-full rounded-lg my-6 px-4 py-6">
          <div>
            <div className="flex flex-row my-2 w-full justify-between">
              <div>{image}</div>
              <button className="px-4 py-1.5 border-1 font-bold border-secondary-500 text-secondary-500 rounded-lg">
                Edit
              </button>
            </div>
            <div className="flex flex-row space-x-4">
              <h2 className="text-lg font-bold">
                {capitalizeFirstLetterOfEachWord(cardDetails?.brand!)} ending in{" "}
                {cardDetails?.last4}
              </h2>
              <div className="px-3 border-2 border-cyan text-cyan rounded-full">
                Default
              </div>
            </div>
            <p className="text-base my-1 font-medium">
              Expiry {cardDetails?.exp_Month}/{cardDetails?.exp_Year}
            </p>
          </div>
        </div>
        <div className="border border-secondaryGrey w-full rounded-lg my-6">
          <div className="p-4 px-6 border-b border-secondaryGrey">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">{plan} plan</h2>
              <div className="px-3 py-0 border-2 border-cyan text-cyan rounded-full">
                {isActive}
              </div>
            </div>
            <p className="text-base my-1 font-medium">
              Next payment date{" "}
              <span className="font-normal">{nextPayment}</span>
            </p>
          </div>
          <div className="p-4 flex justify-center items-center">
            <button 
              onClick={() => manageYourSubscription()}
            className="border-2 border-secondary-500 rounded-lg px-6 py-2 font-bold text-secondary-500 hover:bg-secondary-500 hover:text-white">
              Manage subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
