interface Window {
  electron: {
    selectFile: () => Promise<string[]>;
  };
}
