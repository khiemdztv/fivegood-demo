import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `Bạn là hệ thống OCR + AI Analysis của FiveGood Journey.

NHIỆM VỤ: Phân tích nội dung minh chứng, bóc tách thông tin. KHÔNG ĐƯỢC BỊA DỮ LIỆU.

Trả về JSON thuần (KHÔNG markdown, KHÔNG code block):
{
  "extractedText": "Toàn bộ text đọc được, giữ nguyên format",
  "fields": [{"label": "Tên trường", "value": "Giá trị đọc được"}],
  "aiValidity": "VALID hoặc SUSPECT hoặc INVALID",
  "aiScore": 0.85,
  "criteriaMatch": "Tiêu chí SV5T phù hợp nhất",
  "note": "Đánh giá chi tiết về minh chứng"
}

QUY TẮC:
- CHỈ ghi những gì ĐỌC ĐƯỢC, KHÔNG bịa thêm
- fields: bóc tách các trường thông tin thực tế
- VALID nếu hợp lệ, SUSPECT nếu nghi ngờ, INVALID nếu không hợp lệ
- CHỈ TRẢ VỀ JSON`;

const VISION_MODELS = [
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'llama-3.2-11b-vision-preview',
];

// Thử vision models cho ảnh
async function tryVision(groq, imageUrl, fileName, fileSize, criteriaName) {
  let lastError = null;
  for (const model of VISION_MODELS) {
    try {
      console.log(`[OCR] Vision: ${model}`);
      const completion = await groq.chat.completions.create({
        model,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: `${SYSTEM_PROMPT}\n\nFile: "${fileName}" (${fileSize}MB). Tiêu chí: "${criteriaName}". Đọc nội dung thật từ ảnh, trả về JSON.` },
          ],
        }],
        temperature: 0.1,
        max_tokens: 2048,
      });
      const raw = completion.choices[0]?.message?.content || '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return { extractedText: raw, fields: [], aiValidity: 'SUSPECT', aiScore: 0.6, note: 'AI đọc được nhưng không trả JSON chuẩn.' };
    } catch (err) {
      console.error(`[OCR] ${model} fail:`, err.message);
      lastError = err;
    }
  }
  throw lastError || new Error('Vision models đều bị lỗi');
}

// Phân tích PDF text bằng text model
async function analyzePdfText(groq, pdfText, fileName, criteriaName) {
  console.log(`[OCR] Analyzing PDF text (${pdfText.length} chars)`);
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Đây là nội dung text trích xuất từ file PDF "${fileName}".\nTiêu chí SV5T: "${criteriaName}".\n\n--- NỘI DUNG PDF ---\n${pdfText.slice(0, 4000)}\n--- HẾT ---\n\nHãy phân tích nội dung thật ở trên, bóc tách thông tin và trả về JSON.` }
    ],
    temperature: 0.1,
    max_tokens: 2048,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(completion.choices[0]?.message?.content || '{}');
}

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'GROQ_API_KEY chưa cấu hình' }, { status: 500 });
  }

  try {
    const { fileName, fileType, fileSize, criteriaName, fileBase64, pdfText } = await request.json();
    const groq = new Groq({ apiKey });

    let result;

    if (fileBase64) {
      // Ảnh → Vision model đọc
      const imageUrl = fileBase64.startsWith('data:') ? fileBase64 : `data:image/jpeg;base64,${fileBase64}`;
      result = await tryVision(groq, imageUrl, fileName, fileSize, criteriaName);
    } else if (pdfText && pdfText.length > 10) {
      // PDF có text → text model phân tích
      result = await analyzePdfText(groq, pdfText, fileName, criteriaName);
    } else {
      // Không có gì → text model dựa trên tên file
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `File: "${fileName}" (${fileType}, ${fileSize}MB). Tiêu chí: "${criteriaName}". Không trích xuất được nội dung. Trả về JSON với aiValidity="SUSPECT", aiScore=0.3, note giải thích cần upload ảnh hoặc PDF có text.` }
        ],
        temperature: 0.1, max_tokens: 1024,
        response_format: { type: 'json_object' },
      });
      result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    }

    return Response.json(result);
  } catch (error) {
    console.error('[OCR] Error:', error);
    return Response.json({ error: `${error.message}` }, { status: 500 });
  }
}
