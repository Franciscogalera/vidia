import { handleUpload } from '@vercel/blob/client';

// Erzeugt einen signierten Client-Token, mit dem der Browser die Datei
// direkt in Vercel Blob hochlädt (umgeht das 4,5-MB-Limit der Funktion).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
          'video/mp4', 'video/quicktime', 'video/webm',
        ],
        maximumSizeInBytes: 524288000, // 500 MB
        addRandomSuffix: true,
      }),
    });
    res.status(200).json(jsonResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
