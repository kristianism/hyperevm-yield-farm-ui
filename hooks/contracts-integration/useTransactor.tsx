"use client";
import { notification } from "@/components/common/Notification";
import TxnNotification from "@/components/common/TxnNotification";
import { wagmiConfig } from "@/config/wagmiConfig";
import { TransactorFuncOptions } from "@/utils/contracts-types";
import { getParsedError } from "@/utils/getParsedError";
import { getBlockExplorerTxLink } from "@/utils/network";
import { getPublicClient } from "@wagmi/core";
import {
  Hash,
  SendTransactionParameters,
  TransactionReceipt,
  WalletClient,
} from "viem";
import { Config, useWalletClient } from "wagmi";
import { SendTransactionMutate } from "wagmi/query";
// import {
//   getBlockExplorerTxLink,
//   getParsedError,
//   notification,
// } from ;
// import { TransactorFuncOptions } from "~~/utils/scaffold-eth/contract";

type TransactionFunc = ({
  tx,
  options,
  txMessage,
}: {
  tx:
    | (() => Promise<Hash>)
    | Parameters<SendTransactionMutate<Config, undefined>>[0];
  options?: TransactorFuncOptions;
  txMessage?: string;
}) => Promise<Hash | undefined>;

/**
 * Custom notification content for TXs.
 */

/**
 * Runs Transaction passed in to returned function showing UI feedback.
 * @param _walletClient - Optional wallet client to use. If not provided, will use the one from useWalletClient.
 * @returns function that takes in transaction function as callback, shows UI feedback for transaction and returns a promise of the transaction hash
 */
export const useTransactor = (
  _walletClient?: WalletClient
): TransactionFunc => {
  let walletClient = _walletClient;
  const { data } = useWalletClient();
  if (walletClient === undefined && data) {
    walletClient = data;
  }

  const result: TransactionFunc = async ({ tx, options, txMessage }) => {
    if (!walletClient) {
      notification.error("Cannot access account");
      console.error("⚡️ ~ file: useTransactor.tsx ~ error");
      return;
    }

    let notificationId = null;
    let transactionHash: Hash | undefined = undefined;
    let transactionReceipt: TransactionReceipt | undefined;
    let blockExplorerTxURL = "";
    try {
      const network = await walletClient.getChainId();
      // Get full transaction from public client
      const publicClient = getPublicClient(wagmiConfig);

      notificationId = notification.loading(
        <TxnNotification message={txMessage || "Transaction Pending"} />
      );
      if (typeof tx === "function") {
        // Tx is already prepared by the caller
        const result = await tx();
        transactionHash = result;
      } else if (tx != null) {
        transactionHash = await walletClient.sendTransaction(
          tx as SendTransactionParameters
        );
      } else {
        throw new Error("Incorrect transaction passed to transactor");
      }
      notification.remove(notificationId);

      blockExplorerTxURL = network
        ? getBlockExplorerTxLink(network, transactionHash)
        : "";

      notificationId = notification.loading(
        <TxnNotification
          message="Waiting for transaction to complete"
          blockExplorerLink={blockExplorerTxURL}
        />
      );

      transactionReceipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
        confirmations: options?.blockConfirmations,
      });
      notification.remove(notificationId);

      if (transactionReceipt.status === "reverted")
        throw new Error("Transaction reverted");

      notification.success(
        <TxnNotification
          message="Transaction Successful"
          blockExplorerLink={blockExplorerTxURL}
        />
      );

      if (options?.onBlockConfirmation)
        options.onBlockConfirmation(transactionReceipt);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (notificationId) {
        notification.remove(notificationId);
      }
      console.error("⚡️ ~ file: useTransactor.ts ~ error", error);
      const message = getParsedError(error);

      // if receipt was reverted, show notification with block explorer link and return error
      if (transactionReceipt?.status === "reverted") {
        notification.error(
          <TxnNotification
            message={message}
            blockExplorerLink={blockExplorerTxURL}
          />
        );
        throw error;
      }

      notification.error(message);
      throw error;
    }

    return transactionHash;
  };

  return result;
};