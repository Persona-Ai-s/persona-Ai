declare module 'react-file-viewer' {
  interface FileViewerProps {
    fileType: string;
    filePath: string;
    onError?: (error: Error) => void;
    errorComponent?: React.ReactNode;
    loadingComponent?: React.ReactNode;
  }

  const FileViewer: React.FC<FileViewerProps>;
  export default FileViewer;
} 