import * as fs from 'fs';
import * as path from 'path';

export async function uploadFile(filePath: string, ip: string, port: number): Promise<void> {
  const file = await fs.promises.readFile(filePath);
  const response = await fetch(`http://${ip}:${port}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Filename': path.basename(filePath),
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }
}

export async function fetchParameters(): Promise<any> {
  const response = await fetch('http://localhost:8880/parameters');
  if (!response.ok) {
    throw new Error('Failed to fetch parameters');
  }
  return response.json();
}

export function onProgress(callback: (progress: number) => void) {
  // Implement progress logic here
}
