# Exchanger Backend API

Backend API cho ứng dụng chuyển đổi tiền tệ sử dụng exchangerate.host API.

## Cài đặt

```bash
npm install
```

## Cấu hình API Key

1. Đăng ký tài khoản tại [exchangerate.host](https://exchangerate.host/quickstart)
2. Lấy API key từ dashboard
3. Tạo file `.env` trong thư mục backend với nội dung:

```env
EXCHANGERATE_API_KEY=your_actual_api_key_here
PORT=3001
API_GLOBAL_PREFIX=api
SWAGGER_PATH=docs
CORS_ORIGIN=http://localhost:3000
```

## Chạy ứng dụng

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Endpoints

- `GET /api/currency/rates` - Lấy tỉ giá hiện tại
- `GET /api/currency/convert` - Chuyển đổi tiền tệ
- `GET /api/currency/currencies` - Lấy danh sách tiền tệ hỗ trợ
- `GET /api/currency/historical` - Lấy tỉ giá lịch sử

## Swagger Documentation

Truy cập: `http://localhost:3001/docs`

## CORS

Backend đã được cấu hình CORS để cho phép frontend từ `http://localhost:3000`
