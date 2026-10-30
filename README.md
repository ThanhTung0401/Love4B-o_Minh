# Gửi em bé 💌

Một trang web nhỏ dễ thương: Bé Tim hỏi em bé vài câu → phong thư trái tim → bức thư tay với mưa cánh hồng, bó hoa hồng nở, phiếu yêu thương và nút "Ôm anh 1 cái".

Chỉ dùng HTML + CSS + JS thuần, không cần cài đặt gì. Tối ưu cho laptop và iPhone 11 Pro.

## Cấu trúc

```
index.html   – khung trang + nội dung bức thư
style.css    – giao diện, animation
script.js    – câu hỏi, hiệu ứng tim/cánh hồng, nhạc, phiếu, nút ôm
assets/      – (tuỳ chọn) bỏ file music.mp3 vào đây
.nojekyll    – để GitHub Pages phục vụ file y nguyên
```

## Sửa nội dung

- **Bức thư**: sửa trong `index.html`, phần `<!-- 4. Bức thư -->`.
- **Câu hỏi, phiếu yêu thương, lời nhắn khi ôm**: sửa ở đầu file `script.js` (phần `NỘI DUNG`).
- **Nhạc**: mặc định trang tự chơi một bản hộp nhạc nhỏ. Muốn dùng bài hát riêng thì tạo thư mục `assets/` và bỏ file `music.mp3` vào, trang sẽ tự dùng file đó.

## Xem thử trên máy

```bash
cd /home/vy-gamedev/Project/Love_Feeling
python3 -m http.server 8000
```

Mở `http://localhost:8000`.

## Đưa lên GitHub Pages

```bash
cd /home/vy-gamedev/Project/Love_Feeling
git init
git add .
git commit -m "Gửi em bé 💌"
git branch -M main
git remote add origin https://github.com/<ten-github>/<ten-repo>.git
git push -u origin main
```

Trên GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
Sau 1–2 phút link sẽ là `https://<ten-github>.github.io/<ten-repo>/`.

> Lưu ý: iPhone đang bật chế độ im lặng (gạt nút bên hông) thì sẽ không nghe nhạc.
