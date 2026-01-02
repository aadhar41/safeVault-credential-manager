# SafeVault Credential Manager

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)
![Node.js](https://img.shields.io/badge/node.js-v18+-339933?logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/python-3.10+-3776AB?logo=python&logoColor=white)

A secure, lightweight, and user-friendly credential management system designed to store and manage sensitive information such as passwords, API keys, and digital certificates. **SafeVault** is built with a focus on privacy, ensuring that your data remains yours alone.

## 📲 Download SafeVault

[**📥 Download Android APK (v1.0.0)**](https://github.com/yourusername/safeVault-credential-manager/releases/download/v1.0.0/app-debug.apk)

---

> [!TIP]
> After downloading the APK, you may need to allow "Install from Unknown Sources" in your Android settings to install the app.

## 📸 Screenshots

| Login Screen | Dashboard | Vault View |
| :---: | :---: | :---: |
| ![Login](public/screens/login.png) | ![Dashboard](public/screens/dashboard.png) | ![Vault](public/screens/vault.png) |

| Add Credential | Settings | Security Audit |
| :---: | :---: | :---: |
| ![Add](public/screens/add_credential.png) | ![Settings](public/screens/settings.png) | ![Audit](public/screens/audit.png) |

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Docker Deployment](#docker-deployment)
- [Usage](#usage)
- [Security](#security)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Features

- **End-to-End Encryption**: All data is encrypted locally before being stored using industry-standard AES-256-GCM encryption.
- **Zero-Knowledge Architecture**: Your master password is never stored or transmitted; keys are derived using Argon2.
- **Multi-Factor Authentication (MFA)**: Support for TOTP (Google Authenticator, Authy) and hardware keys (YubiKey).
- **Cross-Platform Support**: Unified experience across CLI, Web, and Desktop (Electron).
- **Secure Sharing**: Safely share credentials with team members using RSA-4096 public-key cryptography.
- **Audit Logs**: Comprehensive tracking of access, modifications, and sharing events.
- **Persistent Storage**: Data remains safe and available even after the app is killed or device is restarted.
- **Automatic Backups**: Encrypted cloud sync and local backup rotation.
- **Backup & Restore**: Easily export your vault to JSON or import existing backups.
- **Perfected FAB Layout**: Floating Action Button optimized for mobile safe areas to prevent overlap.
- **File Attachments**: Attach files to your credentials for easy access and sharing.
- **Biometric Unlock**: Support for Fingerprint and FaceID on supported mobile devices.
- **Auto-Fill Service**: Seamlessly fill credentials into other apps and websites.

## 🏗 Architecture Overview

SafeVault utilizes a client-side encryption model. Sensitive data is encrypted on the user's device before being synchronized to the central database. 

- **Key Derivation**: We use **Argon2id** (Memory: 64MB, Iterations: 3, Parallelism: 4) to derive the Master Key from your password.
- **Encryption Layer**: Data is encrypted using **AES-256-GCM**. Each entry has a unique 96-bit Initialization Vector (IV) and a 128-bit Authentication Tag to ensure data integrity.
- **Data Storage**: Encrypted blobs are stored in IndexedDB (browser) or SQLite (local CLI), and optionally synced to a PostgreSQL backend.
- **Communication**: All API calls are protected via TLS 1.3, and payload signatures ensure data integrity.

## 🛠 Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Backend** | Node.js (Express) / Python (FastAPI) |
| **Database** | SQLite (Local) / PostgreSQL (Self-hosted) |
| **Encryption** | OpenSSL, Web Crypto API, Argon2 |
| **Frontend** | React, Tailwind CSS, Electron |
| **Mobile** | React Native / Expo |

## 🏁 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **Python**: 3.10+
- **OpenSSL**: 3.0+
- **Docker**: (Optional) For containerized deployment

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/safeVault-credential-manager.git
   cd safeVault-credential-manager
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (JWT_SECRET, DB_URL, etc.)
   ```

3. **Install dependencies**:

   **For Node.js (Backend/Web):**
   ```bash
   npm install
   ```

   **For Python (CLI/Scripts):**
   ```bash
   pip install -r requirements.txt
   ```

   **For Mobile (React Native):**
   ```bash
   cd mobile
   npm install
   npx expo start
   ```

### Docker Deployment

To run SafeVault using Docker:
```bash
docker-compose up -d
