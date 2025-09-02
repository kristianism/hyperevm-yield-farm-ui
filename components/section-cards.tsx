import { IconTrendingDown, IconTrendingUp, IconCoins, IconPool } from "@tabler/icons-react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTokenData } from "@/hooks/use-token-data"
import { useMasterchefData } from "@/hooks/use-masterchef-data"

export function SectionCards() {
  const { totalSupply, tokenName, tokenSymbol, isLoading } = useTokenData();
  const { 
    totalTVL, 
    poolCount, 
    poolDetails,
    isLoading: isLoadingTVL 
  } = useMasterchefData();

  const formatNumber = (supply: string) => {
    const num = parseFloat(supply);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  // Calculate a more meaningful metric for the badge
  const getPoolDiversity = () => {
    if (!poolDetails || poolDetails.length === 0) return "No pools";
    
    const uniqueTokens = new Set(poolDetails.map(pool => pool.tokenSymbol));
    return `${uniqueTokens.size} token types`;
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            {tokenName ? `${tokenName} (${tokenSymbol}) Supply` : "Token Supply"}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading ? (
              <div className="animate-pulse bg-muted h-8 w-32 rounded"></div>
            ) : (
              formatNumber(totalSupply)
            )}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Live token metrics <IconCoins className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Current circulating supply on-chain
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Value Locked (TVL)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoadingTVL ? (
              <div className="animate-pulse bg-muted h-8 w-32 rounded"></div>
            ) : (
              <>
                {formatNumber(totalTVL)}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  tokens
                </span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Across {poolCount} active pools <IconPool className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {getPoolDiversity()} locked in yield farming
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>

    </div>
  )
}
