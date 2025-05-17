# por-solana-smart-contracts

This repository contains a Solana smart contract project for the "Proof of recycling" app developed using the [Anchor framework](https://www.anchor-lang.com/).
The project is structured to facilitate the development and deployment of Solana programs with Rust and Anchor.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Rust**: Install via [rustup](https://rustup.rs/).
- **Solana CLI**: Install using the following command:
  ```bash
  sh -c "$(curl -sSfL https://release.solana.com/v1.9.6/install)"
  ```
- **Anchor CLI**: Install with Cargo:
  ```bash
  cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
  ```

## Project Structure

The repository is organized as follows:

- `programs/por_nft`: Contains the main smart contract code for minting discount nft.
- `tests/`: Includes test scripts for the program.
- `Anchor.toml`: Anchor configuration file.
- `Cargo.toml`: Rust project configuration.
- `package.json`: Node.js project configuration (if applicable).

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Wow11One/por-solana-smart-contracts.git
   cd por-solana-smart-contracts
   ```

2. **Install Dependencies**:
   If the project includes a JavaScript client, install Node.js dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Solana CLI**:
   Set the CLI to use the local validator:
   ```bash
   solana config set --url localhost
   ```

4. **Start Local Validator**:
   In a separate terminal window, start the Solana test validator:
   ```bash
   solana-test-validator
   ```

5. **Generate a New Keypair**:
   Create a new keypair for deploying the program:
   ```bash
   solana-keygen new --outfile ~/.config/solana/id.json
   ```

## Build and Deploy

1. **Build the Program**:
   Use Anchor to build the smart contract:
   ```bash
   anchor build
   ```

2. **Deploy the Program**:
   Deploy the compiled program to the local validator:
   ```bash
   anchor deploy
   ```

## Testing

Run the test suite to ensure the program behaves as expected:
```bash
anchor test
```
