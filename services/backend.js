import { BASE_URI } from "@/constants/constant";
import {
    FrappeProvider as SDKProvider,
    useFrappeAuth,
    useFrappeCall,
    useFrappeCreateDoc,
    useFrappeGetDoc,
    useFrappeGetDocCount,
    useFrappeGetDocList,
} from "frappe-react-sdk";
import React, { createContext, useContext } from "react";
import { AuthContext } from "./auth";

const FrappeContext = createContext(null);

const FrappeProvider = ({ children }) => {

  const { accessToken } = useContext(AuthContext)
  return (
    <SDKProvider
      url={BASE_URI}
      tokenParams={{
        useToken: true,
        type: "bearer",
        token: () => accessToken,
      }}
    >
      <FrappeContext.Provider
        value={{
          useCall: useFrappeCall,
          useGetDoc: useFrappeGetDoc,
          useGetDocList: useFrappeGetDocList,
          useAuth: useFrappeAuth,
          useCount: useFrappeGetDocCount,
          useCreate: useFrappeCreateDoc,
        }}
      >
        {children}
      </FrappeContext.Provider>
    </SDKProvider>
  );
};

export const useFrappe = () => {
  const frappe = useContext(FrappeContext);
  return frappe;
};

export { FrappeContext, FrappeProvider };

