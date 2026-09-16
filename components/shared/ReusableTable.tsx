"use client";

import React, { useState, useMemo, useRef, useEffect, ReactNode } from "react";
import { Pencil, Trash2, Search, ChevronLeft, ChevronRight, ChevronDown, Filter, Ban, CheckCircle, FileEdit, Eye } from "lucide-react";
import TruncatedText from "./TruncatedText";
import DashTopBar from "./DashTopBar";
import ConfirmDelete from "@/components/shared/ConfirmDelete";

import { useTranslations } from "next-intl";

// --- Types & Interfaces ---
export interface TableColumn<T> {
  key: keyof T;
  header: string;
  filterable?: boolean;
  filterType?: "text" | "select" ;
  render?: (value: any, row: T) => ReactNode;
}

interface SearchableSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  t: any;
}

interface ReusableTableProps<T> {
  title?: string;
  columns: TableColumn<T>[];
  data: T[];
  subtitle?: string;
  onAddClick?: () => void;
  titleAdd?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  extraActions?: (row: T) => ReactNode;
  showStatusInActions?: boolean;
  onToggleStatus?: (row: T) => void;
  statusKey?: keyof T;
  children?: ReactNode;
  rowsPerPage?: number;
  isLoading?: boolean;
  
  // Server-side Pagination & Search Props
  isServerSide?: boolean;
  serverTotalPages?: number;
  serverTotalItems?: number;
  serverCurrentPage?: number;
  onServerPageChange?: (page: number) => void;
  onServerSearchChange?: (search: string) => void;
  headerRightChildren?: ReactNode;
  customFilterButtons?: any[];
  filterVariant?: "default" | "red";
  searchContainerClass?: string;

  // Multi-Select & Bulk Actions Props
  enableMultiSelect?: boolean;
  onMultiDelete?: (selectedIds: number[]) => void;
  onMultiread?: (selectedIds: number[]) => void;
  idKey?: keyof T;
  hasSearch?: boolean;
  showIndex?: boolean;
}

// --- Custom Searchable Select Component ---
const SearchableSelect: React.FC<SearchableSelectProps> = ({ value, onChange, options, placeholder, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    String(opt).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative w-full ${isOpen ? "z-50" : "z-10"}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-2 border border-border rounded-lg bg-card text-foreground text-sm outline-none focus:ring-1 focus:ring-one cursor-pointer transition-colors"
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 bg-card border border-border rounded-lg shadow-xl overflow-hidden rtl:right-auto rtl:left-0">
          <div className="p-2 border-b border-border bg-muted/30">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 opacity-40 w-3 h-3 rtl:left-auto rtl:right-2" />
              <input
                type="text"
                placeholder={t('searchOptions')}
                className="w-full p-1.5 pl-7 text-xs border border-border rounded bg-background text-foreground outline-none focus:border-one focus:ring-1 focus:ring-one"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <ul className="py-1 overflow-y-auto max-h-48 custom-scrollbar bg-card">
            <li
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-one/10 transition-colors ${!value ? "bg-one/5 text-one font-bold" : ""}`}
              onClick={() => {
                onChange("");
                setIsOpen(false);
                setSearchQuery("");
              }}
            >
              {t('all')}
            </li>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((val, idx) => (
                <li
                  key={idx}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-one/10 transition-colors ${value === val ? "bg-one/5 text-one font-bold" : ""}`}
                  onClick={() => {
                    onChange(val);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                >
                  {val}
                </li>
              ))
            ) : (
              <li className="px-3 py-4 text-xs text-center text-muted-foreground italic">
                {t('noResults')}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// --- Main Table Component ---
function ReusableTable<T extends Record<string, any>>({
  title,
  columns,
  data = [],
  subtitle,
  onAddClick,
  titleAdd,
  onEdit,
  onDelete,
  extraActions,
  showStatusInActions = false,
  onToggleStatus,
  statusKey = "status" as keyof T,
  children,
  rowsPerPage = 15,
  isServerSide = false,
  serverTotalPages = 1,
  serverTotalItems = 0,
  serverCurrentPage = 1,
  onServerPageChange,
  onServerSearchChange,
  headerRightChildren,
  customFilterButtons,
  filterVariant = "default",
  searchContainerClass,
  enableMultiSelect = false,
  onMultiDelete,
  onMultiread,
  idKey = "id" as keyof T,
  hasSearch = true,
  showIndex = true,
  isLoading = false,
}: ReusableTableProps<T>) {
  const t = useTranslations('admin.table');
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showMultiDeleteModal, setShowMultiDeleteModal] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const handleColumnFilterChange = (key: keyof T, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [key as string]: value }));
    setCurrentPage(1);
  };

  const getUniqueValues = (key: keyof T) => {
    const values = data.map((item) => String(item[key] || "").trim()).filter(Boolean);
    return Array.from(new Set(values));
  };

  const filteredData = useMemo(() => {
    if (isServerSide) return data;
    
    return data.filter((row) => {
      const matchesGlobalSearch = columns.some((col) =>
        String(row[col.key] || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesColumnFilters = columns.every((col) => {
        const filterKey = col.key as string;
        if (!col.filterable || !columnFilters[filterKey]) return true;
        const cellValue = String(row[col.key] || "").toLowerCase();
        const filterValue = columnFilters[filterKey].toLowerCase();
        if (col.filterType === "select") return cellValue === filterValue;
        return cellValue.includes(filterValue);
      });
      return matchesGlobalSearch && matchesColumnFilters;
    });
  }, [data, columns, searchTerm, columnFilters, isServerSide]);

  const actualData = isServerSide ? data : filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const actualTotalPages = isServerSide ? serverTotalPages : Math.ceil(filteredData.length / rowsPerPage);
  const actualCurrentPage = isServerSide ? serverCurrentPage : currentPage;
  const actualTotalItems = isServerSide ? serverTotalItems : filteredData.length;

  const hasFilters = columns.some((col) => col.filterable);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (isServerSide && onServerSearchChange) {
      onServerSearchChange(val);
    } else {
      setCurrentPage(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(actualTotalPages, newPage));
    if (isServerSide && onServerPageChange) {
      onServerPageChange(validPage);
    } else {
      setCurrentPage(validPage);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentPageIds = actualData.map((row) => Number(row[idKey]));
    if (e.target.checked) {
      setSelectedIds((prev) => {
        const newSelected = [...prev];
        currentPageIds.forEach((id) => {
          if (!newSelected.includes(id)) newSelected.push(id);
        });
        return newSelected;
      });
    } else {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRowClick = (e: React.MouseEvent, id: number) => {
    if (!enableMultiSelect) return;
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest("input")) {
      return;
    }
    handleSelectRow(id);
  };

  const handleBulkRead = async () => {
    if (!onMultiread || selectedIds.length === 0) return;
    try {
      setIsReading(true);
      await onMultiread(selectedIds);
      setSelectedIds([]);
    } catch (error) {
      console.error("Failed to mark items as read:", error);
    } finally {
      setIsReading(false);
    }
  };

  const BulkActionsButtons = enableMultiSelect && selectedIds.length > 0 ? (
    <div className="flex items-center gap-2">
      {onMultiread && (
        <button
          onClick={handleBulkRead}
          disabled={isReading}
          className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-colors rounded-[12px] text-[14px] font-medium flex items-center gap-2"
        >
          <Eye className="w-4 h-4" /> {t('markRead', { count: selectedIds.length })}
        </button>
      )}
      {onMultiDelete && (
        <button
          onClick={() => setShowMultiDeleteModal(true)}
          className="px-4 py-2 bg-[#FCE6E6] text-primary hover:bg-red-200 transition-colors rounded-[12px] text-[14px] font-medium flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> {t('deleteSelected', { count: selectedIds.length })}
        </button>
      )}
    </div>
  ) : null;

  return (
    <div className="w-full space-y-4 p-4 bg-transparent text-start">
      <DashTopBar
        subtitle={subtitle}
        title={title}
        titleAdd={titleAdd}
        onAddClick={onAddClick}
        headerChildren={children}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder={t('searchPlaceholder')}
        hasSearch={hasSearch}
        primaryActionClass="bg-[#121212] hover:bg-overlay-black/50 text-white"
        headerRightChildren={
          <>
            {BulkActionsButtons}
            {headerRightChildren}
          </>
        }
        filterVariant={filterVariant}
        searchContainerClass={searchContainerClass}
        filterButtons={
          customFilterButtons
            ? customFilterButtons
            : hasFilters
            ? [
                {
                  label: t('filterByStatus'),
                  isActive: showFilters,
                  onClick: () => setShowFilters(!showFilters),
                  icon: <Filter className="w-[16px] h-[16px] text-white" strokeWidth={1.33} />,
                },
              ]
            : []
        }
      >
        {hasFilters && showFilters && (
          <div className="w-full pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {columns
                .filter((col) => col.filterable)
                .map((col, index) => (
                  <div key={index} className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-white uppercase tracking-[0.6px]">
                      {col.header}
                    </label>
                    {col.filterType === "select" ? (
                      <SearchableSelect
                        value={columnFilters[col.key as string] || ""}
                        onChange={(val) => handleColumnFilterChange(col.key, val)}
                        options={getUniqueValues(col.key)}
                        placeholder={t('all')}
                        t={t}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder={`${t('searchPlaceholder')} ${col.header}...`}
                        className="w-full p-2 h-[44px] border-[0.8px] border-secondary-border rounded-[14px] bg-background text-[14px] text-foreground outline-none focus:border-[#717171] transition-colors"
                        value={columnFilters[col.key as string] || ""}
                        onChange={(e) => handleColumnFilterChange(col.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </DashTopBar>

      <div className="flex flex-col border-[0.8px] border-secondary-border rounded-[16px] bg-background/85 mt-4">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-primary text-white border-b-[0.8px] border-secondary-border h-[64px]">
                {enableMultiSelect && (
                  <th className="px-6 py-4 w-12 text-center align-middle">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-white focus:ring-primary cursor-pointer"
                      checked={actualData.length > 0 && actualData.every(row => selectedIds.includes(Number(row[idKey])))}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                {showIndex && (
                  <th className="px-6 py-4 font-semibold text-[12px] leading-[16px] tracking-[0.6px] uppercase text-white align-middle whitespace-nowrap text-start">
                    #
                  </th>
                )}
                {columns.map((col, index) => (
                  <th key={index} className="px-6 py-4 font-semibold text-[12px] leading-[16px] tracking-[0.6px] uppercase text-white align-middle whitespace-nowrap text-start">
                    {col.header}
                  </th>
                ))}
                {(onEdit || onDelete || extraActions || showStatusInActions) && (
                  <th className="px-6 py-4 font-semibold text-[12px] leading-[16px] tracking-[0.6px] uppercase text-white align-middle whitespace-nowrap text-center">
                    {t('actions')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + (showIndex ? 1 : 0) + (onEdit || onDelete || extraActions || showStatusInActions ? 1 : 0) + (enableMultiSelect ? 1 : 0)} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-4 border-[#C9070A]/20 border-t-[#C9070A] rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : actualData.length > 0 ? (
                actualData.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className={`border-b-[0.8px] border-secondary-border last:border-0 hover:bg-black/5 transition-colors ${enableMultiSelect ? "cursor-pointer" : ""}`}
                    onClick={(e) => handleRowClick(e, Number(row[idKey]))}
                  >
                    {enableMultiSelect && (
                      <td className="px-6 py-6 w-12 text-center align-middle">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                          checked={selectedIds.includes(Number(row[idKey]))}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(Number(row[idKey]));
                          }}
                        />
                      </td>
                    )}
                    {showIndex && (
                      <td className="px-6 py-6 text-[14px] leading-[20px] text-white font-normal align-middle">
                        {(actualCurrentPage - 1) * rowsPerPage + rowIndex + 1}
                      </td>
                    )}
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="px-6 py-6 text-[14px] leading-[20px] text-white font-normal align-middle">
                        {col.render ? (
                          col.render(row[col.key], row)
                        ) : (
                          <TruncatedText text={String(row[col.key] || "")} />
                        )}
                      </td>
                    ))}

                    {(onEdit || onDelete || extraActions || showStatusInActions) && (
                      <td className="px-6 py-6 align-middle">
                        <div className="flex justify-center items-center gap-2 flex-nowrap">
                          {showStatusInActions && (
                            onToggleStatus ? (
                              <button
                                onClick={() => onToggleStatus(row)}
                                className={`w-[32px] h-[32px] flex items-center justify-center rounded-[10px] hover:bg-black/5 transition-colors cursor-pointer`}
                              >
                                {(row[statusKey] === 1 || row[statusKey] === "1" || row[statusKey] === true || row[statusKey] === "true" || row[statusKey] === "active") ? (
                                  <Ban className="w-[16px] h-[16px] text-[#EF4444]" strokeWidth={1.5} />
                                ) : (
                                  <CheckCircle className="w-[16px] h-[16px] text-[#00A854]" strokeWidth={1.5} />
                                )}
                              </button>
                            ) : (
                              <span
                                className={`px-3 py-1.5 rounded-[10px] text-[12px] font-medium ${
                                  (row[statusKey] === 1 || row[statusKey] === "1" || row[statusKey] === true || row[statusKey] === "true" || row[statusKey] === "active")
                                    ? "bg-[#F0FDF4] text-[#008236]"
                                    : "bg-[#FEF2F2] text-[#EF4444]"
                                }`}
                              >
                                {(row[statusKey] === 1 || row[statusKey] === "1" || row[statusKey] === true || row[statusKey] === "true" || row[statusKey] === "active") ? t('active') : t('inactive')}
                              </span>
                            )
                          )}
                          {extraActions && extraActions(row)}
                          {onEdit && (
                            <button onClick={() => onEdit(row)} className="w-[32px] h-[32px] flex items-center justify-center rounded-[10px] hover:bg-black/5 transition-colors cursor-pointer" title={t('edit')}>
                              <FileEdit className="w-[16px] h-[16px] text-white" strokeWidth={1.33} />
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={() => onDelete(row)} className="w-[32px] h-[32px] flex items-center justify-center rounded-[10px] hover:bg-black/5 transition-colors cursor-pointer" title={t('delete')}>
                              <Trash2 className="w-[16px] h-[16px] text-[#EF4444]" strokeWidth={1.33} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 2} className="px-6 py-10 text-center text-white italic text-[14px]">
                    {t('noResults')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Attached to Bottom of Table */}
        <div className="flex flex-row justify-between items-center px-[24px] py-[16px] border-t-[0.8px] border-secondary-border w-full rounded-b-[16px] bg-background">
          <div className="font-normal text-[14px] leading-[20px] text-white">
            {t('showingResults', {
              start: actualTotalItems > 0 ? (actualCurrentPage - 1) * rowsPerPage + 1 : 0,
              end: Math.min(actualCurrentPage * rowsPerPage, actualTotalItems),
              total: actualTotalItems
            })}
          </div>
          <div className="flex flex-row items-center gap-[8px]">
            <button 
              disabled={actualCurrentPage <= 1} 
              onClick={() => handlePageChange(actualCurrentPage - 1)} 
              className="box-border flex items-center justify-center min-w-[86.49px] px-2 h-[37.6px] border-[0.8px] border-secondary-border rounded-[10px] bg-background font-medium text-[14px] leading-[20px] text-foreground hover:bg-black/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('previous')}
            </button>
            <button 
              disabled={actualCurrentPage >= actualTotalPages || actualTotalPages === 0} 
              onClick={() => handlePageChange(actualCurrentPage + 1)} 
              className="box-border flex items-center justify-center min-w-[63.09px] px-2 h-[37.6px] border-[0.8px] border-secondary-border rounded-[10px] bg-background font-medium text-[14px] leading-[20px] text-foreground hover:bg-black/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('next')}
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Delete Confirmation Modal */}
      {showMultiDeleteModal && (
        <ConfirmDelete
          title={t('deleteSelectedConfirmTitle')}
          description={t('deleteSelectedConfirmDesc', { count: selectedIds.length })}
          onConfirm={async () => {
            if (onMultiDelete) {
              await onMultiDelete(selectedIds);
              setSelectedIds([]);
              setShowMultiDeleteModal(false);
            }
          }}
          onCancel={() => setShowMultiDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default ReusableTable;
