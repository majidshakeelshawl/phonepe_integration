# PhonePe Integration

A comprehensive implementation showcasing **X-Verify header validation** and seamless **PhonePe payment integration** for web applications. This project ensures secure payment handling and robust webhook processing for real-time updates.

---

## Features

- **Payment Processing**: Secure integration with PhonePe's payment gateway.
- **X-Verify Validation**: Ensures data integrity using PhonePe's hashing mechanism.
- **Webhook Support**: Handles callbacks for payment success/failure notifications.
- **Dynamic Payload Handling**: Customizable payload structure to fit various use cases.
- **Redirect-Based User Experience**: Users are redirected to appropriate status pages after transaction completion.

---

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js (LTS version) installed.
- **Express.js**: The core framework for routing and handling requests.
- **Ngrok**: For exposing local development servers to the internet.
- **Environment Variables**: Set up a `.env` file with the following keys:
  - `MERCHANT_ID`
  - `NGROK_URL`
  - `PHONEPE_API_TEST`
  - `ENVIRONMENT` (e.g., `DEVELOPMENT` or `PRODUCTION`) etc.

> NOTE: Check the [SAMPLE ENV](./sample.env) file for reference.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/majidshakeelshawl/phonepe_integration.git
   cd phonepe_integration

2. Install dependencies:
```bash
    npm install
```

3. Start the server:
```bash
    npm run dev
```

4. Set up Ngrok:
```bash
    ngrok http <SERVER_RUNNING_PORT>
```

Copy the public URL from Ngrok and update the NGROK_URL in your .env file.

### Usage
1. Visit the homepage at http://localhost:3000.
2. Initiate a payment by clicking the "Pay with PhonePe" button.
3. After payment, users are redirected to a status page (Payment Successful or Payment Failed).
4. Webhooks will handle transaction updates based on the callback URL provided in the payload.

### Project Notes
1. X-Verify Validation: The server computes the X-Verify header to ensure the authenticity of data exchanged between the client and PhonePe.
2. Callback Security: The project includes logic to verify the X-Verify header in callback requests, preventing unauthorized updates.
3. Environment-Specific Behavior: The application behaves differently in DEVELOPMENT and PRODUCTION environments, so ensure the correct settings in the .env file.
4. Dynamic Routing: Routes for payments and webhooks are modularized for better maintainability.
5. Error Handling: Generic error messages are provided for failed payments, ensuring sensitive data is not leaked.

### Important Disclaimer
This project is for educational purposes and demonstrates a secure integration of PhonePe with web applications. While the implementation prioritizes security and efficiency, it is recommended to thoroughly review and customize the code to fit your production needs. The maintainers are not responsible for any issues arising from the use of this project in production environments.

### Contribution
Feel free to fork the repository, create a feature branch, and open a pull request with improvements or new features!

### License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.