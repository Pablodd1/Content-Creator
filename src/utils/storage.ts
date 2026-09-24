export interface SavedImageItem {
  id: string;
  url: string;
  prompt: string;
  appliedPrompt?: string;
  style?: string;
  aspectRatio?: string;
  hasReference?: boolean;
  createdAt: number;
}

export interface SavedVideoItem {
  id: string;
  title?: string;
  script?: string;
  prompt?: string;
  platform?: string;
  referenceImage?: string;
  operationName?: string;
  createdAt: number;
}

const BRIEFING_KEY = 'unitec_briefing_state';
const BUNDLE_KEY = 'unitec_master_bundle';
const STEP_KEY = 'unitec_wizard_step';
const MODE_KEY = 'unitec_app_mode';
const IMAGES_KEY = 'unitec_saved_images_history';
const VIDEOS_KEY = 'unitec_saved_videos_history';

export const storage = {
  // Briefing Form
  getBriefingState: () => {
    try {
      const data = localStorage.getItem(BRIEFING_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveBriefingState: (state: any) => {
    try {
      localStorage.setItem(BRIEFING_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Storage warning:', e);
    }
  },
  getBriefingAttachments: (): any[] => {
    try {
      const data = localStorage.getItem(BRIEFING_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return parsed.files || parsed.attachedFiles || [];
    } catch {
      return [];
    }
  },
  getBriefingContext: (): string => {
    try {
      const data = localStorage.getItem(BRIEFING_KEY);
      if (!data) return '';
      const parsed = JSON.parse(data);
      return parsed.context || '';
    } catch {
      return '';
    }
  },
  clearBriefingState: () => {
    try {
      localStorage.removeItem(BRIEFING_KEY);
    } catch (e) {}
  },

  // Master Bundle
  getMasterBundle: () => {
    try {
      const data = localStorage.getItem(BUNDLE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveMasterBundle: (bundle: any) => {
    try {
      if (bundle) {
        localStorage.setItem(BUNDLE_KEY, JSON.stringify(bundle));
      } else {
        localStorage.removeItem(BUNDLE_KEY);
      }
    } catch (e) {
      console.warn('Storage warning:', e);
    }
  },

  // Step & Mode
  getStep: (): number => {
    try {
      const s = localStorage.getItem(STEP_KEY);
      return s ? parseInt(s, 10) : 1;
    } catch {
      return 1;
    }
  },
  saveStep: (step: number) => {
    try {
      localStorage.setItem(STEP_KEY, String(step));
    } catch {}
  },

  getMode: (): 'wizard' | 'standalone-image' | 'standalone-video' => {
    try {
      const m = localStorage.getItem(MODE_KEY);
      if (m === 'standalone-image' || m === 'standalone-video' || m === 'wizard') {
        return m;
      }
      return 'wizard';
    } catch {
      return 'wizard';
    }
  },
  saveMode: (mode: 'wizard' | 'standalone-image' | 'standalone-video') => {
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {}
  },

  // Active Base Example Cache for Cross-component sharing
  getActiveBaseExample: () => {
    try {
      const data = localStorage.getItem('unitec_active_base_example');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveActiveBaseExample: (example: any) => {
    try {
      if (example) {
        localStorage.setItem('unitec_active_base_example', JSON.stringify(example));
      } else {
        localStorage.removeItem('unitec_active_base_example');
      }
    } catch {}
  },

  // Generated Images History
  getGeneratedImages: (): SavedImageItem[] => {
    try {
      const data = localStorage.getItem(IMAGES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveGeneratedImage: (item: Omit<SavedImageItem, 'id' | 'createdAt'>) => {
    try {
      const existing = storage.getGeneratedImages();
      // Keep most recent 20 images
      const newItem: SavedImageItem = {
        ...item,
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: Date.now()
      };
      const updated = [newItem, ...existing.filter(x => x.url !== item.url)].slice(0, 20);
      localStorage.setItem(IMAGES_KEY, JSON.stringify(updated));
      return newItem;
    } catch (e) {
      console.warn('Image storage warning:', e);
      return null;
    }
  },

  // Generated Videos History
  getGeneratedVideos: (): SavedVideoItem[] => {
    try {
      const data = localStorage.getItem(VIDEOS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveGeneratedVideo: (item: Omit<SavedVideoItem, 'id' | 'createdAt'>) => {
    try {
      const existing = storage.getGeneratedVideos();
      const newItem: SavedVideoItem = {
        ...item,
        id: `vid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: Date.now()
      };
      const updated = [newItem, ...existing].slice(0, 20);
      localStorage.setItem(VIDEOS_KEY, JSON.stringify(updated));
      return newItem;
    } catch (e) {
      console.warn('Video storage warning:', e);
      return null;
    }
  }
};
