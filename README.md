# ⭐ FiveGood Journey – SV5T Copilot

> **AI đồng hành cùng hành trình Sinh viên 5 Tốt**
> 
> 🏆 Vietnamese Student HackAIthon 2026 · Bảng B Challenger · Đề tài 5

## 🌐 Demo

**Live Demo:** [fivegood-demo.vercel.app](https://fivegood-demo.vercel.app)

## 🎯 Tổng quan

FiveGood Journey là nền tảng AI hỗ trợ toàn bộ quy trình "Sinh viên 5 tốt" (SV5T), phục vụ cả **sinh viên** và **cán bộ Hội**:

- 🎓 **Sinh viên**: Dashboard tiến độ, AI Mentor hỏi đáp, Upload minh chứng AI OCR, Digital Passport
- 🏛️ **Cán bộ Hội**: Duyệt hồ sơ AI-assisted, Thống kê & Báo cáo, AI Copilot hỗ trợ

## ✨ Tính năng chính

| Tính năng | Mô tả | AI Engine |
|---|---|---|
| 🔐 Login phân quyền | Sinh viên / Cán bộ Hội | Role-based |
| 🎓 Dashboard SV5T | Tiến độ 5 tiêu chí | — |
| 🤖 AI Mentor | Chatbot hỏi đáp SV5T realtime | Groq Llama 3.3 70B |
| 📄 Upload OCR (ảnh) | Đọc nội dung thật từ ảnh minh chứng | Groq Vision Llama 4 Scout |
| 📄 Upload OCR (PDF) | Trích xuất text + AI phân tích | unpdf + Groq Llama 3.3 |
| 🎫 Digital Passport | Hồ sơ năng lực số SV5T | — |
| 🏛️ Reviewer Dashboard | Duyệt hồ sơ cho cán bộ | AI risk scoring |
| 📊 Analytics | Thống kê & báo cáo | Data visualization |

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router) · React 19 · Vanilla CSS
- **AI:** Groq Cloud – Llama 4 Scout (Vision) + Llama 3.3 70B (Text)
- **Storage:** Supabase (Files + PostgreSQL)
- **PDF:** unpdf (client-side text extraction)
- **Deploy:** Vercel (auto-deploy from GitHub)

## 🚀 Cài đặt local

```bash
# Clone
git clone https://github.com/khiemdztv/fivegood-demo.git
cd fivegood-demo

# Install
npm install

# Tạo .env.local
echo "GROQ_API_KEY=your_groq_api_key" > .env.local

# Run
npm run dev
```

Mở http://localhost:3000

## 📂 Cấu trúc

```
fivegood-demo/
├── app/
│   ├── api/chat/       # AI Mentor endpoint
│   ├── api/ocr/        # OCR Analysis endpoint
│   ├── dashboard/      # Dashboard sinh viên
│   ├── mentor/         # AI Mentor chatbot
│   ├── upload/         # Upload minh chứng
│   ├── passport/       # Digital Passport
│   ├── reviewer/       # Duyệt hồ sơ (Cán bộ)
│   ├── analytics/      # Thống kê
│   ├── architecture/   # Kiến trúc hệ thống
│   └── login/          # Login phân quyền
├── components/         # Sidebar, shared components
├── lib/                # Auth context, Supabase client
├── data/               # Mock data & criteria
└── docs/               # Proposal vòng 1
```

## 📄 Tài liệu

- [Proposal Vòng 1](docs/FiveGood-Journey-Proposal-Vong1.md) – Bản mô tả ý tưởng đầy đủ

## 👥 Đội thi

Vietnamese Student HackAIthon 2026 · Bảng B Challenger · Đề tài 5

---

*Built with ❤️ for Vietnamese students*
