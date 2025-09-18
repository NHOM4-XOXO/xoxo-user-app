import Header from "@/components/main/LeftSidebar-Home/Header";
import LegalTabs from "@/app/legal/LegalTabs";

export default function LegalLayout({ activePath = "", children }) {
  return (
    <>
      <Header />

      <div className="mx-auto w-full max-w-[1100px] px-4">
        {/* MOBILE/TABLET: tabs ngang sticky trên nội dung */}
        <div className="lg:hidden sticky top-16 z-20 border-b border-[#29abe2]/10 bg-white/80 backdrop-blur dark:bg-black/50">
          <LegalTabs activePath={activePath} variant="horizontal" />
        </div>

        {/* Lưới từ lg+: sidebar dọc + nội dung */}
        <div className="lg:grid lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr] lg:gap-8">
          {/* Sidebar dọc (sticky) */}
          <div className="hidden lg:block">
            <div className="sticky top-20 xl:top-24">
              <LegalTabs activePath={activePath} variant="vertical" />
            </div>
          </div>

          {/* Nội dung */}
          <main className="py-4 sm:py-6 lg:py-8">{children}</main>
        </div>
      </div>
    </>
  );
}
