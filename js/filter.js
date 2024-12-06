// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const filterWorkspace = document.querySelector('.filter-workspace');
const originalImage = document.getElementById('originalImage');
const filteredImage = document.getElementById('filteredImage');
const downloadBtn = document.getElementById('downloadBtn');

// 当前滤镜状态
let currentFilters = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hue: 0,
    preset: 'none'
};

// 预设滤镜配置
const presetFilters = {
    none: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        hue: 0
    },
    grayscale: {
        filter: 'grayscale(100%)'
    },
    sepia: {
        filter: 'sepia(100%)'
    },
    invert: {
        filter: 'invert(100%)'
    },
    warm: {
        filter: 'sepia(30%) saturate(140%) hue-rotate(15deg)'
    },
    cool: {
        filter: 'saturate(110%) hue-rotate(180deg)'
    },
    vintage: {
        filter: 'sepia(50%) contrast(95%) brightness(90%) saturate(80%)'
    }
};

// 初始化事件监听
function initializeEvents() {
    // 文件上传处理
    uploadArea.addEventListener('click', () => fileInput.click());
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
        handleImageUpload(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });

    // 滤镜调节控制
    document.querySelectorAll('.adjustment-controls input').forEach(input => {
        input.addEventListener('input', (e) => {
            currentFilters[e.target.id] = e.target.value;
            e.target.nextElementSibling.textContent = getValueText(e.target.id, e.target.value);
            applyFilters();
        });
    });

    // 预设滤镜按钮
    document.querySelectorAll('.filter-buttons button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.filter-buttons button.active')?.classList.remove('active');
            button.classList.add('active');
            applyPresetFilter(button.dataset.filter);
        });
    });

    // 下载按钮
    downloadBtn.addEventListener('click', downloadImage);
}

// 处理图片上传
function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        filteredImage.src = e.target.result;
        filterWorkspace.style.display = 'block';
        uploadArea.style.display = 'none';
        resetFilters();
    };
    reader.readAsDataURL(file);
}

// 应用滤镜效果
function applyFilters() {
    const filters = [
        `brightness(${currentFilters.brightness}%)`,
        `contrast(${currentFilters.contrast}%)`,
        `saturate(${currentFilters.saturation}%)`,
        `blur(${currentFilters.blur}px)`,
        `hue-rotate(${currentFilters.hue}deg)`
    ];

    if (currentFilters.preset !== 'none' && presetFilters[currentFilters.preset].filter) {
        filters.push(presetFilters[currentFilters.preset].filter);
    }

    filteredImage.style.filter = filters.join(' ');
}

// 应用预设滤镜
function applyPresetFilter(preset) {
    currentFilters.preset = preset;
    applyFilters();
}

// 重置滤镜
function resetFilters() {
    currentFilters = {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        hue: 0,
        preset: 'none'
    };

    document.querySelectorAll('.adjustment-controls input').forEach(input => {
        input.value = currentFilters[input.id];
        input.nextElementSibling.textContent = getValueText(input.id, currentFilters[input.id]);
    });

    document.querySelector('.filter-buttons button[data-filter="none"]').click();
}

// 获取值的文本表示
function getValueText(type, value) {
    switch (type) {
        case 'blur':
            return `${value}px`;
        case 'hue':
            return `${value}°`;
        default:
            return `${value}%`;
    }
}

// 下载处理后的图片
function downloadImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小为图片实际大小
    canvas.width = filteredImage.naturalWidth;
    canvas.height = filteredImage.naturalHeight;
    
    // 应用滤镜效果并绘制图片
    ctx.filter = filteredImage.style.filter;
    ctx.drawImage(filteredImage, 0, 0);
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = 'filtered-image.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.8);
    link.click();
}

// 初始化
initializeEvents(); 