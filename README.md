# StaffNet 📱🕒

**StaffNet** is an integrated School Operations Management system designed to streamline assets tracking and live academic monitoring. Built for efficiency, it bridges the gap between digital administration and physical classroom management.

---

## 🚀 Key Features

### 1. Student Phone Management
* **Inventory Control:** Digital register for student device storage.
* **Status Tracking:** Real-time monitoring of borrowed vs. returned devices.
* **Automatic Overdue Detection:** Visual alerts for devices not returned by the set deadline.
* **Digital Receipts:** Exportable PDF reports for accountability.

### 2. Live Attendance & Timetable Monitor
* **Real-time Synchronization:** A "Live Status" dashboard that updates every second to show currently ongoing classes.
* **Dynamic Timetable:** A 5-day interactive grid mapped to specific teachers, subjects, and classrooms.
* **Attendance Logging:** Simplified "One-Tap" presence marking for teaching staff.
* **Conflict Prevention:** Smart logic to ensure teachers aren't scheduled in two places at once.

### 3. Analytics Dashboard
* **Visual Insights:** Pie charts and bar graphs showing device distribution and class-wise borrowing trends.
* **Staff Overview:** Quick stats on active sessions and total registered users.

---

## 🛠️ Tech Stack

* **Core:** [React.js](https://reactjs.org/) (Component-based architecture)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Utility-first responsive design)
* **Icons:** [Lucide-React](https://lucide.dev/) (Clean, consistent iconography)
* **Charts:** [Recharts](https://recharts.org/) (Data visualization)
* **Reporting:** [jsPDF](https://github.com/parallax/jsPDF) (Client-side PDF generation)

---

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone (https://github.com/ste-lla-mina/StaffNet.git)
    ```

2.  **Install dependencies:**
    ```bash
    cd StaffNet
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 📁 Project Structure

```text
src/
├── assets/             # Images and branding
├── components/         # Reusable UI modules (Dashboard, Phones, Attendance)
├── data/               # JSON-based timetable and student records
├── App.jsx             # Main application logic & routing
└── index.css           # Global Tailwind configurations
