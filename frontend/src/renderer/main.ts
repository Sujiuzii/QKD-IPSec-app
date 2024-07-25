import { uploadFile, onProgress, fetchParameters } from './api';

document.addEventListener('DOMContentLoaded', () => {
  const fileInputButton = document.getElementById('fileInputButton') as HTMLButtonElement;
  const filePathDisplay = document.getElementById('filePathDisplay') as HTMLSpanElement;
  const uploadButton = document.getElementById('uploadButton') as HTMLButtonElement;
  const progressBar = document.getElementById('progressBar') as HTMLDivElement;
  const toggleButton = document.getElementById('toggleButton') as HTMLButtonElement;
  const parameterPanel = document.getElementById('parameterPanel') as HTMLDivElement;
  const parameterDisplay = document.getElementById('parameterDisplay') as HTMLDivElement;

  let selectedFilePath: string | null = null;

  fileInputButton.addEventListener('click', async () => {
    const filePath = await window.electron.selectFile();
    if (filePath) {
      filePathDisplay.textContent = filePath;
      selectedFilePath = filePath;
    }
  });

  uploadButton.addEventListener('click', () => {
    if (selectedFilePath) {
      const ip = "127.0.0.1";
      const port = 8080;
      uploadFile(selectedFilePath, ip, port)
        .then(() => {
          onProgress((progress) => {
            progressBar.style.width = `${progress}%`;
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });

  toggleButton.addEventListener('click', () => {
    parameterPanel.style.display = parameterPanel.style.display === 'none' ? 'block' : 'none';
  });

  fetchParameters()
    .then((params) => {
      parameterDisplay.textContent = JSON.stringify(params, null, 2);
    })
    .catch((err) => {
      console.error(err);
    });
});

