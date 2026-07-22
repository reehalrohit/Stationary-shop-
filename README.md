# 🛒 Ajay Stationary Hub - AI POS & Inventory System

A modern, full-stack Point of Sale (POS) and inventory management system built with Next.js. This application uses AI vision models to automatically scan and extract supplier invoices, manages live stock in a PostgreSQL database, and features a clean POS interface with printable A4 customer billing.

## ✨ Features

* **🤖 AI Invoice Processing:** Upload images or PDFs of supplier invoices. The app uses OpenRouter (Gemma Vision) directly from the browser (bypassing server timeouts) to extract item names, quantities, and wholesale costs.
* **📦 Live Inventory Management:** Automatically merges duplicate items, adds them to a live Vercel Postgres database, and allows for real-time stock and price editing.
* **💰 Smart Pricing:** Separates wholesale cost (hidden) from Maximum Retail Price (MRP).
* **🧾 POS Billing System:** Click-to-add cart system, adjustable quantities, and on-the-fly MRP editing during checkout.
* **🖨️ A4 Invoice Printing:** Generates a professional, print-ready A4 customer invoice that strictly hides wholesale costs and only displays the retail MRP.

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router) & React
* **Styling:** Tailwind CSS
* **Database:** Vercel Postgres (`pg` package)
* **AI Provider:** OpenRouter API (`google/gemma-4-26b-a4b-it:free`)
* **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed and an active [OpenRouter](https://openrouter.ai/) account to generate an API key.

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/stationary-shop.git](https://github.com/your-username/stationary-shop.git)
cd stationary-shop
