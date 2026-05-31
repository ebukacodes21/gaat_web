import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";

type AcceptedMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const apiCall = async <T = any>(
  url: string,
  method: AcceptedMethods,
  data?: any,
  extraConfig?: Partial<AxiosRequestConfig>,
): Promise<T> => {
  try {
    const config: AxiosRequestConfig = {
      url,
      method: method.toUpperCase() as Method,
      ...extraConfig,
    };

    if (method.toUpperCase() === "GET") {
      config.params = data;
    } else {
      config.data = data;
    }

    const res: AxiosResponse<T> = await axios(config);
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "api error";
    console.log(`api call failed [${method}] ${url}:`, message);
    throw error;
  }
};

export const formatErr = (err: any): string => {
  const errorMessage =
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    "Something went wrong. Please try again.";

  return errorMessage;
};

export const fileUploader = async (url: string, formData: FormData) => {
  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;  
  } catch (error) {
    return error;  // Return the error to handle it in the frontend
  }
};

export   const formatCurrency = (val: number) =>
    `₦${val?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;


 