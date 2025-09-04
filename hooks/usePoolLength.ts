import { useCustomReadContract } from "@/hooks/contracts-integration/useCustomReadContract";

export function usePoolLength() {

    const { data: poolLength }: { data: bigint } = useCustomReadContract({
        contractName: "Masterchef",
        functionName: "poolLength"
    });

    return { poolLength };
}