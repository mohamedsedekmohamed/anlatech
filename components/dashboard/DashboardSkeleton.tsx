// ─── Page-level skeleton (stats cards + table) ──────────────────────────────
export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4 shadow-sm animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-24 bg-muted rounded-full" />
        <div className="h-6 w-14 bg-muted rounded-full" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="border-b border-[#F5F5F5] animate-pulse">
      {/* index */}
      <td className="px-6 py-5">
        <div className="h-3 w-4 bg-muted/50 rounded-full" />
      </td>
      {/* name col — wider */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted/70 shrink-0" />
          <div className="space-y-2">
            <div className="h-3 w-28 bg-muted/70 rounded-full" />
            <div className="h-2.5 w-20 bg-muted/40 rounded-full" />
          </div>
        </div>
      </td>
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <td key={i} className="px-6 py-5">
          <div className="h-3 w-16 bg-muted/50 rounded-full" />
        </td>
      ))}
      {/* actions */}
      <td className="px-6 py-5">
        <div className="flex justify-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-muted" />
          <div className="w-7 h-7 rounded-lg bg-muted" />
          <div className="w-7 h-7 rounded-lg bg-muted" />
        </div>
      </td>
    </tr>
  );
}

export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="flex flex-col border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
      {/* fake topbar */}
      <div className="px-5 py-4 border-b border-[#F5F5F5] animate-pulse flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-5 w-24 bg-muted/70 rounded-full" />
          <div className="h-3 w-40 bg-muted/40 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-muted/40 rounded-xl" />
          <div className="h-9 w-24 bg-muted/40 rounded-xl" />
          <div className="h-9 w-28 bg-muted/70 rounded-xl" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-[#F5F5F5] h-14 animate-pulse">
              {Array.from({ length: cols + 2 }).map((_, i) => (
                <th key={i} className="px-6">
                  <div className="h-3 w-16 bg-muted/50 rounded-full" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} cols={cols} />
            ))}
          </tbody>
        </table>
      </div>
      {/* fake pagination */}
      <div className="px-6 py-4 border-t border-[#F5F5F5] flex justify-between items-center animate-pulse">
        <div className="h-3 w-40 bg-muted rounded-full" />
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-muted rounded-xl" />
          <div className="h-9 w-16 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}
