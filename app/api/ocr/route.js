import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `Bạn là hệ thống OCR + AI Analysis. Bạn nhận được hình ảnh của một minh chứng/giấy tờ.

NHIỆM VỤ: Đọc NỘI DUNG THẬT trong ảnh, bóc tách thông tin thật. KHÔNG ĐƯỢC BỊA DỮ LIỆU.

Trả về JSON thuần (KHÔNG markdown, KHÔNG code block):
{
  "extractedText": "Toàn bộ text đọc được từ ảnh, giữ nguyên format",
  "fields": [{"label": "Tên trường", "value": "Giá trị đọc được"}],
  "aiValidity": "VALID hoặc SUSPECT hoặc INVALID",
  "aiScore": 0.xx,
  "criteriaMatch": "Tiêu chí SV5T phù hợp nhất",
  "note": "Đánh giá: giấy tờ này có hợp lệ không, có dấu hiệu giả mạo không"
}

QUY TẮC QUAN TRỌNG:
- CHỈ ghi những gì BẠN ĐỌC ĐƯỢC từ ảnh, KHÔNG bịa thêm
- Nếu không đọc được rõ → ghi "không đọc được" cho field đó
- fields: bóc tách các trường thông tin thực tế có trong giấy tờ
- aiValidity: VALID nếu giấy tờ có vẻ hợp lệ, SUSPECT nếu nghi ngờ
- CHỈ TRẢ VỀ JSON`;

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'GROQ_API_KEY chưa cấu hình' }, { status: 500 });
  }

  try {
    const { fileName, fileType, fileSize, criteriaName, fileBase64 } = await request.json();
    const groq = new Groq({ apiKey });

    let result;

    // Nếu có ảnh base64 → dùng Vision model để đọc thật
    if (fileBase64 && (fileType.startsWith('image/') || fileType === 'application/pdf')) {
      const imageUrl = fileBase64.startsWith('data:') ? fileBase64 : `data:${fileType};base64,${fileBase64}`;

      const completion = await groq.chat.completions.create({
        model: 'llama-3.2-90b-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: imageUrl },
              },
              {
                type: 'text',
                text: `${SYSTEM_PROMPT}\n\nFile: "${fileName}" (${fileSize}MB). Tiêu chí SV5T: "${criteriaName}". Hãy đọc nội dung thật từ ảnh này và trả về JSON.`,
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 2048,
      });

      const raw = completion.choices[0]?.message?.content || '';
      // Parse JSON từ response
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = { extractedText: raw, fields: [], aiValidity: 'SUSPECT', aiScore: 0.5, note: 'Không parse được JSON từ AI response' };
      }
    } else {
      // Fallback: không có ảnh → dùng text model (chỉ dựa trên tên file)
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `File: "${fileName}" (${fileType}, ${fileSize}MB). Tiêu chí: "${criteriaName}". Không có ảnh để đọc. Trả về JSON với note giải thích rằng cần upload file ảnh (JPG/PNG) để AI có thể đọc nội dung thật.` }
        ],
        temperature: 0.1,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
      });

      result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    }

    return Response.json(result);
  } catch (error) {
    console.error('OCR API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
