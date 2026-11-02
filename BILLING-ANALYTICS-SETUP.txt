WASA KASUR — BUILD 5.4.0 FINANCIAL ANALYTICS

IMPORTANT STATUS
This is an updated candidate build based on the supplied 5.3.0 files. The new billing analytics module is added, and inline JavaScript syntax checks pass. A live end-to-end test against the user's separate billing workbook and full zone-enabled Consumer Master has NOT been possible in this environment. Do not describe this build as guaranteed error-free until those workbooks are imported and reconciliation totals are confirmed.

CORE EXISTING WORKFLOW PRESERVED
- Consumer Master Excel is stored locally in IndexedDB on the Head Office PC.
- Original master bill PDFs are indexed locally; they are not uploaded to Firebase Storage or Cloudinary.
- Bill matching and filtered combined PDF use Consumer No. and saved Excel sequence.
- Missing/uncertain bills are not guessed into a final combined PDF.

NEW BUILD 5.4.0 — BILLING & REVENUE ANALYTICS
- Dashboard includes a separate Import Billing Excel workflow.
- It reads multiple worksheets and allows the admin to confirm Consumer No., Bill Amount, Paid Amount, optional Balance Amount, and optional Billing Month columns.
- Consumer Master is the authority for Zone/Area. Financial rows are linked by normalized Consumer No.; Zone/Area are not required in the billing workbook.
- Zone and Area filters are populated from the linked billing rows. Multiple zones/areas can be selected together, along with month, search, bill min/max, paid min, and balance min.
- KPIs and charts show matched consumers, billing, paid/recovery, balance, recovery rate, zone financial comparisons and area recovery.
- Export actions create filtered Excel, PDF, Word-compatible .doc and PowerPoint .pptx reports.
- Duplicate Consumer No. + billing month rows are flagged and excluded from financial totals; unmatched consumers, missing Consumer No., duplicate master IDs and invalid amount rows are reported.
- Billing data is stored locally in a separate IndexedDB database on this browser/PC. Export/backup the billing Excel and retain the source files safely.

BILLING WORKFLOW
1. Deploy the folder to the same HTTPS hosting location used by the app.
2. Sign in to Admin Panel and upload the full Consumer Master in Bulk Upload. Confirm the Zone column is present and import finishes successfully.
3. Open Dashboard > Billing, Recovery & Outstanding Analytics > Import Billing Excel.
4. Confirm the five column mappings. Consumer No., Bill Amount and Paid Amount are required. Balance and Month are optional. If Balance is absent, it is calculated as Bill minus Paid; confirm this matches WASA's accounting policy before relying on totals.
5. Click Verify & Import Billing Data and wait for the reconciliation summary.
6. Check unmatched consumers, duplicate months, invalid amounts and missing Zone/Area before presenting figures. If one consumer has multiple months, the billing workbook must include a month/period column to prevent the rows being treated as the same period.
7. Apply filters and export. The table previews up to 500 rows for browser responsiveness; filtered exports include all filtered rows.

NEW FIREBASE PROJECT SETUP (DO NOT DELETE THE OLD PROJECT FIRST)
The supplied code currently points to the existing Firebase project. A new project cannot be wired in automatically because its web app config and authorized admin identity are unique to the account.
1. Open https://console.firebase.google.com/ and create a new project for WASA Kasur. Keep the old project until you have exported/backed up anything important.
2. In Project settings > General > Your apps, register a Web app and copy its Firebase config object.
3. Replace the `const firebaseConfig = { ... }` block in BOTH `admin-panel.html` and `officer-app.html` with the new project's values. Do not change other JavaScript around it.
4. In Authentication > Sign-in method, enable the sign-in method the app is configured to use. Check the actual login flow in the app before choosing phone/email options.
5. Create Firestore Database. In Firestore > Rules, publish the supplied `firestore.rules` only after reviewing that the rules match your approved roles. Never use open rules such as `allow read, write: if true`.
6. Add your deployed website domain in Authentication > Settings > Authorized domains.
7. Ensure the first Super Admin profile is provisioned correctly in `wasaUsers` with role `superadmin` and the correct UID/permissions. The new Firebase project has new UIDs; the existing project's UID will not automatically carry over. Do not share passwords or service-account private keys in chat.
8. The package leaves `SUPER_UID` blank in both HTML files so a newly created Firebase Auth user can be provisioned. After the first successful Super Admin login, copy that account UID from Firebase Authentication and set the same UID in both files to pin the account. Keep the Super Admin email/password private.
9. Firebase Storage is NOT required for the local Consumer Master or original master bill PDFs in this single-PC workflow. Storage rules are only needed if you intentionally use Firebase Storage for other files.
10. Cloudinary is only used for some officer/admin media uploads, not master bill PDF indexing. If you create a new Cloudinary account, replace `cloudinaryConfig` in both HTML files with the new cloud name and unsigned upload preset. Restrict upload preset settings; never place an API secret in browser code.
11. Deploy the folder to HTTPS hosting. Replace `admin-panel.html`, `officer-app.html`, `sw.js`, `manifest.json`, `privacy-policy.html`, `firestore.rules`, `storage.rules`, and this README as applicable. Then hard-refresh (Ctrl+Shift+R). If the old PWA is still cached, unregister the old service worker and reload.

DATA / ACCOUNTING SAFETY
- Consumer No. is the primary join key. Name/address are supporting details, not safe primary keys.
- Do not interpret missing Zone as Zone 1. Records with no detected Zone/Area are marked Unassigned / missing.
- If a month column is absent, records are grouped under “Unspecified”; duplicate consumer rows in the same unspecified period are flagged. For monthly revenue reporting, include a reliable Billing Month column.
- Recovery % is calculated as total Paid Amount / total Bill Amount for non-duplicate rows. Confirm whether your official recovery calculation should use current billing only, demand including arrears, or another denominator.
- Very large all-consumer PDF/Word exports may be resource-intensive in a browser. Excel is recommended for raw data; PDF/PPT are better suited to official summaries and manageable filtered subsets.
- Local IndexedDB is tied to this browser profile and PC. Keep independent backups of both Excel workbooks and original bill PDFs. Clearing browser site data can remove local indexes/imported billing data.

TESTS PERFORMED FOR THIS PACKAGE
- ZIP contents checked.
- Inline JavaScript syntax checked with Node.js; all inline script blocks passed syntax parsing.
- HTML/JavaScript runtime behavior, Firebase sign-in, new-project permissions, real workbook column mappings, 70K–100K performance, financial reconciliation and generated file correctness require testing in the target browser with the actual workbooks.
