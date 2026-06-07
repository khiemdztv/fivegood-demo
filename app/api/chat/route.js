import Groq from 'groq-sdk';

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

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json({
      message: '⚠️ Groq API chưa được cấu hình. Vui lòng thêm GROQ_API_KEY vào file .env.local\n\nĐể lấy key miễn phí: https://console.groq.com',
      error: 'NO_API_KEY',
    }, { status: 200 });
  }

  try {
    const { messages, userName, userInfo } = await request.json();

    const groq = new Groq({ apiKey });

    // Cá nhân hóa system prompt với tên user thật
    const personalizedPrompt = SYSTEM_PROMPT.replace(
      '## Thông tin sinh viên hiện tại\n- Tên: Nguyễn Minh Anh, MSSV: 20210001\n- Khoa CNTT, ĐH Bách Khoa TP.HCM, GPA: 3.65',
      `## Thông tin sinh viên hiện tại\n- Tên: ${userName || 'Sinh viên'}\n- ${userInfo || 'Đang chuẩn bị hồ sơ SV5T'}`
    );

    const chatMessages = [
      { role: 'system', content: personalizedPrompt },
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
