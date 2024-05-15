import { z } from 'zod';
import { DASHBOARD } from '../../api-url';
import api, { handleError } from '../../apiService';

const menuItemSchema = z.object({
  itemName: z.string().trim().min(1, 'Item name is required'),
  price: z.number().min(1, 'Price is required'),
  menuID: z.string().trim().min(1, 'Select a menu'),
});
const menuVarietySchema = z.object({
  unit: z.string().trim().min(1, 'Unit is required'),
  price: z.number().min(1, 'Price is required'),
});
export async function getMenu(businessId: string) {
  const headers = businessId ? { businessId } : {};

  try {
    const data = await api.get(DASHBOARD.getMenu, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}

export async function getMenuItem(menuId: string) {
  try {
    const data = await api.get(`${DASHBOARD.menuItem}?itemId=${menuId}`);

    return data;
  } catch (error) {
    handleError(error);
  }
}
export async function uploadFile(businessId: string, formData: FormData) {
  const headers = businessId
    ? { businessId, 'Content-Type': 'multipart/form-data' }
    : {};
  try {
    const data = await api.post(DASHBOARD.uploadFile, formData, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}
export async function deleteFile(businessId: string, referenceId: string) {
  const headers = businessId ? { businessId, referenceId } : {};
  try {
    const data = await api.delete(DASHBOARD.removeFile, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}
export async function uploadFilemultipleMenuItem(
  businessId: string,
  formData: FormData,
  menuId: string
) {
  const headers = businessId
    ? { businessId, menuId, 'Content-Type': 'multipart/form-data' }
    : {};
  try {
    const data = await api.post(DASHBOARD.uploadBulkMenuItem, formData, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}
export async function getMenuByBusiness(businessId: string) {
  const headers = businessId ? { businessId } : {};

  try {
    const data = await api.get(DASHBOARD.getMenuByBusiness, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}

type payloadMenu = {
  name: string;
};
export async function createMenu(businessId: string, payload: payloadMenu) {
  const headers = businessId ? { businessId } : {};

  try {
    const data = await api.post(DASHBOARD.getMenu, payload, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}
export async function createMenuConfiguration(
  businessId: string,
  payload: any
) {
  const headers = businessId ? { businessId } : {};

  try {
    const data = await api.post(DASHBOARD.menuConfiguration, payload, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}
export async function getMenuConfiguration(businessId: string) {
  const headers = businessId ? { businessId } : {};

  try {
    const data = await api.get(DASHBOARD.menuConfiguration, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}

export type payloadMenuItem = {
  menuID: string;
  itemName: string;
  itemDescription: string;
  price: number;
  isAvailable?: boolean;
  imageReference: string;
};
export type payloadMenuVariety = {
  price: number;
  unit: string;
  itemID?: string;
  menuID?: string;

  currency?: string;
};
export async function createMenuItem(
  businessId: string,
  payload: payloadMenuItem
) {
  const validatedFields = menuItemSchema.safeParse({
    itemName: payload?.itemName,
    price: payload?.price,
    menuID: payload.menuID,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const headers = businessId ? { businessId } : {};

  try {
    const data = await api.post(DASHBOARD.menuItem, payload, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}

export async function createMenuVariety(
  businessId: string,
  payload: payloadMenuVariety
) {
  const validatedFields = menuVarietySchema.safeParse({
    price: payload?.price,
    unit: payload?.unit,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const headers = businessId ? { businessId } : {};

  try {
    const data = await api.post(DASHBOARD.menuVariety, payload, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}
export async function editMenuVariety(
  businessId: string,
  payload: payloadMenuVariety,
  varietyId: string
) {
  const validatedFields = menuVarietySchema.safeParse({
    price: payload?.price,
    unit: payload?.unit,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const headers = businessId ? { businessId } : {};

  try {
    const data = await api.put(
      `${DASHBOARD.menuVariety}?itemVarietyId=${varietyId}`,
      payload,
      {
        headers,
      }
    );

    return data;
  } catch (error) {
    handleError(error);
  }
}
export async function deleteMenuItem(businessId: string, itemId: string) {
  const headers = businessId ? { businessId } : {};
  try {
    const data = await api.delete(`${DASHBOARD.menuItem}?itemId=${itemId}`, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
}
export async function deleteVariety(businessId: string, itemId: string) {
  const headers = businessId ? { businessId } : {};
  try {
    const data = await api.delete(
      `${DASHBOARD.menuVariety}?itemVarietyId=${itemId}`,
      {
        headers,
      }
    );

    return data;
  } catch (error) {
    handleError(error);
  }
}
export async function editMenuItem(
  businessId: string,
  payload: payloadMenuItem,
  itemId: string
) {
  const validatedFields = menuItemSchema.safeParse({
    itemName: payload?.itemName,
    price: payload?.price,
    menuID: payload.menuID,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const headers = businessId ? { businessId } : {};

  try {
    const data = await api.put(
      `${DASHBOARD.menuItem}?itemId=${itemId}`,
      payload,
      {
        headers,
      }
    );

    return data;
  } catch (error) {
    handleError(error);
  }
}
