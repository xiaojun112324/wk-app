import React from "react";
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  pageNum: number; // 当前页，从1开始
  pageSize: number; // 每页条数
  total: number; // 总条数
  onPageChange?: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pageNum,
  pageSize,
  total,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  const handleClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange?.(page);
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (pageNum <= 4) {
        pages.push(1, 2, 3, 4, 5, "ellipsis", totalPages);
      } else if (pageNum >= totalPages - 3) {
        pages.push(1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "ellipsis",
          pageNum - 1,
          pageNum,
          pageNum + 1,
          "ellipsis",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <UIPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleClick(pageNum - 1);
            }}
          />
        </PaginationItem>

        {getPageNumbers().map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === pageNum}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(p as number);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleClick(pageNum + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  );
};
