let currentImg = null;

const Base91 = {
    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,-./:;<=>?@[]^_`{|}~\"",
    encode: function(data) {
        let n = 0, b = 0, res = "";
        for (let i = 0; i < data.length; i++) {
            b |= (data[i] & 255) << n; n += 8;
            if (n > 13) {
                let v = b & 8191;
                if (v > 88) { b >>= 13; n -= 13; } 
                else { v = b & 16383; b >>= 14; n -= 14; }
                res += this.alphabet[v % 91] + this.alphabet[Math.floor(v / 91)];
            }
        }
        if (n > 0) { res += this.alphabet[b % 91]; if (n > 7 || b > 90) res += this.alphabet[Math.floor(b / 91)]; }
        return res;
    },
    decode: function(str) {
        let v = -1, b = 0, n = 0, out = [];
        for (let i = 0; i < str.length; i++) {
            let c = this.alphabet.indexOf(str[i]);
            if (c === -1) continue;
            if (v < 0) { v = c; } 
            else {
                v += c * 91; b |= v << n; n += (v & 8191) > 88 ? 13 : 14;
                while (n >= 8) { out.push(b & 255); b >>= 8; n -= 8; }
                v = -1;
            }
        }
        if (v > -1) out.push((b | v << n) & 255);
        return new Uint8Array(out);
    }
};

const App = {
    async compress(str) {
        const stream = new Blob([str]).stream().pipeThrough(new CompressionStream("gzip"));
        return new Uint8Array(await new Response(stream).arrayBuffer());
    },
    async decompress(uint8) {
        const stream = new Blob([uint8]).stream().pipeThrough(new DecompressionStream("gzip"));
        return new Response(stream).text();
    }
};

async function updateSettings() {
    const q = document.getElementById('qualityInput').value;
    document.getElementById('qualityVal').innerText = q;
    if (currentImg) await processImage(currentImg);
}

async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = async () => {
            currentImg = img;
            await processImage(img);
            document.body.classList.add('uploaded');
            document.getElementById('resultArea').style.display = 'block';
        };
    };
    reader.readAsDataURL(file);
}

async function processImage(img) {
    const maxWidth = parseInt(document.getElementById('maxWidthInput').value) || 0;
    const maxHeight = parseInt(document.getElementById('maxHeightInput').value) || 0;
    const quality = parseFloat(document.getElementById('qualityInput').value) || 0.7;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let w = img.width, h = img.height;
    let ratio = 1;
    if (maxWidth > 0 && w > maxWidth) ratio = Math.min(ratio, maxWidth / w);
    if (maxHeight > 0 && h > maxHeight) ratio = Math.min(ratio, maxHeight / h);

    canvas.width = w * ratio; canvas.height = h * ratio;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const webpData = canvas.toDataURL('image/webp', quality);
    const compressed = await App.compress(webpData);
    const hash = Base91.encode(compressed);

    const finalURL = window.location.origin + window.location.pathname.replace('index.html', '') + 'view.html#' + encodeURIComponent(hash);
    document.getElementById('urlOutput').value = finalURL;
    document.getElementById('urlOutputDisplay').innerText = finalURL;
    document.getElementById('preview').src = webpData;
}

function copyURL() {
    const val = document.getElementById('urlOutput').value;
    navigator.clipboard.writeText(val).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    });
}

async function runViewer() {
    const hashStr = window.location.hash.substring(1);
    const statusText = document.getElementById('statusText');
    const statusContainer = document.getElementById('statusContainer');
    const img = document.getElementById('viewerImg');

    if (!hashStr) {
        if (statusText) statusText.innerText = "No data found.";
        return;
    }

    try {
        const decoded = Base91.decode(decodeURIComponent(hashStr));
        const webpData = await App.decompress(decoded);
        if (img) {
            img.src = webpData;
            img.onload = () => {
                img.style.display = 'block';
                if (statusContainer) statusContainer.style.display = 'none';
            };
        }
    } catch (e) {
        if (statusText) {
            statusText.innerText = "Invalid or Corrupted URL.";
            statusText.style.color = "#808080";
        }s
    }
}

window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('viewerImg')) runViewer();
    const input = document.getElementById('imageInput');
    if (input) {
        input.onchange = (e) => handleFile(e.target.files[0]);
        window.addEventListener('dragover', (e) => e.preventDefault());
        window.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
        });
    }
});


async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = async () => {
            currentImg = img;
            await processImage(img);
            
            document.body.classList.add('uploaded');
            
            const resultArea = document.getElementById('resultArea');
            resultArea.style.display = 'block';

            setTimeout(() => {
                resultArea.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center'
                });
            }, 100);
        };
    };
    reader.readAsDataURL(file);
}