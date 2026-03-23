import { Skeleton } from "@/components/ui/skeleton";

export function FinanceHeroSkeleton() {
  return (
    <section className="mt-3 rounded-2xl border border-[#d8e7ff] bg-gradient-to-br from-[#f3f8ff] via-[#edf5ff] to-[#e6f0ff] px-4 py-3 shadow-[0_10px_24px_rgba(33,91,168,0.12)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-6 w-28 bg-white/75" />
          <Skeleton className="h-4 w-48 bg-white/70" />
        </div>
        <Skeleton className="h-10 w-10 rounded-xl bg-white/75" />
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-24 bg-white/70" />
        <Skeleton className="h-5 w-24 rounded-full bg-white/70" />
      </div>
    </section>
  );
}

export function FinanceCardSkeleton({
  lines = 4,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <section className={`glass-card p-4 mt-3 ${className}`}>
      <Skeleton className="h-5 w-28 mb-3" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function FinanceListSkeleton({
  rows = 3,
  withTabs = false,
}: {
  rows?: number;
  withTabs?: boolean;
}) {
  return (
    <section className="glass-card p-4 mt-3">
      <Skeleton className="h-5 w-32 mb-3" />
      {withTabs ? (
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-8 w-14 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      ) : null}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="finance-list-row">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FinanceBannerSkeleton() {
  return (
    <section className="glass-card p-1 overflow-hidden bg-[#eef5ff]">
      <Skeleton className="h-[140px] w-full rounded-xl" />
    </section>
  );
}

export function FinanceNavGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <section className="grid grid-cols-5 gap-2 py-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="glass-card flex flex-col justify-center py-2 px-1">
          <Skeleton className="size-10 mx-auto rounded-xl" />
          <Skeleton className="h-3 w-10 mx-auto mt-2" />
        </div>
      ))}
    </section>
  );
}

export function FinanceFormSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <section className="glass-card mt-3 p-4">
      <Skeleton className="h-5 w-24 mb-4" />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </section>
  );
}
