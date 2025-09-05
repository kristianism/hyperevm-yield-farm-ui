import { useMasterchefData } from "@/hooks/useMasterchefData";
import { PoolCard } from "@/components/pool-cards";
import { IconPool } from "@tabler/icons-react";

export function PoolsList() {
  const { poolCount, poolDetails, isLoading } = useMasterchefData();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <IconPool className="size-6" />
          <h2 className="text-2xl font-bold">Yield Farming Pools</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-muted h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (poolCount === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <IconPool className="size-6" />
          <h2 className="text-2xl font-bold">Yield Farming Pools</h2>
        </div>
        <div className="text-center py-12">
          <IconPool className="size-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No pools available</h3>
          <p className="text-muted-foreground">
            Pools will appear here once they are added to the Masterchef contract.
          </p>
        </div>
      </div>
    );
  }

  // Calculate total allocation points for pool share calculation
  const totalAllocPoints = poolDetails?.reduce((sum, pool) => sum + (pool.allocPoint || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconPool className="size-6" />
          <h2 className="text-2xl font-bold">Yield Farming Pools</h2>
        </div>
        <div className="text-lg text-muted-foreground">
          {poolCount} active pool{poolCount !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: poolCount }).map((_, index) => (
          <PoolCard 
            key={index}
            poolId={index}
            allocPoint={poolDetails?.[index]?.allocPoint || 0}
            totalAllocPoints={totalAllocPoints}
          />
        ))}
      </div>
    </div>
  );
}