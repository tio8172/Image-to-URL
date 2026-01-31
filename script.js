const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const urlOutput = document.getElementById('urlOutput');

// 1. 이미지 선택 시: 압축하여 URL 생성
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const base64String = event.target.result;
        
        // LZ-String을 이용한 고강도 압축 (URL safe)
        const compressed = LZString.compressToEncodedURIComponent(base64String);
        
        // # 뒤에 압축 데이터를 붙여서 URL 생성
        const shareURL = window.location.origin + window.location.pathname + '#' + compressed;
        
        urlOutput.value = shareURL;
        preview.src = base64String;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
});

// 2. 페이지 로드 시 또는 URL 변경 시: 데이터 복구 및 이미지 출력
function decodeImageFromURL() {
    // URL에서 # 뒷부분 가져오기
    const hash = window.location.hash.substring(1);
    
    if (hash) {
        try {
            // 압축 해제
            const decompressed = LZString.decompressFromEncodedURIComponent(hash);
            
            if (decompressed && decompressed.startsWith('data:image')) {
                preview.src = decompressed;
                preview.style.display = 'block';
                urlOutput.value = window.location.href;
            } else {
                alert("이미지 데이터를 불러올 수 없습니다. URL이 올바르지 않거나 너무 깁니다.");
            }
        } catch (error) {
            console.error("Decoding error:", error);
        }
    }
}

// 페이지가 처음 로드될 때 실행
window.addEventListener('load', decodeImageFromURL);
// 사용자가 주소창에 새 URL을 붙여넣고 엔터를 쳤을 때(hash가 바뀔 때) 실행
window.addEventListener('hashchange', decodeImageFromURL);

function copyURL() {
    urlOutput.select();
    navigator.clipboard.writeText(urlOutput.value).then(() => {
        alert('URL이 복사되었습니다!');
    });
}
