
<h1 align="center">📦 Parcel Delivery API</h1>

<p align="center">




  
  A <b>full-stack backend service</b> for managing parcel deliveries with role-based authentication (Admin, Sender, Receiver).
  <br />
  Built with <b>Node.js, Express, MongoDB, TypeScript</b> and deployed on <b>Vercel</b>.
</p>

---

<h2>🌐 Overview</h2>
<p>
This project simulates a parcel delivery system where users can register as <b>Sender</b>, <b>Receiver</b>, or <b>Admin</b>.
Each role has specific permissions:
</p>
<ul>
  <li>📤 <b>Sender</b> → Can create parcels, view/cancel their parcels.</li>
  <li>📥 <b>Receiver</b> → Can confirm deliveries, track parcels.</li>
  <li>🛠 <b>Admin</b> → Can manage users (block/unblock), approve/dispatch parcels, and see all system data.</li>
</ul>

---

<h2>⚙️ Technologies Used</h2>
<ul>
  <li>Node.js + Express</li>
  <li>TypeScript</li>
  <li>MongoDB (Mongoose ODM)</li>
  <li>JWT Authentication</li>
  <li>bcrypt for password hashing</li>
  <li>Vercel for deployment</li>
  <li>Postman for testing APIs</li>
</ul>

---

<h2>📁 Folder Structure</h2>

<pre>
├── src
│   ├── config
│   │   └── db.ts
│   ├── controllers
│   ├── middleware
│   ├── models
│   │   ├── user.model.ts
│   │   └── parcel.model.ts
│   ├── routes
│   │   ├── auth.routes.ts
│   │   ├── parcel.routes.ts
│   │   └── user.routes.ts
│   ├── services
│   │   └── parcel.service.ts
│   └── app.ts
├── dist (compiled JS)
├── package.json
├── tsconfig.json
├── vercel.json
</pre>

---

<h2>🚀 Features</h2>
<ul>
  <li>Role-based Authentication (Admin, Sender, Receiver)</li>
  <li>Parcel lifecycle management (Requested → Approved → Dispatched → In Transit → Delivered)</li>
  <li>User blocking/unblocking by Admin</li>
  <li>Track parcel with unique <code>trackingId</code></li>
  <li>Secure password storage</li>
  <li>Postman-ready API testing</li>
  <li>Clear status transition rules to prevent invalid updates</li>
</ul>

---

<h2>🧑‍🤝‍🧑 Role Permissions</h2>

<table>
  <tr>
    <th>Role</th>
    <th>Capabilities</th>
  </tr>
  <tr>
    <td>📤 Sender</td>
    <td>Create parcel, view parcels, cancel parcel</td>
  </tr>
  <tr>
    <td>📥 Receiver</td>
    <td>Confirm delivery, view assigned parcels, track parcel</td>
  </tr>
  <tr>
    <td>🛠 Admin</td>
    <td>Approve/dispatch parcels, view all parcels & users, block/unblock users</td>
  </tr>
</table>

---

<h2>📑 Code Notes</h2>

<ul>
  <li><b>Model Design:</b> Separate <code>User</code> and <code>Parcel</code> models with relationships. Each parcel has tracking logs.</li>
  <li><b>Route Design:</b> Grouped by role → <code>/api/auth</code>, <code>/api/parcels</code>, <code>/api/users</code>.</li>
  <li><b>Service Layer:</b> <code>parcel.service.ts</code> handles business logic (status transitions, delivery confirmation).</li>
  <li><b>Security:</b> JWT tokens used for protected routes, password hashing via bcrypt, role-based middleware for authorization.</li>
  <li><b>Error Handling:</b> Centralized error messages returned in JSON with <code>success: false</code> and readable descriptions.</li>
</ul>

---


<h2>🌍 Deployment</h2>
<p>
🔗 <b>Live API (Vercel):</b> <a href="https://parcel-delivery-ass5.vercel.app" target="_blank">https://parcel-delivery-ass5.vercel.app</a> <br/>
💻 <b>GitHub Repo:</b> <a href="https://github.com/your-username/parcel-delivery-ass5" target="_blank">GitHub Repository</a>
</p>

---

<h2>🧪 Postman Setup</h2>

<h1>📦 Parcel Delivery API - Postman Collection</h1>

<h2>🌐 Environment Variables</h2>
<table>
  <thead>
    <tr>
      <th>Variable</th>
      <th>Value / Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>baseUrl</td><td>https://parcel-delivery-ass5.vercel.app</td></tr>
    <tr><td>adminToken</td><td>(set after admin login)</td></tr>
    <tr><td>senderToken</td><td>(set after sender login)</td></tr>
    <tr><td>receiverToken</td><td>(set after receiver login)</td></tr>
    <tr><td>receiverId</td><td>(copy from registered receiver user _id)</td></tr>
    <tr><td>parcelId</td><td>(copy from created parcel _id)</td></tr>
    <tr><td>trackingId</td><td>(copy from parcel trackingId)</td></tr>
    <tr><td>userId</td><td>(any registered user _id)</td></tr>
  </tbody>
</table>

<hr>

<h2>1️⃣ Auth Requests</h2>

<h3>Register Sender</h3>
<pre><code>POST {{baseUrl}}/api/auth/register

Body:
{
  "name": "Alice Sender",
  "email": "alice.sender@example.com",
  "password": "password123",
  "role": "sender"
}</code></pre>

<h3>Register Receiver</h3>
<pre><code>POST {{baseUrl}}/api/auth/register

Body:
{
  "name": "Bob Receiver",
  "email": "bob.receiver@example.com",
  "password": "password123",
  "role": "receiver"
}</code></pre>

<h3>Register Admin</h3>
<pre><code>POST {{baseUrl}}/api/auth/register

Body:
{
  "name": "Charlie Admin",
  "email": "charlie.admin@example.com",
  "password": "password123",
  "role": "admin"
}</code></pre>

<h3>Login Requests</h3>
<pre><code>Login Sender:
{
  "email": "alice.sender@example.com",
  "password": "password123"
}

Login Receiver:
{
  "email": "bob.receiver@example.com",
  "password": "password123"
}

Login Admin:
{
  "email": "charlie.admin@example.com",
  "password": "password123"
}</code></pre>

<p>Copy the tokens to <code>{{senderToken}}</code>, <code>{{receiverToken}}</code>, <code>{{adminToken}}</code>.</p>

<hr>

<h2>2️⃣ Sender Parcel Requests</h2>

<h3>Create Parcel</h3>
<pre><code>POST {{baseUrl}}/api/parcels
Headers: Authorization: Bearer {{senderToken}}

Body:
{
  "type": "Box",
  "weight": 2.5,
  "receiverId": "{{receiverId}}",
  "pickupAddress": "123 Main St",
  "deliveryAddress": "456 Market Rd",
  "fee": 100
}</code></pre>

<h3>Get My Parcels</h3>
<pre><code>GET {{baseUrl}}/api/parcels/me
Headers: Authorization: Bearer {{senderToken}}</code></pre>

<h3>Cancel Parcel</h3>
<pre><code>PATCH {{baseUrl}}/api/parcels/cancel/{{parcelId}}
Headers: Authorization: Bearer {{senderToken}}</code></pre>

<hr>

<h2>3️⃣ Receiver Parcel Requests</h2>

<h3>Confirm Delivery</h3>
<pre><code>PATCH {{baseUrl}}/api/parcels/confirm/{{parcelId}}
Headers: Authorization: Bearer {{receiverToken}}</code></pre>

<h3>Get My Parcels</h3>
<pre><code>GET {{baseUrl}}/api/parcels/me
Headers: Authorization: Bearer {{receiverToken}}</code></pre>

<hr>

<h2>4️⃣ Admin Requests</h2>

<h3>List All Users</h3>
<pre><code>GET {{baseUrl}}/api/users
Headers: Authorization: Bearer {{adminToken}}</code></pre>

<h3>Block User</h3>
<pre><code>PATCH {{baseUrl}}/api/users/block/{{userId}}
Headers: Authorization: Bearer {{adminToken}}
Body:
{ "blocked": true }</code></pre>

<h3>Unblock User</h3>
<pre><code>PATCH {{baseUrl}}/api/users/block/{{userId}}
Headers: Authorization: Bearer {{adminToken}}
Body:
{ "blocked": false }</code></pre>

<h3>Get All Parcels</h3>
<pre><code>GET {{baseUrl}}/api/parcels
Headers: Authorization: Bearer {{adminToken}}</code></pre>

<h3>Get All Blocked Users</h3>
<pre><code>GET {{baseUrl}}/api/users/blocked
Headers: Authorization: Bearer {{adminToken}}</code></pre>

<h3>Update Parcel Status</h3>
<pre><code>PATCH {{baseUrl}}/api/parcels/status/{{parcelId}}
Headers: Authorization: Bearer {{adminToken}}
Body:
{ "status": "Approved", "note": "Approved by admin" }</code></pre>

<h3>Block Parcel</h3>
<pre><code>PATCH {{baseUrl}}/api/parcels/block/{{parcelId}}
Headers: Authorization: Bearer {{adminToken}}
Body:
{ "blocked": true }</code></pre>

<hr>

<h2>5️⃣ Public Parcel Requests</h2>

<h3>Track Parcel</h3>
<pre><code>GET {{baseUrl}}/api/parcels/track/{{trackingId}}</code></pre>

<hr>

<h2>6️⃣ Parcel History (Sender/Receiver)</h2>

<h3>Get Delivery History</h3>
<pre><code>GET {{baseUrl}}/api/parcels/history/{{parcelId}}
Headers: Authorization: Bearer {{senderToken}} or {{receiverToken}}</code></pre>

<p>This shows all status changes for a parcel, including timestamps, notes, and who updated it.</p>

<hr>

<h2>✅ Testing Workflow</h2>
<ol>
  <li>Register users (sender, receiver, admin).</li>
  <li>Login and save tokens.</li>
  <li>Sender creates a parcel → copy <code>parcelId</code> and <code>trackingId</code>.</li>
  <li>Admin approves parcel or updates status.</li>
  <li>Receiver confirms delivery.</li>
  <li>Test Parcel History to see the full delivery log.</li>
  <li>Admin can view all users, block/unblock, and view all parcels.</li>
</ol>

<h2>📦 Dummy Test Data</h2>

<pre>
Sender:
  email: alice.sender@example.com
  password: password123

Receiver:
  email: bob.receiver@example.com
  password: password123

Admin:
  email: charlie.admin@example.com
  password: password123
</pre>

---

<h2>🙏 Thank You</h2>

<h2>🚀 Future Improvements</h2>
<ul>
  <li>📱 Add frontend dashboard (React/Next.js)</li>
  <li>📊 Generate delivery reports & analytics</li>
  <li>🔔 Add email/SMS notifications</li>
  <li>📍 Integrate live tracking with Google Maps API</li>
  <li>🧾 Add invoice & billing system for deliveries</li>
</ul>

---

<h2>🙏 Acknowledgements</h2>
<p>
Thanks for checking out this project! Built with ❤️ using Node.js, MongoDB, and Vercel.  
Feel free to fork, contribute, or suggest improvements.
</p>
