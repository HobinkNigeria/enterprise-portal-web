// 'use client';
// import { getMenuByBusiness } from '@/app/api/controllers/dashboard/menu';
// import { getJsonItemFromLocalStorage } from '@/lib/utils';
// import { useQuery } from 'react-query';

// type MenuData = {
//   name: string;
//   items: Array<{
//     menuID: string;
//     menuName: string;
//     itemName: string;
//     itemDescription: string;
//     price: number;
//     currency: string;
//     isAvailable: boolean;
//     hasVariety: boolean;
//     image: string;
//     varieties: null | any;
//   }>;
// };

// const useMenu = () => {
//   const businessInformation = getJsonItemFromLocalStorage('business');

//   const getAllMenus = async () => {
//     const responseData = await getMenuByBusiness(
//       businessInformation[0]?.businessId
//     );
//     return responseData?.data?.data as MenuData[];
//   };

//   const { data, isLoading, isError, refetch } = useQuery<MenuData[]>(
//     'menus',
//     getAllMenus,
//     {
//       staleTime: 1000 * 60 * 1,
//     }
//   );

//   return { data, isLoading, isError, refetch };
// };

// export default useMenu;
'use client';
import { getMenuByBusiness } from '@/app/api/controllers/dashboard/menu';
import { getJsonItemFromLocalStorage } from '@/lib/utils';
import { useQuery } from 'react-query';
import { useGlobalContext } from '../globalProvider';

type MenuData = {
  name: string;
  items: Array<{
    menuID: string;
    menuName: string;
    itemName: string;
    itemDescription: string;
    price: number;
    currency: string;
    isAvailable: boolean;
    hasVariety: boolean;
    image: string;
    varieties: null | any;
  }>;
};

const useMenu = () => {
  const { page, rowsPerPage, menuIdTable } = useGlobalContext();
  const businessInformation = getJsonItemFromLocalStorage('business');

  const getAllMenus = async ({ queryKey }) => {
    const [_key, { page, rowsPerPage, menuIdTable }] = queryKey;
    const responseData = await getMenuByBusiness(
      businessInformation[0]?.businessId,
      page,
      rowsPerPage,
      menuIdTable
    );

    return responseData?.data?.data as MenuData[];
  };

  const { data, isLoading, isError, refetch } = useQuery<MenuData[]>(
    ['menus', { page, rowsPerPage, menuIdTable }],
    getAllMenus,
    {
      staleTime: 1000 * 60 * 1,
      keepPreviousData: true,
    }
  );

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export default useMenu;
