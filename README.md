# 📸 Image to URL Share (Serverless Image Sharing)

A simple web tool that converts an image into a data-encoded URL. Since the image data is embedded directly into the URL, you can share images using only a link—no servers or databases required.

## ✨ Key Features
- **No Server/No DB:** Image data is compressed and stored directly within the URL hash.
- **Privacy-Focused:** No data is ever uploaded to a server; everything stays in your browser.
- **Instant Sharing:** Just copy the generated URL and send it. The recipient's browser will decode the image instantly.
- **Client-side Compression:** Uses the [LZ-String](https://pieroxy.net/lua/lz-string/) library to minimize URL length for better compatibility.

## 🚀 How to Use
1. Access the live website.
2. Click the **"Choose File"** button to upload the image you want to share.
3. The app will generate a long **Share URL**.
4. Click **"Copy URL"** and send it to anyone! When they open the link, the image will appear.

## 🛠 Technical Stack
- **Frontend:** HTML5, CSS3, JavaScript
- **Library:** [LZ-String](https://pieroxy.net/lua/lz-string/) (for URL-safe data compression)
- **Deployment:** GitHub Pages

## ⚠️ Limitations & Notes
- **URL Length Limits:** Extremely high-resolution images may result in URLs that are too long for some browsers or messaging apps to handle. 
- **Best Use Case:** Recommended for small images, screenshots, or thumbnails.

---
*Created for lightweight, cost-free image sharing and exploring client-side data handling.*
