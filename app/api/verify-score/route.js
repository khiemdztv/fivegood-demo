import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `Bạn là hệ thống AI phân tích Minh chứng, Bảng điểm và Giấy chứng nhận của FiveGood Journey.

NHIỆM VỤ: Phân tích hình ảnh minh chứng được upload (bảng điểm, giấy khen, chứng nhận rèn luyện, chứng nhận tình nguyện, chứng nhận thể thao).

Hãy trích xuất thông tin thật và trả về dưới dạng JSON thuần túy (KHÔNG dùng markdown code blocks, KHÔNG nói chuyện bên ngoài, CHỈ TRẢ VỀ JSON):
{
  "studentName": "Họ và tên sinh viên ghi trên giấy tờ (VD: 'Nguyễn Minh Anh')",
  "schoolName": "Tên trường đại học/cơ sở đào tạo ghi trên giấy tờ (VD: 'Đại học Bách Khoa TP.HCM')",
  "extractedScore": "Điểm số hoặc thành tích trích xuất tương ứng loại cần lấy (VD: GPA: '3.8', Điểm rèn luyện: '95', Thể thao: 'Đạt chuẩn thể lực' hoặc 'Huy chương Vàng', Giải thưởng: 'Giải Nhất NCKH' hoặc 'Giấy khen Đoàn trường', Tình nguyện: số ngày tình nguyện đọc được từ giấy xác nhận, vd: '5 ngày')",
  "nameMatch": true/false (So sánh xem studentName trích xuất có khớp ngữ nghĩa với Tên sinh viên dự kiến hay không. Trả về true nếu khớp hoặc viết không dấu khớp, false nếu sai tên hoàn toàn),
  "schoolMatch": true/false (So sánh xem schoolName trích xuất có khớp ngữ nghĩa với Trường dự kiến hay không. Trả về true nếu trùng khớp hoặc viết tắt phổ biến khớp, false nếu sai trường hoàn toàn),
  "isAuthentic": true/false (Đánh giá tài liệu có dấu mộc đỏ, chữ ký, logo đơn vị ban hành, hoặc đúng định dạng của một minh chứng/giấy chứng nhận thật hay không. Trả về true nếu hợp lệ, false nếu là ảnh rác/đáng ngờ),
  "note": "Lời giải thích ngắn gọn bằng tiếng Việt về kết quả phân tích (VD: 'Tìm thấy tên sinh viên và tên trường trùng khớp. Điểm GPA đọc được là 3.8. Có dấu mộc đỏ hợp lệ.')"
}`;

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'GROQ_API_KEY chưa cấu hình' }, { status: 500 });
  }

  try {
    const { fileBase64, expectedSchool, expectedName, scoreType } = await request.json();
    const groq = new Groq({ apiKey });

    if (!fileBase64) {
      return Response.json({ error: 'Không có ảnh' }, { status: 400 });
    }

    const imageUrl = fileBase64.startsWith('data:') ? fileBase64 : `data:image/jpeg;base64,${fileBase64}`;

    console.log(`[Verify-Score] Đang phân tích ${scoreType} cho sinh viên ${expectedName} - ${expectedSchool}`);

    const completion = await groq.chat.completions.create({
      model: 'llama-3.2-11b-vision-preview',
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: imageUrl } },
          { type: 'text', text: `${SYSTEM_PROMPT}\n\nThông tin cần đối chiếu:\n- Tên sinh viên dự kiến: ${expectedName}\n- Trường dự kiến: ${expectedSchool}\n- Loại thành tích cần lấy: ${scoreType}\n\nHãy đọc nội dung thật từ ảnh và trả về JSON.` },
        ],
      }],
      temperature: 0.1,
      max_tokens: 1024,
    });

    const raw = completion.choices[0]?.message?.content || '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return Response.json(JSON.parse(jsonMatch[0]));
    }
    
    return Response.json({ 
      studentName: "",
      schoolName: "",
      extractedScore: "", 
      nameMatch: false,
      schoolMatch: false, 
      isAuthentic: false, 
      note: 'AI đọc được nhưng không phân tích được định dạng. Vui lòng chụp lại rõ nét hơn.' 
    });

  } catch (error) {
    console.error('[Verify-Score] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
