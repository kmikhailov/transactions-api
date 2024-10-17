# Transactions Aggregator API

This project is a NestJS-based API that aggregates transaction data for users. It includes endpoints to get aggregated data, request payouts, and mock server capabilities for testing purposes.
    
## Features

- Aggregate user transaction data such as balance, earned, spent, and payout.
- Poll transactions data from a given API periodically.
- Expose endpoints to add transactions dynamically (earned, spent, and payout).
- Unit tests for core service functionality.

## Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation
1. Install Nest CLI globally if not already installed:

   ```bash
   npm install -g @nestjs/cli
   ```

2. Clone the repository:

   ```bash
   git clone <repository-url>
   cd aggregator
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Running the Application

1. Start the application:

   ```bash
   npm run start
   ```

2. The API server will run at `http://localhost:3000` by default.

2. The API server will use transactions server run at `http://localhost:3001` by default.

3. To access the Swagger API documentation, visit:

   ```
   http://localhost:3000/api
   ```

## Mock Transactions Server

To run the mock transactions server for testing:

1. Navigate to the directory containing the mock transactions API:

   ```bash
   cd aggregator/transactions
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the mock server:

   ```bash
   npm run start
   ```

4. The mock server will be available at `http://localhost:3001`.

3. To access the Swagger API documentation, visit:

   ```
   http://localhost:3001/api
   ```
## Running Tests

### Unit Tests

1. Run the unit tests for the service layer:
   ```bash
   npm run test
   ```

## Available Endpoints

- **GET /transactions/user/:userId** - Get aggregated transaction data by user ID.
- **GET /transactions/payouts** - Get requested payouts aggregated by user ID.
- **POST /transactions** - Add a new transaction (`earned`, `spent`, or `payout`).

## License

This project is licensed under the MIT License.

