# TAKAH - Frontend Development Flow & Task List

## Project Information

**Project Name** : TAKAH
**Full Name** : Smart Letter Management System
**Framework** : React + Vite
**Styling** : Tailwind CSS
**Backend** : Golang (Gin Framework)
**Database** : MySQL

---

# 1. Progress Pengerjaan Frontend

```text
✅ Setup Project
        │
        ▼
✅ Rapikan Struktur Folder
        │
        ▼
✅ Install Tailwind CSS
        │
        ▼
✅ Setup Tailwind CSS
        │
        ▼
✅ Bersihkan File Bawaan Vite
        │
        ▼
⏳ Setup Axios
        │
        ▼
⏳ Setup React Router
        │
        ▼
⏳ Setup Auth Context
        │
        ▼
⏳ Membuat Layout
        │
        ▼
⏳ Halaman Login
        │
        ▼
⏳ Integrasi Login API
        │
        ▼
⏳ Dashboard
        │
        ▼
⏳ Modul Aplikasi
        │
        ▼
⏳ Testing
        │
        ▼
⏳ Finishing UI
        │
        ▼
⏳ Deploy
```

---

# 2. Flow Aplikasi

```text
User Membuka Aplikasi
          │
          ▼
      Login Page
          │
          ▼
 Input Email & Password
          │
          ▼
 Authentication (JWT)
          │
          ▼
      Validasi Role
          │
     ┌────┴────┐
     ▼         ▼
   Admin      User
```

---

# 3. Flow Admin

```text
Dashboard
│
├── Master Takah
├── Parameter Surat
├── Template Surat
├── Config Nomor Surat
├── Surat Keluar
├── Surat Masuk
├── Approval Surat
├── Monitoring Surat
└── Profile
```

---

# 4. Flow User

```text
Dashboard
│
├── Buat Surat
│      │
│      ▼
│  Pilih Jenis Surat
│      │
│      ▼
│  Template Surat
│      │
│      ▼
│  Parameter Surat
│      │
│      ▼
│  Generate Nomor Surat
│      │
│      ▼
│  Preview Surat
│      │
│      ▼
│  Simpan Draft
│      │
│      ▼
│  Kirim Approval
│
├── Surat Saya
├── Surat Masuk
├── Monitoring
└── Profile
```

---

# 5. Flow Approval

```text
Draft
  │
  ▼
Pending
  │
  ▼
Review Admin
  │
 ┌┴───────────┐
 ▼            ▼
Approve    Reject
 │            │
 ▼            ▼
Completed   Revisi
```

---

# 6. Flow Generate Surat

```text
Master Takah
      │
      ▼
Template Surat
      │
      ▼
Parameter Surat
      │
      ▼
Isi Form Surat
      │
      ▼
Generate Nomor Surat
      │
      ▼
Preview
      │
      ▼
Simpan Draft
      │
      ▼
Kirim Approval
```

---

# 7. Flow Monitoring

```text
Draft
   │
   ▼
Pending
   │
   ▼
Review
   │
   ▼
Approved / Rejected
   │
   ▼
Completed
```

---

# 8. Urutan Pembuatan Halaman

1. Login
2. Dashboard
3. Master Takah
4. Parameter Surat
5. Template Surat
6. Config Nomor Surat
7. Surat Keluar
8. Surat Masuk
9. Approval
10. Monitoring
11. Profile

---

# 9. Task List

## Setup Project

| Task                     | Status |
| ------------------------ | :----: |
| Buat Project React Vite  |    ✅   |
| Install Dependency       |    ✅   |
| Install Tailwind CSS     |    ✅   |
| Setup Tailwind CSS       |    ✅   |
| Setup Global CSS         |    ✅   |
| Rapikan Struktur Folder  |    ✅   |
| Rapikan File Bawaan Vite |    ✅   |

---

## Konfigurasi Dasar

| Task                  | Status |
| --------------------- | :----: |
| Setup Axios           |    ⏳   |
| Setup React Router    |    ⏳   |
| Setup Auth Context    |    ⏳   |
| Setup Protected Route |    ⏳   |

---

## Authentication

| Task                | Status |
| ------------------- | :----: |
| Halaman Login       |    ⏳   |
| Integrasi Login API |    ⏳   |
| Simpan JWT          |    ⏳   |
| Simpan Data User    |    ⏳   |
| Logout              |    ⏳   |

---

## Layout

| Task                  | Status |
| --------------------- | :----: |
| Main Layout           |    ⏳   |
| Auth Layout           |    ⏳   |
| Sidebar               |    ⏳   |
| Navbar                |    ⏳   |
| Menu Berdasarkan Role |    ⏳   |

---

## Dashboard

| Task            | Status |
| --------------- | :----: |
| Dashboard Admin |    ⏳   |
| Dashboard User  |    ⏳   |
| Summary Card    |    ⏳   |
| Statistik Surat |    ⏳   |
| Recent Activity |    ⏳   |

---

## Modul Admin

| Module             | Status |
| ------------------ | :----: |
| Master Takah       |    ⏳   |
| Parameter Surat    |    ⏳   |
| Template Surat     |    ⏳   |
| Config Nomor Surat |    ⏳   |
| Surat Keluar       |    ⏳   |
| Surat Masuk        |    ⏳   |
| Approval Surat     |    ⏳   |
| Monitoring Surat   |    ⏳   |
| Profile            |    ⏳   |

---

## Modul User

| Module      | Status |
| ----------- | :----: |
| Dashboard   |    ⏳   |
| Buat Surat  |    ⏳   |
| Surat Saya  |    ⏳   |
| Surat Masuk |    ⏳   |
| Monitoring  |    ⏳   |
| Profile     |    ⏳   |

---

## Finishing

| Task               | Status |
| ------------------ | :----: |
| Responsive Layout  |    ⏳   |
| Warna & Typography |    ⏳   |
| Badge Status       |    ⏳   |
| Loading State      |    ⏳   |
| Empty State        |    ⏳   |
| Testing Semua API  |    ⏳   |
| Final Testing      |    ⏳   |
| Final Commit       |    ⏳   |
| Deploy             |    ⏳   |
