import LegalLayout from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Điều khoản || XOXO",
  description: "Điều khoản sử dụng dịch vụ XOXO",
};

export default function Page() {
  return (
    <LegalLayout activePath="/legal/terms">
      <section className="pt-2">
        <div className="rounded-2xl border p-5 shadow-sm dark:border-gray-800 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/40 dark:to-fuchsia-950/30">
          <h1 className="text-2xl font-semibold">Điều khoản sử dụng</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Cập nhật: 17/09/2025 — Quy định việc truy cập và sử dụng XOXO.
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Đọc cùng với{" "}
            <a className="underline font-bold" href="/legal/privacy">
              Chính sách Quyền riêng tư
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
              Khi tạo tài khoản, truy cập hoặc sử dụng XOXO (gồm website, ứng
              dụng, API và tính năng liên quan), bạn đồng ý tuân thủ Điều khoản
              này. Nếu bạn đại diện tổ chức, bạn tuyên bố có thẩm quyền ràng
              buộc tổ chức đó.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              1. Phạm vi &amp; chấp nhận
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                Áp dụng cho mọi sản phẩm/dịch vụ, tính năng hiện có hoặc ra mắt
                sau này của XOXO.
              </li>
              <li>
                Điều khoản có thể bổ sung bởi chính sách/điều kiện riêng cho
                từng tính năng (nếu có).
              </li>
              <li>
                Tiếp tục sử dụng sau khi Điều khoản thay đổi đồng nghĩa chấp
                nhận phiên bản cập nhật.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              2. Tài khoản &amp; bảo mật
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                Bạn cần cung cấp thông tin chính xác, cập nhật và giữ bí mật
                thông tin đăng nhập.
              </li>
              <li>
                Không chia sẻ, chuyển nhượng, cho thuê, mua bán tài khoản; không
                mạo danh người khác.
              </li>
              <li>
                Báo ngay cho XOXO khi phát hiện truy cập trái phép hoặc rủi ro
                bảo mật.
              </li>
              <li>
                Chúng tôi có thể yêu cầu xác minh danh tính trong trường hợp cần
                thiết (ví dụ: khôi phục tài khoản).
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              3. Nội dung của bạn &amp; giấy phép
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                Bạn sở hữu quyền đối với nội dung do bạn tạo hoặc đăng tải lên
                XOXO.
              </li>
              <li>
                Bằng việc đăng tải, bạn cấp cho XOXO giấy phép toàn cầu, không
                độc quyền, có thể chuyển nhượng và cấp lại, miễn tiền bản quyền
                để lưu trữ, sao chép, xử lý, hiển thị, phân phối nội dung nhằm
                vận hành, cải thiện dịch vụ và bảo vệ an toàn cộng đồng.
              </li>
              <li>
                Bạn đảm bảo nội dung không vi phạm pháp luật, quyền riêng tư
                hoặc quyền SHTT của bên thứ ba.
              </li>
              <li>
                Chúng tôi có thể gỡ bỏ nội dung vi phạm pháp luật/Điều khoản
                hoặc theo yêu cầu hợp lệ của cơ quan có thẩm quyền.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              4. Hành vi được phép/không được phép
            </h3>
            <div className="mt-2 space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                Bạn đồng ý sử dụng XOXO một cách tôn trọng, hợp pháp. Nghiêm
                cấm:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Phát tán spam, lừa đảo, mã độc, nội dung thù hận/hung hăng/đồi
                  trụy trái luật.
                </li>
                <li>
                  Quấy rối, đe doạ, xâm phạm riêng tư; mạo danh hoặc giả mạo
                  thông tin nhận dạng.
                </li>
                <li>
                  Thu thập dữ liệu trái phép (scrape/crawl) hoặc khai thác lỗ
                  hổng, can thiệp kỹ thuật.
                </li>
                <li>
                  Vượt qua biện pháp kiểm soát truy cập; bán lại dịch vụ nếu
                  không được phép.
                </li>
              </ul>
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              5. Sở hữu trí tuệ của XOXO
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Nhãn hiệu, logo, giao diện, thiết kế, mã nguồn và dữ liệu hệ thống
              thuộc XOXO hoặc đối tác cấp phép. Bạn không được sao chép, chỉnh
              sửa, dịch ngược, cho thuê, bán lại, tạo tác phẩm phái sinh ngoài
              phạm vi cho phép.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              6. Quảng cáo, dịch vụ thu phí &amp; thanh toán
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                XOXO có thể hiển thị quảng cáo. Bạn có thể kiểm soát tại{" "}
                <a className="underline font-bold" href="/legal/ads">
                  Lựa chọn quảng cáo
                </a>
                .
              </li>
              <li>
                Một số tính năng/tiện ích có thể thu phí; điều kiện áp dụng sẽ
                hiển thị rõ trước khi thanh toán.
              </li>
              <li>
                Trừ khi luật yêu cầu, các khoản thanh toán thường không hoàn
                lại.
              </li>
              <li>
                Giao dịch qua nhà cung cấp thanh toán tuân theo điều khoản của
                họ và luật hiện hành.
              </li>
            </ul>
          </section>

          {/* 7. Dịch vụ/đường dẫn bên thứ ba */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold">7. Bên thứ ba</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              XOXO có thể tích hợp dịch vụ/đường dẫn của bên thứ ba. Chúng tôi
              không kiểm soát nội dung, chính sách hoặc hoạt động của họ và
              không chịu trách nhiệm cho tổn thất phát sinh từ việc bạn sử dụng
              các dịch vụ đó.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              8. Tạm ngừng &amp; chấm dứt
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                Chúng tôi có thể tạm ngừng hoặc chấm dứt quyền truy cập nếu bạn
                vi phạm Điều khoản/luật pháp.
              </li>
              <li>
                Bạn có thể ngừng sử dụng bất kỳ lúc nào; có thể yêu cầu xoá tài
                khoản theo{" "}
                <a className="underline font-bold" href="/legal/privacy">
                  Chính sách Quyền riêng tư
                </a>
                .
              </li>
              <li>
                Sau khi chấm dứt, một lượng dữ liệu nhất định có thể được lưu để
                tuân thủ nghĩa vụ pháp lý.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">9. Miễn trừ bảo đảm</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Dịch vụ được cung cấp “nguyên trạng” và “tuỳ khả dụng”. Trong phạm
              vi pháp luật cho phép, XOXO từ chối mọi bảo đảm rõ ràng hay ngụ ý
              về khả năng thương mại, phù hợp mục đích cụ thể, và không vi phạm.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">10. Giới hạn trách nhiệm</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Trong phạm vi tối đa pháp luật cho phép, XOXO không chịu trách
              nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hệ
              quả, mất dữ liệu hoặc lợi nhuận, dù đã được cảnh báo về khả năng
              xảy ra.
            </p>
          </section>

          {/* 11. Bồi thường */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold">11. Bồi thường</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Bạn đồng ý bồi thường, bảo vệ và giữ cho XOXO, các công ty liên
              kết, lãnh đạo, nhân viên, đối tác không bị thiệt hại khỏi mọi
              khiếu nại, yêu cầu, chi phí phát sinh từ việc bạn sử dụng dịch vụ,
              nội dung bạn đăng hoặc vi phạm Điều khoản.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">
              12. Luật áp dụng &amp; tranh chấp
            </h3>
            <div className="mt-2 space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                Điều khoản này được điều chỉnh bởi pháp luật nơi XOXO đăng ký
                hoạt động (trừ khi luật địa phương bắt buộc khác).
              </p>
              <p>
                Tranh chấp sẽ ưu tiên giải quyết bằng thương lượng thiện chí
                trong vòng 30 ngày. Nếu không đạt được, các bên có thể đưa tới
                cơ quan có thẩm quyền theo luật áp dụng.
              </p>
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">13. Thay đổi Điều khoản</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Chúng tôi có thể cập nhật Điều khoản để phản ánh thay đổi về tính
              năng/pháp luật. Khi có thay đổi trọng yếu, XOXO sẽ thông báo trong
              ứng dụng. Việc bạn tiếp tục sử dụng sau ngày có hiệu lực đồng
              nghĩa chấp nhận Điều khoản mới.
            </p>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold">14. Liên hệ</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Mọi câu hỏi liên quan đến Điều khoản vui lòng liên hệ:{" "}
              <a
                className="underline text-blue-700"
                href="mailto:legal@xoxo.example"
              >
                legal@xoxo.example
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </LegalLayout>
  );
}
