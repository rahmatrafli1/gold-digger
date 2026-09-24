# GoldDigger 🪙

A gold investment simulation app with live real-time pricing, built using Node.js native modules (`http`, `fs`, `path`, `events`) without any additional frameworks.

## ✨ Features

- **Live Price Streaming** — Gold price per Oz updates automatically every 2 seconds using **Server-Sent Events (SSE)**.
- **Realistic Price Simulation** — Price moves randomly (random walk) around a base price, mimicking real market fluctuations.
- **Real-time Investment** — Users can input an investment amount (in Rupiah) and instantly see how much gold (in ounces) they receive.
- **Transaction Logging** — Every transaction is automatically logged to `transactions.log`.
- **PDF Invoice Generation** — Each transaction generates a downloadable PDF invoice.
- **Mock Email Confirmation** — Simulates sending a confirmation email (logged to `emails.log`, no real SMTP required).
- **Static File Serving** — Frontend (HTML/CSS/JS) is served directly by the server without a framework like Express.

## 📸 Preview

| Disconnected               | Connected                         | Invest                          | Summary                                          |
| -------------------------- | --------------------------------- | ------------------------------- | ------------------------------------------------ |
| Red status, input disabled | Green status, live price updating | Enter amount & click Invest Now | Transaction summary popup with PDF download link |

## 🗂️ Folder Structure

```
GoldDigger/
├── server.js                 # HTTP server entry point
├── events/
│   └── priceEmitter.js       # EventEmitter for generating live prices
├── routes/
│   ├── static.js             # Serves static files & invoice PDFs
│   ├── livePrice.js          # SSE endpoint for live prices
│   └── invest.js             # POST /invest endpoint
├── helpers/
│   └── mimeTypes.js          # MIME type constants
├── utils/
│   ├── logger.js             # Transaction logging function
│   ├── pdfGenerator.js       # Generates PDF invoices
│   └── mailer.js             # Mock email sender (logs to emails.log)
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── invoices/                 # Generated PDF invoices (auto-generated)
├── transactions.log          # Transaction log (auto-generated)
├── emails.log                # Mock email log (auto-generated)
├── .env                       # Environment configuration
└── package.json
```

## ⚙️ Tech Stack

- **Node.js** (native modules: `http`, `fs`, `path`, `events`, `crypto`)
- **dotenv** — Environment variable management
- **sanitize-html** — Sanitizes input before writing to logs
- **pdfkit** — Generates PDF invoices
- **nodemon** — Auto-restarts server during development

## 🚀 Installation

```powershell
npm install
```

## 🔧 Configuration

Create a `.env` file in the project root:

```env
PORT=8000
BASE_PRICE=2700000
```

| Variable     | Description                     | Default   |
| ------------ | ------------------------------- | --------- |
| `PORT`       | Server port                     | `8000`    |
| `BASE_PRICE` | Base gold price per Oz (Rupiah) | `2700000` |

## ▶️ Running the App

**Development mode (auto-reload):**

```powershell
npm run dev
```

**Production mode:**

```powershell
npm start
```

Open your browser at:

```
http://localhost:8000
```

## 📡 API Endpoints

### `GET /live-price`

Streams the gold price in real-time using Server-Sent Events (SSE).

**Response (event stream):**

```
data: {"price": 2702345.67}
```

### `POST /invest`

Executes a gold purchase based on the investment amount. Automatically generates a PDF invoice and triggers a mock confirmation email.

**Request Body:**

```json
{ "amount": 100000 }
```

**Success Response:**

```json
{
  "amountPaid": 100000,
  "pricePerOz": 2702345.67,
  "goldSold": 0.037,
  "transactionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "invoiceUrl": "/invoices/invoice-a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf"
}
```

**Error Response:**

```json
{ "error": "Invalid amount" }
```

### `GET /invoices/:filename`

Serves the generated PDF invoice for download.

## 📝 Sample Transaction Log

```
2026-09-24T10:15:32.123Z, amount paid: Rp100000, price per Oz: Rp2702345.67, gold sold: 0.037 Oz
2026-09-24T10:20:10.456Z, amount paid: Rp500000, price per Oz: Rp2698765.43, gold sold: 0.1853 Oz
```

## 📧 Sample Mock Email Log

```
========================================
To: customer@example.com
Subject: GoldDigger - Purchase Confirmation
Date: 2026-09-24T10:15:32.456Z
----------------------------------------
Dear Customer,

Thank you for your investment with GoldDigger!

Transaction Details:
- Transaction ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
- Amount Paid: Rp100.000
- Price per Oz: Rp2.702.345,67
- Gold Purchased: 0.037 Oz

Your invoice is attached: invoice-a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf

Best regards,
GoldDigger Team
========================================
```

## 🎯 Concepts Used

- **HTTP Module** — Building a server without a framework
- **FS Module** — Reading static files, writing logs & generating PDFs
- **Path Module** — Cross-platform-safe path resolution
- **Events Module** — `EventEmitter` for broadcasting live prices
- **Crypto Module** — Generating unique transaction IDs
- **Server-Sent Events (SSE)** — Server-to-client push without polling
- **Manual Routing** — Mapping URLs to handlers without a framework

## 🎁 Stretch Goals

- [x] Generate a PDF with transaction details
- [x] Send a confirmation email for the purchase (mocked)

## 📄 License

This project was built for learning/portfolio purposes.
