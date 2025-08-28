"use client"

import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbItem {
  label: string
  href: string
  isActive?: boolean
}

interface RouterBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function RouterBreadcrumb({ items }: RouterBreadcrumbProps) {
  const router = useRouter()

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={item.href} className="flex items-center gap-2.5">
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.isActive ? (
                <span className="font-medium text-foreground">{item.label}</span>
              ) : (
                <BreadcrumbLink
                  className="cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleNavigation(item.href)}
                >
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}