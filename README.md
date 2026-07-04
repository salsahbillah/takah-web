# TAKAH

**Takah (Smart Letter Management System)** is a web-based digital correspondence management application built with **React**, **Vite**, and **Tailwind CSS**, integrated with a **Golang Gin REST API** backend.

The application was developed as part of the Industrial Internship Program at **PT Cyber Blitz Nusantara** to streamline digital correspondence processes, including letter creation, approval workflows, monitoring, and master data management.

---

# Technology Stack

- React 19
- Vite
- Tailwind CSS 4
- Axios
- React Router DOM
- Golang Gin REST API
- MySQL
- JWT Authentication
- Lucide React

---

# Project Structure

```text
src
│
├── assets
├── components
├── config
├── context
├── hooks
├── layouts
├── pages
├── router
├── services
├── utils
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# Application Features

## Authentication

- User Login
- JWT Authentication
- Protected Routes
- Logout
- Session Management

---

## Dashboard

- Admin Dashboard
- Letter Statistics Summary
- User Profile Overview
- Quick Navigation

---

## Master Takah

- Create Master Data
- Update Master Data
- Delete Master Data
- Search Functionality

---

## Parameter Surat

- CRUD Operations
- Template Relationships
- Dynamic Input Fields
- Search & Filter
- Pagination

---

## Template Surat

- CRUD Operations
- Dynamic Letter Placeholders
- Template Preview
- Search
- Pagination

---

## Config Nomor Surat

- CRUD Operations
- Automatic Letter Number Configuration
- Monthly Reset
- Yearly Reset
- Number Format Preview

---

## Surat Keluar

- CRUD Operations
- Automatic Letter Number Generation
- Dynamic Parameters
- Draft Management
- Submit for Approval
- PDF Download
- Search
- Filter
- Pagination

---

## Surat Masuk

- CRUD Operations
- Document Upload
- Attachment Download
- Search
- Filter
- Pagination

---

## Approval

- Letter Details
- Approve Letter
- Reject Letter
- Approval Notes
- PDF Download
- Search
- Filter
- Pagination

---

## Monitoring

- Letter Status Monitoring
- Approval History
- Letter Details
- Search
- Filter
- Pagination

---

## Profile

- User Information
- User Role
- Logout

---

# Authentication Flow

```text
User
 │
 ▼
Login Page
 │
 ▼
Enter Email & Password
 │
 ▼
POST /api/v1/auth/login
 │
 ▼
Backend Validation
 │
 ▼
JWT Token
 │
 ▼
Local Storage
 │
 ▼
Auth Context
 │
 ▼
Protected Routes
 │
 ▼
Dashboard
```

---

# Application Flow

```text
Login
 │
 ▼
Dashboard
 │
 ├── Master Takah
 ├── Parameter Surat
 ├── Template Surat
 ├── Config Nomor Surat
 ├── Surat Keluar
 ├── Surat Masuk
 ├── Approval
 ├── Monitoring
 └── Profile
```

---

# Development Status

| Module | Status |
|----------|:------:|
| Authentication | ✅ |
| Dashboard | ✅ |
| Master Takah | ✅ |
| Parameter Surat | ✅ |
| Template Surat | ✅ |
| Config Nomor Surat | ✅ |
| Surat Keluar | ✅ |
| Surat Masuk | ✅ |
| Approval | ✅ |
| Monitoring | ✅ |
| Profile | ✅ |
| Responsive UI | ✅ |
| REST API Integration | ✅ |

---

# Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

# Backend

The backend service is developed using **Golang**, **Gin Framework**, and **MySQL**, and communicates with the frontend through RESTful APIs.

---

# Notes

This project was completed as part of the Industrial Internship Program at **PT Cyber Blitz Nusantara**.

All core features defined within the project scope have been successfully implemented and integrated with the backend system. Any future enhancements, feature requests, or requirement changes beyond the internship period are considered future development and are documented as implementation notes.
