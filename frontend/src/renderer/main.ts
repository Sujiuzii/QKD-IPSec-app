document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('sendBtn');
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const ipInput = document.getElementById('ipInput') as HTMLInputElement;
  const ipVersion = document.getElementById('ipVersion') as HTMLSelectElement;
  const transferProgress = document.getElementById('transferProgress') as HTMLDivElement;
  const encryptionProgress = document.getElementById('encryptionProgress') as HTMLDivElement;
  const fileList = document.getElementById('fileList');
  const keyQuantity = document.getElementById('keyQuantity');
  const keyRate = document.getElementById('keyRate');

  sendBtn?.addEventListener('click', async () => {
      const ip = ipInput.value;
      const file: File | null = fileInput.files ? fileInput.files[0] : null;

      if (!ip || !file) {
          alert('Please enter an IP address and upload a file.');
          return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('ip', ip);
      formData.append('ipVersion', ipVersion.value);

      try {
          const response = await fetch('http://localhost:8880/upload', {
              method: 'POST',
              body: formData,
          });

          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

        const encryptedVideoContainer = document.getElementById('encryptedVideoContainer');
        if (encryptedVideoContainer) {
          encryptedVideoContainer.innerHTML = '<div class="lock-overlay">File has been encrypted</div>';
        }
          simulateProgress();

      } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
      }
  });

  function simulateProgress() {
      let transferValue = 0;
      let encryptionValue = 0;
      const interval = setInterval(() => {
          if (transferValue < 100) {
              transferValue += 10;
              transferProgress.style.width = `${transferValue}%`;
          }
          if (encryptionValue < 100) {
              encryptionValue += 10;
              encryptionProgress.style.width = `${encryptionValue}%`;
          }
          if (transferValue >= 100 && encryptionValue >= 100) {
              clearInterval(interval);
              const fileName = fileInput.files ? fileInput.files[0].name : null;
              const listItem = document.createElement('li');
              listItem.textContent = fileName;
              fileList?.appendChild(listItem);
          }
      }, 500);
  }

fileInput.addEventListener('change', (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;
    if (file) {
        const url = URL.createObjectURL(file);
        const originalVideo = document.getElementById('originalVideo') as HTMLIFrameElement;
        originalVideo.src = url;
    }
});
});
