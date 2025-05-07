const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const results = document.getElementById('results');
const downloadAllBtn = document.getElementById('downloadAll');
let compressedFiles = []; // 存储所有压缩后的文件

// 添加新的全局变量
const progressStatus = document.getElementById('progressStatus');
const currentFileSpan = document.getElementById('currentFile');
const totalFilesSpan = document.getElementById('totalFiles');
const totalProgressBar = document.getElementById('totalProgressBar');

// 压缩选项
const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    preserveExif: true
};

// 添加历史记录数组
let compressionHistory = [];

// 添加设置面板HTML
const settingsPanel = document.createElement('div');
settingsPanel.className = 'settings-panel';
settingsPanel.innerHTML = `
    <div class="settings-header">
        <h3><i class="fas fa-cog"></i> 压缩设置</h3>
        <button class="close-settings"><i class="fas fa-times"></i></button>
    </div>
    <div class="settings-content">
        <div class="setting-item">
            <label>最大文件大小 (MB)</label>
            <input type="number" id="maxSizeInput" value="1" min="0.1" max="10" step="0.1">
        </div>
        <div class="setting-item">
            <label>最大宽度/高度 (像素)</label>
            <input type="number" id="maxDimensionInput" value="1920" min="100" max="4000" step="100">
        </div>
        <div class="setting-item">
            <label>
                <input type="checkbox" id="preserveExifInput" checked>
                保留EXIF信息
            </label>
        </div>
        <div class="setting-item">
            <label>
                <input type="checkbox" id="darkModeInput">
                暗黑模式
            </label>
        </div>
    </div>
`;

// 添加历史记录面板HTML
const historyPanel = document.createElement('div');
historyPanel.className = 'history-panel';
historyPanel.innerHTML = `
    <div class="history-header">
        <h3><i class="fas fa-history"></i> 压缩历史</h3>
        <button class="clear-history"><i class="fas fa-trash"></i></button>
    </div>
    <div class="history-content" id="historyContent">
    </div>
`;

// 添加设置按钮
const settingsBtn = document.createElement('button');
settingsBtn.className = 'settings-btn';
settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
document.querySelector('.container').appendChild(settingsBtn);

// 添加历史按钮
const historyBtn = document.createElement('button');
historyBtn.className = 'history-btn';
historyBtn.innerHTML = '<i class="fas fa-history"></i>';
document.querySelector('.container').appendChild(historyBtn);

// 添加设置面板到页面
document.querySelector('.container').appendChild(settingsPanel);
document.querySelector('.container').appendChild(historyPanel);

// 设置面板事件监听
document.querySelector('.close-settings').addEventListener('click', () => {
    settingsPanel.classList.remove('active');
});

settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('active');
});

historyBtn.addEventListener('click', () => {
    historyPanel.classList.toggle('active');
});

// 更新压缩选项
function updateCompressionOptions() {
    options.maxSizeMB = parseFloat(document.getElementById('maxSizeInput').value);
    options.maxWidthOrHeight = parseInt(document.getElementById('maxDimensionInput').value);
    options.preserveExif = document.getElementById('preserveExifInput').checked;
}

// 暗黑模式切换
document.getElementById('darkModeInput').addEventListener('change', (e) => {
    options.darkMode = e.target.checked;
    document.body.classList.toggle('dark-mode', options.darkMode);
    localStorage.setItem('darkMode', options.darkMode);
});

// 保存历史记录
function saveToHistory(file, compressedFile) {
    const historyItem = {
        originalName: file.name,
        originalSize: file.size,
        compressedSize: compressedFile.size,
        timestamp: new Date().toISOString(),
        savedPercentage: (100 - (compressedFile.size / file.size) * 100).toFixed(1)
    };
    
    compressionHistory.unshift(historyItem);
    if (compressionHistory.length > 50) compressionHistory.pop();
    
    updateHistoryPanel();
    localStorage.setItem('compressionHistory', JSON.stringify(compressionHistory));
}

// 更新历史记录面板
function updateHistoryPanel() {
    const historyContent = document.getElementById('historyContent');
    historyContent.innerHTML = compressionHistory.map(item => `
        <div class="history-item">
            <div class="history-file-name">${item.originalName}</div>
            <div class="history-details">
                <span>原始: ${(item.originalSize / 1024 / 1024).toFixed(2)}MB</span>
                <span>压缩后: ${(item.compressedSize / 1024 / 1024).toFixed(2)}MB</span>
                <span>节省: ${item.savedPercentage}%</span>
            </div>
            <div class="history-time">${new Date(item.timestamp).toLocaleString()}</div>
        </div>
    `).join('');
}

// 清除历史记录
document.querySelector('.clear-history').addEventListener('click', () => {
    compressionHistory = [];
    updateHistoryPanel();
    localStorage.removeItem('compressionHistory');
});

// 加载保存的设置和历史记录
function loadSavedData() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
        options.darkMode = savedDarkMode === 'true';
        document.getElementById('darkModeInput').checked = options.darkMode;
        document.body.classList.toggle('dark-mode', options.darkMode);
    }
    
    const savedHistory = localStorage.getItem('compressionHistory');
    if (savedHistory) {
        compressionHistory = JSON.parse(savedHistory);
        updateHistoryPanel();
    }
}

// 拖拽上传
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.background = '#f8f9fa';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.background = 'white';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.background = 'white';
    handleFiles(e.dataTransfer.files);
});

// 点击上传
dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

async function handleFiles(files) {
    compressedFiles = [];
    downloadAllBtn.style.display = 'none';
    
    // 显示总进度状态
    progressStatus.style.display = 'block';
    totalFilesSpan.textContent = files.length;
    currentFileSpan.textContent = '0';
    totalProgressBar.style.width = '0%';
    
    let processedCount = 0;
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    for (const file of validFiles) {
        const resultItem = createResultItem(file);
        results.insertBefore(resultItem, results.firstChild);

        try {
            updateCompressionOptions(); // 更新压缩选项
            const compressedFile = await compressImage(file, resultItem);
            compressedFiles.push(compressedFile);
            updateResultItem(resultItem, file, compressedFile, true);
            saveToHistory(file, compressedFile); // 保存到历史记录
            
            processedCount++;
            currentFileSpan.textContent = processedCount;
            totalProgressBar.style.width = `${(processedCount / validFiles.length) * 100}%`;
            
            if (compressedFiles.length > 0) {
                downloadAllBtn.style.display = 'block';
            }
        } catch (error) {
            console.error('压缩失败:', error);
            updateResultItem(resultItem, file, null, false);
            processedCount++;
            currentFileSpan.textContent = processedCount;
            totalProgressBar.style.width = `${(processedCount / validFiles.length) * 100}%`;
        }
    }
}

function createResultItem(file) {
    const div = document.createElement('div');
    div.className = 'result-item';
    div.innerHTML = `
        <div class="file-info">
            <img src="${URL.createObjectURL(file)}" alt="预览">
            <div>
                <div class="file-name">
                    ${file.name}
                    <span class="status-icon pending">
                        <i class="fas fa-spinner fa-spin"></i>
                    </span>
                </div>
                <div class="size-info">正在压缩...</div>
                <div class="progress">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
        </div>
        <button class="download-btn" style="display: none">
            <i class="fas fa-download"></i> 下载
        </button>
    `;
    return div;
}

async function compressImage(file, resultItem) {
    const progressBar = resultItem.querySelector('.progress-bar');
    
    options.onProgress = (progress) => {
        progressBar.style.width = `${progress * 100}%`;
    };

    const compressedFile = await imageCompression(file, options);
    
    // 创建与原始文件名相同的File对象
    return new File([compressedFile], file.name, {
        type: compressedFile.type
    });
}

function updateResultItem(resultItem, originalFile, compressedFile, success) {
    const sizeInfo = resultItem.querySelector('.size-info');
    const downloadBtn = resultItem.querySelector('.download-btn');
    const progressBar = resultItem.querySelector('.progress-bar');
    const statusIcon = resultItem.querySelector('.status-icon');

    if (success) {
        const originalSize = (originalFile.size / 1024 / 1024).toFixed(2);
        const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
        const savedPercentage = (100 - (compressedFile.size / originalFile.size) * 100).toFixed(1);

        sizeInfo.textContent = `原始大小: ${originalSize}MB | 压缩后: ${compressedSize}MB | 节省: ${savedPercentage}%`;
        statusIcon.className = 'status-icon success';
        statusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        
        downloadBtn.style.display = 'block';
        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(compressedFile);
            link.download = compressedFile.name;
            link.click();
        });
    } else {
        sizeInfo.textContent = '压缩失败';
        statusIcon.className = 'status-icon error';
        statusIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
    }
    
    progressBar.style.width = '100%';
}

// 添加一键下载功能
downloadAllBtn.addEventListener('click', async () => {
    if (compressedFiles.length === 0) return;

    // 如果只有一个文件，直接下载
    if (compressedFiles.length === 1) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(compressedFiles[0]);
        link.download = compressedFiles[0].name;
        link.click();
        return;
    }

    // 如果有多个文件，创建zip
    const zip = new JSZip();
    
    // 添加所有文件到zip
    compressedFiles.forEach(file => {
        zip.file(file.name, file);
    });
    
    try {
        // 生成zip文件
        const content = await zip.generateAsync({type: 'blob'});
        // 下载zip文件
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = '压缩图片.zip';
        link.click();
    } catch (error) {
        console.error('创建zip文件失败:', error);
        alert('下载失败，请重试或单独下载文件');
    }
});

// 初始化
loadSavedData(); 