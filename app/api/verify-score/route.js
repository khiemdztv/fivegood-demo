import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `Bạn là hệ thống AI phân tích Bảng điểm và Xác thực dữ liệu sinh viên.

NHIỆM VỤ: Phân tích hình ảnh bảng điểm hoặc giấy chứng nhận.
Yêu cầu phân tích:
1. "extractedScore": Đọc ra điểm số cuối cùng (GPA hệ 4.0, hoặc Điểm rèn luyện hệ 100) tùy theo yêu cầu của sinh viên.
2. "schoolMatch": So sánh tên trường trên giấy tờ với "Trường của sinh viên" được cấp. Dùng đối chiếu NGỮ NGHĨA (semantic match), ví dụ "ĐH Bách Khoa" khớp với "Trường Đại học Bách Khoa", "ĐH Ngân Hàng" khớp với "Đại học Ngân hàng TP.HCM".
3. "isAuthentic": Đánh giá xem hình ảnh có vẻ là bảng điểm thật không (có dấu mộc, chữ ký, logo, form chuẩn...). Trả về true nếu hợp lệ, false nếu là ảnh rác/đáng ngờ.
4. "note": Lời giải thích ngắn gọn về kết quả.

Trả về kết quả dưới định dạng JSON thuần túy (KHÔNG có markdown):
{
  "extractedScore": "3.8",
  "schoolMatch": true,
  "isAuthentic": true,
  "note": "Phát hiện tên trường ĐH Ngân Hàng khớp với hồ sơ. Có dấu mộc đỏ hợp lệ."
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
          { type: 'text', text: `${SYSTEM_PROMPT}\n\nThông tin cần đối chiếu:\n- Tên sinh viên: ${expectedName}\n- Trường của sinh viên: ${expectedSchool}\n- Loại điểm cần lấy: ${scoreType}\n\nHãy đọc nội dung thật từ ảnh và trả về JSON.` },
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
      extractedScore: "", 
      schoolMatch: false, 
      isAuthentic: false, 
      note: 'AI đọc được nhưng không phân tích được định dạng. Vui lòng chụp lại rõ nét hơn.' 
    });

  } catch (error) {
    console.error('[Verify-Score] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
