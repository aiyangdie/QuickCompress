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
            const compressedFile = await compressImage(file, resultItem);
            compressedFiles.push(compressedFile);
            updateResultItem(resultItem, file, compressedFile, true);
            
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