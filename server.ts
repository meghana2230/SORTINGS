import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Persistent storage directory for global project-level videos
  const DATA_DIR = path.join(process.cwd(), 'persistent_data', 'videos');
  const META_FILE = path.join(DATA_DIR, 'meta.json');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  interface VideoMeta {
    algoId: string;
    algorithmId?: string;
    mapping?: string;
    name: string;
    filename: string;
    size: number;
    mimeType: string;
    isLocked: boolean;
    locked?: boolean;
    uploadedAt: string;
  }

  function loadMeta(): Record<string, VideoMeta> {
    try {
      if (fs.existsSync(META_FILE)) {
        const raw = fs.readFileSync(META_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[Server] Error reading meta file:', e);
    }
    return {};
  }

  function saveMeta(data: Record<string, VideoMeta>) {
    try {
      fs.writeFileSync(META_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[Server] Error writing meta file:', e);
    }
  }

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const MAPPINGS_FILE = path.join(DATA_DIR, 'visualize_videos.json');

  function loadMappings(): Record<string, any> {
    try {
      if (fs.existsSync(MAPPINGS_FILE)) {
        return JSON.parse(fs.readFileSync(MAPPINGS_FILE, 'utf-8'));
      }
    } catch (e) {
      console.warn('[Server] Error reading visualize_videos.json:', e);
    }
    return {};
  }

  // Persistent mapping endpoint: visualizeVideos/sorting/bubble-sort
  app.get('/api/videos/visualizeVideos/sorting/bubble-sort', (_req, res) => {
    const bubblePath = path.join(DATA_DIR, 'bubble.mp4');
    if (!fs.existsSync(bubblePath)) {
      return res.status(404).json({ error: 'Bubble sort video not found.' });
    }
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.sendFile(bubblePath, { acceptRanges: true, maxAge: 0 });
  });

  // Category mapping endpoint: /api/videos/visualizeVideos/:category/:algoId
  app.get('/api/videos/visualizeVideos/:category/:algoId', (req, res) => {
    const { category, algoId } = req.params;
    const key = `visualizeVideos/${category}/${algoId}`;
    const mappings = loadMappings();
    const mapping = mappings[key];

    const filename = mapping?.filename || (algoId.startsWith('bubble') ? 'bubble.mp4' : `${algoId}.mp4`);
    const filePath = path.join(DATA_DIR, filename);

    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      return res.sendFile(filePath, { acceptRanges: true, maxAge: 0 });
    }

    return res.status(404).json({ error: `Video for ${key} not found.` });
  });

  // Dedicated Stack Video endpoint (unmodified Stack Operations video)
  app.get('/api/videos/stack', (_req, res) => {
    const stackPath = path.join(process.cwd(), 'src', 'Videos', 'Stack Operations.mp4');
    if (fs.existsSync(stackPath)) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      return res.sendFile(stackPath, { acceptRanges: true, maxAge: 0 });
    }
    return res.status(404).json({ error: 'Stack video file not found.' });
  });

  // 1. GET /api/videos - returns all videos and their permanent lock status
  app.get('/api/videos', (_req, res) => {
    const store = loadMeta();
    const mappings = loadMappings();
    const result: Record<string, any> = {};

    const algoIds = ['bubble', 'bubble-sort', 'insertion', 'selection'];
    for (const rawAlgoId of algoIds) {
      const algoKey = rawAlgoId === 'bubble-sort' ? 'bubble' : rawAlgoId;
      const record = store[rawAlgoId] || store[algoKey];

      if (record && (record.isLocked || record.locked)) {
        const filePath = path.join(DATA_DIR, record.filename);
        if (fs.existsSync(filePath)) {
          const isBubble = rawAlgoId === 'bubble' || rawAlgoId === 'bubble-sort';
          result[rawAlgoId] = {
            algoId: rawAlgoId,
            algorithmId: isBubble ? 'bubble-sort' : rawAlgoId,
            name: record.name,
            size: record.size,
            mimeType: record.mimeType || 'video/mp4',
            isLocked: true,
            locked: true,
            mapping: isBubble ? 'visualizeVideos/sorting/bubble-sort' : undefined,
            uploadedAt: record.uploadedAt,
            url: isBubble ? '/api/videos/visualizeVideos/sorting/bubble-sort' : `/api/videos/${rawAlgoId}`,
          };
          continue;
        }
      }

      result[rawAlgoId] = {
        algoId: rawAlgoId,
        algorithmId: rawAlgoId,
        name: '',
        size: 0,
        mimeType: '',
        isLocked: false,
        locked: false,
        uploadedAt: null,
        url: null,
      };
    }

    res.json({
      success: true,
      videos: result,
      mappings,
      lockedVideos: {
        'bubble-sort': Boolean(result['bubble-sort']?.isLocked || result['bubble']?.isLocked),
        'bubble': Boolean(result['bubble']?.isLocked || result['bubble-sort']?.isLocked),
      },
    });
  });

  // 2. GET /api/videos/:algoId - streams the video file with Range header support
  app.get('/api/videos/:algoId', (req, res) => {
    const { algoId } = req.params;

    // Handle bubble / bubble-sort explicitly to ensure the 59s Bubble Sort video is served
    if (algoId === 'bubble' || algoId === 'bubble-sort') {
      const bubblePath = path.join(DATA_DIR, 'bubble.mp4');
      if (fs.existsSync(bubblePath)) {
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Accept-Ranges', 'bytes');
        return res.sendFile(bubblePath, { acceptRanges: true, maxAge: 0 });
      }
    }

    // Handle stack
    if (algoId === 'stack') {
      const stackPath = path.join(process.cwd(), 'src', 'Videos', 'Stack Operations.mp4');
      if (fs.existsSync(stackPath)) {
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Accept-Ranges', 'bytes');
        return res.sendFile(stackPath, { acceptRanges: true, maxAge: 0 });
      }
    }

    const store = loadMeta();
    const record = store[algoId];

    if (!record) {
      return res.status(404).json({ error: 'No video found for this algorithm.' });
    }

    const filePath = path.join(DATA_DIR, record.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Video file not found on disk.' });
    }

    res.setHeader('Content-Type', record.mimeType || 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');

    res.sendFile(
      filePath,
      {
        acceptRanges: true,
        maxAge: 0,
      },
      (err) => {
        if (err && !res.headersSent) {
          console.error(`[Server] Error streaming video for ${algoId}:`, err);
          res.status(500).end();
        }
      }
    );
  });

  // 3. POST /api/videos/:algoId - saves video permanently to backend and updates persistent records
  app.post('/api/videos/:algoId', (req, res) => {
    const { algoId } = req.params;
    const store = loadMeta();

    const isBubble = algoId === 'bubble' || algoId === 'bubble-sort';

    // If this video is already locked and saved on disk, return existing permanent record
    const existing = store[algoId] || (isBubble ? store['bubble'] || store['bubble-sort'] : undefined);
    if (existing && (existing.isLocked || existing.locked)) {
      const targetFilename = existing.filename || (isBubble ? 'bubble.mp4' : `${algoId}.mp4`);
      const targetPath = path.join(DATA_DIR, targetFilename);
      if (fs.existsSync(targetPath)) {
        console.log(`[Server] Video "${algoId}" is already locked on disk. Returning existing permanent video.`);
        return res.status(200).json({
          success: true,
          video: {
            ...existing,
            url: isBubble ? '/api/videos/visualizeVideos/sorting/bubble-sort' : `/api/videos/${algoId}`,
          },
          alreadyLocked: true,
        });
      }
    }

    const rawFileName = req.headers['x-file-name'];
    let originalName = '';
    if (rawFileName) {
      try {
        originalName = decodeURIComponent(Array.isArray(rawFileName) ? rawFileName[0] : rawFileName);
      } catch {
        originalName = String(rawFileName);
      }
    }
    if (!originalName) {
      originalName = isBubble ? 'Bubble Sort Educational Video.mp4' : `${algoId}.mp4`;
    }

    const mimeType = (req.headers['content-type'] as string) || 'video/mp4';
    const ext = path.extname(originalName) || '.mp4';
    const targetFilename = isBubble ? 'bubble.mp4' : `${algoId}${ext}`;
    const targetPath = path.join(DATA_DIR, targetFilename);
    const tempPath = path.join(DATA_DIR, `${algoId}_upload_${Date.now()}${ext}`);

    const writeStream = fs.createWriteStream(tempPath);
    req.pipe(writeStream);

    writeStream.on('finish', () => {
      try {
        if (fs.existsSync(targetPath)) {
          fs.unlinkSync(targetPath);
        }
        fs.renameSync(tempPath, targetPath);
        const stats = fs.statSync(targetPath);

        const newRecord: VideoMeta = {
          algoId: isBubble ? 'bubble' : algoId,
          algorithmId: isBubble ? 'bubble-sort' : algoId,
          mapping: isBubble ? 'visualizeVideos/sorting/bubble-sort' : undefined,
          name: originalName,
          filename: targetFilename,
          size: stats.size,
          mimeType,
          isLocked: true,
          locked: true,
          uploadedAt: new Date().toISOString(),
        };

        if (isBubble) {
          store['bubble'] = newRecord;
          store['bubble-sort'] = { ...newRecord, algoId: 'bubble-sort' };
        } else {
          store[algoId] = newRecord;
        }
        saveMeta(store);

        // Also update visualize_videos.json if it exists
        try {
          const visMapPath = path.join(DATA_DIR, 'visualize_videos.json');
          if (fs.existsSync(visMapPath)) {
            const visMap = JSON.parse(fs.readFileSync(visMapPath, 'utf8'));
            const mapKey = isBubble
              ? 'visualizeVideos/sorting/bubble-sort'
              : `visualizeVideos/sorting/${algoId}-sort`;
            visMap[mapKey] = {
              ...(visMap[mapKey] || {}),
              algorithmId: isBubble ? 'bubble-sort' : `${algoId}-sort`,
              algoId: isBubble ? 'bubble-sort' : algoId,
              name: originalName,
              filename: targetFilename,
              storagePath: `/persistent_data/videos/${targetFilename}`,
              url: `/api/videos/${mapKey}`,
              directUrl: `/api/videos/${isBubble ? 'bubble-sort' : algoId}`,
              locked: true,
              isLocked: true,
              size: stats.size,
              mimeType,
            };
            fs.writeFileSync(visMapPath, JSON.stringify(visMap, null, 2), 'utf8');
          }
        } catch (e) {
          console.warn('[Server] Error syncing visualize_videos.json:', e);
        }

        console.log(`[Server] Video saved permanently for "${algoId}": ${originalName} (${stats.size} bytes)`);

        return res.status(200).json({
          success: true,
          video: {
            ...newRecord,
            url: isBubble ? '/api/videos/visualizeVideos/sorting/bubble-sort' : `/api/videos/${algoId}`,
          },
        });
      } catch (err: any) {
        console.error(`[Server] Failed to finalize upload for "${algoId}":`, err);
        return res.status(500).json({ error: 'Failed to finalize video file on server.' });
      }
    });

    writeStream.on('error', (err) => {
      console.error(`[Server] Write stream error for "${algoId}":`, err);
      try {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      } catch {}
      return res.status(500).json({ error: 'Failed to write video file.' });
    });

    req.on('error', (err) => {
      console.error(`[Server] Request stream error for "${algoId}":`, err);
      try {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      } catch {}
    });
  });

  // 4. Strictly reject any attempt to delete or alter locked videos
  app.delete('/api/videos/:algoId', (_req, res) => {
    return res.status(403).json({
      error: 'Videos in the Visualize section are permanently locked and cannot be deleted.',
    });
  });
  app.put('/api/videos/:algoId', (_req, res) => {
    return res.status(403).json({
      error: 'Videos in the Visualize section are permanently locked and cannot be replaced or updated.',
    });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
