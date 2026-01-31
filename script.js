// ===========================================
//       공통 함수: LZ-String 압축/해제
// ===========================================

/**
 * Base64 문자열을 LZ-String으로 압축하여 URL에 안전한 형태로 반환합니다.
 * @param {string} base64String - 원본 Base64 데이터
 * @returns {string} 압축된 문자열
 */
function compressData(base64String) {
    return LZString.compressToEncodedURIComponent(base64String);
}

/**
 * URL에서 압축된 데이터를 읽어 Base64 문자열로 해제합니다.
 * @param {string} compressedData - 압축된 문자열
 * @returns {string | null} 해제된 Base64 문자열 또는 null
 */
function decompressData(compressedData) {
    if (!compressedData) return null;
    try {
        const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
        // 유효한 Base64 이미지 데이터인지 간단히 확인
        if (decompressed && decompressed.startsWith('data:image')) {
            return decompressed;
        }
    } catch (e) {
        console.error("데이터 압축 해제 오류:", e);
    }
    return null;
}

/**
 * URL 복사 함수 (navigator.clipboard 사용)
 */
function copyURL() {
    const urlOutput = document.getElementById('urlOutput');
    if (urlOutput) {
        urlOutput.select();
        navigator.clipboard.writeText(urlOutput.value).then(() => {
            alert('URL이 클립보드에 복사되었습니다!');
        }).catch(err => {
            console.error('URL 복사 실패:', err);
            alert('URL 복사에 실패했습니다. 수동으로 복사해주세요.');
        });
    }
}

// ===========================================
//       업로드 페이지 전용 로직
// ===========================================
if (document.body.classList.contains('upload-page')) {
    const imageInput = document.getElementById('imageInput');
    const preview = document.getElementById('preview');
    const urlOutput = document.getElementById('urlOutput');

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target.result;
            const compressed = compressData(base64String);
            
            // 뷰어 페이지로 연결되는 URL 생성: /view.html#<압축데이터>
            const viewPageURL = window.location.origin + window.location.pathname.replace('upload.html', 'view.html') + '#' + compressed;
            
            urlOutput.value = viewPageURL;
            preview.src = base64String;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });
}

// ===========================================
//       뷰어 페이지 전용 로직
// ===========================================
if (document.body.classList.contains('viewer-page')) {
    const viewerImg = document.getElementById('viewer-img');
    const loadingText = document.getElementById('loading-text');

    // 페이지 로드 시 또는 URL 해시 변경 시 이미지 표시
    const displayImage = () => {
        const hash = window.location.hash.substring(1); // '#' 제거
        const decompressed = decompressData(hash);
        
        if (decompressed) {
            viewerImg.src = decompressed;
            viewerImg.onload = () => {
                loadingText.style.display = 'none'; // 로딩 텍스트 숨김
                viewerImg.style.display = 'block'; // 이미지 표시
            };
            viewerImg.onerror = () => {
                loadingText.textContent = "이미지를 불러오는 데 실패했습니다.";
                loadingText.style.color = "#ff7675";
            }
        } else {
            loadingText.textContent = "유효한 이미지 데이터가 없습니다.";
            loadingText.style.color = "#ff7675";
        }
    };

    window.addEventListener('load', displayImage);
    window.addEventListener('hashchange', displayImage); // URL 해시 변경 감지
}
