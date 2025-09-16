"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { formatEther } from "viem"
import { useReadContract } from "wagmi"

// Presale Contract ABI - Add your actual ABI here
const PRESALE_ABI = [
	{
		inputs: [],
		name: "startTime",
		outputs: [{ type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "endTime",
		outputs: [{ type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "liquidityUnlockTime",
		outputs: [{ type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "presalePrice",
		outputs: [{ type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "listingPrice",
		outputs: [{ type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "liquidityPercentage",
		outputs: [{ type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "tokensRemaining",
		outputs: [{ type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "softCap",
		outputs: [{ type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "hardCap",
		outputs: [{ type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "totalRaised",
		outputs: [{ type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
] as const

const PRESALE_CONTRACT_ADDRESS = "0x..." // Add your presale contract address

export function PresaleCard() {
	const [timeLeft, setTimeLeft] = useState<{
		start?: number
		end?: number
		liquidityUnlock?: number
	}>({})

	// Read contract data
	const { data: startTime } = useReadContract({
		address: PRESALE_CONTRACT_ADDRESS,
		abi: PRESALE_ABI,
		functionName: "startTime",
	})

	const { data: endTime } = useReadContract({
		address: PRESALE_CONTRACT_ADDRESS,
		abi: PRESALE_ABI,
		functionName: "endTime",
	})

	const { data: liquidityUnlockTime } = useReadContract({
		address: PRESALE_CONTRACT_ADDRESS,
		abi: PRESALE_ABI,
		functionName: "liquidityUnlockTime",
	})

	const { data: presalePrice } = useReadContract({
		address: PRESALE_CONTRACT_ADDRESS,
		abi: PRESALE_ABI,
		functionName: "presalePrice",
	})

	const { data: listingPrice } = useReadContract({
		address: PRESALE_CONTRACT_ADDRESS,
		abi: PRESALE_ABI,
		functionName: "listingPrice",
	})

	const { data: liquidityPercentage } = useReadContract({
		address: PRESALE_CONTRACT_ADDRESS,
		abi: PRESALE_ABI,
		functionName: "liquidityPercentage",
	})

	const { data: tokensRemaining } = useReadContract({
		address: PRESALE_CONTRACT_ADDRESS,
		abi: PRESALE_ABI,
		functionName: "tokensRemaining",
	})

	const { data: softCap } = useReadContract({
		address: PRESALE_CONTRACT_ADDRESS,
		abi: PRESALE_ABI,
		functionName: "softCap",
	})

	const { data: hardCap } = useReadContract({
		address: PRESALE_CONTRACT_ADDRESS,
		abi: PRESALE_ABI,
		functionName: "hardCap",
	})

	const { data: totalRaised } = useReadContract({
		address: PRESALE_CONTRACT_ADDRESS,
		abi: PRESALE_ABI,
		functionName: "totalRaised",
	})

	// Timer logic
	useEffect(() => {
		const updateTimers = () => {
			const now = Math.floor(Date.now() / 1000)

			setTimeLeft({
				start: startTime ? Math.max(0, Number(startTime) - now) : 0,
				end: endTime ? Math.max(0, Number(endTime) - now) : 0,
				liquidityUnlock: liquidityUnlockTime
					? Math.max(0, Number(liquidityUnlockTime) - now)
					: 0,
			})
		}

		updateTimers()
		const interval = setInterval(updateTimers, 1000)
		return () => clearInterval(interval)
	}, [startTime, endTime, liquidityUnlockTime])

	const formatTime = (seconds: number) => {
		const days = Math.floor(seconds / 86400)
		const hours = Math.floor((seconds % 86400) / 3600)
		const mins = Math.floor((seconds % 3600) / 60)
		const secs = seconds % 60

		if (days > 0) return `${days}d ${hours}h ${mins}m ${secs}s`
		if (hours > 0) return `${hours}h ${mins}m ${secs}s`
		if (mins > 0) return `${mins}m ${secs}s`
		return `${secs}s`
	}

	const getPresaleStatus = () => {
		const now = Math.floor(Date.now() / 1000)
		if (startTime && now < Number(startTime)) return "upcoming"
		if (endTime && now < Number(endTime)) return "active"
		return "ended"
	}

	const progressPercentage =
		hardCap && totalRaised
			? (Number(totalRaised) / Number(hardCap)) * 100
			: 0

	const status = getPresaleStatus()

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-2xl font-bold">HyperYield Presale</CardTitle>
				<Badge
					variant={
						status === "active"
							? "default"
							: status === "upcoming"
							? "secondary"
							: "destructive"
					}
					className="text-xs"
				>
					{status === "active"
						? "Live"
						: status === "upcoming"
						? "Upcoming"
						: "Ended"}
				</Badge>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Timers Section */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="text-center p-3 bg-muted rounded-lg">
						<div className="text-xs text-muted-foreground mb-1">
							{status === "upcoming" ? "Starts In" : "Started"}
						</div>
						<div className="font-mono text-sm font-semibold">
							{status === "upcoming" && timeLeft.start
								? formatTime(timeLeft.start)
								: "Started"}
						</div>
					</div>
					<div className="text-center p-3 bg-muted rounded-lg">
						<div className="text-xs text-muted-foreground mb-1">
							{status === "active" ? "Ends In" : "Ended"}
						</div>
						<div className="font-mono text-sm font-semibold">
							{status === "active" && timeLeft.end
								? formatTime(timeLeft.end)
								: "Ended"}
						</div>
					</div>
					<div className="text-center p-3 bg-muted rounded-lg">
						<div className="text-xs text-muted-foreground mb-1">
							Liquidity Unlock
						</div>
						<div className="font-mono text-sm font-semibold">
							{timeLeft.liquidityUnlock
								? formatTime(timeLeft.liquidityUnlock)
								: "Unlocked"}
						</div>
					</div>
				</div>

				{/* Progress Bar */}
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span>Progress ({progressPercentage.toFixed(1)}%)</span>
						<span>
							{totalRaised
								? formatEther(totalRaised)
								: "0"}{" "}
							/{" "}
							{hardCap ? formatEther(hardCap) : "0"} HYPE
						</span>
					</div>
					<Progress value={progressPercentage} className="h-3" />
				</div>

				{/* Presale Details */}
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-3">
						<div>
							<div className="text-xs text-muted-foreground">
								Presale Price
							</div>
							<div className="font-semibold">
								{presalePrice
									? `${formatEther(presalePrice)} HYPE`
									: "Loading..."}
							</div>
						</div>
						<div>
							<div className="text-xs text-muted-foreground">
								Listing Price
							</div>
							<div className="font-semibold">
								{listingPrice
									? `${formatEther(listingPrice)} HYPE`
									: "Loading..."}
							</div>
						</div>
						<div>
							<div className="text-xs text-muted-foreground">
								Liquidity %
							</div>
							<div className="font-semibold">
								{liquidityPercentage
									? `${liquidityPercentage}%`
									: "Loading..."}
							</div>
						</div>
					</div>
					<div className="space-y-3">
						<div>
							<div className="text-xs text-muted-foreground">
								Tokens Remaining
							</div>
							<div className="font-semibold">
								{tokensRemaining
									? formatEther(tokensRemaining)
									: "Loading..."}
							</div>
						</div>
						<div>
							<div className="text-xs text-muted-foreground">Soft Cap</div>
							<div className="font-semibold">
								{softCap
									? `${formatEther(softCap)} HYPE`
									: "Loading..."}
							</div>
						</div>
						<div>
							<div className="text-xs text-muted-foreground">Hard Cap</div>
							<div className="font-semibold">
								{hardCap
									? `${formatEther(hardCap)} HYPE`
									: "Loading..."}
							</div>
						</div>
					</div>
				</div>

				{/* Action Button */}
				<Button
					className="w-full"
					disabled={status !== "active"}
					size="lg"
				>
					{status === "upcoming"
						? "Presale Not Started"
						: status === "active"
						? "Participate in Presale"
						: "Presale Ended"}
				</Button>
			</CardContent>
		</Card>
	)
}
