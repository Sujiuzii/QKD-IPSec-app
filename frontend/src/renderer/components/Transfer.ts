document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('sendBtn');
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const ipInput = document.getElementById('ipInput') as HTMLInputElement;
    const ipVersion = document.getElementById('ipVersion') as HTMLSelectElement;
    const transferProgress = document.getElementById('transferProgress') as HTMLDivElement;
    const encryptionProgress = document.getElementById('encryptionProgress') as HTMLDivElement;
    const fileList = document.getElementById('fileList');
  
    let socket: WebSocket;
  
    sendBtn?.addEventListener('click', async () => {
      const ip = ipInput.value;
      const file: File | null = fileInput.files ? fileInput.files[0] : null;
  
      if (!ip || !file) {
        alert('请填写IP地址并上传文件。');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ip', ip);
      formData.append('ipVersion', 'IPv4');
  
      try {
        const response = await fetch('http://localhost:10001/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('网络响应不正常');
        }
  
        const encryptedVideoContainer = document.getElementById('encryptedVideoContainer');
        if (encryptedVideoContainer) {
          encryptedVideoContainer.innerHTML = '<div class="lock-overlay">文件已加密</div>';
        }
        setupWebSocket();
      } catch (error) {
        console.error('上传操作出现问题:', error);
      }
    });
  
    function setupWebSocket() {
      socket = new WebSocket('ws://localhost:10001/ws');
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateProgress(data.progress);
      };
    }
  
    function updateProgress(progress: number) {
      transferProgress.style.width = `${progress}%`;
      if (progress >= 100) {
        const fileName = fileInput.files ? fileInput.files[0].name : null;
        const listItem = document.createElement('li');
        listItem.textContent = fileName;
        fileList?.appendChild(listItem);
      }
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
  