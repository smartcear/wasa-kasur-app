WASA KASUR FINAL AUTH + ZONES + BILLS PATCH

Files:
- admin-panel.html
- officer-app.html
- firestore.rules
- storage.rules

Important:
1. Firebase Authentication Email/Password must be enabled.
2. Super Admin Firebase Auth user UID is already configured in admin/officer code.
3. Do NOT publish the final Firestore/Storage rules until the new admin/officer files are uploaded and tested once. The current temporary Firestore rule can remain only during migration/testing.
4. Bills use Firebase Storage path wasaBills/{batchId}/master/{fileName}. The original master PDF is stored unchanged. Page matching is exact-only; ambiguous/unreadable pages become REVIEW_REQUIRED.
5. Zones and Areas are stored in wasaZones and wasaAreas. Officers can be assigned a zoneId and areaId from Admin > Officers.
