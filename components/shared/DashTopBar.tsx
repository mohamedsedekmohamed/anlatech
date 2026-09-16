"use client";

import React, { ReactNode } from "react";
import { Search, Plus } from "lucide-react";
import DashTitle from "./DashTitle";

export interface FilterButtonProps {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

interface DashboardTopBarProps {
  title?: string;
  subtitle?: string;
  titleAdd?: string;
  onAddClick?: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  hasSearch?: boolean;
  filterButtons?: FilterButtonProps[];
  filterVariant?: "default" | "red";
  customFilterNode?: ReactNode;
  children?: ReactNode;
  headerChildren?: ReactNode;
  headerRightChildren?: ReactNode;
  primaryActionClass?: string;
  searchContainerClass?: string;
}

export default function DashboardTopBar({
  title,
  subtitle,
  titleAdd,
  
  onAddClick,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  hasSearch = true,
  filterButtons = [],
  filterVariant = "default",
  customFilterNode,
  children,
  headerChildren,
  headerRightChildren,
  primaryActionClass = "bg-[#C9070A] hover:bg-red-700 text-white",
  searchContainerClass = "relative flex-1 min-w-[200px] h-[44px]",
}: DashboardTopBarProps) {
  return (
    <div className="w-full flex flex-col mb-4">
      {/* Header */}
      <DashTitle
        title={title}
        subtitle={subtitle}
        titleAdd={titleAdd}
        onAddClick={onAddClick}
        headerChildren={headerChildren}
        primaryActionClass={primaryActionClass}
      >
        {headerRightChildren}
      </DashTitle>

      {/* Search & Actions Container */}
      {(hasSearch || filterButtons.length > 0 || customFilterNode || children) && (
        <div className="flex flex-col items-start px-[20.8px] pt-[20.8px] pb-[0.8px] bg-[rgba(255,255,255,0.85)] border-[0.8px] border-border rounded-[16px] w-full">
          <div className="flex flex-col md:flex-row items-center gap-[16px] w-full mb-[20px] flex-wrap md:flex-nowrap">
          {/* Search Input */}
          {hasSearch && (
            <div className={searchContainerClass}>
              <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground rtl:left-auto rtl:right-[14px]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full h-full pl-[44px] pr-[16px] border-[0.8px] border-border rounded-[14px] bg-card text-[14px] text-foreground placeholder-[rgba(18,18,18,0.5)] outline-none focus:border-[#717171] transition-colors"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}

          {/* Filter Buttons */}
          {filterButtons.length > 0 && (
            <div className="flex items-center gap-[16px] flex-wrap">
              {filterButtons.map((btn, idx) => {
                let activeClass = "";
                let inactiveClass = "";
                let textClass = "";

                if (filterVariant === "red") {
                  activeClass = "bg-[#C9070A] border-[#C9070A] text-white";
                  inactiveClass = "border-border bg-card hover:bg-black/5";
                  textClass = btn.isActive ? "text-white" : "text-muted-foreground";
                } else {
                  activeClass = "border-[#121212] bg-muted";
                  inactiveClass = "border-border hover:bg-black/5";
                  textClass = "text-muted-foreground";
                }

                return (
                  <button 
                    key={idx}
                    onClick={btn.onClick}
                    className={`box-border flex flex-row items-center justify-center px-[16px] py-[10px] gap-[8px] h-[44px] min-w-[120px] border-[0.8px] rounded-[14px] transition-colors whitespace-nowrap ${btn.isActive ? activeClass : inactiveClass}`}
                  >
                    {btn.icon && <span className={`w-[16px] h-[16px] flex items-center justify-center ${textClass}`}>{btn.icon}</span>}
                    <span className={`font-medium text-[14px] leading-[21px] text-center ${textClass}`}>
                      {btn.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Custom Filter Node */}
          {customFilterNode && (
            <div className="flex items-center gap-[16px]">
              {customFilterNode}
            </div>
          )}
        </div>

          {children}
        </div>
      )}
    </div>
  );
}
