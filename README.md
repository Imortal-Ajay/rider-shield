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

To handle large-scale fraud scenarios such as coordinated GPS spoofing attacks, Insure Drive implements a layered and practical verification system beyond basic location checks.  

---

### 1. Differentiation: Genuine Rider vs Spoofed Claim  

Our system distinguishes real riders from fraudulent actors using behavioral patterns:  

- *Active Session Check:* Verifies if the rider was actively working (logged in / accepting orders) during the disruption  
- *Movement Patterns:* Real riders show natural movement or stop patterns, while spoofed users often show unrealistic static or perfectly smooth movement  
- *Disruption Consistency:* A genuine rider’s inactivity aligns with real-world disruption conditions (e.g., sudden stop during heavy rain)  

---

### 2. Data Signals Beyond GPS  

Instead of relying only on GPS, the system evaluates multiple signals:  

- 📍 Location consistency over time (no sudden unrealistic jumps)  
- ⏱️ Activity logs (order acceptance, session status)  
- 📊 Claim patterns (frequency and timing of claims)  
- 🌦️ External data validation (weather API + area-wide impact)  

If multiple riders trigger claims in an unusually synchronized way, the system flags potential coordinated fraud.  

---

### 3. UX Balance: Fairness for Genuine Riders  

To avoid penalizing honest riders:  

- *Soft Flagging:* Suspicious claims are temporarily held instead of instantly rejected  
- *Delayed Verification:* High-risk claims are reviewed with additional checks  
- *Trust-Based Priority:* Riders with consistent history receive faster approvals  

This ensures that genuine riders facing real disruptions are not unfairly impacted while still protecting the system from abuse.  

---

### 🔐 Key Principle  

> The system prioritizes *fair payouts for genuine riders* while maintaining strong safeguards against coordinated fraud attacks.

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
