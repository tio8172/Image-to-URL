// 업로드 로직 (index.html에서 작동)
const imageInput = document.getElementById('imageInput');
if (imageInput) {
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const base64 = event.target.result;
            // 데이터를 압축
            const compressed = LZString.compressToEncodedURIComponent(base64);
            
            // 뷰어 페이지 경로 생성 (GitHub 주소 기준)
            const viewURL = window.location.origin + window.location.pathname.replace('index.html', '') + 'view.html#' + compressed;
            
            // 결과창 표시
            document.getElementById('urlOutput').value = viewURL;
            document.getElementById('preview').src = base64;
            document.getElementById('resultArea').style.display = 'block';
        };
        reader.readAsDataURL(file);
    });
}

// 뷰어 로드 로직 (view.html에서 작동)
window.addEventListener('load', function() {
    const viewerImg = document.getElementById('viewerImg');
    if (!viewerImg) return;

    const hash = window.location.hash.substring(1);
    if (hash) {
        try {
            const decompressed = LZString.decompressFromEncodedURIComponent(hash);
            if (decompressed) {
                viewerImg.src = decompressed;
                viewerImg.style.display = 'block';
                document.getElementById('statusText').style.display = 'none';
            }
        } catch (e) {
            document.getElementById('statusText').innerText = "이미지 복구에 실패했습니다.";
        }
    } else {
        document.getElementById('statusText').innerText = "공유된 이미지가 없습니다.";
    }
});

// 복사 함수
function copyURL() {
    const copyText = document.getElementById("urlOutput");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    alert("URL이 복사되었습니다!");
}
