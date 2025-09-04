"use client"

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useBlockNumber } from "wagmi";

/**
 * Invalidates queries on every new block.
 * This will refresh all pool data, balances, rewards, etc.
 */
export default function BlockRefresher() {
  const qc = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  useEffect(() => {
    if (blockNumber == null) return;

    // Invalidate all queries to refresh pool data, balances, rewards
    qc.invalidateQueries();
  }, [blockNumber, qc]);

  return null;
}