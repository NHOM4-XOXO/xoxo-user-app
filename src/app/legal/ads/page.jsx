
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Lựa chọn quảng cáo || XOXO",
  description: "Kiểm soát cách bạn thấy quảng cáo trên XOXO",
};

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <LegalLayout activePath="/legal/ads">
      <section className="pt-2">
        <div className="rounded-2xl border p-5 shadow-sm dark:border-gray-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30">
          <h1 className="text-2xl font-semibold">Lựa chọn quảng cáo</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Cập nhật: 17/09/2025 — Cách chúng tôi hiển thị quảng cáo và lựa chọn
            kiểm soát của bạn.
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Tài liệu này cần được đọc cùng{" "}
            <a className="underline font-bold" href="/legal/privacy">
              Chính sách Quyền riêng tư
            </a>{" "}
            và{" "}
            <a className="underline font-bold" href="/legal/terms">
              Điều khoản
            </a>
            .
          </p>
        </div>
      </section>

      <article className="py-6">
        <div className="rounded-2xl border p-6 shadow-sm dark:border-gray-800">
          <section className="mt-2">
            <h3 className="text-xl font-semibold">Tổng quan</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              XOXO hiển thị quảng cáo để duy trì dịch vụ miễn phí. Chúng tôi ưu
              tiên minh bạch, kiểm soát của người dùng và an toàn. Bạn có thể
              điều chỉnh mức độ cá nhân hoá, xem lý do vì sao thấy một quảng cáo
              cụ thể, ẩn hoặc báo cáo quảng cáo.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">1. Bạn kiểm soát điều gì?</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <b>Cá nhân hoá quảng cáo</b>: bật/tắt việc dùng hoạt động trên
                XOXO (tài khoản theo dõi, tương tác, chủ đề quan tâm) để chọn
                quảng cáo phù hợp hơn.
              </li>
              <li>
                <b>Chủ đề/quảng cáo không muốn thấy</b>: ẩn chủ đề nhạy cảm (VD:
                cờ bạc, hẹn hò) hoặc <i>Ẩn quảng cáo từ nhà quảng cáo này</i>.
              </li>
              <li>
                <b>Giới hạn tần suất</b>: chúng tôi tự động giới hạn hiển thị
                lặp lại; bạn vẫn có thể ẩn quảng cáo nếu thấy phiền.
              </li>
              <li>
                <b>Vị trí gần đúng</b>: cho phép/không cho phép dùng vị trí gần
                đúng (từ IP, cài đặt hệ thống).
              </li>
              <li>
                <b>Dữ liệu đối tác</b>: quyết định việc kết hợp dữ liệu chiến
                dịch từ website/app đối tác (khi có thỏa thuận hợp lệ).
              </li>
              <li>
                <b>“Vì sao tôi thấy quảng cáo này?”</b>: menu ⋯ trên quảng cáo
                cho biết các tín hiệu được dùng.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              2. Dữ liệu nào được dùng cho quảng cáo?
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <b>Hoạt động trên XOXO</b>: theo dõi, lượt thích, bình luận,
                tương tác với chủ đề/nhóm (khi bật cá nhân hoá).
              </li>
              <li>
                <b>Thông tin thiết bị</b>: loại thiết bị, hệ điều hành, ngôn
                ngữ, vùng, cookie/ID thiết bị cho chống gian lận và đo lường.
              </li>
              <li>
                <b>Vị trí gần đúng</b>: suy ra từ IP hoặc cài đặt hệ thống.
              </li>
              <li>
                <b>Dữ liệu đối tác</b> (khi có sự đồng ý): lượt xem trang/đơn
                hàng để đo hiệu quả chiến dịch.
              </li>
              <li>
                <b>Không dùng</b> nội dung tin nhắn riêng tư, dữ liệu nhạy cảm
                (sức khoẻ, tôn giáo, định danh chính trị…) để cá nhân hoá.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">3. Quản lý ngoài XOXO</h3>
            <div className="mt-2 space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                Bạn có thể kiểm soát cá nhân hoá ở cấp hệ điều hành/trình duyệt.
                Một số lựa chọn phổ biến:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <b>iOS/iPadOS</b>: Cài đặt → Quyền riêng tư &amp; Bảo mật →
                  Theo dõi → tắt “Cho phép app yêu cầu theo dõi”; đặt{" "}
                  <i>Giới hạn theo dõi quảng cáo</i>.
                </li>
                <li>
                  <b>Android</b>: Cài đặt Google → Quảng cáo → Xoá ID quảng cáo
                  hoặc tắt “Cá nhân hoá quảng cáo”.
                </li>
                <li>
                  <b>Web</b>: Chặn cookie của bên thứ ba, xoá cookie, dùng tính
                  năng “Không theo dõi” của trình duyệt (nếu có).
                </li>
                <li>
                  <b>Industry opt-out</b> (một số quốc gia/khu vực): các tổ chức
                  như DAA/NAI/YourOnlineChoices cung cấp cơ chế rút lui khỏi
                  quảng cáo dựa trên hứng thú ở cấp trình duyệt.
                </li>
              </ul>
              <p className="text-sm opacity-80">
                Lưu ý: cài đặt ngoài XOXO có thể làm giảm độ liên quan của quảng
                cáo nhưng không loại bỏ hoàn toàn quảng cáo.
              </p>
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              4. Đo lường &amp; chống gian lận
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <b>Đo lường</b>: chúng tôi ghi nhận lượt hiển thị, nhấp chuột,
                chuyển đổi ở dạng tổng hợp/ẩn danh khi có thể.
              </li>
              <li>
                <b>Chống gian lận</b>: phát hiện nhấp chuột giả, spam, bot; có
                thể dùng dấu hiệu thiết bị/địa chỉ IP để bảo vệ hệ thống.
              </li>
              <li>
                <b>Kiểm toán</b>: có thể hợp tác với bên thứ ba đáng tin cậy để
                xác minh số liệu chiến dịch ở mức tổng hợp.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              5. Minh bạch &amp; khiếu nại
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <b>Vì sao tôi thấy quảng cáo này?</b> Mở menu ⋯ trên quảng cáo
                để xem tiêu chí hiển thị và điều chỉnh tùy chọn.
              </li>
              <li>
                <b>Báo cáo quảng cáo</b>: nếu quảng cáo vi phạm chính sách/luật.
              </li>
              <li>
                <b>Liên hệ</b>: gửi phản hồi tới{" "}
                <a
                  className="underline text-blue-700"
                  href="mailto:support@xoxo.example"
                >
                  support@xoxo.example
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">6. Lưu giữ &amp; bảo mật</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Dữ liệu quảng cáo được lưu trong thời gian cần thiết cho mục đích
              nêu trên và theo quy định pháp luật. Chúng tôi áp dụng mã hoá khi
              truyền, kiểm soát truy cập, ghi nhật ký và các biện pháp an ninh
              nội bộ. Khi không còn cần thiết, dữ liệu sẽ được xoá hoặc ẩn danh
              hoá hợp lý.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              7. Trẻ vị thành niên &amp; chủ đề nhạy cảm
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                Không cá nhân hoá quảng cáo cho người dùng dưới độ tuổi theo
                luật địa phương (khi chúng tôi có thể xác định).
              </li>
              <li>
                Hạn chế chủ đề nhạy cảm (VD: cờ bạc, rượu, dược phẩm theo đơn)
                theo luật và chính sách nội bộ.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">8. Thay đổi &amp; liên hệ</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Khi cập nhật tài liệu này, chúng tôi sẽ thông báo trong ứng dụng.
              Nếu có câu hỏi, hãy liên hệ:{" "}
              <a
                className="underline text-blue-700"
                href="mailto:support@xoxo.example"
              >
                support@xoxo.example
              </a>
              .
            </p>
          </section>

          <section className="mt-8">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              *Tài liệu này mang tính tham khảo và không phải là tư vấn pháp lý.
              Vui lòng tham vấn luật sư trước khi ban hành chính thức.
            </p>
          </section>
        </div>
      </article>
    </LegalLayout>
  );
}
