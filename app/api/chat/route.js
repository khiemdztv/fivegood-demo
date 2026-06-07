import Groq from 'groq-sdk';
import { getUserEvidences, getAllUsers, getAllEvidences } from '@/lib/supabase';

const SYSTEM_PROMPT = `Bạn là "FiveGood AI Mentor" – trợ lý AI cá nhân hóa cho sinh viên đang chuẩn bị hồ sơ "Sinh viên 5 Tốt" (SV5T).

## Vai trò
- Hướng dẫn sinh viên về quy trình, tiêu chí SV5T
- Gợi ý cách chuẩn bị minh chứng cho từng tiêu chí
- Trả lời FAQ về SV5T
- Động viên, khích lệ sinh viên

## 5 Tiêu chí SV5T
1. **Đạo đức tốt**: Chấp hành nội quy, không vi phạm pháp luật, điểm rèn luyện ≥ 80
2. **Học tập tốt**: GPA ≥ 2.5/4.0, không nợ môn, có NCKH/đề tài là lợi thế
3. **Thể lực tốt**: Đạt chuẩn TDTT, tham gia CLB thể thao/giải đấu
4. **Tình nguyện tốt**: Tham gia chiến dịch tình nguyện, hoạt động cộng đồng ≥ 5 ngày, có giấy xác nhận
5. **Hội nhập tốt**: Ngoại ngữ (IELTS ≥ 5.5 hoặc tương đương), hoạt động giao lưu quốc tế, kỹ năng mềm/CLB

## Thông tin sinh viên hiện tại
- Tên: Nguyễn Minh Anh, MSSV: 20210001
- Khoa CNTT, ĐH Bách Khoa TP.HCM, GPA: 3.65
- Tiến độ: Đạo đức 100%, Học tập 85%, Thể lực 100%, Tình nguyện 45%, Hội nhập 60%
- Còn thiếu: minh chứng NCKH, giấy xác nhận tình nguyện, hoạt động giao lưu quốc tế
- Deadline: 30/06/2026

## Quy tắc
- Trả lời bằng tiếng Việt, thân thiện, dùng emoji phù hợp
- Trả lời ngắn gọn, có cấu trúc (bullet points, bold)
- Nếu câu hỏi ngoài phạm vi SV5T → từ chối lịch sự, hướng dẫn liên hệ cán bộ Hội
- Luôn nhắc deadline nếu phù hợp
- Kết thúc bằng gợi ý hành động cụ thể`;

const REVIEWER_PROMPT = `Bạn là "FiveGood AI Copilot" – trợ lý nghiệp vụ quản lý hồ sơ "Sinh viên 5 Tốt" (SV5T) dành cho Cán bộ Hội.

## Vai trò
- Truy xuất và báo cáo dữ liệu từ cơ sở dữ liệu hồ sơ
- Cảnh báo các trường hợp rủi ro cao (AI Risk: SUSPECT) cần xử lý
- Cung cấp số liệu thống kê tiến độ theo thời gian thực

## Context Dữ liệu (Giả lập CSDL/RAG)
- **Tổng số hồ sơ đang xét duyệt:** 1,245 hồ sơ
- **Hồ sơ nộp mới hôm nay:** 42 hồ sơ
- **Phân loại AI Risk:**
  + 1,100 hồ sơ Hợp lệ (VALID) 🟢
  + 120 hồ sơ Thiếu/Sai sót nhẹ (WARNING) 🟡
  + 25 hồ sơ Nghi vấn (SUSPECT) 🔴 (Cần kiểm tra thủ công gấp)
- **Tiến độ thu hồ sơ theo Khoa:**
  + Khoa CNTT: 320 hồ sơ, hoàn thành 80% chỉ tiêu.
  + Khoa QTKD: 450 hồ sơ, hoàn thành 95% chỉ tiêu.
  + Khoa Ngoại ngữ: 115 hồ sơ, hoàn thành 45% chỉ tiêu (đang chậm, cần đôn đốc).
- **Các trường hợp SUSPECT nổi bật cần chú ý:**
  + Trần B (MSSV 20002 - QTKD): Giấy chứng nhận tình nguyện scan mờ, thiếu đơn vị cấp.
  + Lê C (MSSV 20003 - Luật): Bảng điểm tải lên bị nghi ngờ chỉnh sửa (chữ không khớp font).

## Quy tắc
- Trả lời bằng tiếng Việt, ngắn gọn, mang phong cách chuyên nghiệp, khách quan của hệ thống quản trị.
- Tuyệt đối bám sát dữ liệu Context ở trên, KHÔNG tự bịa thêm số liệu.
- Định dạng dữ liệu bằng bullet points hoặc số in đậm để cán bộ dễ đọc lướt.`;

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json({
      message: '⚠️ Groq API chưa được cấu hình. Vui lòng thêm GROQ_API_KEY vào file .env.local\n\nĐể lấy key miễn phí: https://console.groq.com',
      error: 'NO_API_KEY',
    }, { status: 200 });
  }

  try {
    const { messages, userName, userInfo, userRole, userId } = await request.json();

    const groq = new Groq({ apiKey });

    let finalSystemPrompt = SYSTEM_PROMPT;

    if (userRole === 'reviewer') {
      let dbContext = '- Hiện tại chưa lấy được dữ liệu.';
      const [allUsers, allEvidences] = await Promise.all([
        getAllUsers(),
        getAllEvidences()
      ]);

      if (allUsers && allEvidences) {
        const evidencesByUser = {};
        allEvidences.forEach(e => {
          if (!evidencesByUser[e.user_id]) evidencesByUser[e.user_id] = [];
          evidencesByUser[e.user_id].push(e);
        });

        const totalStudents = allUsers.length;
        const totalEvidences = allEvidences.length;
        const validCount = allEvidences.filter(e => e.ai_validity === 'VALID').length;
        const suspectCount = allEvidences.filter(e => e.ai_validity === 'SUSPECT').length;
        
        let detailedStudents = allUsers.map(u => {
          const uEvidences = evidencesByUser[u.id] || [];
          const hasSuspect = uEvidences.some(e => e.ai_validity === 'SUSPECT');
          return `- SV: ${u.name} (MSSV: ${u.mssv}, Khoa: ${u.faculty}). Số tài liệu đã nộp: ${uEvidences.length}. Cảnh báo SUSPECT: ${hasSuspect ? 'CÓ' : 'KHÔNG'}`;
        }).join('\n');

        dbContext = `- **Tổng số sinh viên (Accounts):** ${totalStudents}
- **Tổng số minh chứng đã nộp (System-wide):** ${totalEvidences}
- **Thống kê AI Risk (Trạng thái hệ thống):** ${validCount} Hợp lệ (VALID), ${suspectCount} Nghi vấn (SUSPECT).
- **Chi tiết dữ liệu từng sinh viên:**\n${detailedStudents}`;
      }

      finalSystemPrompt = REVIEWER_PROMPT.replace(
        'Cán bộ Hội',
        `Cán bộ Hội (${userName || 'Quản trị viên'})`
      ).replace(
        /## Context Dữ liệu \(Giả lập CSDL\/RAG\)[\s\S]*?## Quy tắc/,
        `## Context Dữ liệu (Realtime Database RAG)\n${dbContext}\n\n## Quy tắc`
      );
    } else {
      let userContext = '- Chưa tải lên minh chứng nào.';
      if (userId) {
        const evidences = await getUserEvidences(userId);
        if (evidences && evidences.length > 0) {
          userContext = evidences.map(e => `- Đã nộp: "${e.file_name}" (Tiêu chí: ${e.criteria_id}). Nhãn AI: ${e.ai_validity}`).join('\n');
        }
      }

      // Thay thế dữ liệu mock về tiến độ bằng dữ liệu thật
      finalSystemPrompt = SYSTEM_PROMPT.replace(
        '- Tiến độ: Đạo đức 100%, Học tập 85%, Thể lực 100%, Tình nguyện 45%, Hội nhập 60%\n- Còn thiếu: minh chứng NCKH, giấy xác nhận tình nguyện, hoạt động giao lưu quốc tế',
        `## Minh chứng sinh viên đã nộp (Lấy từ DB)\n${userContext}`
      );

      // Thay thế thông tin cá nhân
      finalSystemPrompt = finalSystemPrompt.replace(
        '## Thông tin sinh viên hiện tại\n- Tên: Nguyễn Minh Anh, MSSV: 20210001\n- Khoa CNTT, ĐH Bách Khoa TP.HCM, GPA: 3.65',
        `## Thông tin sinh viên hiện tại\n- Tên: ${userName || 'Sinh viên'}\n- ${userInfo || 'Đang chuẩn bị hồ sơ SV5T'}`
      );
    }

    const chatMessages = [
      { role: 'system', content: finalSystemPrompt },
      ...messages.map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text,
      })),
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || 'Xin lỗi, mình không thể trả lời lúc này.';

    return Response.json({ message: reply });
  } catch (error) {
    console.error('Groq API error:', error);
    return Response.json({
      message: `❌ Lỗi kết nối Groq: ${error.message}\n\nKiểm tra lại API key hoặc thử lại sau.`,
      error: error.message,
    }, { status: 200 });
  }
}
