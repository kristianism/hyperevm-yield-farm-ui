import { IconCoins, IconPool, IconCalculator } from "@tabler/icons-react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTokenData } from "@/hooks/useTokenData"
import { usePoolLength } from "@/hooks/usePoolLength"

export function SectionCards() {
  const { parsedTotalSupply, name, symbol, isLoading } = useTokenData();
  const { poolLength } = usePoolLength();

  const isLoadingTVL = false; // Placeholder for TVL loading state
  const totalTVL = "1234567.89"; // Placeholder for total TVL value

  const formatNumber = (supply: string) => {
    const num = parseFloat(supply);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <IconCalculator className="size-6" />
        <h2 className="text-2xl font-bold">HyperYield Statistics</h2>
      </div>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>
              {name ? `${name} (${symbol}) Supply` : "Token Supply"}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {isLoading ? (
                <div className="animate-pulse bg-muted h-8 w-32 rounded"></div>
              ) : (
                formatNumber(parsedTotalSupply)
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
                    US$
                  </span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Across {poolLength} active pools <IconPool className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Current total value locked in all pools
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>My Staked Amount</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {isLoadingTVL ? (
                <div className="animate-pulse bg-muted h-8 w-32 rounded"></div>
              ) : (
                <>
                  {formatNumber(totalTVL)}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    US$
                  </span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Across {poolLength} active pools <IconPool className="size-4" />
            </div>
            <div className="text-muted-foreground">
              My current total value staked in all pools
            </div>
          </CardFooter>
        </Card>

      </div>
    </>
  )
}
