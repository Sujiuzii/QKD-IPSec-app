export const uploadFile = async (filePath: string, ip: string, port: number) => {
  const formData = new FormData();
  const file = await fetch(filePath).then(response => response.blob());
  formData.append("file", file, "uploadedFile");

  const response = await fetch(`http://${ip}:${port}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("File upload failed");
  }
};

export const onProgress = (callback: (progress: number) => void) => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    callback(progress);
    if (progress >= 100) {
      clearInterval(interval);
    }
  }, 100);
};

export const fetchParameters = async () => {
  const response = await fetch('http://127.0.0.1:8080/parameters');
  if (!response.ok) {
    throw new Error('Failed to fetch parameters');
  }
  return response.json();
};

