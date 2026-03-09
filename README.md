# QRetrieve

**Scan it. Find it. Return it.**

QRetrieve is a QR-based lost-and-found platform. Register your belongings with a QR code tag — if someone finds your item, they scan the code and you get notified instantly.

---

## Features

- **Item Registration** — Register items and generate unique QR code tags
- **QR Customization Widget** — Interactive widget with live preview, size presets (keychain/bag tag/poster), custom dimensions (px/cm/in), and optional label
- **Multi-format Download** — Export QR codes as PNG, SVG, or PDF
- **Finder Scan Page** — Clean mobile-friendly form for finders with GPS autofill
- **Owner Dashboard** — View registered items, track found reports, download QR codes
- **Notification Popup** — Real-time popup showing finder details when an item is reported found
- **Containerized Deployment** — Full Docker setup with Nginx reverse proxy

---

## Tech Stack

| Layer      | Technology            |
|------------|----------------------|
| Frontend   | React 18             |
| Backend    | Node.js + Express    |
| Database   | MongoDB              |
| QR Engine  | qrcode + qrcode.react|
| PDF Export | jsPDF                |
| Proxy      | Nginx                |
| Container  | Docker Compose       |

---

## Project Structure

```
QRetrieve/
├── backend/
│   ├── src/
│   │   ├── config/         # App config and DB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/      # Error handler, request logger
│   │   ├── models/         # Mongoose schemas (Item, Report)
│   │   ├── routes/         # Express route definitions
│   │   ├── services/       # Business logic (item, report, QR)
│   │   ├── utils/          # Validation helpers
│   │   └── server.js       # App entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client
│   │   ├── styles/         # Global CSS
│   │   └── index.js        # React entry point
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   ├── nginx.conf          # Reverse proxy configuration
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Quick Start

### With Docker (Recommended)

```bash
docker-compose up --build
```

The app will be available at `http://localhost`.

- Frontend: `http://localhost` (via Nginx)
- Backend API: `http://localhost/api`
- MongoDB: `localhost:27017`

### Without Docker

**Prerequisites:** Node.js 18+, MongoDB running locally.

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:5000`.

---

## API Documentation

### Items

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| POST   | `/api/items`          | Register a new item        |
| GET    | `/api/items`          | Get all registered items   |
| GET    | `/api/items/:itemId`  | Get a specific item        |
| GET    | `/api/items/:itemId/qr` | Get QR code (png/svg/dataurl) |

**POST /api/items** — Register an item
```json
{
  "ownerName": "John Doe",
  "ownerContact": "john@example.com",
  "itemName": "Blue Backpack"
}
```

Response:
```json
{
  "item": {
    "itemId": "a1b2c3d4e5f6",
    "ownerName": "John Doe",
    "ownerContact": "john@example.com",
    "itemName": "Blue Backpack",
    "status": "safe",
    "createdAt": "2026-03-09T..."
  },
  "qrDataUrl": "data:image/png;base64,..."
}
```

**GET /api/items/:itemId/qr** — Download QR code
- Query params: `format` (png|svg|dataurl), `size` (pixels, default 512)

### Reports

| Method | Endpoint                  | Description                 |
|--------|---------------------------|-----------------------------|
| POST   | `/api/report-found`       | Submit a found report       |
| GET    | `/api/reports`            | Get all reports             |
| GET    | `/api/reports/:itemId`    | Get reports for an item     |

**POST /api/report-found** — Report a found item
```json
{
  "itemId": "a1b2c3d4e5f6",
  "finderName": "Jane Smith",
  "finderLocation": "Central Park, NYC",
  "finderContact": "jane@example.com",
  "message": "Found near the fountain"
}
```

### Health Check

| Method | Endpoint       | Description       |
|--------|---------------|-------------------|
| GET    | `/api/health` | Server status     |

---

## Database Schema

### Items Collection
| Field        | Type   | Description           |
|-------------|--------|-----------------------|
| itemId      | String | Unique item identifier |
| ownerName   | String | Item owner's name      |
| ownerContact| String | Email or phone         |
| itemName    | String | Item description       |
| status      | String | "safe" or "found"      |
| createdAt   | Date   | Registration timestamp |

### Reports Collection
| Field         | Type   | Description           |
|--------------|--------|-----------------------|
| reportId     | String | Unique report ID       |
| itemId       | String | Linked item identifier |
| finderName   | String | Name of finder         |
| finderLocation| String| Where item was found   |
| finderContact| String | Optional contact info  |
| message      | String | Optional message       |
| createdAt    | Date   | Report timestamp       |

---

## Environment Variables

| Variable      | Default                              | Description     |
|--------------|--------------------------------------|-----------------|
| PORT         | 5000                                 | Backend port    |
| MONGODB_URI  | mongodb://mongodb:27017/qretrieve    | MongoDB URI     |
| BASE_URL     | https://qretrieve.app                | QR code base URL|
| NODE_ENV     | development                          | Environment     |

---

## License

MIT
