# House of Hairs Saloon - Management System

A salon and spa management desktop and web application designed for **House of Hairs Saloon**. Built with modern React 19, TypeScript, Tailwind CSS, and Electron for full offline capability with zero reliance on cloud servers or subscription fees.

---

## Key Features

- **Dashboard & Daily Overview**:
  - Live revenue tally, completed service count, new client registration metrics, and active on-duty staff count.
  - Real-time Total Sales indicator updated across the top header, sidebar, and overview cards.

- **Live Service Ledger & Appointment Calendar**:
  - Full client boarding lifecycle: `Scheduled` ➔ `Boarded` (Arrived) ➔ `Seat In Chair` (`In Progress`) ➔ `Completed`.
  - Direct **"Bill Now"** action on finished services that populates invoice modals and marks appointments as Paid.
  - Delete and cancel appointment workflows with confirmation safeguards.

- **Point of Sale (POS) & Quick Billing**:
  - Multi-service checkout with automatic GST/Tax calculations, discounts, and itemized receipts.
  - Support for multiple payment methods: Cash, Credit/Debit Card, and UPI/GPay.
  - Thermal and standard receipt printing preview (`window.print()`).
  - Void and delete invoice capabilities that automatically adjust customer lifetime spend and salon sales totals in real-time.

- **Client CRM & Hair Diagnostics**:
  - Client contact book with hair texture, diagnostics, chemical color formulas, and scalp sensitivity/allergy alerts.
  - Automatic saving of new walk-in clients upon bill generation.
  - Direct WhatsApp campaign and individual message integration.

- **Staff & Receptionist Roster**:
  - Stylist roster with active/break/off status toggles, service counts, and daily revenue generation.
  - Front-desk receptionist management with desk assignments, shift schedules, and active duty switching.

- **Offline-First & Local Data Security**:
  - 100% offline functionality powered by local browser storage and local file system exports.
  - 1-click JSON backup export and restore directly in the Settings menu.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (bundled with Node.js)

### Installation

1. **Clone or extract the repository**:
   ```bash
   cd Saloon-Management-System-main
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to run the web application.

---

## Desktop Application (Electron)

The application includes an Electron desktop wrapper for native execution on Windows, macOS, and Linux.

### Run in Desktop Mode (Development)
```bash
npm run electron
```
This builds the client assets and immediately boots the native Electron window.

### Build Executables / Installers

You can package native installers for your operating system using the included `electron-builder` scripts:

- **Windows (.exe / NSIS Installer & Portable)**:
  ```bash
  npm run build:desktop:win
  ```
- **macOS (.dmg & .zip)**:
  ```bash
  npm run build:desktop:mac
  ```
- **Linux (.AppImage & .deb)**:
  ```bash
  npm run build:desktop:linux
  ```
- **Current OS Default**:
  ```bash
  npm run build:desktop
  ```

All compiled binaries will be output to the `dist-electron/` directory.

---

## Project Structure

```
├── electron/
│   └── main.cjs             # Electron main process and window lifecycle configuration
├── src/
│   ├── components/          # Reusable view components
│   │   ├── AddCustomerModal.tsx
│   │   ├── AppointmentsView.tsx
│   │   ├── BillingView.tsx
│   │   ├── BookingModal.tsx
│   │   ├── CustomerMarketingWidget.tsx
│   │   ├── CustomersView.tsx
│   │   ├── DailyOverview.tsx
│   │   ├── LiveServiceLedger.tsx
│   │   ├── OffersView.tsx
│   │   ├── PaymentModal.tsx
│   │   ├── QuickBilling.tsx
│   │   ├── ReportsView.tsx
│   │   ├── SettingsView.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StaffView.tsx
│   │   ├── TopHeader.tsx
│   │   └── WindowLauncher.tsx
│   ├── data/
│   │   └── initialData.ts   # Baseline catalog for services, stylists, and clients
│   ├── utils/
│   │   ├── format.ts        # Currency (INR ₹) and date formatting helpers
│   │   ├── offlineAvatars.ts# Offline SVG avatars fallback
│   │   └── offlineBackup.ts # Local database export and import utilities
│   ├── App.tsx              # Central state engine and route controller
│   ├── index.css            # Tailwind CSS styling directives
│   ├── main.tsx             # Application entry point
│   └── types.ts             # TypeScript definitions (Customer, Staff, Invoice, etc.)
├── index.html               # Main HTML shell
├── metadata.json            # AI Studio and platform configuration
├── package.json             # NPM package scripts and build targets
└── vite.config.ts           # Vite build pipeline setup
```

---

## Data Management & Backup

All customer profiles, service records, staff rosters, and invoices are securely stored in local storage. To ensure data safety across workstations or format operations:
1. Navigate to **Settings** (`/settings`).
2. Under **Local Database Backup & Security**, click **"Export Full Database (.json)"**.
3. To restore or migrate data to a new computer, use **"Restore Database from File"** to import the saved `.json` file.

---

## License

Private and proprietary software developed for House of Hairs Saloon.
