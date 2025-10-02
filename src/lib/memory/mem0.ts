// Minimal Mem0 wrapper (no-op if MEM0_API_KEY missing)
// Add in `.env.local`:
// - MEM0_API_KEY=...

export type Memory = {
  id: string;
  content: string;
  createdAt: number;
};

export class Mem0Client {
  private readonly apiKey: string | undefined;
  constructor() {
    this.apiKey = process.env.MEM0_API_KEY;
  }

  enabled() {
    return Boolean(this.apiKey);
  }

  async addMemory(_userId: string, _text: string): Promise<void> {
    if (!this.enabled()) return; // integrate real API here
    // TODO: call Mem0 API to persist memory (requires MEM0_API_KEY)
  }

  async getMemories(_userId: string): Promise<Memory[]> {
    if (!this.enabled()) return [];
    // TODO: call Mem0 API to retrieve memories
    return [];
  }
}
