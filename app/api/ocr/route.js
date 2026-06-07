import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `Bạn là hệ thống OCR + AI Analysis. Bạn nhận được hình ảnh của một minh chứng/giấy tờ.

NHIỆM VỤ: Đọc NỘI DUNG THẬT trong ảnh, bóc tách thông tin thật. KHÔNG ĐƯỢC BỊA DỮ LIỆU.

Trả về JSON thuần (KHÔNG markdown, KHÔNG code block):
{
  "extractedText": "Toàn bộ text đọc được từ ảnh, giữ nguyên format",
  "fields": [{"label": "Tên trường", "value": "Giá trị đọc được"}],
  "aiValidity": "VALID hoặc SUSPECT hoặc INVALID",
  "aiScore": 0.85,
  "criteriaMatch": "Tiêu chí SV5T phù hợp nhất",
  "note": "Đánh giá: giấy tờ này có hợp lệ không, có dấu hiệu giả mạo không"
}

QUY TẮC QUAN TRỌNG:
- CHỈ ghi những gì BẠN ĐỌC ĐƯỢC từ ảnh, KHÔNG bịa thêm
- Nếu không đọc được rõ → ghi "không đọc được" cho field đó
- fields: bóc tách các trường thông tin thực tế có trong giấy tờ
- aiValidity: VALID nếu giấy tờ có vẻ hợp lệ, SUSPECT nếu nghi ngờ
- CHỈ TRẢ VỀ JSON`;

// Danh sách Vision models để thử (fallback nếu model chính bị lỗi)
const VISION_MODELS = [
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'llama-3.2-11b-vision-preview',
];

async function tryVision(groq, imageUrl, fileName, fileSize, criteriaName) {
  let lastError = null;

  for (const model of VISION_MODELS) {
    try {
      console.log(`[OCR] Trying vision model: ${model}`);
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: imageUrl } },
              { type: 'text', text: `${SYSTEM_PROMPT}\n\nFile: "${fileName}" (${fileSize}MB). Tiêu chí SV5T: "${criteriaName}". Hãy đọc nội dung thật từ ảnh và trả về JSON.` },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 2048,
      });

      const raw = completion.choices[0]?.message?.content || '';
      console.log(`[OCR] ${model} responded, length: ${raw.length}`);

      // Parse JSON
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { extractedText: raw, fields: [], aiValidity: 'SUSPECT', aiScore: 0.6, note: 'AI đã đọc ảnh nhưng không trả về JSON chuẩn. Nội dung đã extract ở trên.' };

    } catch (err) {
      console.error(`[OCR] ${model} failed:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('Tất cả vision models đều bị lỗi');
}

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'GROQ_API_KEY chưa cấu hình trong .env.local' }, { status: 500 });
  }

  try {
    const { fileName, fileType, fileSize, criteriaName, fileBase64 } = await request.json();
    const groq = new Groq({ apiKey });

    let result;

    if (fileBase64) {
      // Có ảnh → dùng Vision model đọc thật
      const imageUrl = fileBase64.startsWith('data:') ? fileBase64 : `data:image/jpeg;base64,${fileBase64}`;
      result = await tryVision(groq, imageUrl, fileName, fileSize, criteriaName);
    } else {
      // PDF hoặc không có ảnh → dùng text model
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `File: "${fileName}" (${fileType}, ${fileSize}MB). Tiêu chí: "${criteriaName}". Đây là file PDF – không thể đọc nội dung trực tiếp. Trả về JSON với extractedText = "File PDF - cần chuyển sang ảnh (JPG/PNG) để AI Vision đọc nội dung thật", aiValidity = "SUSPECT", aiScore = 0.40, và note giải thích.` }
        ],
        temperature: 0.1,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
      });

      result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    }

    return Response.json(result);
  } catch (error) {
    console.error('[OCR] Final error:', error);
    return Response.json({
      error: `${error.message}. Thử upload ảnh nhỏ hơn (JPG/PNG < 5MB).`
    }, { status: 500 });
  }
}
