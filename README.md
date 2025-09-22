# 🚇 Elevator Simulation – Setup Guide

This repository contains the source code for the Elevator Simulation project.  
Follow the steps below to set up and run the project locally.

---
### [Live Deployed URL](https://elevator-system-frontend-eight.vercel.app/)

## ✨ Features

- 🔄 **Real-time Simulation** — elevators move floor-by-floor with door open/close events. Its' achieved by using websockets.  
- 🚅 **Increase Simulation speed** - increase simulation speeds by selecting desired simulation speed (1x, 2x, 5x).
- 📊 **Live Metrics Panel** — average wait, max wait, average travel, throughput, utilization.  
- 🏢 **Building View UI** — interactive floor call buttons (↕️) and elevator cards with passenger counts.  
- 🎯 **Manual & Scenario Testing** — spawn **Manual Requests**, **Morning Rush**, or **Random Burst**.  
- ⚡ **Configurable Parameters** — change number of elevators, floors, and simulation speed.  
- 🚪 **Capacity Awareness** — elevators respect passenger capacity with *near full* and *full* states.  

---

## 📦 Prerequisites

- Node.js **>= 18**
- npm or yarn

---

## 🚀 Setup Instructions

### 1. Clone repositories
Frontend: git clone https://github.com/SahO-ux/elevator-system-frontend.git
Backend: git clone https://github.com/SahO-ux/elevator-system-backend.git

### 2. Install dependencies:
Install dependencies in both frontend an backend by using command:
- npm install

### 3. Configure environment variables:
In FE, create a .env file in root folder, with following single URL for api calls:-
VITE_REACT_APP_API_URL: http://localhost:8081

In BE, createa .env file in root folder, with following:-
PORT:8081

### 4. Run dev server:
Use the following command in both repos terminal for running the project:-
npm run dev

### You will now be able to see the UI having:
- Controls (Start, Stop, Reset simulation)
- Manual Request (From & To fields)
- Simulation Config for setting up number of elevators and floors
- Scenario simulation buttons which are "Morning Burst" and "Random Burst"
- Live Metrics which polls Served, Avg. Wait(s), Max Wait(s), Pending and Avg. Travel(s) every 2 seconds from endpoint "/api/metrics"
- On right of all this, there will be a Building having 12 floors (default), each floor have Up/Down button.

### If simulation is inactive (initial state), that is start has not been clicked, then even if we try to click on rest of the buttons like Morning Rush, Random Burst, try to create manual request, etc. it will show an error message stating that simulation has to be in active state which is we should click start in order to start simulation

- NOTE:- Each elevator has max capacity of 6 passengers.
- After starting simulation, you will see a text change on top banner from "Simulation is inactive..." to "Simulation is active".
- You can now use all of the functionalities like adding a manual request by setting up values in from (pickup floor) and to (destination floor) fields which will simulate movement of the lifts.
  
- You can use Morning Rush, which generates 50 random requests out of which 35 request will be from the lobby floor (ground floor or in our case Floor 1) and rest 15 will be from other floors except lobby.
- You can use Random Burst, which generates 100 random requests having both random pickup and destination floors, where destination floor is not equal to pickup floor.
- For both scenarios, Morning Rush and Random Burst, if you want to create more requests in bulk you can use endpoint "/api/scenario" which accepts request body as { scenario: "morningRush", count: 150 } and for random burst { scenario: "randomBurst", count: 150 }.
  
- If you want to change number of total floors in a building or number of lifts, you have to stop simulation by using "Stop" button, and then under Simulation Config, you can input values for Elevators and Floors and then click on "Apply Config", and then click "Start" to start simulation and then again you can perform the actions which are mentioned above.

- In Building View, you can see ↕️ button at each floor, using which you can send a request to call a lift, simply click on it and enter destination number in prompt (due to time constraint, havent' used any external lib for modals).
- Inside each lift, you can see a small select box, using which passenger can select the floor, he wants to go after hitting "Send" button beside it

- In Live Metrics section, you can view metrics like Served requests in "Served", Avg. Wait(s), Max. Wait(s), Pending (pending requests) and Avg. Travel(s) using all generated requests (be it from Manual, Morning Rush, Random Burst, etc) which were generated in simulation session, which is when the backend server was started.
