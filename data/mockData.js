// ═══════════════════════════════════════════
// FiveGood Journey – Mock Data
// ═══════════════════════════════════════════

export const currentStudent = {
  id: 'sv-001',
  studentCode: '20210001',
  fullName: 'Nguyễn Minh Anh',
  email: 'minhanh@student.edu.vn',
  phone: '0901234567',
  faculty: 'Công nghệ Thông tin',
  className: 'CNTT-K21A',
  school: 'Trường Đại học Bách Khoa TP.HCM',
  year: 3,
  gpa: 3.65,
  avatarUrl: null,
  createdAt: '2024-09-01',
};

export const applicationCycle = {
  id: 'cycle-2026',
  name: 'Xét chọn SV5T năm học 2025–2026',
  startDate: '2026-03-01',
  endDate: '2026-06-30',
  status: 'OPEN',
};

export const criteria = [
  {
    id: 'c1',
    code: 'DAO_DUC',
    name: 'Đạo đức tốt',
    icon: '🌟',
    color: '#3b82f6',
    progress: 100,
    status: 'complete',
    subcriteria: [
      { id: 'sc1-1', name: 'Chấp hành nội quy nhà trường', status: 'complete' },
      { id: 'sc1-2', name: 'Không vi phạm pháp luật', status: 'complete' },
      { id: 'sc1-3', name: 'Điểm rèn luyện ≥ 80', status: 'complete' },
    ],
  },
  {
    id: 'c2',
    code: 'HOC_TAP',
    name: 'Học tập tốt',
    icon: '📚',
    color: '#8b5cf6',
    progress: 85,
    status: 'in_progress',
    subcriteria: [
      { id: 'sc2-1', name: 'GPA ≥ 2.5 / 4.0', status: 'complete' },
      { id: 'sc2-2', name: 'Không nợ môn', status: 'complete' },
      { id: 'sc2-3', name: 'Có NCKH hoặc đề tài', status: 'missing' },
    ],
  },
  {
    id: 'c3',
    code: 'THE_LUC',
    name: 'Thể lực tốt',
    icon: '💪',
    color: '#10b981',
    progress: 100,
    status: 'complete',
    subcriteria: [
      { id: 'sc3-1', name: 'Đạt chuẩn TDTT', status: 'complete' },
      { id: 'sc3-2', name: 'Tham gia CLB thể thao / giải đấu', status: 'complete' },
    ],
  },
  {
    id: 'c4',
    code: 'TINH_NGUYEN',
    name: 'Tình nguyện tốt',
    icon: '❤️',
    color: '#ef4444',
    progress: 45,
    status: 'missing',
    subcriteria: [
      { id: 'sc4-1', name: 'Tham gia chiến dịch tình nguyện', status: 'missing' },
      { id: 'sc4-2', name: 'Hoạt động cộng đồng ≥ 5 ngày', status: 'in_progress' },
      { id: 'sc4-3', name: 'Có giấy xác nhận tình nguyện', status: 'missing' },
    ],
  },
  {
    id: 'c5',
    code: 'HOI_NHAP',
    name: 'Hội nhập tốt',
    icon: '🌍',
    color: '#06b6d4',
    progress: 60,
    status: 'in_progress',
    subcriteria: [
      { id: 'sc5-1', name: 'Ngoại ngữ (IELTS ≥ 5.5 hoặc tương đương)', status: 'complete' },
      { id: 'sc5-2', name: 'Tham gia hoạt động giao lưu quốc tế', status: 'missing' },
      { id: 'sc5-3', name: 'Kỹ năng mềm / CLB', status: 'complete' },
    ],
  },
];

export const evidences = [
  {
    id: 'ev-001',
    criteriaId: 'c1',
    subcriteriaId: 'sc1-3',
    fileName: 'phieu_diem_ren_luyen_hk1.pdf',
    fileType: 'PDF',
    aiValidity: 'VALID',
    aiScore: 0.95,
    extractedText: 'Phiếu điểm rèn luyện\nHọ tên: Nguyễn Minh Anh\nMSSV: 20210001\nHK1 2025-2026: 92/100 điểm\nXếp loại: Xuất sắc',
    extractedFields: {
      hoTen: 'Nguyễn Minh Anh',
      mssv: '20210001',
      diemRenLuyen: '92',
      xepLoai: 'Xuất sắc',
    },
    uploadedAt: '2026-05-15',
    reviewStatus: 'pending',
  },
  {
    id: 'ev-002',
    criteriaId: 'c2',
    subcriteriaId: 'sc2-1',
    fileName: 'bang_diem_hk1_2025.jpg',
    fileType: 'IMAGE',
    aiValidity: 'VALID',
    aiScore: 0.88,
    extractedText: 'Bảng điểm học kỳ 1\nNguyễn Minh Anh - 20210001\nGPA HK: 3.72\nGPA tích lũy: 3.65',
    extractedFields: {
      hoTen: 'Nguyễn Minh Anh',
      mssv: '20210001',
      gpaHK: '3.72',
      gpaTichLuy: '3.65',
    },
    uploadedAt: '2026-05-16',
    reviewStatus: 'pending',
  },
  {
    id: 'ev-003',
    criteriaId: 'c3',
    subcriteriaId: 'sc3-2',
    fileName: 'giay_cn_clb_bong_da.pdf',
    fileType: 'PDF',
    aiValidity: 'SUSPECT',
    aiScore: 0.62,
    extractedText: 'Giấy chứng nhận\nCâu lạc bộ Bóng đá\nXác nhận: Nguyễn Minh Anh\nlà thành viên tích cực...',
    extractedFields: {
      hoTen: 'Nguyễn Minh Anh',
      donViCap: 'CLB Bóng đá',
      ngayCap: '15/04/2026',
    },
    uploadedAt: '2026-05-18',
    reviewStatus: 'pending',
    aiNote: 'File scan mờ, không rõ con dấu. Đề xuất upload lại bản rõ hơn.',
  },
  {
    id: 'ev-004',
    criteriaId: 'c5',
    subcriteriaId: 'sc5-1',
    fileName: 'chung_chi_ielts.jpg',
    fileType: 'IMAGE',
    aiValidity: 'VALID',
    aiScore: 0.92,
    extractedText: 'IELTS Test Report Form\nCandidate: NGUYEN MINH ANH\nOverall Band Score: 6.5\nDate: 20/01/2026',
    extractedFields: {
      hoTen: 'NGUYEN MINH ANH',
      loaiChungChi: 'IELTS',
      diem: '6.5',
      ngayThi: '20/01/2026',
    },
    uploadedAt: '2026-05-20',
    reviewStatus: 'pending',
  },
];

export const chatScenarios = [
  {
    id: 'chat-1',
    question: 'Em còn thiếu tiêu chí nào?',
    answer: `Chào Minh Anh! 👋 Mình đã xem hồ sơ của bạn rồi.

📊 **Tình trạng hiện tại:**
- ✅ Đạo đức tốt: **Hoàn thành** (92 điểm rèn luyện)
- 🔶 Học tập tốt: **85%** – còn thiếu minh chứng NCKH/đề tài
- ✅ Thể lực tốt: **Hoàn thành**
- ❌ Tình nguyện tốt: **45%** – cần bổ sung giấy xác nhận tình nguyện
- 🔶 Hội nhập tốt: **60%** – còn thiếu hoạt động giao lưu quốc tế

📋 **Việc cần làm ngay:**
1. Upload giấy xác nhận tham gia chiến dịch tình nguyện
2. Bổ sung minh chứng hoạt động giao lưu quốc tế
3. Thêm minh chứng NCKH nếu có`,
  },
  {
    id: 'chat-2',
    question: 'Minh chứng giấy khen CLB có dùng được không?',
    answer: `Giấy khen CLB **có thể dùng được** nhé! Tùy vào tiêu chí:

📌 **Nếu là CLB thể thao** → dùng cho tiêu chí **Thể lực tốt**
📌 **Nếu là CLB học thuật** → dùng cho tiêu chí **Hội nhập tốt** (kỹ năng mềm)
📌 **Nếu là CLB tình nguyện** → dùng cho tiêu chí **Tình nguyện tốt**

⚠️ **Lưu ý quan trọng:**
- Giấy khen cần có **con dấu** và **chữ ký** của đơn vị cấp
- Nên upload bản **scan rõ nét**, không chụp nghiêng
- Nội dung phải thể hiện rõ **tên bạn** và **hoạt động cụ thể**

Bạn upload lên, AI sẽ kiểm tra và phản hồi ngay! 🚀`,
  },
  {
    id: 'chat-3',
    question: 'Em có IELTS 6.5, cần thêm gì cho tiêu chí Hội nhập?',
    answer: `Tuyệt vời! IELTS 6.5 đã đáp ứng yêu cầu ngoại ngữ rồi! ✅

Tuy nhiên, tiêu chí **Hội nhập tốt** còn cần thêm:

🌍 **Hoạt động giao lưu quốc tế** (đang thiếu):
- Tham gia hội thảo/workshop quốc tế
- Trao đổi sinh viên (exchange program)
- Tham gia cuộc thi quốc tế
- Hoạt động với sinh viên quốc tế tại trường

💡 **Gợi ý cụ thể:**
Trường mình sắp có **International Student Day** vào tháng 6. Bạn nên đăng ký tham gia và xin giấy xác nhận nhé!

📅 Deadline nộp hồ sơ: **30/06/2026** – còn ~3 tuần nữa.`,
  },
  {
    id: 'chat-4',
    question: 'Hồ sơ em đang ở trạng thái nào rồi?',
    answer: `📋 **Trạng thái hồ sơ của bạn:** DRAFT (Đang soạn)

📊 **Tiến độ tổng thể: 72%**

| Tiêu chí | Trạng thái | Minh chứng |
|---|---|---|
| Đạo đức tốt | ✅ Đạt | 1 MC hợp lệ |
| Học tập tốt | 🔶 Thiếu | 1/2 MC |
| Thể lực tốt | ✅ Đạt | 1 MC (cần review) |
| Tình nguyện | ❌ Thiếu | 0 MC |
| Hội nhập | 🔶 Thiếu | 1/2 MC |

⏰ Bạn cần hoàn thành và nhấn **"Gửi hồ sơ"** trước ngày **30/06/2026**.

Khi gửi, hệ thống sẽ kiểm tra tự động và chuyển cho cán bộ Hội duyệt.`,
  },
];

export const reviewerApplications = [
  {
    id: 'app-001',
    studentCode: '20210001',
    fullName: 'Nguyễn Minh Anh',
    faculty: 'Công nghệ Thông tin',
    status: 'SUBMITTED',
    aiRiskLevel: 'MEDIUM',
    overallScore: 72,
    submittedAt: '2026-05-25',
    evidenceCount: 4,
    criteriaStatus: { c1: 'pass', c2: 'partial', c3: 'review', c4: 'fail', c5: 'partial' },
    aiSummary: 'Hồ sơ đạt 3/5 tiêu chí. Thiếu minh chứng tình nguyện. 1 MC nghi vấn (CLB Bóng đá – scan mờ). Đề xuất yêu cầu bổ sung.',
  },
  {
    id: 'app-002',
    studentCode: '20210015',
    fullName: 'Trần Hoàng Nam',
    faculty: 'Quản trị Kinh doanh',
    status: 'SUBMITTED',
    aiRiskLevel: 'HIGH',
    overallScore: 45,
    submittedAt: '2026-05-24',
    evidenceCount: 3,
    criteriaStatus: { c1: 'pass', c2: 'fail', c3: 'pass', c4: 'fail', c5: 'fail' },
    aiSummary: 'Hồ sơ chỉ đạt 2/5 tiêu chí. Thiếu nhiều minh chứng quan trọng. 2 MC có dấu hiệu không phù hợp. Đề xuất từ chối hoặc yêu cầu bổ sung toàn bộ.',
  },
  {
    id: 'app-003',
    studentCode: '20210022',
    fullName: 'Lê Thị Bích Ngọc',
    faculty: 'Ngoại ngữ',
    status: 'SUBMITTED',
    aiRiskLevel: 'LOW',
    overallScore: 95,
    submittedAt: '2026-05-23',
    evidenceCount: 8,
    criteriaStatus: { c1: 'pass', c2: 'pass', c3: 'pass', c4: 'pass', c5: 'pass' },
    aiSummary: 'Hồ sơ hoàn chỉnh, đạt tất cả 5 tiêu chí. Tất cả minh chứng hợp lệ (VALID). GPA 3.8, IELTS 7.5, 200 giờ tình nguyện. Đề xuất duyệt nhanh.',
  },
  {
    id: 'app-004',
    studentCode: '20210038',
    fullName: 'Phạm Đức Minh',
    faculty: 'Cơ khí',
    status: 'UNDER_REVIEW',
    aiRiskLevel: 'MEDIUM',
    overallScore: 68,
    submittedAt: '2026-05-22',
    evidenceCount: 5,
    criteriaStatus: { c1: 'pass', c2: 'pass', c3: 'review', c4: 'partial', c5: 'fail' },
    aiSummary: 'Hồ sơ đạt 2/5 tiêu chí hoàn chỉnh. Tiêu chí Thể lực cần xác minh thêm ảnh hoạt động. Tiêu chí Hội nhập thiếu minh chứng ngoại ngữ.',
  },
  {
    id: 'app-005',
    studentCode: '20210045',
    fullName: 'Vũ Thanh Hương',
    faculty: 'Luật',
    status: 'SUBMITTED',
    aiRiskLevel: 'LOW',
    overallScore: 88,
    submittedAt: '2026-05-26',
    evidenceCount: 7,
    criteriaStatus: { c1: 'pass', c2: 'pass', c3: 'pass', c4: 'pass', c5: 'partial' },
    aiSummary: 'Hồ sơ tốt, đạt 4/5 tiêu chí. Tiêu chí Hội nhập chỉ còn thiếu 1 MC giao lưu quốc tế. Đề xuất yêu cầu bổ sung 1 MC.',
  },
];

export const passportData = {
  student: {
    fullName: 'Lê Thị Bích Ngọc',
    studentCode: '20210022',
    school: 'Trường Đại học Bách Khoa TP.HCM',
    faculty: 'Khoa Ngoại ngữ',
    title: 'Sinh viên 5 Tốt cấp Trường',
    year: '2025–2026',
    issueDate: '15/07/2026',
  },
  achievements: [
    { icon: '📚', label: 'GPA', value: '3.8 / 4.0' },
    { icon: '🌍', label: 'IELTS', value: '7.5' },
    { icon: '❤️', label: 'Tình nguyện', value: '200 giờ' },
    { icon: '💪', label: 'Thể thao', value: 'HCV Bơi lội' },
    { icon: '🏆', label: 'Giải thưởng', value: '3 giải cấp trường' },
    { icon: '🌟', label: 'Rèn luyện', value: '95/100 điểm' },
  ],
  timeline: [
    { date: '09/2023', event: 'Nhập học K21 – Khoa Ngoại ngữ', type: 'milestone' },
    { date: '12/2023', event: 'Đạt IELTS 7.0 lần đầu', type: 'achievement' },
    { date: '03/2024', event: 'Tham gia chiến dịch Mùa Hè Xanh', type: 'volunteer' },
    { date: '06/2024', event: 'HCV Bơi lội giải Thể thao SV', type: 'sport' },
    { date: '09/2024', event: 'Trao đổi sinh viên tại Đại học Chulalongkorn', type: 'international' },
    { date: '01/2025', event: 'Nâng IELTS lên 7.5', type: 'achievement' },
    { date: '03/2025', event: 'Trưởng ban tổ chức International Day', type: 'leadership' },
    { date: '05/2026', event: 'Nộp hồ sơ SV5T – Đạt tất cả 5 tiêu chí', type: 'milestone' },
    { date: '07/2026', event: '🎉 Công nhận Sinh viên 5 Tốt cấp Trường', type: 'award' },
  ],
};

export const apiMapping = [
  { feature: 'OCR minh chứng, bóc tách thông tin', api: 'SmartReader', desc: 'Đọc bảng điểm, chứng chỉ, giấy khen', color: '#06b6d4' },
  { feature: 'Kiểm tra giấy tờ thật/giả, liveness', api: 'eKYC', desc: 'Check CCCD/CMND, phát hiện deepfake', color: '#3b82f6' },
  { feature: 'Chatbot AI Mentor SV5T', api: 'Smartbot', desc: 'FAQ, kịch bản, LLM hỏi đáp', color: '#8b5cf6' },
  { feature: 'Voice input / output', api: 'SmartVoice', desc: 'STT và TTS tiếng Việt', color: '#ec4899' },
  { feature: 'Analytics UX hành vi', api: 'SmartUX', desc: 'Thu thập hành vi, tối ưu giao diện', color: '#f59e0b' },
  { feature: 'Nhận diện khuôn mặt', api: 'SmartVision', desc: 'So khớp face trong ảnh hoạt động', color: '#10b981' },
  { feature: 'Phân tích MXH', api: 'vnSocial', desc: 'Đo sentiment trên Facebook/Zalo', color: '#ef4444' },
  { feature: 'Nhận diện khuôn mặt nâng cao', api: 'vnFace', desc: 'Face profile, điểm danh sự kiện', color: '#a855f7' },
];
