const fs = require('fs');

const privacy = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - DigiShop</title>
  <style>
    :root { --primary: #208AEF; --text: #1E293B; --text-muted: #64748B; --bg: #F8FAFC; --card-bg: #FFFFFF; --border: #E2E8F0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; line-height: 1.6; color: var(--text); background-color: var(--bg); margin: 0; padding: 24px; }
    .container { max-width: 840px; margin: 0 auto; background: var(--card-bg); padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid var(--border); }
    h1 { color: var(--primary); font-size: 28px; margin-top: 0; margin-bottom: 8px; }
    .badge { display: inline-block; background: #E0F2FE; color: #0369A1; padding: 4px 10px; border-radius: 999px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
    h2 { font-size: 20px; border-bottom: 2px solid var(--border); padding-bottom: 6px; margin-top: 32px; color: #0F172A; }
    h3 { font-size: 16px; margin-top: 20px; color: #334155; }
    p, li { color: #334155; font-size: 15px; }
    ul { padding-left: 20px; }
    li { margin-bottom: 6px; }
    .highlight-box { background: #EFF6FF; border-left: 4px solid var(--primary); padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 13px; text-align: center; }
    a { color: var(--primary); text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Privacy Policy</h1>
    <div class="badge">App: DigiShop (com.techflowstudio.shopkeeper)</div>
    <p><strong>Effective Date:</strong> January 1, 2026</p>
    <p><strong>Last Updated:</strong> October 2, 2026</p>
    <div class="highlight-box">
      <strong>Summary:</strong> DigiShop ("we", "us", or "our") is an offline-first Point of Sale and bookkeeping tool designed for retail storekeepers. Your business data belongs solely to you. We do not sell your personal data or your customers' transaction data to third parties.
    </div>
    <h2>1. Introduction</h2>
    <p>This Privacy Policy explains how DigiShop collects, stores, uses, and safeguards information when you use our mobile application and related cloud backup services. By using DigiShop, you consent to the practices described in this policy.</p>
    <h2>2. Information We Collect</h2>
    <h3>A. Account Information</h3>
    <p>When you sign in using Google Sign-In, we collect your name, email address, and profile photo URL provided by Google via Firebase Authentication. If you use the app in Guest Mode, no account information is collected.</p>
    <h3>B. Shop &amp; Merchant Profile</h3>
    <p>You may optionally provide store details such as your shop name (in English and Urdu), store contact phone number, physical address, and optional payment receiver details (such as your EasyPaisa, JazzCash, or bank account identifier for customer billing displays).</p>
    <h3>C. Inventory &amp; Transaction Records</h3>
    <p>To provide core POS register capabilities, the app stores:</p>
    <ul>
      <li>Product catalog (product names, barcodes, purchase cost, retail selling prices, stock quantities, and product photos).</li>
      <li>Sales receipts and transaction histories.</li>
    </ul>
    <h3>D. Customer Khata (Credit Ledger) &amp; Phone Numbers</h3>
    <p>When you use the Udhaar / Khata (customer credit ledger) features, you may enter <strong>third-party personal information</strong> about your own customers, including:</p>
    <ul>
      <li>Customer name (and optional Urdu name)</li>
      <li><strong>Customer mobile / WhatsApp phone number</strong></li>
      <li>Optional address</li>
      <li>Credit (udhaar) balances, payment (vasooli) history, and related notes</li>
    </ul>
    <p><strong>Important:</strong></p>
    <ul>
      <li>This customer information is entered <em>by you (the shopkeeper)</em> for your own bookkeeping, reminders, and collections. We do not scrape or buy customer contacts.</li>
      <li>Phone numbers may be used inside the app only to help you call the customer or open a WhatsApp reminder that <em>you</em> choose to send.</li>
      <li>We do <strong>not</strong> sell, rent, advertise with, or share customer Khata phone numbers with third parties for marketing.</li>
      <li>If cloud sync / backup is enabled, this ledger data (including phone numbers you entered) is stored under your merchant account in Firebase and/or in your personal Google Drive backup, solely so you can restore your shop records.</li>
      <li>You are responsible for entering accurate customer details and for complying with any local rules about how you store or contact your customers.</li>
    </ul>
    <h3>E. Device &amp; Storage Permissions</h3>
    <ul>
      <li><strong>Camera &amp; Photo Gallery:</strong> Used exclusively when you choose to take or select photos of products or your shop logo.</li>
      <li><strong>Internet &amp; Network State:</strong> Used to check network connectivity and synchronize data to Google Firebase or Google Drive when enabled.</li>
    </ul>
    <h2>3. How We Use Your Information</h2>
    <p>We use the collected information solely to:</p>
    <ul>
      <li>Provide local and offline point-of-sale billing and inventory calculations.</li>
      <li>Maintain your customer credit (Udhaar Khata) balances, phone-based reminders you initiate, and printable receipt vouchers.</li>
      <li>Sync your store records securely to Google Firebase Cloud Firestore so you never lose your data across devices.</li>
      <li>Back up database snapshots and product images to your personal Google Drive (when authorized by you).</li>
    </ul>
    <p>We do not use customer Khata phone numbers for advertising, analytics profiles, or resale.</p>
    <h2>4. Third-Party Services &amp; Cloud Infrastructure</h2>
    <p>DigiShop integrates with trusted service providers to deliver cloud backup services:</p>
    <ul>
      <li><strong>Google Firebase (Authentication, Cloud Firestore):</strong> Used for secure user authentication and cloud synchronization. All data transferred between the app and Firebase is encrypted in transit using industry-standard TLS/HTTPS.</li>
      <li><strong>Google Drive API:</strong> If you connect Google Drive, data and image backups are stored in your private Google Drive account. We do not expose your Google Drive files to the public.</li>
      <li><strong>WhatsApp / Phone dialer (device apps):</strong> If you tap Call or WhatsApp Reminder, the app opens your device's phone or WhatsApp app with the number/message you already stored. Message delivery is controlled by you and those apps—not by us.</li>
    </ul>
    <h2>5. Data Security</h2>
    <p>We apply robust security safeguards to protect your business records:</p>
    <ul>
      <li>All cloud communications utilize HTTPS with TLS 1.2+ encryption.</li>
      <li>Firestore security rules enforce strict tenant isolation: each merchant can only read and write data belonging to their verified Firebase User ID (<code>shops/{userId}</code>).</li>
      <li>Offline records are stored in private app sandboxed storage on your device.</li>
    </ul>
    <h2>6. Data Retention and Account Deletion</h2>
    <p>We retain your data only for as long as your account remains active.</p>
    <p><strong>How to Delete Your Account and Data:</strong></p>
    <ul>
      <li><strong>In-App Deletion:</strong> You can permanently delete your account, business profile, inventory, sales, and Khata records (including customer names and phone numbers you entered) at any time by going to <em>Settings &gt; Google Cloud Backup &gt; Delete Account &amp; Cloud Data</em>.</li>
      <li><strong>Web Deletion Portal:</strong> If you have uninstalled the app or cannot access your device, you can request account deletion online at <a href="delete-account.html">Account Deletion Portal</a>.</li>
    </ul>
    <p>On a successful in-app deletion, records under your Firebase account (<code>shops/{userId}</code> in Firestore) and your Firebase Authentication profile are permanently purged. Web portal requests are handled manually (usually within about 48 hours). Google Drive OAuth access is revoked on successful in-app deletion; any files already saved in your personal Google Drive remain under your control and are not deleted by the app.</p>
    <h2>7. Children's Privacy</h2>
    <p>DigiShop is intended for business owners and retail operators. It is not directed at or designed for children under the age of 13. We do not knowingly collect personal information from children.</p>
    <h2>8. Changes to This Privacy Policy</h2>
    <p>We may update our Privacy Policy periodically. We will notify you of any material changes by posting the new Privacy Policy within the app and updating the "Last Updated" date at the top.</p>
    <h2>9. Contact Us</h2>
    <p>If you have any questions, concerns, or requests regarding this Privacy Policy or your data privacy, please contact us:</p>
    <p>
      <strong>Email:</strong> <a href="mailto:techflow0500@gmail.com">techflow0500@gmail.com</a><br>
      <strong>Developer:</strong> Shahab Khan (DigiShop Team)<br>
      <strong>Web Portal:</strong> <a href="https://shopkeeper-a977a.web.app">https://shopkeeper-a977a.web.app</a>
    </p>
    <div class="footer">&copy; 2026 DigiShop. All rights reserved.</div>
  </div>
</body>
</html>
`;

const terms = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms of Service - DigiShop</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; line-height: 1.6; color: #1E293B; background-color: #F8FAFC; margin: 0; padding: 24px; }
    .container { max-width: 800px; margin: 0 auto; background: #FFFFFF; padding: 40px; border-radius: 16px; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    h1 { color: #208AEF; }
    h2 { font-size: 18px; margin-top: 28px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; }
    p, li { font-size: 15px; color: #334155; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; color: #64748B; font-size: 13px; text-align: center; }
    a { color: #208AEF; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Terms of Service</h1>
    <p><strong>Effective Date:</strong> January 1, 2026</p>
    <h2>1. Acceptance of Terms</h2>
    <p>By downloading or using DigiShop (the "App"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the application.</p>
    <h2>2. Purpose of the Application</h2>
    <p>DigiShop is designed as an offline-first inventory management, point-of-sale, and customer credit ledger (Khata) tool for retail shopkeepers. The app provides calculation and bookkeeping features. You are solely responsible for verifying the accuracy of all recorded transactions, prices, taxes, and customer balances.</p>
    <h2>3. Cloud Synchronization &amp; Google Drive</h2>
    <p>Cloud backup functionality requires a valid Google account. You remain the sole owner of your business data. We make reasonable efforts to maintain cloud synchronization uptime via Google Firebase and Google Drive, but we do not guarantee uninterrupted availability.</p>
    <h2>4. Merchant Responsibility</h2>
    <p>You agree not to use the App for any unlawful purpose, fraud, or violation of applicable commercial and taxation laws in your jurisdiction.</p>
    <h2>5. Termination &amp; Deletion</h2>
    <p>You may terminate your account at any time using the in-app deletion option under Settings or via our online deletion portal. We reserve the right to suspend accounts that violate Google Play or applicable policies.</p>
    <h2>6. Contact Us</h2>
    <p>For questions regarding these Terms, contact us at <a href="mailto:techflow0500@gmail.com">techflow0500@gmail.com</a>.</p>
    <div class="footer"><a href="privacy-policy.html">Privacy Policy</a> &bull; &copy; 2026 DigiShop. All rights reserved.</div>
  </div>
</body>
</html>
`;

const index = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DigiShop - Official Legal &amp; Privacy Portal</title>
  <style>
    :root { --primary: #208AEF; --text: #1E293B; --text-muted: #64748B; --bg: #F8FAFC; --card-bg: #FFFFFF; --border: #E2E8F0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; line-height: 1.6; color: var(--text); background-color: var(--bg); margin: 0; padding: 32px 16px; display: flex; justify-content: center; align-items: center; min-height: 100vh; box-sizing: border-box; }
    .card { max-width: 640px; width: 100%; background: var(--card-bg); padding: 40px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); border: 1px solid var(--border); text-align: center; }
    .badge { display: inline-block; background: #E0F2FE; color: #0369A1; padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
    h1 { color: var(--primary); font-size: 26px; margin: 0 0 10px 0; }
    p { color: var(--text-muted); font-size: 15px; margin-bottom: 28px; }
    .links-grid { display: flex; flex-direction: column; gap: 12px; }
    .legal-link { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: #F1F5F9; color: var(--text); border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.2s ease; border: 1px solid var(--border); }
    .legal-link:hover { background: #E2E8F0; border-color: #CBD5E1; transform: translateY(-1px); }
    .arrow { color: var(--primary); font-size: 18px; }
    footer { margin-top: 32px; font-size: 12px; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Google Play Compliance</span>
    <h1>DigiShop</h1>
    <p>Official Legal Documents, Terms of Service, and Data Privacy Policies.</p>
    <div class="links-grid">
      <a href="./privacy-policy.html" class="legal-link"><span>Privacy Policy</span><span class="arrow">&rarr;</span></a>
      <a href="./terms.html" class="legal-link"><span>Terms of Service</span><span class="arrow">&rarr;</span></a>
      <a href="./delete-account.html" class="legal-link"><span>Account &amp; Data Deletion Portal</span><span class="arrow">&rarr;</span></a>
    </div>
    <footer>&copy; 2026 DigiShop. Package: <code>com.techflowstudio.shopkeeper</code></footer>
  </div>
</body>
</html>
`;

const del = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account and Data Deletion Request - DigiShop</title>
  <style>
    :root { --primary: #EF4444; --primary-hover: #DC2626; --text: #1E293B; --text-muted: #64748B; --bg: #F8FAFC; --card-bg: #FFFFFF; --border: #E2E8F0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; line-height: 1.6; color: var(--text); background-color: var(--bg); margin: 0; padding: 24px; }
    .container { max-width: 720px; margin: 0 auto; background: var(--card-bg); padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid var(--border); }
    h1 { color: var(--primary); font-size: 26px; margin-top: 0; }
    .badge { display: inline-block; background: #FEE2E2; color: #991B1B; padding: 4px 10px; border-radius: 999px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
    .alert-box { background: #FFF7ED; border-left: 4px solid #F97316; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0; font-size: 14px; }
    .steps-card { background: #F8FAFC; border: 1px solid var(--border); border-radius: 10px; padding: 20px; margin: 20px 0; }
    h2 { font-size: 18px; color: #0F172A; margin-top: 24px; }
    ul, ol { padding-left: 24px; font-size: 15px; }
    li { margin-bottom: 8px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-weight: 600; font-size: 14px; margin-bottom: 6px; color: #334155; }
    input[type="email"], textarea { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; }
    button { background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; }
    button:hover { background: var(--primary-hover); }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 13px; text-align: center; }
    a { color: #2563EB; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Account &amp; Data Deletion Request</h1>
    <div class="badge">App: DigiShop (com.techflowstudio.shopkeeper)</div>
    <p>In compliance with Google Play's User Data &amp; Account Deletion Policy, DigiShop provides full transparency and easy mechanisms for users to request the permanent deletion of their account and all associated personal and business data.</p>
    <div class="alert-box"><strong>Warning:</strong> Account deletion is irreversible. Once deleted, all cloud records including your product catalog, sales invoices, and customer credit ledger (Khata) will be permanently purged.</div>
    <h2>Option 1: In-App Immediate Deletion (Recommended)</h2>
    <div class="steps-card">
      <p>If you currently have the app installed on your Android device:</p>
      <ol>
        <li>Open the <strong>DigiShop</strong> app.</li>
        <li>Navigate to the <strong>Settings</strong> screen (gear icon in the bottom bar).</li>
        <li>Scroll down to the <strong>Google Cloud Backup</strong> section.</li>
        <li>Tap <strong>Delete Account &amp; Cloud Data</strong>.</li>
        <li>Confirm your decision in the confirmation dialog.</li>
      </ol>
      <p><em>When deletion succeeds, your Firebase Auth account and Firestore shop data are removed immediately. Google Drive backups already in your personal Drive are not removed by the app.</em></p>
    </div>
    <h2>Option 2: Web Deletion Request (If App is Uninstalled)</h2>
    <p>If you uninstalled the application or cannot access your device, submit your registered Google email address below. This opens an email to our support team (it is a request, not an automated instant purge). We process confirmed requests within about 48 hours.</p>
    <form onsubmit="handleRequest(event)">
      <div class="form-group">
        <label for="email">Google Account Email Address used in the app:</label>
        <input type="email" id="email" required placeholder="e.g. yourname@gmail.com">
      </div>
      <div class="form-group">
        <label for="reason">Optional Reason for Deletion:</label>
        <textarea id="reason" rows="3" placeholder="Closing store, testing, etc."></textarea>
      </div>
      <button type="submit" id="submitBtn">Submit Deletion Request</button>
    </form>
    <div id="statusMessage" style="display:none; margin-top: 16px; padding: 12px; background: #DCFCE7; color: #166534; border-radius: 8px; font-weight: 500;">Your email draft to support has been opened. After we receive and confirm your request, we will purge your Firebase Auth and Firestore shop data within about 48 hours and reply to your email.</div>
    <h2>What Data Will Be Deleted:</h2>
    <ul>
      <li><strong>User Authentication Profile:</strong> Google account ID, email, name, and Firebase Auth records.</li>
      <li><strong>Store Profile:</strong> Shop name, contact phone number, address, and profile logo.</li>
      <li><strong>Inventory &amp; Sales:</strong> All product listings, barcodes, sales history, and invoices.</li>
      <li><strong>Khata &amp; Ledger:</strong> All customer names, phone numbers, and credit balances.</li>
      <li><strong>Google Drive Integration:</strong> On in-app deletion the app revokes its Google Drive OAuth access and clears the local Drive session. Files previously saved to your personal Google Drive remain in <em>your</em> Drive — the app does not delete those files. You can manage or delete them yourself in Google Drive.</li>
    </ul>
    <h2>Data Retention Timeline:</h2>
    <p>On a successful in-app deletion, Firestore and Firebase Authentication data are removed from our systems immediately. Web requests (Option 2) are processed manually from email within about 48 hours after we receive them. Google Drive files you already own stay in your Drive until you delete them.</p>
    <h2>Need Assistance?</h2>
    <p>Contact our support team directly at <a href="mailto:techflow0500@gmail.com?subject=DigiShop%20Account%20Deletion%20Request">techflow0500@gmail.com</a>.</p>
    <div class="footer"><a href="privacy-policy.html">Privacy Policy</a> &bull; &copy; 2026 DigiShop. All rights reserved.</div>
  </div>
  <script>
    function handleRequest(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.innerText = 'Processing...';
      setTimeout(function () {
        document.getElementById('statusMessage').style.display = 'block';
        btn.innerText = 'Request Submitted';
        window.location.href = 'mailto:techflow0500@gmail.com?subject=Account%20Deletion%20Request%20(' + encodeURIComponent(email) + ')&body=Please%20delete%20all%20data%20associated%20with%20account:%20' + encodeURIComponent(email);
      }, 600);
    }
  </script>
</body>
</html>
`;

fs.writeFileSync('public/privacy-policy.html', privacy, 'utf8');
fs.writeFileSync('public/terms.html', terms, 'utf8');
fs.writeFileSync('public/index.html', index, 'utf8');
fs.writeFileSync('public/delete-account.html', del, 'utf8');
console.log('OK DigiShop legal HTML written');
