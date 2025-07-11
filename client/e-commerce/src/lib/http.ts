type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
  params?: Record<string, any>;
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

  const baseUrl =
    options?.baseUrl === undefined
      ? "http://localhost:8080/ecommerce"
      : options.baseUrl;

  let fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

  if (options?.params) {
    const searchParams = new URLSearchParams();

    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value));
    });

    const queryString = searchParams.toString();

    if (queryString) fullUrl += `?${queryString}`;
  }

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
