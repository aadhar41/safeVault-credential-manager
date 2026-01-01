# safeVault-credential-manager

A secure, lightweight, and user-friendly credential management system designed to store and manage sensitive information such as passwords, API keys, and digital certificates.

## Features

- **End-to-End Encryption**: All data is encrypted locally before being stored using industry-standard AES-256-GCM encryption.
- **Zero-Knowledge Architecture**: Your master password is never stored or transmitted; keys are derived using Argon2.
- **Multi-Factor Authentication (MFA)**: Support for TOTP (Google Authenticator, Authy) and hardware keys (YubiKey).
- **Cross-Platform Support**: Unified experience across CLI, Web, and Desktop (Electron).
- **Secure Sharing**: Safely share credentials with team members using RSA-4096 public-key cryptography.
- **Audit Logs**: Comprehensive tracking of access, modifications, and sharing events.
- **Automatic Backups**: Encrypted cloud sync and local backup rotation.

## Tech Stack

- **Backend**: Node.js / Express or Python / FastAPI
- **Database**: SQLite (local) or PostgreSQL (self-hosted)
- **Encryption**: OpenSSL, Web Crypto API
- **Frontend**: React / Tailwind CSS

## Future Features

- **Browser Extensions**: Native integration for Chrome, Firefox, and Safari for seamless auto-fill.
- **Mobile Application**: Cross-platform mobile app built with React Native, featuring biometric unlock (FaceID/TouchID).
- **Password Health Dashboard**: Integration with "Have I Been Pwned" API to alert users of compromised credentials.
- **SSH Key & Certificate Management**: Support for storing and rotating SSH keys and SSL/TLS certificates.
- **Import/Export Tools**: Easy migration paths from Bitwarden, LastPass, and 1Password.
- **Offline Sync**: Peer-to-peer synchronization for local networks without relying on cloud providers.
- **Emergency Access**: Secure mechanism for trusted contacts to request access to your vault in case of emergency.


## Getting Started

### Prerequisites

- Node.js (v18 or higher) or Python 3.10+
- OpenSSL 3.0+
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/safeVault-credential-manager.git
   cd safeVault-credential-manager
   ```

2. **Install dependencies**:
   ```bash
   npm install # or pip install -r requirements.txt
   ```

3. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL=./vault.db
   ENCRYPTION_KEY_STRENGTH=256
   ```

### Usage

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
   safevault get GitHub
   ```
5. **Delete a Credential**:
   ```bash
   safevault delete GitHub
   ```

## Security

This project takes security seriously. We use industry-standard cryptographic primitives. If you discover any vulnerabilities, please report them via our [Security Policy](SECURITY.md).

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

Distributed under the MIT License. See `LICENSE` for more information.
