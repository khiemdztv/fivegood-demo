import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `Bạn là hệ thống AI phân tích Minh chứng và Giấy chứng nhận của FiveGood Journey.

NHIỆM VỤ: Phân tích nội dung minh chứng được cung cấp (hình ảnh hoặc văn bản PDF) để trích xuất thông tin đối chiếu.

QUY TẮC PHÂN TÍCH:
1. Trích xuất họ tên sinh viên từ tài liệu vào khóa "studentName".
2. Trích xuất tên trường học/cơ sở đào tạo từ tài liệu vào khóa "schoolName".
3. Trích xuất giá trị điểm số, ngày tình nguyện, trình độ ngoại ngữ, thành tích thể thao hoặc thông tin giải thưởng tương ứng vào khóa "extractedScore".
4. So sánh tên sinh viên trích xuất được với "Tên sinh viên dự kiến". Nếu trùng khớp ngữ nghĩa (hoặc không dấu khớp), ghi "nameMatch": true. Ngược lại ghi false.
5. So sánh tên trường trích xuất được với "Trường dự kiến". Ghi "schoolMatch": true nếu trùng khớp hoặc viết tắt khớp. Ngược lại ghi false.
6. Đánh giá tính xác thực của tài liệu (isAuthentic = true nếu là tài liệu thật hợp lệ).
7. Ghi nhận lời giải thích ngắn gọn tiếng Việt vào khóa "note".

CHỈ trả về JSON chuẩn theo cấu trúc chính xác sau, KHÔNG thêm bớt khóa nào khác:
{
  "studentName": "Nguyễn Văn A",
  "schoolName": "Trường Đại học Quốc gia",
  "extractedScore": "3.85",
  "nameMatch": true,
  "schoolMatch": true,
  "isAuthentic": true,
  "note": "Xác thực thành công tên sinh viên và trường học."
}`;

const VISION_MODELS = [
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'llama-3.2-90b-vision-preview',
  'llama-3.2-11b-vision-preview'
];

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'GROQ_API_KEY chưa cấu hình' }, { status: 500 });
  }

  try {
    const { fileBase64, pdfText, expectedSchool, expectedName, scoreType } = await request.json();
    const groq = new Groq({ apiKey });

    if (!fileBase64 && (!pdfText || pdfText.length < 10)) {
      return Response.json({ error: 'Không có ảnh hoặc văn bản PDF để phân tích' }, { status: 400 });
    }

    console.log(`[Verify-Score] Đang phân tích ${scoreType} cho sinh viên ${expectedName} - ${expectedSchool}`);

    let result = null;

    if (fileBase64) {
      const imageUrl = fileBase64.startsWith('data:') ? fileBase64 : `data:image/jpeg;base64,${fileBase64}`;
      let lastError = null;

      for (const model of VISION_MODELS) {
        try {
          console.log(`[Verify-Score] Vision: ${model}`);
          const completion = await groq.chat.completions.create({
            model,
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
            result = JSON.parse(jsonMatch[0]);
            break;
          }
        } catch (err) {
          console.error(`[Verify-Score] Model ${model} failed:`, err.message);
          lastError = err;
        }
      }

      if (!result && lastError) {
        throw lastError;
      }
    } else if (pdfText) {
      console.log(`[Verify-Score] Text/PDF: llama-3.3-70b-versatile`);
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Thông tin cần đối chiếu:
- Tên sinh viên dự kiến: ${expectedName}
- Trường dự kiến: ${expectedSchool}
- Loại thành tích cần lấy: ${scoreType}

--- NỘI DUNG VĂN BẢN TRÍCH XUẤT TỪ PDF ---
${pdfText.slice(0, 4000)}
--- HẾT NỘI DUNG ---

Yêu cầu: Hãy phân tích nội dung trên và trả về kết quả dưới dạng một JSON object hợp lệ duy nhất khớp với cấu trúc trong System Prompt. KHÔNG sao chép lại toàn văn tài liệu vào đầu câu trả lời. KHÔNG viết lời giải thích bên ngoài JSON. Chỉ xuất ra JSON chuẩn.` }
        ],
        temperature: 0.1,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
      });

      const raw = completion.choices[0]?.message?.content || '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      }
    }

    if (result) {
      return Response.json(result);
    }
    
    return Response.json({ 
      studentName: "",
      schoolName: "",
      extractedScore: "", 
      nameMatch: false,
      schoolMatch: false, 
      isAuthentic: false, 
      note: 'AI đọc được nhưng không phân tích được định dạng. Vui lòng chụp/quét lại rõ nét hơn.' 
    });

  } catch (error) {
    console.error('[Verify-Score] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
