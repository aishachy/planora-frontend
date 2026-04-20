/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "../../lib/utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

/* ---------------- ROOT ---------------- */

type AccordionProps =
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
    collapsible?: boolean // optional, but NOT passed to DOM
  }

function Accordion({ className, collapsible, ...rest }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...rest}
    />
  )
}

/* ---------------- ITEM ---------------- */

function AccordionItem(
  props: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
) {
  const { className, ...rest } = props

  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...rest}
    />
  )
}

/* ---------------- TRIGGER ---------------- */

function AccordionTrigger(
  props: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
) {
  const { className, children, ...rest } = props

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className
        )}
        {...rest}
      >
        {children}

        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden ml-auto size-4 text-muted-foreground"
        />

        <ChevronUpIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline ml-auto size-4 text-muted-foreground"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/* ---------------- CONTENT ---------------- */

function AccordionContent(
  props: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Panel>
) {
  const { className, children, ...rest } = props

  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...rest}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

/* ---------------- EXPORT ---------------- */

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}