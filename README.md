# SafeVault Credential Manager

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

A secure, lightweight, and user-friendly credential management system designed to store and manage sensitive information such as passwords, API keys, and digital certificates. **SafeVault** is built with a focus on privacy, ensuring that your data remains yours alone.

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Docker Deployment](#docker-deployment)
- [Usage](#usage)
  - [CLI Commands](#cli-commands)
- [Security](#security)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)

## Features

- **End-to-End Encryption**: All data is encrypted locally before being stored using industry-standard AES-256-GCM encryption.
- **Zero-Knowledge Architecture**: Your master password is never stored or transmitted; keys are derived using Argon2.
- **Multi-Factor Authentication (MFA)**: Support for TOTP (Google Authenticator, Authy) and hardware keys (YubiKey).
- **Cross-Platform Support**: Unified experience across CLI, Web, and Desktop (Electron).
- **Secure Sharing**: Safely share credentials with team members using RSA-4096 public-key cryptography.
- **Audit Logs**: Comprehensive tracking of access, modifications, and sharing events.
- **Persistent Storage**: Data remains safe and available even after the app is killed or device is restarted.
- **Automatic Backups**: Encrypted cloud sync and local backup rotation.

## Architecture Overview

SafeVault utilizes a client-side encryption model. Sensitive data is encrypted on the user's device before being synchronized to the central database. 

- **Key Derivation**: We use Argon2id with a high iteration count and memory cost to protect against brute-force attacks on the master password.
- **Data Storage**: Encrypted blobs are stored in IndexedDB (browser) or SQLite (local CLI), and optionally synced to a PostgreSQL backend.
- **Communication**: All API calls are protected via TLS 1.3, and payload signatures ensure data integrity.

## Tech Stack

- **Backend**: Node.js (Express) or Python (FastAPI)
- **Database**: SQLite (local) or PostgreSQL (self-hosted)
- **Encryption**: OpenSSL, Web Crypto API, Argon2
- **Frontend**: React, Tailwind CSS, Electron

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **Python**: 3.10+ (if using the Python backend)
- **OpenSSL**: 3.0+
- **Docker**: (Optional) For containerized deployment

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/safeVault-credential-manager.git
   cd safeVault-credential-manager
   ```

2. **Install dependencies**:

   **For Node.js:**
   ```bash
   npm install
   ```

   **For Python:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL=./vault.db
   ENCRYPTION_KEY_STRENGTH=256
   SECRET_KEY=your_super_secret_key_here
   ```

### Docker Deployment

To run SafeVault using Docker:
```bash
docker-compose up -d
```
This will spin up the web interface, the API, and a PostgreSQL instance.

## Usage

### CLI Commands

1. **Initialize the Vault**:
   ```bash
   safevault init
   ```
2. **Add a Credential**:
   ```bash
   safevault add --title "GitHub" --username "user" --password "secure-pass" --url "https://github.com"
   ```
3. **List all Credentials**:
   ```bash
   safevault list
   ```
4. **Retrieve a Credential**:
   ```bash
   safevault get GitHub --copy # Copies password to clipboard
   ```
5. **Generate a Password**:
   ```bash
   safevault generate --length 24 --symbols
   ```

## Security

This project takes security seriously. We use industry-standard cryptographic primitives and undergo regular internal audits. 
- **Bug Bounty**: We reward responsible disclosure of security vulnerabilities.
- **Reporting**: If you discover any vulnerabilities, please report them via our [Security Policy](SECURITY.md).

## Future Roadmap

- [ ] **Browser Extensions**: Native integration for Chrome, Firefox, and Safari.
- [ ] **Mobile Application**: React Native app with FaceID/TouchID support.
- [ ] **Password Health Dashboard**: Integration with "Have I Been Pwned" API.
- [ ] **SSH Key & Certificate Management**: Support for rotating SSL/TLS certificates.
- [ ] **Offline Sync**: Peer-to-peer synchronization for local networks.
- [ ] **Emergency Access**: Trusted contact recovery mechanism.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

Distributed under the MIT License. See `LICENSE` for more information.
