# WASA Kasur Billing & Revenue Dashboard

Standalone HTML dashboard intended for GitHub Pages. Includes Excel/CSV import, local reporting, filters, CSV exports, print/PDF, and an optional Cloud Firestore connector.

## Important before use

This package is **not yet connected to your live Firebase project** because the actual Firebase Web App config (especially `apiKey`) was not supplied. The app's Firebase panel contains a placeholder. GitHub upload alone cannot fill in private project settings or grant Firestore permissions.

The Firestore Data tab screenshot showed the default database had no collections/documents at that time. The app reads and writes the `wasaConsumers` collection. It does not automatically recover data from another project, another collection, or an Excel file.

## Deploy on GitHub Pages

1. Create/open your GitHub repository.
2. Upload `index.html` and `README.md` to the repository root (not inside an extra nested folder).
3. Open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to publish, then open the URL shown on the Pages screen.
6. Internet access is required for SheetJS and Firebase modules loaded from their CDNs.

## Add Firebase configuration

1. Open Firebase Console and select project `wasa-dashboard-ksr`.
2. Open **Project settings → General → Your apps → KSR-DASHBOARD → SDK setup and configuration → Config**.
3. Copy the actual config object, including the real `apiKey`.
4. Open the deployed dashboard, sign in to the local demo gate, go to **Data / Firebase connection**, replace the placeholder JSON with your actual config, and choose **Connect / Load Firestore**.
5. The app expects a collection named `wasaConsumers`.

## Firestore permissions and security

The app does not change Firestore Security Rules and does not implement Firebase Authentication. Therefore it will only read/write if the existing Firestore rules allow unauthenticated access. **Do not make production consumer/financial data publicly readable or writable.** For a real WASA deployment, implement Firebase Authentication and restrictive rules before storing confidential data. The built-in `admin` / `WasaDemo2026!` login is only a client-side demo gate and is not secure authentication.

## Importing Excel

1. Import the workbook using the dashboard's Excel data centre.
2. Review the recognized column mappings and verify totals against the official workbook.
3. Connect Firebase.
4. Only use **Save imported Excel rows to Firestore** after reviewing the collection and making a backup. It appends documents; it does not deduplicate, update by consumer number, or delete existing documents. Re-importing the same workbook can create duplicates. Do not click save repeatedly.

## Data handling

Excel is parsed in the browser. The app does not upload the workbook to a separate application server. Saving rows to Firestore explicitly sends the imported records to your Firebase project.

## Demo login

- Username: `admin`
- Password: `WasaDemo2026!`

Change/remove this demo gate and add real authentication before production use.
