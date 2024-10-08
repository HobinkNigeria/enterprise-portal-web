import { DASHBOARD } from '../../api-url';
import api, { handleError } from '../../apiService';

export async function getReport(
  businessId: string,
  filterType: number,
  startDate?: string,
  endDate?: string
) {
  const headers = businessId ? { businessId } : {};
  const payload = {
    startDate: startDate,
    endDate: endDate,
    filterType: filterType,
  };

  try {
    const data = await api.post(DASHBOARD.report, payload, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error, false);
  }
}
export async function getReportOrder(
  businessId: string,
  filterType: number,
  startDate?: string,
  endDate?: string,
  reportType?: number,
  emailAddress?: string
) {
  const headers = businessId ? { businessId } : {};
  const payload = {
    startDate: startDate,
    endDate: endDate,
    filterType: filterType,
    reportType: reportType,
    emailAddress: emailAddress,
  };

  try {
    const data = await api.post(DASHBOARD.reportOrder, payload, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error, false);
  }
}
export async function getReportPayment(
  businessId: string,
  filterType: number,
  startDate?: string,
  endDate?: string,
  reportType?: number,
  emailAddress?: string
) {
  const headers = businessId ? { businessId } : {};
  const payload = {
    startDate: startDate,
    endDate: endDate,
    filterType: filterType,
    reportType: reportType,
    emailAddress: emailAddress,
  };

  try {
    const data = await api.post(DASHBOARD.reportPayment, payload, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error, false);
  }
}
export async function getReportBooking(
  businessId: string,
  filterType: number,
  startDate?: string,
  endDate?: string,
  reportType?: number,
  emailAddress?: string
) {
  const headers = businessId ? { businessId } : {};
  const payload = {
    startDate: startDate,
    endDate: endDate,
    filterType: filterType,
    reportType: reportType,
    emailAddress: emailAddress,
  };

  try {
    const data = await api.post(DASHBOARD.reportBooking, payload, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error, false);
  }
}
export async function getReportAuditLog(
  businessId: string,
  filterType: number,
  startDate?: string,
  endDate?: string,
  reportType?: number,
  emailAddress?: string
) {
  const headers = businessId ? { businessId } : {};
  const payload = {
    startDate: startDate,
    endDate: endDate,
    filterType: filterType,
    reportType: reportType,
    emailAddress: emailAddress,
  };

  try {
    const data = await api.post(DASHBOARD.reportAuditLog, payload, {
      headers,
    });

    return data;
  } catch (error) {
    handleError(error, false);
  }
}
