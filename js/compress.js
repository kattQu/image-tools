// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 当前处理的图片数据
let currentImage = null;
let compressedImage = null;

// 初始化事件监听
function initializeEvents() {
    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageUpload(files[0]);
        }
    });

    // 点击上传
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });

    // 质量滑块变化
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (currentImage) {
            compressImage(currentImage, e.target.value / 100);
        }
    });

    // 下载按钮
    downloadBtn.addEventListener('click', () => {
        if (compressedImage) {
            const link = document.createElement('a');
            link.download = 'compressed-image.jpg';
            link.href = compressedImage;
            link.click();
        }
    });
}

// 处理图片上传
async function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！');
        return;
    }

    // 显示原图信息
    const originalContainer = document.querySelector('.preview-original .image-container');
    const originalInfo = document.querySelector('.preview-original .image-info');
    
    // 读取并显示原图
    const reader = new FileReader();
    reader.onload = async (e) => {
        currentImage = e.target.result;
        
        // 显示原图
        originalContainer.innerHTML = `<img src="${currentImage}" style="max-width: 100%; height: auto;">`;
        originalInfo.textContent = `原始大小: ${formatFileSize(file.size)}`;
        
        // 压缩图片
        await compressImage(currentImage, qualitySlider.value / 100);
    };
    reader.readAsDataURL(file);
}

// 压缩图片
async function compressImage(imageData, quality) {
    const img = new Image();
    img.src = imageData;
    
    await new Promise(resolve => img.onload = resolve);
    
    // 创建canvas
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    // 绘制图片
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    // 压缩
    compressedImage = canvas.toDataURL('image/jpeg', quality);
    
    // 显示压缩后的图片
    const compressedContainer = document.querySelector('.preview-compressed .image-container');
    const compressedInfo = document.querySelector('.preview-compressed .image-info');
    
    compressedContainer.innerHTML = `<img src="${compressedImage}" style="max-width: 100%; height: auto;">`;
    
    // 计算压缩后的大小
    const compressedSize = Math.round((compressedImage.length - 'data:image/jpeg;base64,'.length) * 3 / 4);
    compressedInfo.textContent = `压缩后大小: ${formatFileSize(compressedSize)}`;
    
    // 启用下载按钮
    downloadBtn.disabled = false;
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// 初始化
initializeEvents(); 