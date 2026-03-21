# 🥭 Mango Fusion – Food & Order Management System

A modern, full-stack food and order management application built with cutting-edge web technologies. Mango Fusion enables administrators to manage menu items and orders, while customers can browse food items, place orders, and securely manage their accounts.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

Mango Fusion is designed to streamline food service operations with an intuitive interface for both administrators and end-users. The application leverages modern architectural patterns and best practices for security, performance, and scalability.

## 🚀 Tech Stack

### Backend
- **Framework**: .NET Core 10 Web API
- **ORM**: Entity Framework Core (Code-First approach)
- **Database**: Microsoft SQL Server
- **Authentication**: JWT Token-Based Authentication
- **Architecture**: RESTful API with clean separation of concerns

### Frontend
- **Framework**: Angular 21 (Standalone Architecture)
- **State Management**: Angular Signals
- **HTTP**: Functional HTTP Interceptors with JWT token injection
- **UI Notifications**: ngx-toastr for toast notifications
- **Modals**: SweetAlert2 for user confirmations and alerts

### Database
- **DBMS**: Microsoft SQL Server
- **Migrations**: EF Core migrations for version control

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with email verification
- Secure login with JWT tokens
- JWT token-based authentication
- Automatic token expiration validation
- Protected API endpoints
- Role-based authorization (Admin/User roles)
- Automatic unauthorized request handling

### 🥗 Menu Management
- Add new menu items with detailed information
- Edit existing menu items
- Delete menu items
- Upload and manage food images
- Category and special tag support
- Dynamic price management

### 🛒 Order Management
- Browse and place food orders
- View complete order history
- Track order status
- Secure order processing
- Admin controls for order status updates

### 🛡 Security
- JWT token injection via HTTP interceptors
- Password strength validation
- Global error handling across the application
- Automatic unauthorized response handling
- Protected routes and endpoints

## 📁 Project Structure

```
dotnet-core-angular-mango-fusion/
├── MangoFusion.Api/          # .NET Core Web API
│   ├── Controllers/          # API endpoints
│   ├── Models/              # Data models
│   ├── Services/            # Business logic
│   ├── Repository/          # Data access layer
│   └── ...
├── MangoFusion.Ui/          # Angular frontend
│   ├── src/
│   │   ├── app/            # Angular components
│   │   ├── services/       # API services
│   │   ├── models/         # TypeScript models
│   │   └── ...
│   └── ...
├── LICENSE                  # MIT License
└── README.md               # This file
```

## 🏃 Getting Started

### Prerequisites

- **.NET Core 10** or later
- **Node.js** (v18 or later) and **npm**
- **Angular CLI** v21 or later
- **Microsoft SQL Server** (local or cloud)
- **Git**

### Installation

#### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/avijitg11/dotnet-core-angular-mango-fusion.git
   cd dotnet-core-angular-mango-fusion
   ```

2. Navigate to the API directory:
   ```bash
   cd MangoFusion.Api
   ```

3. Install dependencies and restore NuGet packages:
   ```bash
   dotnet restore
   ```

4. Configure your SQL Server connection string in `appsettings.json`

5. Run database migrations:
   ```bash
   dotnet ef database update
   ```

#### Frontend Setup

1. Navigate to the UI directory:
   ```bash
   cd MangoFusion.Ui
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

## ▶️ Running the Application

### Start the Backend API

```bash
cd MangoFusion.Api
dotnet run
```

The API will be available at `https://localhost:5001` (or your configured port)

### Start the Frontend Application

```bash
cd MangoFusion.Ui
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload whenever you modify any source files.

### Build for Production

**Backend:**
```bash
cd MangoFusion.Api
dotnet publish -c Release
```

**Frontend:**
```bash
cd MangoFusion.Ui
ng build --configuration production
```

## 🧪 Testing

### Frontend Unit Tests
```bash
cd MangoFusion.Ui
ng test
```

### Frontend End-to-End Tests
```bash
cd MangoFusion.Ui
ng e2e
```

## 📚 API Documentation

The API follows RESTful conventions with the following main endpoints:

- **Authentication**: `/api/auth/register`, `/api/auth/login`
- **Menu Items**: `/api/menu/items` (GET, POST, PUT, DELETE)
- **Orders**: `/api/orders` (GET, POST)
- **Users**: `/api/users/{id}`

For detailed API specifications, refer to the Swagger documentation available at `/swagger` when the API is running.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

For questions or support, please open an issue on the [GitHub repository](https://github.com/avijitg11/dotnet-core-angular-mango-fusion/issues).

---

**Built with ❤️ by [Avijit Ghosh](https://github.com/avijitg11)**
