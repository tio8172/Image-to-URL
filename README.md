# [Image to URL](https://tio8172.github.io/Image-to-URL/)

A simple, client-side tool that encodes images into highly compressed data strings and stores them directly within the URL. No database or server-side storage is required.

## ✨ Features
* **Serverless Storage**: Images are converted to data strings and stored in the URL hash.
* **High Compression**: Uses **AVIF/WebP** conversion, **Gzip** compression, and **Base91** encoding to keep URLs as short as possible.
* **Privacy Focused**: All processing happens locally in your browser—no data ever leaves your device.

## 🚀 How it Works
1. **Select** or **Drag & Drop** an image anywhere on the screen.
2. **Adjust** the Max Width, Max Height, or Quality settings.
3. **Check** the URL length; if it's too long, the system will suggest lowering the quality.
4. **Copy** the generated link and share it.
5. The recipient opens the link to **decode** and view the original image instantly.

## 🛠 Tech Stack
* **HTML5 / CSS3**: Custom Inter font and OKLab interpolation for gradients.
* **Vanilla JavaScript**: Pure logic without external dependencies.
* **CompressionStream API**: Native browser Gzip compression.
* **Base91 Encoding**: Efficient binary-to-text encoding for URL safety.
