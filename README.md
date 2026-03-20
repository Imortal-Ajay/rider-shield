# 🚀 Insure Drive
**AI-Powered Income Protection for Delivery Riders**

## 🎯 Problem Statement
Delivery riders working with platforms like Swiggy and Zomato rely heavily on daily working hours for income.

External disruptions such as:
- 🌧️ Heavy Rain
- 🌡️ Extreme Heat
- 😷 High Pollution

cause 20–30% weekly income loss.
Currently, there is no financial safety net for these disruptions.

## 💡 Solution
Insure Drive is an AI-powered parametric insurance platform that protects riders from income loss due to external conditions.

Unlike traditional insurance, Insure Drive:
- Detects disruptions automatically
- Estimates actual work-hour loss
- Validates rider activity to prevent misuse
- Processes payouts instantly

## ⚙️ Workflow
1. Rider signs up and selects a weekly plan
2. System monitors weather and pollution data
3. Disruption detected (rain / heat / AQI)
4. Work-hour loss estimated
5. Rider activity validated
6. Claim auto-triggered
7. Payout calculated and processed

## 🔥 Core Features
- **⏱️ Work-Hour Based Payout:** Compensation tied to actual income loss
- **🌧️ Parametric Triggers:** Rain > 20 mm/hr, Heat > 40°C, AQI > 300
- **🛡️ Smart Validation:** Confirms rider activity, prevents false claims
- **💰 Weekly Insurance Model:** Affordable premiums, AI-adjusted by location risk

## 🤖 AI/ML Integration
- **Risk-Based Pricing:** Premiums vary by zone risk
- **Work-Loss Estimation:** Predicts hours lost per disruption
- **Fraud Detection:** Flags anomalies in rider activity

## 💸 Pricing
- **Base Premium:** ₹49/week
- **Coverage:** Up to 40 hours
- **AI Adjustment:** ±20%

**Example:**
- Low-risk zone → ₹39
- High-risk zone → ₹59

## 📊 Parametric Triggers

| Trigger | Threshold | Data Source | Payout |
|---------|-----------|-------------|--------|
| Heavy Rain | >20mm/hr | OpenWeatherMap | 4hrs wage |
| Extreme Heat | >40°C | Weather API | 6hrs wage |
| Severe Pollution | AQI>300 | Mock API | 3hrs wage |

## 🛡️ Adversarial Defense & Anti-Spoofing Strategy
To combat the "Market Crash" scenario where fraud rings use fake GPS to drain liquidity pools, **Insure Drive** implements a multi-layered verification logic that goes beyond simple location checks.

### 1. Multi-Sensor Data Fusion (Spotting the Faker)
*   **📡 Cellular/Wi-Fi Triangulation:** We cross-reference GPS coordinates with unique Cell Tower IDs and surrounding Wi-Fi SSIDs. A "genuine" rider's device will show a consistent shift in nearby access points. A faker using a "Mock Location" app typically fails to simulate the underlying network environment.
*   **⚖️ Inertial Sensor Analysis:** Real-world movement is messy. We analyze Accelerometer and Gyroscope data. Static fakers or those using "joystick" simulators produce perfectly linear or unnaturally smooth movement profiles that lack the micro-vibrations and gravity-shifts of a moving motorbike.

### 2. Graph-Based Fraud Ring Detection (Catching the Ring)
*   **🕸️ Payout Proximity Cluster:** Our system flags "Simultaneous Triggering." If 50 riders in a 1km radius all claim a payout within a 2-minute window using identical device fingerprints or withdrawing to a tight cluster of digital wallets, the entire "ring" is quarantined for manual audit.
*   **🔗 Device Fingerprinting:** We track `Canvas ID`, `WebGL Vendor`, and `Hardware Concurrency`. Fraud rings often use device farms or emulators; when dozens of "different" riders share 90%+ of their hardware metadata, they are flagged as a single adversarial unit.

### 3. Hyperlocal Truth Verification (Airtight Logic)
*   **🌤️ Oracle Cross-Referencing:** We don't just trust a "Rain" trigger. We correlate the rider's claim with 3rd party hyper-local weather Oracles AND the reported drop in average platform speed for *all* riders in that sector.
*   **🔍 The "Stranded" vs "Spoofed" Test:** Genuine stranded workers show a pattern of "Zero Velocity + Active Session." Spoofers often forget to simulate a "working" state in the background. We require an active heartbeat from the delivery platform's API to confirm the rider was actually "On Shift" when the disruption occurred.

### 4. Safe-Guard Mechanism (Protecting Honest Actors)
*   **📉 Dynamic Trust Scoring:** Every rider has a "Trust Score." Long-term honest riders have their payouts expedited. New accounts or those with sensor anomalies are subject to a **Soft-Flag** (held for 24h) or required to provide a timestamped photo-verification of the street conditions before high-value payouts are released.

## 🛠️ Tech Stack
- **Frontend:** React / Next.js
- **Styling:** Tailwind CSS
- **Language:** TypeScript / JavaScript
- **Deployment:** Vercel
- **APIs:** Weather & AQI APIs

## 🎥 Prototype
Includes:
- Rider onboarding
- Plan selection
- Disruption simulation
- Auto claim triggering
- Payout calculation

## 🚀 Future Enhancements
- Predictive weather alerts
- Advanced ML fraud detection
- Integration with delivery platforms
- Personalized insurance plans

## 🏆 Differentiator
Insure Drive calculates real income loss based on work hours.  
No fixed payouts — only genuine, validated compensation.

## 👥 Team TechExperts
1. AJAY 
2. VARSHATHA 
3. MADHURA 
4. HARISH 
5. SARAVANA
