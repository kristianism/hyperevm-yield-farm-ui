import { useState } from "react";
import { IconCoins, IconTrendingUp, IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePoolInteractions } from "@/hooks/usePoolInteractions";
import { toast } from "sonner";

interface PoolCardProps {
  poolId: number;
  allocPoint: number;
  totalAllocPoints: number;
}

export function PoolCard({ poolId, allocPoint, totalAllocPoints }: PoolCardProps) {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    poolInfo,
    approve,
    deposit,
    withdraw,
    harvest,
    needsApproval,
    isLoading: isLoadingData,
  } = usePoolInteractions(poolId);

  const poolShare = totalAllocPoints > 0 ? ((allocPoint / totalAllocPoints) * 100).toFixed(1) : "0";

  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      await approve(depositAmount);
      toast.success("Token approved successfully!");
    } catch (error) {
      toast.error("Failed to approve token");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount) {
      toast.error("Please enter deposit amount");
      return;
    }

    try {
      setIsLoading(true);
      
      if (needsApproval(depositAmount)) {
        await approve(depositAmount);
        toast.success("Token approved! Now depositing...");
      }
      
      await deposit(depositAmount);
      toast.success("Deposit successful!");
      setDepositAmount("");
    } catch (error) {
      toast.error("Failed to deposit");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) {
      toast.error("Please enter withdraw amount");
      return;
    }

    try {
      setIsLoading(true);
      await withdraw(withdrawAmount);
      toast.success("Withdrawal successful!");
      setWithdrawAmount("");
    } catch (error) {
      toast.error("Failed to withdraw");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHarvest = async () => {
    try {
      setIsLoading(true);
      await harvest();
      toast.success("Rewards harvested!");
    } catch (error) {
      toast.error("Failed to harvest rewards");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse bg-muted h-6 w-32 rounded"></div>
          <div className="animate-pulse bg-muted h-4 w-48 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted h-20 w-full rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <IconCoins className="size-5" />
            {poolInfo.tokenSymbol} Pool
          </span>
          <Badge variant="outline">
            <IconTrendingUp className="size-3 mr-1" />
            {poolShare}% APR
          </Badge>
          <Badge variant="outline">
            <IconTrendingUp className="size-3 mr-1" />
            {poolShare}% allocation
          </Badge>
        </CardTitle>
        <CardDescription>
          Pool #{poolId} • Stake {poolInfo.tokenSymbol} tokens to earn rewards
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Pool Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Your Staked</p>
            <p className="font-medium">{formatNumber(poolInfo.userStakedAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Your Balance</p>
            <p className="font-medium">{formatNumber(poolInfo.userBalance)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Pending Rewards</p>
            <p className="font-medium text-green-600">{formatNumber(poolInfo.pendingRewards)}</p>
          </div>
        </div>

        {/* Harvest Rewards */}
        {parseFloat(poolInfo.pendingRewards) > 0 && (
          <Button 
            onClick={handleHarvest} 
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            <IconCoins className="size-4 mr-2" />
            Harvest {formatNumber(poolInfo.pendingRewards)} Rewards
          </Button>
        )}

        {/* Deposit Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Deposit Amount</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              disabled={isLoading}
            />
            <Button
              variant="outline"
              onClick={() => setDepositAmount(poolInfo.userBalance)}
              disabled={isLoading || parseFloat(poolInfo.userBalance) === 0}
            >
              Max
            </Button>
          </div>
          
          {depositAmount && needsApproval(depositAmount) ? (
            <Button 
              onClick={handleApprove} 
              disabled={isLoading}
              className="w-full"
            >
              Approve {poolInfo.tokenSymbol}
            </Button>
          ) : (
            <Button 
              onClick={handleDeposit} 
              disabled={isLoading || !depositAmount || parseFloat(depositAmount) === 0}
              className="w-full"
            >
              <IconArrowDown className="size-4 mr-2" />
              Deposit
            </Button>
          )}
        </div>

        {/* Withdraw Section */}
        {parseFloat(poolInfo.userStakedAmount) > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Withdraw Amount</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.0"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                disabled={isLoading}
              />
              <Button
                variant="outline"
                onClick={() => setWithdrawAmount(poolInfo.userStakedAmount)}
                disabled={isLoading}
              >
                Max
              </Button>
            </div>
            <Button 
              onClick={handleWithdraw} 
              disabled={isLoading || !withdrawAmount || parseFloat(withdrawAmount) === 0}
              variant="outline"
              className="w-full"
            >
              <IconArrowUp className="size-4 mr-2" />
              Withdraw
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}