# Garden Service Tracker

This project is a React application designed to track hours worked on gardening services. It utilizes Capacitor to enable mobile functionality, allowing the app to run on both Android and iOS platforms.

## Features

- User-friendly interface for tracking hours worked.
- Modals for adding hours, updating settings, and viewing history.
- Persistent storage using localStorage to save user data.
- Responsive design suitable for mobile devices.

## Getting Started

### Prerequisites

- Node.js (version 12 or higher)
- npm (Node package manager)
- Capacitor CLI

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd garden-capacitor
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Initialize Capacitor:

   ```
   npx cap init
   ```

4. Add platforms:

   ```
   npx cap add android
   npx cap add ios
   ```

5. Build the project:

   ```
   npm run build
   ```

6. Sync the project with Capacitor:

   ```
   npx cap sync
   ```

### Running the App

To run the app in a web browser:

```
npm start
```

To run the app on an Android device or emulator:

```
npx cap open android
```

To run the app on an iOS device or simulator:

```
npx cap open ios
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.