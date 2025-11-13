# Study Notes - Ứng dụng Ghi chú học tập

## Thông tin sinh viên

- **Họ và tên**: Đinh Lê Thái Dương
- **MSSV**: 22IT056
- **Lớp**: 22SE2
- **Đề tài**: Đề 4 - Ứng dụng Ghi chú học tập (Study Notes)

## Tính năng chính

### 1. Màn hình chính (Home)

- Hiển thị danh sách các môn học: Toán, Lý, Hóa, Anh, CNTT
- Điều hướng sang màn hình ghi chú khi chọn môn

### 2. Màn hình ghi chú (Notes)

- Nhận tham số `subject` từ URL
- Hiển thị danh sách ghi chú của môn học đó
- Form nhập ghi chú mới với validation
- Thêm ghi chú mới (Enter hoặc nút Thêm)
- Xóa ghi chú bằng cách vuốt sang trái
- Tự động lưu và reload danh sách
- Toast notifications cho các thao tác
- Empty state khi chưa có ghi chú

### 3. Lưu trữ dữ liệu

- Sử dụng `@capacitor/preferences` (chính thức từ Capacitor 7)
- Lưu theo format: `notes_<subject>` với giá trị JSON string
- Service class `NotesStorage` để quản lý
- Hỗ trợ CRUD operations đầy đủ

## Cài đặt và Chạy dự án

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cài đặt Capacitor Preferences (đã có trong package.json)

```bash
npm install @capacitor/preferences
```

### 3. Build project

```bash
npm run build
```

### 4. Sync với Capacitor

```bash
npx cap sync
```

### 5. Chạy trên trình duyệt (Development)

```bash
ionic serve
```

hoặc

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:5173

### 6. Chạy trên Android

#### Mở Android Studio:

```bash
npx cap open android
```

#### Hoặc chạy trực tiếp:

```bash
npx cap run android
```
