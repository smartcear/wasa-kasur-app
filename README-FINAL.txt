WASA KASUR — FINAL BUILD

Files:
- admin-panel.html
- officer-app.html
- manifest.json
- sw.js
- privacy-policy.html
- firestore.rules
- storage.rules

Firebase project: wasa-app-ksr
Admin/Super Admin first login UI: Phone + Password
Super Admin phone maps internally to Firebase Auth email wasanafees@gmail.com.
The Firebase Auth UID is used as the wasaUsers document ID.

IMPORTANT:
1. Do not store passwords in Firestore.
2. Replace Firestore temporary/open rules with firestore.rules only after verifying Auth login works.
3. Storage bill files require authenticated role-based access.
4. Unsigned Cloudinary should not be used for sensitive government bills in production; use private Firebase Storage or a signed backend.
5. Do not delete existing wasaSettings or wasaUsers data.
