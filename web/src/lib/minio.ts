import { Client } from 'minio';

// Parse endpoint and port from full URL
const parseEndpoint = (url: string) => {
  try {
    const urlObj = new URL(url);
    return {
      endpoint: urlObj.hostname,
      port: parseInt(urlObj.port || '443')
    };
  } catch (e) {
    // Fallback if URL parsing fails
    const [endpoint, port] = url.split(':');
    return {
      endpoint: endpoint.replace(/^https?:\/\//, ''),
      port: parseInt(port || '443')
    };
  }
};

const { endpoint, port } = parseEndpoint(process.env.MINIO_ENDPOINT || 'localhost:443');

export const minioClient = new Client({
  endPoint: endpoint,
  port: port,
  useSSL: true, // Since we're using Railway, we need SSL
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

export const BUCKET_NAME = 'cvs';

// Initialize bucket if it doesn't exist
export async function initializeBucket() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, process.env.MINIO_REGION || 'us-east-1');
      console.log(`Created bucket: ${BUCKET_NAME}`);
    }
  } catch (error) {
    console.error('Error initializing Minio bucket:', error);
    throw error;
  }
} 