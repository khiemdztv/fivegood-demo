import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `Bạn là hệ thống OCR + AI Analysis của FiveGood Journey. Khi nhận thông tin về một file minh chứng, bạn sẽ giả lập kết quả OCR và phân tích file đó.

Luôn trả về JSON hợp lệ (KHÔNG markdown, KHÔNG code block, CHỈ JSON thuần):
{
  "extractedText": "Nội dung văn bản được bóc tách từ file (giả lập thực tế)",
  "fields": [
    {"label": "Tên trường", "value": "Giá trị"}
  ],
  "aiValidity": "VALID hoặc SUSPECT hoặc INVALID",
  "aiScore": 0.85,
  "criteriaMatch": "Tên tiêu chí phù hợp",
  "note": "Đánh giá chi tiết về minh chứng này"
}

Quy tắc:
- Sinh viên: Nguyễn Minh Anh, MSSV 20210001, khoa CNTT, ĐH Bách Khoa TP.HCM
- Dựa vào TÊN FILE và TIÊU CHÍ để tạo nội dung phù hợp, thực tế
- extractedText phải giống như một giấy tờ thật được OCR
- fields phải có 5-7 trường thông tin bóc tách
- aiScore: 0.80-0.95 cho VALID, 0.50-0.79 cho SUSPECT, <0.50 cho INVALID
- CHỈ TRẢ VỀ JSON, KHÔNG CÓ BẤT KỲ TEXT NÀO KHÁC`;

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json({ error: 'GROQ_API_KEY chưa cấu hình' }, { status: 500 });
  }

  try {
    const { fileName, fileType, fileSize, criteriaName } = await request.json();

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `File: "${fileName}" (${fileType}, ${fileSize}MB). Tiêu chí: "${criteriaName}". Hãy phân tích và trả về JSON.` }
      ],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content || '';
    const result = JSON.parse(raw);

    return Response.json(result);
  } catch (error) {
    console.error('OCR API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
