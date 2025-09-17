import Link from "next/link";
import clsx from "clsx";

export default function SidebarFooter({
  className,
  year = new Date().getFullYear(),
  brand = "XOXO",
  compact = false,
}) {
  return (
    <div
      className={clsx(
        "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700",
        className
      )}
    >
      <div
        className={clsx(
          "text-xs text-gray-500 dark:text-gray-400",
          compact ? "space-x-2" : "space-y-1"
        )}
      >
        {compact ? (
          <p className="flex flex-wrap items-center gap-x-2">
            <Link href="/legal/privacy" className="hover:underline">
              Quyền riêng tư
            </Link>
            <span>•</span>
            <Link href="/legal/terms" className="hover:underline">
              Điều khoản
            </Link>
            <span>•</span>
            <Link href="/legal/ads" className="hover:underline">
              Quảng cáo
            </Link>
            <span className="ms-auto opacity-70">
              {brand} © {year}
            </span>
          </p>
        ) : (
          <>
            <p className="flex flex-wrap items-center gap-x-2">
              <Link href="/legal/privacy" className="hover:underline">
                Quyền riêng tư
              </Link>
              <span>•</span>
              <Link href="/legal/terms" className="hover:underline">
                Điều khoản
              </Link>
              <span>•</span>
              <Link href="/legal/ads" className="hover:underline">
                Quảng cáo
              </Link>
            </p>
            <p className="opacity-70">
              {brand} © {year}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
