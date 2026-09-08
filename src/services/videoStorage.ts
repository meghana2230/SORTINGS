// Persistent storage and locking service for Visualize algorithm videos
// Integrates with global project-level backend (/api/videos) with IndexedDB fallback

export type VisualizeAlgoId = 'bubble' | 'insertion' | 'selection';

export const BUBBLE_SORT_MAPPING_KEY = 'visualizeVideos/sorting/bubble-sort';

export interface StoredVideoRecord {
  algoId: VisualizeAlgoId;
  algorithmId?: string;
  mapping?: string;
  name: string;
  type: string;
  size: number;
  blob?: Blob | null;
  url?: string | null;
  isLocked?: boolean;
  locked?: boolean;
  updatedAt?: number;
}

export interface BackendVideoInfo {
  algoId: VisualizeAlgoId;
  algorithmId?: string;
  mapping?: string;
  name: string;
  size: number;
  mimeType?: string;
  isLocked: boolean;
  locked?: boolean;
  uploadedAt?: string | null;
  url: string | null;
}

const DB_NAME = 'algolearn_visualize_videos_v1';
const DB_VERSION = 1;
const STORE_NAME = 'algorithm_videos';

const defaultCleanNames: Record<VisualizeAlgoId, string> = {
  bubble: 'Bubble Sort Video',
  insertion: 'Insertion Sort Video',
  selection: 'Selection Sort Video',
};

/**
 * Checks if a filename or string contains unwanted WhatsApp Video filename text
 */
export function hasUnwantedFilenameText(name?: string | null): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  return (
    lower.includes('whatsapp video 2026-09-06') ||
    (lower.includes('whatsapp') && lower.includes('2026-09-06')) ||
    lower.includes('whatsapp video') ||
    lower.includes('whatsapp')
  );
}

/**
 * Removes unwanted WhatsApp Video filename text and returns a clean descriptive title
 */
export function cleanVideoTitle(nameOrUrl?: string | null, fallback: string = 'Video Lesson'): string {
  if (!nameOrUrl) return fallback;
  if (hasUnwantedFilenameText(nameOrUrl)) {
    return fallback;
  }
  return nameOrUrl;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'algoId' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open video database'));
    };
  });
}

// In-memory cache of backend locked status
const memoryLockedState: Record<VisualizeAlgoId, boolean> = {
  bubble: false,
  insertion: false,
  selection: false,
};

export function isVideoPermanentlyLocked(algoId: VisualizeAlgoId): boolean {
  if (memoryLockedState[algoId]) return true;
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(`algolearn_video_locked_${algoId}`) === 'true';
  } catch {
    return false;
  }
}

export function setVideoPermanentlyLocked(algoId: VisualizeAlgoId, locked: boolean = true): void {
  memoryLockedState[algoId] = locked;
  if (typeof window === 'undefined') return;
  try {
    if (locked) {
      localStorage.setItem(`algolearn_video_locked_${algoId}`, 'true');
    } else {
      localStorage.removeItem(`algolearn_video_locked_${algoId}`);
    }
  } catch {
    // Ignore storage quota or access issues
  }
}

/**
 * Fetches the global project-level videos and locked status from the backend server (/api/videos)
 * Every user, session, incognito window, and device sees this exact same state.
 */
export async function fetchGlobalVideosFromBackend(): Promise<Record<VisualizeAlgoId, BackendVideoInfo>> {
  const fallback: Record<VisualizeAlgoId, BackendVideoInfo> = {
    bubble: { algoId: 'bubble', name: '', size: 0, isLocked: false, url: null },
    insertion: { algoId: 'insertion', name: '', size: 0, isLocked: false, url: null },
    selection: { algoId: 'selection', name: '', size: 0, isLocked: false, url: null },
  };

  if (typeof window === 'undefined') return fallback;

  try {
    const res = await fetch('/api/videos', {
      headers: { credentials: 'same-origin' },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn('[VideoStorage] Server /api/videos returned status:', res.status);
      return fallback;
    }

    const data = await res.json();
    if (data && data.success && data.videos) {
      const result = { ...fallback };
      (['bubble', 'insertion', 'selection'] as VisualizeAlgoId[]).forEach((algoId) => {
        const item = data.videos[algoId] || (algoId === 'bubble' ? data.videos['bubble-sort'] : undefined);
        if (item && (item.isLocked || item.locked) && item.url) {
          result[algoId] = {
            algoId,
            algorithmId: algoId === 'bubble' ? 'bubble-sort' : algoId,
            mapping: algoId === 'bubble' ? BUBBLE_SORT_MAPPING_KEY : undefined,
            name: cleanVideoTitle(item.name, defaultCleanNames[algoId]),
            size: item.size || 0,
            mimeType: item.mimeType || 'video/mp4',
            isLocked: true,
            locked: true,
            uploadedAt: item.uploadedAt || null,
            url: algoId === 'bubble' ? '/api/videos/visualizeVideos/sorting/bubble-sort' : item.url,
          };
          setVideoPermanentlyLocked(algoId, true);
        } else if (algoId === 'bubble') {
          setVideoPermanentlyLocked('bubble', false);
        }
      });
      return result;
    }
    return fallback;
  } catch (err) {
    console.warn('[VideoStorage] Error fetching global videos from backend:', err);
    return fallback;
  }
}

/**
 * Uploads a video to the backend server (/api/videos/:algoId) and saves it permanently to disk.
 * Supports upload progress updates via XMLHttpRequest.
 */
export async function uploadVideoToBackend(
  algoId: VisualizeAlgoId,
  file: File | Blob,
  fileName?: string,
  onProgress?: (percent: number) => void
): Promise<BackendVideoInfo> {
  const actualName = fileName || (file instanceof File ? file.name : `${algoId}.mp4`);
  const mimeType = file.type || 'video/mp4';

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/videos/${algoId}`, true);
    xhr.setRequestHeader('Content-Type', mimeType);
    xhr.setRequestHeader('X-File-Name', encodeURIComponent(actualName));

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const resp = JSON.parse(xhr.responseText);
          const vid = resp.video;
          setVideoPermanentlyLocked(algoId, true);
          if (onProgress) onProgress(100);
          resolve({
            algoId,
            name: cleanVideoTitle(vid.name, defaultCleanNames[algoId]),
            size: vid.size,
            mimeType: vid.mimeType,
            isLocked: true,
            uploadedAt: vid.uploadedAt,
            url: vid.url || `/api/videos/${algoId}`,
          });
        } catch (e) {
          reject(new Error('Invalid response from server'));
        }
      } else if (xhr.status === 403) {
        // Already locked on server: retrieve existing permanent video reference
        setVideoPermanentlyLocked(algoId, true);
        try {
          const resp = JSON.parse(xhr.responseText);
          if (resp.video) {
            resolve({
              algoId,
              name: cleanVideoTitle(resp.video.name, defaultCleanNames[algoId]),
              size: resp.video.size,
              isLocked: true,
              url: resp.video.url || `/api/videos/${algoId}`,
            });
            return;
          }
        } catch {}

        // Fallback to existing stored video
        getVideoFromStorage(algoId).then((existingRecord) => {
          if (existingRecord && existingRecord.url) {
            resolve({
              algoId,
              name: existingRecord.name,
              size: existingRecord.size,
              isLocked: true,
              url: existingRecord.url,
            });
          } else {
            resolve({
              algoId,
              name: defaultCleanNames[algoId],
              size: 0,
              isLocked: true,
              url: algoId === 'bubble' ? '/api/videos/visualizeVideos/sorting/bubble-sort' : `/api/videos/${algoId}`,
            });
          }
        }).catch(() => {
          resolve({
            algoId,
            name: defaultCleanNames[algoId],
            size: 0,
            isLocked: true,
            url: algoId === 'bubble' ? '/api/videos/visualizeVideos/sorting/bubble-sort' : `/api/videos/${algoId}`,
          });
        });
      } else {
        reject(new Error(xhr.responseText || `Server upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network connection failed while uploading video to server'));
    };

    xhr.send(file);
  });
}

/**
 * Saves video to persistent backend storage and locks it permanently.
 */
export async function saveVideoToStorage(
  algoId: VisualizeAlgoId,
  file: File,
  onProgress?: (percent: number) => void
): Promise<StoredVideoRecord> {
  // 1. Validate file format
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const validExtensions = ['mp4', 'webm', 'mov', 'avi', 'm4v', 'mkv'];
  const isValidVideo = file.type.startsWith('video/') || validExtensions.includes(extension);
  if (!isValidVideo) {
    throw new Error('Unsupported format. Please select an MP4, MOV, WebM, or AVI video file.');
  }

  // 2. Upload and save permanently to global backend
  const backendResult = await uploadVideoToBackend(algoId, file, file.name, onProgress);
  setVideoPermanentlyLocked(algoId, true);

  // 3. Save copy to IndexedDB for local offline resilience
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({
      algoId,
      name: file.name,
      type: file.type || 'video/mp4',
      size: file.size,
      blob: file,
      updatedAt: Date.now(),
    });
  } catch (err) {
    console.warn('[VideoStorage] IndexedDB local cache write skipped:', err);
  }

  return {
    algoId,
    name: backendResult.name,
    type: backendResult.mimeType || 'video/mp4',
    size: backendResult.size,
    url: backendResult.url || `/api/videos/${algoId}`,
    isLocked: true,
  };
}

export async function getVideoFromStorage(
  algoId: VisualizeAlgoId
): Promise<StoredVideoRecord | null> {
  // 1. Check backend first
  const globalVideos = await fetchGlobalVideosFromBackend();
  const backendVideo = globalVideos[algoId];
  if (backendVideo && (backendVideo.isLocked || backendVideo.locked) && backendVideo.url) {
    return {
      algoId,
      algorithmId: algoId === 'bubble' ? 'bubble-sort' : algoId,
      mapping: algoId === 'bubble' ? BUBBLE_SORT_MAPPING_KEY : undefined,
      name: backendVideo.name,
      type: backendVideo.mimeType || 'video/mp4',
      size: backendVideo.size,
      url: backendVideo.url,
      isLocked: true,
      locked: true,
    };
  }

  if (algoId === 'bubble') {
    return null;
  }

  // 2. Check local IndexedDB fallback
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(algoId);

      getReq.onsuccess = () => {
        const record = (getReq.result as any) || null;
        if (record && record.blob) {
          const url = URL.createObjectURL(record.blob);
          resolve({
            algoId: record.algoId,
            algorithmId: record.algoId,
            name: cleanVideoTitle(record.name, defaultCleanNames[algoId]),
            type: record.type || 'video/mp4',
            size: record.size || record.blob.size,
            blob: record.blob,
            url,
            isLocked: true,
            locked: true,
          });
          return;
        }
        resolve(null);
      };
      getReq.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Retrieves all videos from the persistent global backend and local store.
 * If a video was previously uploaded locally but not yet synced to backend,
 * this function automatically migrates it to the global backend!
 */
export async function getAllVideosFromStorage(): Promise<Record<VisualizeAlgoId, StoredVideoRecord | null>> {
  const result: Record<VisualizeAlgoId, StoredVideoRecord | null> = {
    bubble: null,
    insertion: null,
    selection: null,
  };

  // 1. Fetch global project-level videos from backend
  const backendVideos = await fetchGlobalVideosFromBackend();

  for (const id of ['bubble', 'insertion', 'selection'] as VisualizeAlgoId[]) {
    const bVid = backendVideos[id];
    if (bVid && (bVid.isLocked || bVid.locked) && bVid.url) {
      result[id] = {
        algoId: id,
        algorithmId: id === 'bubble' ? 'bubble-sort' : id,
        mapping: id === 'bubble' ? BUBBLE_SORT_MAPPING_KEY : undefined,
        name: cleanVideoTitle(bVid.name, defaultCleanNames[id]),
        size: bVid.size,
        type: bVid.mimeType || 'video/mp4',
        url: id === 'bubble' ? '/api/videos/visualizeVideos/sorting/bubble-sort' : bVid.url,
        isLocked: true,
        locked: true,
      };
      setVideoPermanentlyLocked(id, true);
    }
  }

  // 2. For non-bubble algorithms without a backend video, check if IndexedDB has a local video
  try {
    const db = await openDB();
    const localRecords = await new Promise<any[]>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    for (const rec of localRecords) {
      const id = rec?.algoId as VisualizeAlgoId;
      if (id && id !== 'bubble' && id in result) {
        if (!result[id] && rec.blob && rec.blob.size > 0) {
          console.log(`[VideoStorage] Migrating local video for "${id}" to backend...`);
          try {
            const synced = await uploadVideoToBackend(id, rec.blob, rec.name);
            result[id] = {
              algoId: id,
              name: synced.name,
              type: synced.mimeType || 'video/mp4',
              size: synced.size,
              url: synced.url,
              isLocked: true,
              locked: true,
            };
            setVideoPermanentlyLocked(id, true);
          } catch (syncErr) {
            console.warn(`[VideoStorage] Backend migration fallback for "${id}":`, syncErr);
            const blobUrl = URL.createObjectURL(rec.blob);
            result[id] = {
              algoId: id,
              name: cleanVideoTitle(rec.name, defaultCleanNames[id]),
              type: rec.type || 'video/mp4',
              size: rec.size,
              blob: rec.blob,
              url: blobUrl,
              isLocked: true,
              locked: true,
            };
            setVideoPermanentlyLocked(id, true);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[VideoStorage] Local IndexedDB check skipped:', err);
  }

  return result;
}

export async function deleteVideoFromStorage(algoId: VisualizeAlgoId): Promise<boolean> {
  // Permanently locked: videos cannot be deleted, removed, or reset
  console.warn(`[VideoStorage] Video deletion prevented: Video for "${algoId}" is permanently locked.`);
  return false;
}

export async function clearAllVideosFromStorage(): Promise<boolean> {
  // Permanently locked: videos cannot be cleared or reset
  console.warn('[VideoStorage] Video clear prevented: Uploaded videos are permanently locked.');
  return false;
}
