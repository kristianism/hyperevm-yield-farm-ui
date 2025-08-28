"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-center">
        <Image
          className="dark:invert animate-ping"
          src="/hl-symbol-mint-green.svg"
          alt="HyperLiquid logo"
          width={180}
          height={38}
          priority
        />
        <Image
          className="dark:invert"
          src="/powered-by-hl.svg"
          alt="Next.js logo"
          width={300}
          height={38}
          priority
        />
        <ul className="font-mono list-inside list-disc text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              HyperEVM Farm: Because Slow Yields Are for Normies.
            </code>
          </li>
          <li className="tracking-[-.01em]">
            Degens don’t wait. Why should you?
          </li>
        </ul>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/dashboard"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/hl-symbol-mint-green.svg"
              alt="Hyperliquid logo"
              width={20}
              height={20}
            />
            Get Hyper
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/dashboard"
            rel="noopener noreferrer"
          >
            Catch the Flow
          </a>
        </div>
      </main>
    </div>
  );
}
