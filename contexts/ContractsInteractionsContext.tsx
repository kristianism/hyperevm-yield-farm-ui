"use client";

import { useCustomWriteContract } from "@/hooks/contracts-integration/useCustomWriteContract";
import { createContext } from "react";

type TContractsInteractionsContext = {
  writeToMasterchef: ReturnType<
    typeof useCustomWriteContract
  >["writeContractAsync"];
};

const ContractsInteractionsContext =
  createContext<TContractsInteractionsContext>(
    {} as TContractsInteractionsContext
  );

export const ContractsInteractionsContextProvider = ({
  children,
}: {
  children: any;
}) => {
  const { writeContractAsync: writeToMasterchef } =
    useCustomWriteContract("Masterchef");

  return (
    <ContractsInteractionsContext.Provider
      value={{
        writeToMasterchef
      }}
    >
      {children}
    </ContractsInteractionsContext.Provider>
  );
};

export default ContractsInteractionsContext;