import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileNavigation from "../components/MobileNavigation";

export default function HomePage() {
  return (
    <html lang="en">
      <body>
        <Header />
        <Sidebar />
        <MobileNavigation />
        <main className="pt-14 lg:pl-64 pb-16 lg:pb-4 p-4">
          <h1>Đây là content</h1>
        </main>
      </body>
    </html>
  );
}
