# TAKAH

Frontend **Takah (Smart Letter Management System)** merupakan aplikasi pengelolaan surat digital yang dibangun menggunakan **React, Vite, Tailwind CSS**, dan terintegrasi dengan **REST API Golang Gin**.

Aplikasi ini dikembangkan sebagai bagian dari Program Magang Industri di **PT Cyberss Blitz Nusantara** untuk membantu proses administrasi surat secara digital mulai dari pembuatan surat, approval, monitoring, hingga pengelolaan data master.

---

# Tech Stack

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

# Fitur Aplikasi

## Authentication

- Login
- JWT Authentication
- Protected Route
- Logout
- Session Management

---

## Dashboard

- Dashboard Admin
- Ringkasan Statistik Surat
- Informasi Profil User
- Navigasi Cepat

---

## Master Takah

- Tambah Master
- Edit Master
- Hapus Master
- Pencarian Data

---

## Parameter Surat

- CRUD Parameter
- Template Relation
- Dynamic Input
- Search & Filter
- Pagination

---

## Template Surat

- CRUD Template
- Placeholder Surat
- Preview Template
- Search
- Pagination

---

## Config Nomor Surat

- CRUD Config
- Generate Format Nomor
- Reset Bulanan
- Reset Tahunan
- Preview Nomor Surat

---

## Surat Keluar

- CRUD Surat Keluar
- Generate Nomor Surat
- Dynamic Parameter
- Draft
- Submit Approval
- Download PDF
- Search
- Filter
- Pagination

---

## Surat Masuk

- CRUD Surat Masuk
- Upload Dokumen
- Download Lampiran
- Search
- Filter
- Pagination

---

## Approval

- Detail Surat
- Approve Surat
- Reject Surat
- Catatan Approval
- Download Surat
- Search
- Filter
- Pagination

---

## Monitoring

- Monitoring Status Surat
- Riwayat Approval
- Detail Surat
- Search
- Filter
- Pagination

---

## Profile

- Informasi User
- Role User
- Logout

---

# Authentication Flow

```text
User
 │
 ▼
Login
 │
 ▼
Input Email & Password
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
Protected Route
 │
 ▼
Dashboard
```

---

# Flow Aplikasi

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

# Status Pengembangan

| Modul | Status |
|--------|:------:|
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
| Integrasi REST API | ✅ |

---

# Cara Menjalankan Project

Install dependency

```bash
npm install
```

Menjalankan project

```bash
npm run dev
```

Build production

```bash
npm run build
```

---

# Backend

Repository backend menggunakan **Golang Gin** dan terintegrasi dengan MySQL melalui REST API.

---

# Catatan

Project ini merupakan hasil implementasi selama Program Magang Industri di **PT Cybers Blitz Nusantara**.

Seluruh fitur utama yang menjadi ruang lingkup pengembangan telah diselesaikan. Apabila di kemudian hari terdapat perubahan kebutuhan atau penyesuaian fitur, perubahan tersebut menjadi catatan untuk pengembangan lanjutan di luar periode pelaksanaan magang.