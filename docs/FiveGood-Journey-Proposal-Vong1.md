# BẢN MÔ TẢ Ý TƯỞNG – VÒNG 1 BẢNG B CHALLENGER
## Vietnamese Student HackAIthon 2026

---

# THÔNG TIN ĐỘI THI

| Mục | Nội dung |
|---|---|
| **Tên đội** | *(Điền tên đội)* |
| **Tên sản phẩm / dự án** | **FiveGood Journey** – AI đồng hành cùng hành trình Sinh viên 5 tốt |
| **Đề tài lựa chọn** | Đề tài 5 – Phát triển giải pháp AI hỗ trợ đổi mới, nâng cao hiệu quả công tác Hội và phong trào sinh viên, tối ưu hóa quy trình quản lý, đánh giá, xét chọn danh hiệu "Sinh viên 5 tốt cấp Trung ương" |
| **Trường** | *(Điền tên trường)* |
| **Thành viên** | *(Điền danh sách thành viên – tối đa 5 người)* |
| **Số điện thoại liên hệ** | *(Điền SĐT)* |
| **Email liên hệ** | *(Điền email)* |

---

# MỤC LỤC

1. [Tổng quan ý tưởng](#1-tổng-quan-ý-tưởng)
2. [Vấn đề thực tiễn và bối cảnh](#2-vấn-đề-thực-tiễn-và-bối-cảnh)
3. [Giải pháp đề xuất](#3-giải-pháp-đề-xuất)
4. [Thiết kế tổng quan hệ thống](#4-thiết-kế-tổng-quan-hệ-thống)
5. [Tính đổi mới và khác biệt](#5-tính-đổi-mới-và-khác-biệt)
6. [Tính khả thi khi triển khai](#6-tính-khả-thi-khi-triển-khai)
7. [Tác động dự kiến](#7-tác-động-dự-kiến)
8. [Phương hướng triển khai và Roadmap](#8-phương-hướng-triển-khai-và-roadmap)
9. [Tận dụng hệ sinh thái API của BTC](#9-tận-dụng-hệ-sinh-thái-api-của-btc)
10. [Kết luận](#10-kết-luận)

---

# 1. TỔNG QUAN Ý TƯỞNG

## 1.1. Tên sản phẩm và định vị

**FiveGood Journey** là nền tảng AI-first hỗ trợ toàn bộ vòng đời "Sinh viên 5 tốt" (SV5T), từ giai đoạn sinh viên tìm hiểu tiêu chí, lập kế hoạch phấn đấu, chuẩn bị minh chứng, nộp hồ sơ, theo dõi trạng thái xét duyệt, đến giai đoạn tạo hồ sơ năng lực số sau khi đạt danh hiệu.

**Tagline:** *AI đồng hành cùng hành trình trở thành Sinh viên 5 tốt*

**Định vị:** Nền tảng AI hai chiều cho cả sinh viên và cán bộ Hội, hỗ trợ **trước – trong – sau** xét duyệt danh hiệu "Sinh viên 5 tốt".

## 1.2. Tầm nhìn sản phẩm

FiveGood Journey không đơn thuần là một cổng nộp hồ sơ số hóa. Sản phẩm được thiết kế như một **journey product** – nơi người dùng được đồng hành theo từng chặng của hành trình phấn đấu, với AI đóng vai trò mentor cá nhân, trợ lý kiểm tra minh chứng, và copilot hỗ trợ xét duyệt. Mục tiêu cuối cùng là biến quy trình hành chính phức tạp thành một trải nghiệm trực quan, minh bạch và hiệu quả cho tất cả các bên liên quan.

---

# 2. VẤN ĐỀ THỰC TIỄN VÀ BỐI CẢNH

## 2.1. Bối cảnh chung

Phong trào "Sinh viên 5 tốt" là một trong những phong trào trọng điểm của Hội Sinh viên Việt Nam, với hàng chục nghìn hồ sơ được nộp và xét duyệt mỗi năm qua nhiều cấp (khoa, trường, Trung ương). Mỗi hồ sơ bao gồm nhiều loại minh chứng đa dạng: bảng điểm, giấy chứng nhận, giấy khen, hình ảnh hoạt động tình nguyện, file scan, ảnh chụp điện thoại, bản PDF, link xác nhận... Quy trình hiện tại chủ yếu dựa vào thao tác thủ công và biểu mẫu giấy/form online đơn giản.

## 2.2. Các pain point cụ thể

### Phía sinh viên
- **Thiếu thông tin rõ ràng:** Sinh viên không biết chính xác tiêu chí SV5T được quy đổi ra sao trong đợt xét cụ thể, minh chứng nào được chấp nhận, mình còn thiếu tiêu chí nào.
- **Chuẩn bị hồ sơ bị động:** Nhiều sinh viên chỉ bắt đầu gom hồ sơ gần deadline, dẫn đến thiếu sót giấy tờ, nộp sai loại file, không biết trạng thái hồ sơ sau khi đã gửi.
- **Không có phản hồi tức thời:** Các câu hỏi lặp đi lặp lại ("giấy chứng nhận này có dùng được không?", "em thiếu tiêu chí gì?") không có kênh giải đáp nhanh chóng, phải chờ cán bộ Hội trả lời thủ công.
- **Lưu trữ minh chứng rời rạc:** Sinh viên tích cực phong trào có rất nhiều minh chứng nhưng lưu trữ phân tán, thiếu công cụ hệ thống hóa.

### Phía cán bộ Hội
- **Quá tải xử lý thủ công:** Mỗi đợt xét, cán bộ phải tiếp nhận hàng trăm đến hàng nghìn hồ sơ, mỗi hồ sơ gồm nhiều loại tài liệu rất không đồng nhất về định dạng và chất lượng.
- **Đọc – đối chiếu – phân loại thủ công:** Cán bộ phải đọc thủ công từng minh chứng, đối chiếu với tiêu chí, kiểm tra thiếu – đủ – hợp lệ, tốn rất nhiều thời gian và dễ sai sót.
- **Trả lời FAQ lặp lại:** Cùng những câu hỏi giống nhau từ nhiều sinh viên, cán bộ phải trả lời nhiều lần.
- **Thiếu công cụ thống kê:** Tổng hợp báo cáo theo đơn vị, theo tiêu chí, theo đợt xét chủ yếu bằng Excel, thiếu trực quan và khó truy vết.

### Hệ thống hiện tại
- Chưa có công cụ **hiểu nội dung minh chứng** (chỉ thu file, không kiểm tra nội dung).
- Chưa có khả năng **kiểm tra tính phù hợp** của minh chứng theo rule nghiệp vụ.
- Chưa có **phân loại hồ sơ theo mức rủi ro** để ưu tiên xử lý.
- Chưa có **hỗ trợ trả lời theo ngữ cảnh** từng sinh viên.
- Chưa có **đo lường trải nghiệm** để cải tiến theo dữ liệu.

## 2.3. Vì sao phải dùng AI?

Nếu chỉ dùng một hệ thống form online, kết quả tốt nhất vẫn chỉ là "thu file nhanh hơn". Toàn bộ phần việc khó nhất vẫn nằm ở con người: đọc – hiểu – phân loại – đối chiếu – phản hồi – thống kê.

AI là thành phần **bắt buộc** vì bài toán SV5T có 4 đặc điểm cốt lõi:

| # | Đặc điểm | Vai trò AI |
|---|---|---|
| 1 | **Dữ liệu phi cấu trúc** – ảnh, PDF, giấy scan, ảnh hoạt động, file nhiều định dạng | OCR, bóc tách thông tin, phân loại tự động |
| 2 | **Ngữ cảnh thay đổi** – mỗi trường, mỗi đợt xét, mỗi tiêu chí có thể khác nhau | AI trả lời theo context, không phải FAQ cứng |
| 3 | **Khối lượng lớn, thao tác lặp lại** – hàng nghìn hồ sơ/đợt | AI sơ loại, gắn nhãn rủi ro, giảm tải cho người |
| 4 | **Cần tương tác tự nhiên** – sinh viên cần hỏi bằng ngôn ngữ tự nhiên | Chatbot / Voicebot thông minh |

**Quan điểm thiết kế:** AI trong FiveGood Journey được dùng đúng chỗ – không phải để "thay thế cán bộ Hội", mà để tự động hóa phần đọc và chuẩn hóa dữ liệu, gợi ý và cảnh báo, hỗ trợ quyết định, và nâng trải nghiệm người dùng lên cấp cá nhân hóa.

---

# 3. GIẢI PHÁP ĐỀ XUẤT

## 3.1. Tổng quan giải pháp

FiveGood Journey tạo ra **5 lớp giá trị cốt lõi**:

### ① AI Mentor cá nhân hóa cho sinh viên
Sinh viên vào hệ thống không chỉ để nộp hồ sơ, mà để được tư vấn:
- "Em còn thiếu tiêu chí nào?"
- "Minh chứng này có dùng được không?"
- "Với hồ sơ hiện tại, em nên làm gì trong 2 tháng tới?"
- "Em có IELTS 6.5 và hoạt động CLB, còn thiếu gì cho tiêu chí Hội nhập?"

AI Mentor đọc trạng thái hồ sơ hiện tại, trả lời theo context cụ thể (không phải FAQ chung chung), đưa ra checklist tiếp theo, và gợi ý hoạt động hoặc minh chứng cần bổ sung.

**API BTC sử dụng:** VNPT Smartbot (hỏi đáp LLM), VNPT SmartVoice (hỗ trợ voice query).

### ② Journey Dashboard thay cho form nộp hồ sơ truyền thống
Thay vì bắt đầu bằng biểu mẫu, người dùng bắt đầu bằng **dashboard trực quan** thể hiện 5 trụ cột:

| Đạo đức tốt | Học tập tốt | Thể lực tốt | Tình nguyện tốt | Hội nhập tốt |
|:---:|:---:|:---:|:---:|:---:|
| ✅ Hoàn thành | 🔶 Đang tiến hành | ✅ Hoàn thành | ❌ Còn thiếu | 🔶 Đang tiến hành |

Mỗi trụ cột hiển thị: mức độ hoàn thành (%), checklist minh chứng, trạng thái đạt/thiếu/chưa có dữ liệu, và đề xuất việc tiếp theo.

### ③ AI kiểm tra minh chứng tự động (Evidence Intelligence)
Đây là xương sống kỹ thuật của sản phẩm. Khi sinh viên upload giấy chứng nhận, bảng điểm, ảnh hoạt động, file PDF, hệ thống sẽ:
- **Đọc OCR** bằng VNPT SmartReader / eKYC → bóc tách họ tên, ngày cấp, đơn vị cấp, nội dung.
- **Phân loại tự động** → gợi ý minh chứng thuộc tiêu chí nào.
- **Cảnh báo lỗi** → file mờ, thiếu thông tin, sai loại minh chứng.
- **Gắn nhãn rủi ro** (Valid / Suspect / Invalid) → cán bộ Hội xử lý nhanh hơn.

**Mô hình xác minh 3 lớp:**

| Lớp | Phương pháp | API BTC |
|---|---|---|
| Lớp 1 – Văn bản | OCR giấy chứng nhận, bóc tách trường dữ liệu, so khớp rule | SmartReader, eKYC |
| Lớp 2 – Hình ảnh | Phát hiện người/khuôn mặt trong ảnh hoạt động, compare face (có consent) | SmartVision, vnFace, eKYC |
| Lớp 3 – Ngữ cảnh | Tìm dấu vết công khai của sự kiện, đối chiếu thời gian/tên chương trình | vnSocial |

**Thang điểm rủi ro gợi ý:**
- OCR đọc được và khớp tên: +0.25
- Đơn vị cấp nằm trong whitelist: +0.20
- Nội dung khớp tiêu chí: +0.20
- Có dấu vết ngữ cảnh công khai: +0.15
- Hình ảnh hoạt động có face/person hợp lý: +0.20
- Phân loại: `0.80–1.00` = Valid | `0.50–0.79` = Suspect | `<0.50` = Invalid

**Thông điệp quan trọng:** "AI không thay cán bộ Hội ra quyết định cuối cùng. AI giúp loại bỏ 70–80% khối lượng thao tác lặp lại và đưa hồ sơ đúng mức ưu tiên cho người duyệt."

### ④ AI Copilot cho cán bộ Hội (Reviewer Portal)
Thay vì xem hàng trăm hồ sơ theo kiểu "mở file – đọc – đoán – ghi chú", cán bộ Hội được hỗ trợ bằng:
- **Dashboard duyệt hồ sơ** với bộ lọc theo trạng thái, khoa, kỳ xét, mức rủi ro AI.
- **AI Summary** cho từng hồ sơ – tóm tắt nhanh tình trạng minh chứng.
- **Evidence Preview** – xem nhanh minh chứng với OCR highlight.
- **Hành động nhanh** – Approve / Reject / Request Update với ghi log tự động.
- **Gợi ý batch review** – nhóm hồ sơ tương tự để duyệt nhanh.

**API BTC sử dụng:** VNPT SmartUX (đo lường hành vi sử dụng, tối ưu UX dashboard).

### ⑤ Digital Passport – Hồ sơ năng lực số
Sau khi sinh viên đạt danh hiệu, hệ thống tự động tạo **hồ sơ năng lực số** gồm:
- Thông tin được công nhận và cấp xét.
- Các thành tích nổi bật (GPA, giờ tình nguyện, chứng chỉ ngoại ngữ...).
- Timeline hoạt động.
- Bản tóm tắt năng lực do AI tổng hợp.
- QR code hoặc link chia sẻ công khai.

Đây là ý tưởng giúp sản phẩm **vượt khỏi khuôn khổ phần mềm nội bộ**, tạo giá trị dài hạn cho sinh viên và mở ra tiềm năng thị trường sau cuộc thi.

## 3.2. Đối tượng người dùng

| Persona | Đặc điểm | Nhu cầu chính |
|---|---|---|
| **Sinh viên chuẩn bị nộp hồ sơ** | Năm 2–4, không rành quy chế, dùng điện thoại là chính | Biết thiếu gì, minh chứng nào hợp lệ, hồ sơ đang ở đâu |
| **Sinh viên tích cực phong trào** | Nhiều hoạt động, minh chứng phân tán | Gom, chuẩn hóa, tận dụng thành tích tốt hơn |
| **Cán bộ Hội cấp khoa/trường** | Bận mùa xét, nhiều việc lặp lại | Giảm thao tác thủ công, dashboard lọc/thống kê, giải đáp FAQ |
| **Cấp quản lý phong trào** | Cần số liệu tổng hợp, insight | Báo cáo, dashboard, log duyệt, dữ liệu ra quyết định |

## 3.3. User Journey tổng thể

### Journey của sinh viên
1. Đăng nhập / tạo tài khoản
2. Khai báo thông tin cơ bản
3. Vào **Journey Dashboard** xem 5 tiêu chí và tiến độ
4. Hỏi **AI Mentor** để hiểu mình còn thiếu gì
5. **Upload minh chứng** → nhận phản hồi OCR tức thời
6. Xem gợi ý chỉnh sửa nếu minh chứng có vấn đề
7. Hoàn thiện hồ sơ và **nộp chính thức**
8. **Theo dõi trạng thái** xét duyệt
9. Nhận kết quả và **Digital Passport**

### Journey của cán bộ Hội
1. Đăng nhập dashboard admin
2. Chọn kỳ xét và bộ lọc
3. Xem danh sách hồ sơ **sắp xếp theo AI risk**
4. Vào chi tiết hồ sơ → xem OCR summary, AI label, file gốc
5. **Duyệt / yêu cầu bổ sung / từ chối** → ghi log tự động
6. Theo dõi **báo cáo thống kê** theo đơn vị, tiêu chí, đợt xét

---

# 4. THIẾT KẾ TỔNG QUAN HỆ THỐNG

## 4.1. Kiến trúc logic

```
┌───────────────────────────────────────────────────────────────┐
│                     NGƯỜI DÙNG                                │
│        🎓 Sinh viên         🏛️ Cán bộ Hội                    │
└──────────────────────┬────────────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │  🔐 Login       │  (Phân quyền Sinh viên / Cán bộ)
              └────────┬────────┘
                       │
              ┌────────▼────────────────────────────┐
              │  🌐 Next.js 15 (App Router)         │
              │  Frontend + API Routes (Server-side)│
              │  Vercel Production Deploy            │
              └──┬──────────┬──────────┬────────────┘
                 │          │          │
        ┌────────▼───┐ ┌────▼─────┐ ┌──▼──────────┐
        │ Groq AI    │ │ Supabase │ │ unpdf       │
        │            │ │          │ │             │
        │ • Vision   │ │ • Storage│ │ • PDF text  │
        │   Llama 4  │ │   Files  │ │   extraction│
        │ • LLM      │ │ • PgSQL  │ │ • Client-   │
        │   Llama 3.3│ │   (v2)   │ │   side      │
        └────────────┘ └──────────┘ └─────────────┘
                       │
          ┌────────────▼────────────┐
          │  🔮 VNPT AI APIs       │  (Tích hợp Vòng 2)
          │  SmartReader · eKYC    │
          │  SmartBot · SmartVoice │
          └────────────────────────┘
```

## 4.2. Luồng xử lý minh chứng (Core AI Pipeline)

```
Upload file ──▶ Kiểm tra định dạng ──▶ Gửi OCR (SmartReader/eKYC)
                                              │
                                       ┌──────▼──────┐
                                       │ Bóc tách    │
                                       │ text & fields│
                                       └──────┬──────┘
                                              │
                                       ┌──────▼──────┐
                                       │ Risk Scoring│
                                       │ Engine      │
                                       └──────┬──────┘
                                              │
                               ┌──────────────┼──────────────┐
                               │              │              │
                         ┌─────▼─────┐  ┌─────▼─────┐  ┌────▼──────┐
                         │  VALID    │  │  SUSPECT  │  │  INVALID  │
                         │ Sơ bộ OK │  │ Cần kiểm  │  │ Thay thế  │
                         └───────────┘  └───────────┘  └───────────┘
```

## 4.3. Mô hình dữ liệu chính (ERD tóm tắt)

| Bảng | Vai trò | Quan hệ chính |
|---|---|---|
| **users** | Tài khoản đăng nhập, phân quyền (Student/Reviewer/Admin) | 1–1 với students |
| **students** | Hồ sơ sinh viên (MSSV, họ tên, trường, khoa...) | 1–N với applications |
| **application_cycles** | Kỳ xét SV5T (tên, thời gian, trạng thái) | 1–N với applications |
| **applications** | Hồ sơ ứng tuyển của sinh viên trong 1 kỳ xét | 1–N với evidences, criteria_scores |
| **criteria** | 5 tiêu chí SV5T + tiêu chí con (subcriteria) | 1–N với subcriteria |
| **evidences** | Minh chứng upload (file, OCR result, AI label, risk score) | N–1 với applications, subcriteria |
| **criteria_scores** | Điểm từng tiêu chí cho từng hồ sơ (AI + reviewer) | N–1 với applications, criteria |
| **review_logs** | Log duyệt (ai duyệt, hành động gì, lúc nào, ghi chú) | N–1 với applications, users |
| **bot_sessions / bot_messages** | Lịch sử hội thoại AI Mentor | N–1 với users |

## 4.4. Thành phần kỹ thuật dự kiến

| Lớp | Công nghệ | Lý do chọn |
|---|---|---|
| Frontend | **Next.js 15** (App Router) + React 19 + Vanilla CSS | Mobile-first, SSR/SSG, API Routes tích hợp |
| API Layer | **Next.js API Routes** (Server-side) | Không cần backend riêng, Groq SDK chạy server-side |
| AI – Vision OCR | **Groq Cloud** – Llama 4 Scout 17B (Vision) | Đọc nội dung thật từ ảnh minh chứng |
| AI – Text/Chat | **Groq Cloud** – Llama 3.3 70B Versatile | AI Mentor chatbot + phân tích PDF text |
| PDF Processing | **unpdf** (client-side) | Trích xuất text từ PDF, không cần worker |
| File Storage | **Supabase Storage** | Lưu ảnh/PDF minh chứng, miễn phí tier |
| Database | **Supabase PostgreSQL** (vòng 2) | Ổn định, hỗ trợ JSON, RLS security |
| Deploy | **Vercel** | Auto-deploy từ GitHub, HTTPS, CDN global |
| AI Vòng 2 | **VNPT API** (SmartReader, eKYC, SmartBot, SmartVoice...) | Tận dụng tối đa hệ sinh thái BTC |

## 4.5. Wireframe minh họa

### Dashboard sinh viên
```
 ╔══════════════════════════════════════════════════════════╗
 ║  FiveGood Journey          Xin chào, Nguyễn Văn A  👤  ║
 ╠══════════════════════════════════════════════════════════╣
 ║  Tiến độ tổng thể: ████████████████░░░░░░░░  72%       ║
 ║                                                         ║
 ║  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐ ┌────┐ ║
 ║  │Đạo đức  │ │Học tập  │ │Thể lực  │ │T.Nguyện│ │H.Nhập║
 ║  │  ✅ 100%│ │ 🔶 80% │ │  ✅ 100%│ │ ❌ 40% │ │🔶 60%║
 ║  └─────────┘ └─────────┘ └─────────┘ └────────┘ └────┘ ║
 ╠══════════════════════════════════════════════════════════╣
 ║  📋 Việc cần làm tiếp theo                              ║
 ║  • Bổ sung minh chứng tình nguyện (ít nhất 1 giấy CN)  ║
 ║  • Cập nhật chứng chỉ tiếng Anh cho tiêu chí Hội nhập  ║
 ╠══════════════════════════════════════════════════════════╣
 ║  🤖 AI Mentor                                           ║
 ║  "Bạn còn thiếu 1 minh chứng cho tiêu chí Hội nhập.    ║
 ║   Gợi ý: upload chứng chỉ IELTS hoặc giấy CN hoạt     ║
 ║   động giao lưu quốc tế."                               ║
 ║  ┌──────────────────────────────────────────────┐ [Gửi] ║
 ║  │ Nhập câu hỏi...                             │       ║
 ║  └──────────────────────────────────────────────┘       ║
 ╠══════════════════════════════════════════════════════════╣
 ║  📎 Minh chứng gần đây                                  ║
 ║  │ Bảng điểm HK1     │ VALID   │ ✅ OCR OK             ║
 ║  │ Giấy CN CLB Tình N.│ SUSPECT │ ⚠️ Scan mờ           ║
 ╚══════════════════════════════════════════════════════════╝
```

### Dashboard cán bộ Hội (Reviewer)
```
 ╔══════════════════════════════════════════════════════════════╗
 ║  FiveGood Journey Admin        Kỳ xét: SV5T 2025-2026     ║
 ╠══════════════════════════════════════════════════════════════╣
 ║  Bộ lọc: [Trạng thái ▼] [Khoa ▼] [AI Risk ▼] [Đợt xét ▼] ║
 ╠══════════════════════════════════════════════════════════════╣
 ║  MSSV  │ Họ tên      │ Khoa │ Trạng thái │ AI Risk│Hành động║
 ║  20001 │ Nguyễn A    │ CNTT │ Submitted  │ 🟢 Low │ [Xem]  ║
 ║  20002 │ Trần B      │ QTKD │ Submitted  │ 🔴 High│ [Xem]  ║
 ║  20003 │ Lê C        │ Luật │ Need Update│ 🟡 Med │ [Xem]  ║
 ╠══════════════════════════════════════════════════════════════╣
 ║  📋 Chi tiết hồ sơ: Trần B (20002) - AI Risk: HIGH        ║
 ║  • MC 1: Bảng điểm → VALID (OCR: GPA 3.2, khớp tên)      ║
 ║  • MC 2: Giấy CN tình nguyện → SUSPECT (scan mờ, thiếu    ║
 ║    đơn vị cấp)                                              ║
 ║  • MC 3: Ảnh hoạt động → SUSPECT (không phát hiện face)    ║
 ║  🤖 AI Summary: "Hồ sơ thiếu MC tiêu chí Thể lực.         ║
 ║    2 MC nghi vấn cần kiểm tra thủ công."                    ║
 ║  [✅ Approve] [❌ Reject] [📝 Request Update]               ║
 ╚══════════════════════════════════════════════════════════════╝
```

---

# 5. TÍNH ĐỔI MỚI VÀ KHÁC BIỆT

## 5.1. So sánh với cách làm phổ biến

| Khía cạnh | Cách làm phổ biến hiện tại | FiveGood Journey |
|---|---|---|
| Hướng dẫn sinh viên | FAQ thủ công / file hướng dẫn PDF | **AI Mentor cá nhân hóa** theo context hồ sơ |
| Chuẩn bị hồ sơ | Tự gom giấy tờ, nộp qua form | **Journey Dashboard** với checklist + progress |
| Xử lý minh chứng | Cán bộ xem thủ công 100% | **OCR + AI extraction + AI label** tự động |
| Duyệt hồ sơ | Reviewer đọc toàn bộ từ đầu | **AI Copilot** tóm tắt + phân loại risk |
| Sau xét duyệt | Dừng ở kết quả hành chính | **Digital Passport** – hồ sơ năng lực số |
| Tối ưu trải nghiệm | Đánh giá cảm tính | **SmartUX** – data-driven UX optimization |
| Xác minh minh chứng | Chỉ xem bằng mắt | **Mô hình 3 lớp** (văn bản + hình ảnh + ngữ cảnh) |

## 5.2. Điểm đổi mới cốt lõi

Khác biệt của FiveGood Journey không nằm ở 1 tính năng đơn lẻ, mà ở **cụm đổi mới liên kết**:

1. **AI Mentor cá nhân hóa** – Không phải chatbot FAQ chung chung, mà là trợ lý hiểu trạng thái hồ sơ cụ thể của từng sinh viên và đưa gợi ý phù hợp.

2. **Journey-centric UX** – Biến quy trình hành chính thành hành trình phấn đấu có mục tiêu, milestone, feedback tức thời.

3. **Evidence Intelligence Pipeline** – Hệ thống OCR + classification + risk scoring chuyên biệt cho minh chứng SV5T, sử dụng đồng thời nhiều API (SmartReader, eKYC, SmartVision, vnSocial).

4. **Reviewer Copilot** – Dashboard AI-assisted giúp cán bộ duyệt nhanh, nhất quán, có truy vết.

5. **Digital Passport** – Giá trị vượt khỏi khuôn khổ phần mềm xét duyệt, hướng tới hồ sơ năng lực số cho sinh viên.

## 5.3. Vì sao đây không phải "thêm chatbot vào form"

Nhiều giải pháp có thể chỉ dừng ở việc gắn một chatbot FAQ vào cổng nộp hồ sơ online. FiveGood Journey khác ở chỗ:
- AI không chỉ trả lời câu hỏi, mà **chủ động đề xuất** việc sinh viên nên làm tiếp.
- Hệ thống không chỉ thu file, mà **hiểu nội dung** file và **phản hồi tức thời**.
- Cán bộ Hội không phải đọc lại từ đầu, mà nhận **bản tóm tắt AI** và **phân loại ưu tiên**.
- Giá trị sản phẩm không kết thúc ở "nộp hồ sơ", mà kéo dài đến **Digital Passport** và có tiềm năng mở rộng sang CV AI, analytics phong trào.

---

# 6. TÍNH KHẢ THI KHI TRIỂN KHAI

## 6.1. Khả thi về kỹ thuật

| Yếu tố | Đánh giá | Chi tiết |
|---|---|---|
| **Stack kỹ thuật** | ✅ Khả thi cao | Next.js + FastAPI + PostgreSQL – stack phổ biến, mature, dễ tuyển dev |
| **API BTC** | ✅ Sẵn sàng | SmartReader, eKYC, Smartbot, SmartVoice, SmartVision, vnFace, vnSocial, SmartUX – BTC cung cấp sẵn cho vòng 2 |
| **OCR minh chứng** | ✅ Khả thi | SmartReader + eKYC đã có khả năng đọc giấy tờ tiếng Việt |
| **Chatbot** | ✅ Khả thi | Smartbot nâng cao hỗ trợ LLM, có thể dùng RAG với knowledge base tiêu chí SV5T |
| **Deploy** | ✅ Khả thi | Docker Compose → cài đặt 1 lệnh, phù hợp yêu cầu vòng 2 |
| **Thời gian** | ✅ Hợp lý | MVP cốt lõi có thể hoàn thành trong 7–10 ngày với team 3–5 người |

## 6.2. Khả thi về nhân lực

Đội 3–5 người có thể phân công hợp lý:

| Vai trò | Số lượng | Công việc chính |
|---|---|---|
| Backend / API Integration | 1 | Database, API gateway, tích hợp VNPT APIs |
| Frontend | 1 | Dashboard SV + Reviewer, UI/UX mobile-first |
| AI / Data Pipeline | 1 | OCR pipeline, risk scoring, chatbot RAG |
| PM / BA / Test | 1 | Viết test, chuẩn bị demo, quản lý tiến độ |
| UI/UX + Slide | 0–1 | Thiết kế wireframe, chuẩn bị proposal/pitch |

## 6.3. Khả thi về dữ liệu

- **Dữ liệu đầu vào** hoàn toàn từ nguồn hợp pháp: thông tin sinh viên tự cung cấp, minh chứng sinh viên upload, cấu hình tiêu chí do đơn vị quản lý nhập, dữ liệu tương tác và log do hệ thống sinh ra.
- **Không cần training model riêng** – tận dụng API có sẵn của BTC (SmartReader cho OCR, Smartbot cho LLM, SmartVision cho image analysis).
- **Knowledge base** cho AI Mentor có thể xây từ quy chế SV5T công khai + rule nghiệp vụ do admin cấu hình.

## 6.4. Khả thi về chi phí

- **Giai đoạn MVP**: Chi phí thấp – API do BTC cung cấp miễn phí, infra chỉ cần 1 VPS hoặc EC2 nhỏ cho demo.
- **Giai đoạn pilot**: Compute chủ yếu nằm ở OCR và API gọi theo sự kiện, không cần GPU riêng, không cần training model.
- **Giai đoạn mở rộng**: Có thể chuyển sang mô hình SaaS theo trường/theo số hồ sơ.

## 6.5. Khả thi về pháp lý và bảo mật

| Yêu cầu | Giải pháp |
|---|---|
| Bảo mật dữ liệu | HTTPS, mã hóa file lưu trữ |
| Phân quyền | Role-based access control (Student / Reviewer / Admin) |
| Truy vết | Audit log cho mọi hành động reviewer/admin |
| Quyền riêng tư | Face compare chỉ kích hoạt khi có consent rõ ràng |
| Mục đích sử dụng | Dữ liệu chỉ dùng cho mục đích xét duyệt và hỗ trợ người dùng |

## 6.6. Phù hợp yêu cầu kỹ thuật vòng 2

FiveGood Journey được thiết kế ngay từ đầu để đáp ứng các tiêu chí kỹ thuật của vòng 2:

| Yêu cầu vòng 2 | Cách đáp ứng |
|---|---|
| Demo MVP ổn định | Kịch bản demo end-to-end: SV upload → OCR → AI label → Reviewer duyệt → Digital Passport |
| Repo code | Public GitHub repo với README đầy đủ |
| Cài đặt 1 lệnh | `docker compose up` khởi chạy toàn bộ hệ thống |
| Script test tự động | Unit test + integration test cho API chính |
| Tính ổn định | Các luồng chính chạy ổn định nhiều lần |
| Bảo mật dữ liệu | HTTPS + RBAC + audit log |
| UX | Mobile-first, ngôn ngữ dễ hiểu |
| Khả năng mở rộng | Multi-tenant, white-label, module hóa |

---

# 7. TÁC ĐỘNG DỰ KIẾN

## 7.1. Tác động xã hội

- **Tăng khả năng tiếp cận phong trào:** Sinh viên hiểu rõ tiêu chí hơn, biết cách chuẩn bị hồ sơ từ sớm, giảm cảm giác "mơ hồ thủ tục".
- **Khuyến khích phấn đấu dài hạn:** Journey Dashboard tạo động lực cho sinh viên phấn đấu theo từng chặng thay vì "chạy giấy tờ" sát deadline.
- **Công bằng và minh bạch:** Quy trình xét duyệt có truy vết, có log, giảm yếu tố chủ quan.
- **Nâng cao chất lượng phong trào:** Khi sinh viên hiểu rõ tiêu chí và được đồng hành, chất lượng hồ sơ và chất lượng phong trào đều tăng.

## 7.2. Tác động vận hành

| Chỉ số | Trước FiveGood Journey | Sau FiveGood Journey (dự kiến) |
|---|---|---|
| Thời gian sơ loại 1 hồ sơ | 15–30 phút | 3–5 phút (giảm 70–80%) |
| Thời gian trả lời FAQ | 5–10 phút/câu (thủ công) | Tức thời (AI Mentor) |
| Tỷ lệ hồ sơ thiếu minh chứng khi nộp | 30–40% | <10% (nhờ checklist + AI gợi ý) |
| Khả năng truy vết quyết định | Rất thấp (ghi chép tay) | 100% (audit log tự động) |
| Thời gian tổng hợp báo cáo | 1–2 ngày (Excel) | Tức thời (dashboard real-time) |

## 7.3. Tác động dữ liệu

- Có data để nhìn lại **chất lượng phong trào** qua các năm.
- Biết **tiêu chí nào sinh viên thường yếu** để có chính sách hỗ trợ.
- Biết **FAQ nào xuất hiện nhiều nhất** để cải tiến hướng dẫn.
- Có **cơ sở dữ liệu** để cải tiến quy trình năm sau theo hướng data-driven.

---

# 8. PHƯƠNG HƯỚNG TRIỂN KHAI VÀ ROADMAP

## 8.1. Giai đoạn 0 – Vòng 1 (Tháng 6/2026)
- ✅ Hoàn thiện proposal
- ✅ Sơ đồ kiến trúc
- ✅ Wireframe chính
- ✅ Slide pitching

## 8.2. Giai đoạn 1 – Vòng 2 (26/6 – 3/7/2026)
- Build MVP core: Dashboard SV + Upload minh chứng + OCR pipeline + AI Mentor chatbot + Dashboard Reviewer
- Tích hợp: SmartReader + eKYC + Smartbot + SmartVoice
- Dockerize toàn bộ hệ thống (cài đặt 1 lệnh)
- Viết test tự động
- Chuẩn bị kịch bản demo

## 8.3. Giai đoạn 2 – 3 tháng sau cuộc thi
- Pilot tại 1 trường đại học
- Thu feedback thực từ sinh viên và cán bộ Hội
- Cải thiện risk scoring engine và UX
- Bổ sung SmartVision (check ảnh hoạt động), SmartUX (tracking)

## 8.4. Giai đoạn 3 – 12 tháng
- Digital Passport hoàn chỉnh
- CV AI – biến hồ sơ SV5T thành CV năng lực số
- SmartUX analytics dashboard
- Mở rộng liên trường (multi-tenant)
- White-label cho từng đơn vị

## 8.5. TAM – SAM – SOM

| Thị trường | Phạm vi |
|---|---|
| **TAM** (Total Addressable Market) | Tất cả các trường ĐH, học viện, CĐ có hoạt động xét chọn SV5T và phong trào sinh viên tương tự |
| **SAM** (Serviceable Available Market) | Nhóm trường có nhu cầu chuyển đổi số mạnh, khối lượng hồ sơ lớn, có bộ phận Hội hoạt động thường xuyên |
| **SOM** (Serviceable Obtainable Market) | 12 tháng đầu: pilot 1 trường → mở rộng 2–3 khoa → nhân rộng 2–3 trường lân cận |

## 8.6. Go-to-Market Strategy

| Giai đoạn | Chiến lược |
|---|---|
| **Đầu** | Sản phẩm pilot / social impact, bám vào mạng lưới Hội Sinh viên |
| **Sau** | SaaS theo trường / theo số hồ sơ, white-label cho từng đơn vị |
| **Nâng cao** | Digital Passport marketplace, CV AI, analytics phong trào |

---

# 9. TẬN DỤNG HỆ SINH THÁI API CỦA BTC

FiveGood Journey được thiết kế để **tận dụng tối đa** hệ sinh thái API do Ban Tổ chức cung cấp, không chỉ dùng 1–2 API mà kết hợp **nhiều API theo vai trò chuyên biệt**:

| Chức năng trong sản phẩm | API BTC sử dụng | Cách tích hợp cụ thể |
|---|---|---|
| **Chatbot AI Mentor** hỏi đáp theo ngữ cảnh | VNPT Smartbot (nâng cao) | RAG với knowledge base tiêu chí SV5T + trạng thái hồ sơ sinh viên |
| **Voice query** cho sinh viên | VNPT SmartVoice | STT để nhận câu hỏi voice → Smartbot xử lý → TTS trả lời |
| **OCR bảng điểm, giấy chứng nhận** | VNPT SmartReader | Đọc, bóc tách thông tin từ minh chứng scan/ảnh chụp |
| **OCR giấy tờ tùy thân, liveness** | VNPT eKYC | Hỗ trợ xác minh giấy tờ có ảnh, kiểm tra liveness |
| **So khớp khuôn mặt** | vnFace / eKYC Compare | So khớp ảnh chân dung SV với ảnh trong minh chứng hoạt động (có consent) |
| **Phân tích ảnh hoạt động** | VNPT SmartVision | Phát hiện người / khuôn mặt trong ảnh sự kiện, hỗ trợ xác minh |
| **Xác minh ngữ cảnh sự kiện** | vnSocial | Tìm dấu vết công khai của sự kiện trên mạng, đối chiếu tên/ngày |
| **Đo lường trải nghiệm UX** | VNPT SmartUX | Tracking click, drop-off, thời gian thao tác → cải tiến UX data-driven |

**Điểm cộng chiến lược:** Trong khi nhiều đội thi có thể chỉ dùng 1 chatbot, FiveGood Journey sử dụng **8/8 nhóm API** theo vai trò chuyên biệt, thể hiện đúng tinh thần "phát triển giải pháp AI sử dụng hệ sinh thái API sẵn có của Ban Tổ chức".

---

# 10. KẾT LUẬN

## 10.1. Tóm tắt giá trị

**FiveGood Journey** giải quyết trực tiếp bài toán mà Ban Tổ chức đề ra cho đề tài 5: hỗ trợ đổi mới, nâng cao hiệu quả công tác Hội và phong trào sinh viên, tối ưu hóa quy trình quản lý, đánh giá, xét chọn danh hiệu "Sinh viên 5 tốt cấp Trung ương".

Sản phẩm tạo giá trị ở **cả hai phía**:
- **Sinh viên** được đồng hành bởi AI Mentor, biết rõ tiến độ qua Journey Dashboard, nhận phản hồi minh chứng tức thời, và có Digital Passport sau khi đạt danh hiệu.
- **Cán bộ Hội** được hỗ trợ bởi AI Copilot, giảm 70–80% thao tác lặp lại, có dashboard trực quan, và audit log minh bạch.

## 10.2. Vì sao nên chọn FiveGood Journey?

| Tiêu chí đánh giá Vòng 1 | FiveGood Journey đáp ứng |
|---|---|
| **Phù hợp đề bài (25đ)** | Bám sát 100% mô tả đề tài 5 – hỗ trợ xét chọn SV5T, tận dụng đầy đủ hệ sinh thái API BTC |
| **Đổi mới/Khác biệt (20đ)** | Cụm 5 đổi mới liên kết: AI Mentor + Journey Dashboard + Evidence Intelligence + Reviewer Copilot + Digital Passport |
| **Khả thi (25đ)** | Stack đơn giản, API sẵn có, team 3–5 người, MVP 7–10 ngày, Docker 1 lệnh |
| **Tác động dự kiến (20đ)** | Giảm 70–80% thao tác thủ công, tăng minh bạch, tạo giá trị dài hạn cho SV |
| **Chất lượng hồ sơ (10đ)** | Proposal đầy đủ, rõ ràng, có kiến trúc, wireframe, ERD, user journey, roadmap |

## 10.3. Demo MVP đã triển khai (Vòng 1)

Để chứng minh tính khả thi, đội đã xây dựng và deploy **MVP hoàn chỉnh** ngay từ vòng 1:

| Mục | Chi tiết |
|---|---|
| **Demo URL** | **https://fivegood-demo.vercel.app** |
| **GitHub Repo** | https://github.com/khiemdztv/fivegood-demo |
| **Tính năng hoạt động** | Login phân quyền, Dashboard SV5T, AI Mentor (Groq Llama 3.3), Upload OCR ảnh (Groq Vision Llama 4), Upload OCR PDF (unpdf + Groq), Digital Passport, Reviewer Dashboard, Analytics & Thống kê |
| **AI thật** | Groq Cloud API – không mock data, phân tích nội dung thật từ file upload |
| **Tech Stack** | Next.js 15, React 19, Groq AI, Supabase, unpdf, Vercel |

## 10.4. Cam kết

Nếu được vào vòng 2, đội thi cam kết:
- Hoàn thành sản phẩm end-to-end tích hợp API VNPT trong thời gian quy định.
- Tích hợp tối thiểu 4–5 nhóm API của BTC (SmartReader, eKYC, SmartBot, SmartVoice, SmartVision).
- Cung cấp repo code sạch, hướng dẫn cài đặt, tài liệu kỹ thuật đầy đủ.
- Chuẩn bị kịch bản demo ổn định, trực quan, thể hiện đúng giá trị sản phẩm.

---

> **FiveGood Journey – Biến hành trình Sinh viên 5 tốt từ "thủ tục" thành "trải nghiệm".**
>
> 🌐 Demo: https://fivegood-demo.vercel.app
> 📂 GitHub: https://github.com/khiemdztv/fivegood-demo

---

*Tài liệu được biên soạn bởi đội [Tên đội] – Vietnamese Student HackAIthon 2026*
*Ngày nộp: 07/06/2026*

