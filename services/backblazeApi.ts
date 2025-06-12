const BACKBLAZE_API_KEY = 'K005Xg14QfPu15xFy3b18NjcDDRgWFc';
const BACKBLAZE_BUCKET_ID = 'tree-iad1-0000'; // This might need to be adjusted based on your actual bucket ID

interface B2AuthResponse {
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
}

interface B2FileInfo {
  fileId: string;
  fileName: string;
  contentType: string;
  contentLength: number;
  uploadTimestamp: number;
  fileInfo?: Record<string, string>;
}

interface B2ListFilesResponse {
  files: B2FileInfo[];
  nextFileName?: string;
}

class BackblazeService {
  private authToken: string | null = null;
  private apiUrl: string | null = null;
  private downloadUrl: string | null = null;

  async authenticate(): Promise<void> {
    try {
      const response = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${BACKBLAZE_API_KEY}:`)}`
        }
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data: B2AuthResponse = await response.json();
      this.authToken = data.authorizationToken;
      this.apiUrl = data.apiUrl;
      this.downloadUrl = data.downloadUrl;
    } catch (error) {
      console.error('Backblaze authentication error:', error);
      throw error;
    }
  }

  async listFiles(bucketId?: string): Promise<B2FileInfo[]> {
    if (!this.authToken || !this.apiUrl) {
      await this.authenticate();
    }

    try {
      const response = await fetch(`${this.apiUrl}/b2api/v2/b2_list_file_names`, {
        method: 'POST',
        headers: {
          'Authorization': this.authToken!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bucketId: bucketId || BACKBLAZE_BUCKET_ID,
          maxFileCount: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to list files: ${response.statusText}`);
      }

      const data: B2ListFilesResponse = await response.json();
      return data.files.filter(file => 
        file.contentType?.includes('audio') || 
        file.fileName.match(/\.(mp3|wav|m4a|aac|ogg)$/i)
      );
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  getDownloadUrl(fileName: string): string {
    if (!this.downloadUrl) {
      throw new Error('Not authenticated');
    }
    return `${this.downloadUrl}/file/${BACKBLAZE_BUCKET_ID}/${fileName}`;
  }

  async getBuckets(): Promise<any[]> {
    if (!this.authToken || !this.apiUrl) {
      await this.authenticate();
    }

    try {
      const response = await fetch(`${this.apiUrl}/b2api/v2/b2_list_buckets`, {
        method: 'POST',
        headers: {
          'Authorization': this.authToken!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountId: this.authToken!.split(':')[0] // Extract account ID from token
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to list buckets: ${response.statusText}`);
      }

      const data = await response.json();
      return data.buckets || [];
    } catch (error) {
      console.error('Error listing buckets:', error);
      throw error;
    }
  }
}

export const backblazeService = new BackblazeService();
export type { B2FileInfo };