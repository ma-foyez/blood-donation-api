# Blood Donation API

## Overview

Welcome to the Blood Donation API project! This API is designed to facilitate blood donation management, making it easier for donors, recipients, and administrators to interact with blood donation data.

## Features

- **User Management:** Register donors, manage donor profiles, and track donation history.
- **Location-Based Services:** Capture and organize data based on geographical locations for efficient blood distribution.
- **Authentication and Security:** Secure user data with authentication features, ensuring confidentiality and privacy.
- **Comprehensive User Profiles:** Capture essential information about donors, including health details, contact information, and more.

## Getting Started

To set up the Blood Donation API locally or integrate it into your project, follow the instructions below.

---

## Installation

1. Clone repository

```bash
https://github.com/ideskbd/blood-donation-api.git
```

2. Go to the folder

```bash
cd blood-donation-api
```

3. Create an .env file in the root folder & Config Necessary variables for run.

```
PORT= [Port Number you want to run]
MONGO_URL= [MongoDB URL by creating new database]
db_name = [Database Name] - without any white space
JWT_SECRET= [Generate a JWT Token]
```

4. Install Node packages

```bash
npm i
```

5. Run Local server with development watch mood...

```bash
npm run start:dev
```

## Key Features

- [x] Authentication System

## Vercel Deployed API

```bash
https://blood-donation.vercel.app/
```
### with Version - 1.0.0

```bash
https://blood-donation.vercel.app/api/v1
```
