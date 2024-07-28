document.addEventListener('DOMContentLoaded', () => {
  const fileInputButton = document.getElementById('fileInputButton');
  const uploadButton = document.getElementById('uploadButton');
  const filePathDisplay = document.getElementById('filePathDisplay');
  const uploadProgress = document.getElementById('uploadProgress') as HTMLProgressElement;
  const parameterPanel = document.getElementById('parameterPanel');

  let selectedFile: File;

  fileInputButton?.addEventListener('click', async () => {
      const filePaths = await window.electron.selectFile();
      if (filePathDisplay) {
        if (filePaths.length > 0) {
            filePathDisplay.textContent = filePaths[0];
            selectedFile = new File([filePaths[0]], filePaths[0]);
        } else {
            filePathDisplay.textContent = 'No file selected';
        }
      }
  });

  uploadButton?.addEventListener('click', async () => {
      if (selectedFile) {
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('filename', selectedFile.name);

          const xhr = new XMLHttpRequest();
          xhr.open('POST', 'http://localhost:8880/upload', true);

          xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                  const percentComplete = (event.loaded / event.total) * 100;
                  uploadProgress.value = percentComplete;
              }
          };

          xhr.onload = () => {
              if (xhr.status === 200) {
                  console.log('Upload successful');
              } else {
                  console.error('Upload failed');
              }
          };

          xhr.send(formData);
      } else {
          console.error('No file selected for upload');
      }
  });

  // Fetch parameters from backend
  fetch('http://localhost:8880/parameters')
      .then(response => response.json())
      .then(data => {
          for (const key in data) {
              if (data.hasOwnProperty(key)) {
                  const p = document.createElement('p');
                  p.textContent = `${key}: ${data[key]}`;
                  parameterPanel?.appendChild(p);
              }
          }
      })
      .catch(error => console.error('Error fetching parameters:', error));
});
