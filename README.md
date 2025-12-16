# BOOMBURGER 🍔

![BOOMBURGER Logo](https://via.placeholder.com/200x100.png?text=BOOMBURGER)

**BOOMBURGER** is a modern mobile application built with **React Native (Expo)** and **Firebase Firestore** to manage orders efficiently for a burger café. It allows users and admins to view, filter, and manage orders seamlessly with a simple and interactive interface.

---

## Features 🚀

- **Order Management**
  - Fetch all orders from Firebase Firestore.
  - Filter orders by status: `Pending`, `Delivered`, `Cancelled`, or `All`.
  - Cancel orders and update the status in real-time.

- **User Interface**
  - Interactive **status filter tags** (chip-style buttons).
  - **Pull to refresh** functionality to fetch latest orders instantly.
  - Responsive and clean UI for both users and admins.

- **Realtime Updates**
  - Optional Firestore snapshot listener for live order updates.
  - Efficient frontend filtering using React Native state and `useMemo` for performance.

- **Firebase Integration**
  - Fully integrated with **Firebase Firestore** for storing orders.
  - Real-time database sync for accurate order status.

---

## Screenshots 📸

| Orders List | Filter Tags + Pull to Refresh |
|------------|------------------------------|
| ![Orders List](https://via.placeholder.com/250x500.png?text=Orders+List) | ![Filter Tags](https://via.placeholder.com/250x500.png?text=Filter+Tags) |

---

## Installation ⚙️

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/boomburger.git
cd boomburger
