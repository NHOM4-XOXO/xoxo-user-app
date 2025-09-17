import Link from "next/link";
import clsx from "clsx";
import { ShieldCheck, FileText, Megaphone } from "lucide-react";

const tabs = [
  { href: "/legal/privacy", label: "Quyền riêng tư", Icon: ShieldCheck },
  { href: "/legal/terms", label: "Điều khoản", Icon: FileText },
  { href: "/legal/ads", label: "Lựa chọn quảng cáo", Icon: Megaphone },
];

export default function LegalTabs({
  activePath = "",
  variant = "auto",
  showHeading = true,
}) {
  const isActive = (href) =>
    activePath === href ||
    activePath.startsWith(href + "/") ||
    activePath.startsWith(href + "#");

  const current = tabs.find((t) => isActive(t.href));

  const Horizontal = () => (
    <div className="py-3">
      <p className="mb-2 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
        Bạn đang xem:{" "}
        <span className="font-medium text-[#167aa3] dark:text-[#7cc8e5]">
          {current?.label ?? "Tài liệu pháp lý"}
        </span>
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              title={label}
              className={clsx(
                "group relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] sm:text-sm transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 ring-offset-1",
                active
                  ? "text-white bg-gradient-to-br from-[#29abe2] to-[#1e8fbd] shadow-md sm:shadow-lg shadow-[rgba(41,171,226,0.28)] focus-visible:ring-[rgba(41,171,226,0.45)] border border-transparent"
                  : "text-[#167aa3] dark:text-[#9bd8ee] bg-white/85 dark:bg-gray-900/30 border border-[#29abe2]/20 hover:border-[#29abe2]/40 hover:bg-[#29abe2]/5 focus-visible:ring-[rgba(41,171,226,0.35)] hover:shadow-md hover:shadow-[rgba(41,171,226,0.18)]"
              )}
            >
              {active && (
                <span className="pointer-events-none absolute inset-px rounded-full [background:linear-gradient(180deg,rgba(255,255,255,.35),transparent_45%)]" />
              )}
              <Icon
                className={clsx(
                  "h-4 w-4 relative",
                  active ? "scale-110" : "opacity-85 group-hover:opacity-100"
                )}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={clsx(
                  "relative",
                  active ? "font-semibold" : "font-medium"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  const Vertical = () => (
    <aside className="w-[220px] xl:w-[260px]">
      {showHeading && (
        <p className="mb-3 text-[20px] font-semibold text-[#0f5774] dark:text-[#7cc8e5]">
          Thông tin & Chính sách
        </p>
      )}
      <ul className="space-y-2">
        {tabs.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] xl:text-sm transition-all",
                  "focus:outline-none focus-visible:ring-2 ring-offset-1",
                  active
                    ? "text-white bg-gradient-to-br from-[#29abe2] to-[#1e8fbd] shadow-md shadow-[rgba(41,171,226,0.25)] focus-visible:ring-[rgba(41,171,226,0.45)]"
                    : "text-[#167aa3] dark:text-[#9bd8ee] bg-white/80 dark:bg-gray-900/30 border border-[#29abe2]/15 hover:border-[#29abe2]/35 hover:bg-[#29abe2]/5"
                )}
              >
                <span
                  className={clsx(
                    "inline-flex h-7 w-7 items-center justify-center rounded-lg border",
                    active
                      ? "border-white/30 bg-white/15"
                      : "border-[#29abe2]/25 bg-white/50 dark:bg-gray-900/50"
                  )}
                >
                  <Icon
                    className={clsx(
                      "h-4 w-4",
                      active ? "scale-110" : "opacity-90"
                    )}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </span>
                <span
                  className={clsx(active ? "font-semibold" : "font-medium")}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );

  // Chế độ render
  if (variant === "horizontal") return <Horizontal />;
  if (variant === "vertical") return <Vertical />;

  // "auto": trả cả 2, dùng CSS ẩn/hiện theo breakpoint
  return (
    <>
      <div className="block lg:hidden">
        <Horizontal />
      </div>
      <div className="hidden lg:block">
        <Vertical />
      </div>
    </>
  );
}
