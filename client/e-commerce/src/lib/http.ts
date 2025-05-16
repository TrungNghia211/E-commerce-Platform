type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

export class HttpError extends Error {
  status: number;
  payload: any;

  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

class SessionToken {
  private token = "";

  get value() {
    return this.token;
  }

  set value(token: string) {
    // Invoke this method in server will throw Error
    if (typeof window === "undefined")
      throw new Error("Cannot set token on server side");
    this.token = token;
  }
}

export const clientSessionToken = new SessionToken();

const request = async <Response>(
  method: "GET" | "PUT" | "POST" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  const isFormData = options?.body instanceof FormData;

  const baseHeaders = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Authorization: clientSessionToken.value
      ? `Bearer ${clientSessionToken.value}`
      : "",
  };
  const body =
    options?.body instanceof FormData
      ? options.body
      : JSON.stringify(options?.body);
  console.log(options?.body);

  const baseUrl =
    options?.baseUrl === undefined
      ? "http://localhost:8080/ecommerce"
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });

  const payload: Response = await res.json();
  console.log("payload: ", payload);

  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) throw new HttpError(data);

  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },

  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },

  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },

  delete<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;

// utils/http.ts

// export type CustomOptions = Omit<RequestInit, "method"> & {
//   baseUrl?: string;
//   isFormData?: boolean;
// };

// export class HttpError extends Error {
//   status: number;
//   payload: any;

//   constructor({ status, payload }: { status: number; payload: any }) {
//     super("Http Error");
//     this.status = status;
//     this.payload = payload;
//   }
// }

// class SessionToken {
//   private token = "";

//   get value() {
//     return this.token;
//   }

//   set value(token: string) {
//     if (typeof window === "undefined")
//       throw new Error("Cannot set token on server side");
//     this.token = token;
//   }
// }

// export const clientSessionToken = new SessionToken();

// const request = async <Response>(
//   method: "GET" | "POST" | "PUT" | "DELETE",
//   url: string,
//   options: CustomOptions = {}
// ) => {
//   const {
//     isFormData = false,
//     baseUrl = "http://localhost:8080/ecommerce",
//     body,
//     ...rest
//   } = options;

//   const headers: HeadersInit = {
//     ...(isFormData ? {} : { "Content-Type": "application/json" }),
//     Authorization: clientSessionToken.value
//       ? `Bearer ${clientSessionToken.value}`
//       : "",
//     ...options.headers,
//   };
//   console.log("Kiểm tra Header: ", headers);

//   const fullUrl = url.startsWith("/")
//     ? `${baseUrl}${url}`
//     : `${baseUrl}/${url}`;

//   const res = await fetch(fullUrl, {
//     method,
//     headers,
//     ...rest,
//     body: isFormData ? (body as FormData) : JSON.stringify(body),
//   });

//   const payload = await res.json();

//   if (!res.ok) {
//     throw new HttpError({ status: res.status, payload });
//   }

//   return { status: res.status, payload: payload as Response };
// };

// const http = {
//   get<Response>(url: string, options?: Omit<CustomOptions, "body">) {
//     return request<Response>("GET", url, options);
//   },

//   post<Response>(
//     url: string,
//     body: any,
//     options?: Omit<CustomOptions, "body">
//   ) {
//     return request<Response>("POST", url, { ...options, body });
//   },

//   put<Response>(url: string, body: any, options?: Omit<CustomOptions, "body">) {
//     return request<Response>("PUT", url, { ...options, body });
//   },

//   delete<Response>(
//     url: string,
//     body?: any,
//     options?: Omit<CustomOptions, "body">
//   ) {
//     return request<Response>("DELETE", url, { ...options, body });
//   },
// };

// export default http;
