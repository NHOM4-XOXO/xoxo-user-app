
import LegalLayout from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Quyền riêng tư || XOXO",
  description: "Chính sách quyền riêng tư của XOXO",
};

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <LegalLayout activePath="/legal/privacy">
      <section className="pt-2">
        <div className="rounded-2xl border p-5 shadow-sm dark:border-gray-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30">
          <h1 className="text-2xl font-semibold">Chính sách Quyền riêng tư</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Cập nhật: 17/09/2025 — Cách XOXO thu thập, sử dụng, chia sẻ, bảo mật
            và cho bạn kiểm soát dữ liệu cá nhân.
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Nên đọc cùng{" "}
            <a className="underline font-bold" href="/legal/terms">
              Điều khoản
            </a>{" "}
            và{" "}
            <a className="underline font-bold" href="/legal/ads">
              Lựa chọn quảng cáo
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
              Chúng tôi xây dựng XOXO để bạn kết nối an toàn và kiểm soát trải
              nghiệm của mình. Tài liệu này mô tả các loại dữ liệu XOXO xử lý,
              mục đích, thời gian lưu giữ, quyền của bạn và cách liên hệ khi cần
              hỗ trợ.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              1. Dữ liệu chúng tôi thu thập
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <b>Thông tin tài khoản</b>: tên hiển thị, email, số điện thoại
                (nếu cung cấp), ảnh đại diện, ngày sinh (nếu có).
              </li>
              <li>
                <b>Nội dung bạn tạo</b>: bài viết, bình luận, ảnh, video, hồ sơ,
                nhóm/thành viên bạn tham gia, báo cáo/đánh dấu.
              </li>
              <li>
                <b>Hoạt động & tương tác</b>: theo dõi, thích/chia sẻ/lưu, lượt
                xem trang, lịch sử tìm kiếm trong app, cài đặt và tuỳ chọn.
              </li>
              <li>
                <b>Dữ liệu thiết bị & nhật ký</b>: địa chỉ IP, loại thiết bị/OS,
                phiên bản app, ngôn ngữ, múi giờ, cookie/ID thiết bị, sự kiện
                lỗi.
              </li>
              <li>
                <b>Vị trí gần đúng</b>: suy ra từ IP hoặc hệ điều hành khi bạn
                cho phép; không yêu cầu GPS trừ khi bạn bật rõ ràng.
              </li>
              <li>
                <b>Dữ liệu đối tác</b> (khi có sự đồng ý/thoả thuận hợp lệ): số
                liệu chiến dịch, lượt hiển thị/nhấp, chuyển đổi ở mức tổng hợp.
              </li>
              <li>
                <b>Dữ liệu hỗ trợ</b>: nội dung bạn gửi khi liên hệ CSKH, biểu
                mẫu khiếu nại hoặc phản hồi.
              </li>
            </ul>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Lưu ý: XOXO <b>không</b> sử dụng nội dung tin nhắn riêng tư hoặc
              dữ liệu nhạy cảm (sức khỏe, tôn giáo, chính trị…) để cá nhân hoá
              quảng cáo.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              2. Cách chúng tôi sử dụng dữ liệu
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                Cung cấp và vận hành tính năng (tạo tài khoản, đăng nhập, hiển
                thị feed, tìm kiếm, nhắn tin, nhóm…).
              </li>
              <li>
                Cá nhân hoá trải nghiệm: gợi ý bạn bè/nhóm/chủ đề, sắp xếp nội
                dung, ngôn ngữ/định dạng yêu thích.
              </li>
              <li>
                Giữ an toàn: phát hiện spam/gian lận, lạm dụng; bảo vệ người
                dùng và nền tảng.
              </li>
              <li>
                Đo lường & tối ưu hiệu năng: thống kê mức tổng hợp, sửa lỗi, cải
                thiện chất lượng dịch vụ.
              </li>
              <li>
                Quảng cáo & tài trợ khi áp dụng: xem{" "}
                <a className="underline font-bold" href="/legal/ads">
                  Lựa chọn quảng cáo
                </a>{" "}
                để kiểm soát.
              </li>
              <li>
                Tuân thủ pháp luật, thực thi Điều khoản và đáp ứng yêu cầu hợp
                lệ từ cơ quan có thẩm quyền.
              </li>
            </ul>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Cơ sở pháp lý (khi luật áp dụng yêu cầu): thực hiện hợp đồng; lợi
              ích hợp pháp (an toàn, cải tiến); tuân thủ nghĩa vụ pháp lý; hoặc
              theo <b>sự đồng ý</b> (bạn có thể rút lại bất kỳ lúc nào).
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">3. Chia sẻ dữ liệu</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <b>Với người dùng khác</b>: theo phạm vi bạn thiết lập (công
                khai, bạn bè, nhóm). Bạn kiểm soát quyền riêng tư ở mức nội
                dung/nhóm.
              </li>
              <li>
                <b>Nhà cung cấp dịch vụ</b>: hạ tầng đám mây, phân tích, chống
                gian lận, CSKH theo hợp đồng bảo mật.
              </li>
              <li>
                <b>Đối tác đo lường/quảng cáo</b>: số liệu tổng hợp/ẩn danh khi
                có thỏa thuận hợp lệ và theo lựa chọn của bạn.
              </li>
              <li>
                <b>Tuân thủ pháp luật</b>: theo yêu cầu hợp lệ từ cơ quan có
                thẩm quyền hoặc để bảo vệ quyền/lợi ích hợp pháp.
              </li>
              <li>
                <b>Chuyển giao kinh doanh</b>: trong sáp nhập/mua bán/tái cấu
                trúc, dữ liệu có thể được chuyển giao theo luật.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              4. Cookie &amp; công nghệ tương tự
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Cookie/LocalStorage/ID thiết bị giúp duy trì đăng nhập, ghi nhớ
              tuỳ chọn, bảo mật phiên, đo lường hiệu năng và (khi bật) cá nhân
              hoá quảng cáo. Bạn có thể quản lý trong cài đặt trình duyệt, thiết
              bị hoặc tại{" "}
              <a className="underline font-bold" href="/legal/ads">
                Lựa chọn quảng cáo
              </a>
              .
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">5. Lưu giữ &amp; bảo mật</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <b>Thời gian lưu giữ</b>: chỉ trong thời gian cần thiết cho mục
                đích nêu trên hoặc theo quy định pháp luật; sau đó sẽ xoá, ẩn
                danh hoá hoặc lưu trữ an toàn.
              </li>
              <li>
                <b>Bảo mật</b>: mã hoá khi truyền (HTTPS/TLS), kiểm soát truy
                cập, ghi nhật ký, sao lưu định kỳ, phân tách môi trường.
              </li>
              <li>
                <b>Sự cố</b>: nếu có rò rỉ ảnh hưởng nghiêm trọng, chúng tôi sẽ
                thông báo theo yêu cầu pháp luật hiện hành.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              6. Quyền của bạn &amp; cách thực hiện
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <b>Truy cập</b> bản sao dữ liệu cá nhân; <b>chỉnh sửa</b> thông
                tin sai lệch.
              </li>
              <li>
                <b>Xoá</b> dữ liệu trong những trường hợp luật cho phép; lưu ý
                một số dữ liệu phải giữ để tuân thủ pháp luật.
              </li>
              <li>
                <b>Phản đối</b> hoặc <b>hạn chế</b> xử lý; <b>rút lại đồng ý</b>{" "}
                (không ảnh hưởng xử lý trước đó).
              </li>
              <li>
                <b>Di chuyển dữ liệu</b> (data portability) khi áp dụng.
              </li>
              <li>
                <b>Khiếu nại</b> đến cơ quan bảo vệ dữ liệu theo luật hiện hành.
              </li>
            </ul>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Thực hiện qua phần{" "}
              <a
                className="underline font-bold text-red-500"
                href="/settings/privacy"
              >
                Cài đặt &gt; Quyền riêng tư
              </a>{" "}
              (nếu có) hoặc liên hệ{" "}
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
            <h3 className="text-xl font-semibold">7. Trẻ vị thành niên</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              XOXO không chủ đích cung cấp dịch vụ cho người dưới độ tuổi theo
              luật địa phương. Nếu phát hiện vi phạm độ tuổi, chúng tôi có thể
              hạn chế/chấm dứt tài khoản theo quy định và sẽ xử lý dữ liệu phù
              hợp.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              8. Truyền dữ liệu xuyên biên giới
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Dữ liệu có thể được xử lý/ lưu trữ tại các máy chủ đặt ngoài quốc
              gia của bạn. Khi thực hiện, chúng tôi áp dụng các biện pháp bảo vệ
              phù hợp (ví dụ: điều khoản hợp đồng tiêu chuẩn hoặc cơ chế tương
              đương khi luật yêu cầu).
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              9. Người kiểm soát dữ liệu &amp; liên hệ
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Người kiểm soát dữ liệu (data controller): <b>XOXO</b>.<br />
              Liên hệ:{" "}
              <a
                className="underline text-blue-700"
                href="mailto:privacy@xoxo.example"
              >
                support@xoxo.example
              </a>{" "}
            </p>
          </section>

          {/* 10. Thay đổi chính sách */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold">10. Thay đổi chính sách</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Khi cập nhật tài liệu này, chúng tôi sẽ thông báo trong ứng dụng
              và/hoặc qua email (khi phù hợp). Tiếp tục sử dụng XOXO sau ngày có
              hiệu lực đồng nghĩa bạn chấp nhận phiên bản mới.
            </p>
          </section>
        </div>
      </article>
    </LegalLayout>
  );
}
