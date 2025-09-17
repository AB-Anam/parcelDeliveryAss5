
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

<h3>🔑 Environment Variables</h3>
<pre>
baseUrl: https://parcel-delivery-ass5.vercel.app
adminToken: (set after admin login)
senderToken: (set after sender login)
receiverToken: (set after receiver login)
receiverId: (copy from registered receiver user _id)
parcelId: (copy from created parcel _id)
trackingId: (copy from parcel trackingId)
userId: (any registered user _id)
</pre>

---

<h2>📡 API Requests</h2>

<h3>1️⃣ Auth (Separate Requests)</h3>

<b>Register Sender</b>  
<pre>
POST {{baseUrl}}/api/auth/register
{
  "name": "Alice Sender",
  "email": "alice.sender@example.com",
  "password": "password123",
  "role": "sender"
}
</pre>

<b>Register Receiver</b>  
<pre>
POST {{baseUrl}}/api/auth/register
{
  "name": "Bob Receiver",
  "email": "bob.receiver@example.com",
  "password": "password123",
  "role": "receiver"
}
</pre>

<b>Register Admin</b>  
<pre>
POST {{baseUrl}}/api/auth/register
{
  "name": "Charlie Admin",
  "email": "charlie.admin@example.com",
  "password": "password123",
  "role": "admin"
}
</pre>

<b>Login Sender</b>  
<pre>
POST {{baseUrl}}/api/auth/login
{
  "email": "alice.sender@example.com",
  "password": "password123"
}
</pre>

<b>Login Receiver</b>  
<pre>
POST {{baseUrl}}/api/auth/login
{
  "email": "bob.receiver@example.com",
  "password": "password123"
}
</pre>

<b>Login Admin</b>  
<pre>
POST {{baseUrl}}/api/auth/login
{
  "email": "charlie.admin@example.com",
  "password": "password123"
}
</pre>

---

<h3>2️⃣ Sender Parcel Requests</h3>

<b>Create Parcel</b>  
<pre>
POST {{baseUrl}}/api/parcels
Authorization: Bearer {{senderToken}}

{
  "type": "Box",
  "weight": 2.5,
  "receiverId": "{{receiverId}}",
  "pickupAddress": "123 Main St",
  "deliveryAddress": "456 Market Rd",
  "fee": 100
}
</pre>

<b>Get My Parcels</b>  
<pre>
GET {{baseUrl}}/api/parcels/me
Authorization: Bearer {{senderToken}}
</pre>

<b>Cancel Parcel</b>  
<pre>
PATCH {{baseUrl}}/api/parcels/cancel/{{parcelId}}
Authorization: Bearer {{senderToken}}
</pre>

---

<h3>3️⃣ Receiver Parcel Requests</h3>

<b>Confirm Delivery</b>  
<pre>
PATCH {{baseUrl}}/api/parcels/confirm/{{parcelId}}
Authorization: Bearer {{receiverToken}}
</pre>

<b>Get My Parcels</b>  
<pre>
GET {{baseUrl}}/api/parcels/me
Authorization: Bearer {{receiverToken}}
</pre>

---

<h3>4️⃣ Admin Requests</h3>

<b>List All Users</b>  
<pre>
GET {{baseUrl}}/api/users
Authorization: Bearer {{adminToken}}
</pre>

<b>Block User</b>  
<pre>
PATCH {{baseUrl}}/api/users/block/{{userId}}
Authorization: Bearer {{adminToken}}

{ "blocked": true }
</pre>

<b>Unblock User</b>  
<pre>
PATCH {{baseUrl}}/api/users/block/{{userId}}
Authorization: Bearer {{adminToken}}

{ "blocked": false }
</pre>

<b>Get All Parcels</b>  
<pre>
GET {{baseUrl}}/api/parcels
Authorization: Bearer {{adminToken}}
</pre>

<b>Get All Blocked Users</b>  
<pre>
GET {{baseUrl}}/api/users/blocked
Authorization: Bearer {{adminToken}}
</pre>

<b>Update Parcel Status</b>  
<pre>
PATCH {{baseUrl}}/api/parcels/status/{{parcelId}}
Authorization: Bearer {{adminToken}}

{ "status": "Approved", "note": "Approved by admin" }
</pre>

<b>Block Parcel</b>  
<pre>
PATCH {{baseUrl}}/api/parcels/block/{{parcelId}}
Authorization: Bearer {{adminToken}}

{ "blocked": true }
</pre>

---

<h3>5️⃣ Public Parcel Requests</h3>

<b>Track Parcel</b>  
<pre>
GET {{baseUrl}}/api/parcels/track/{{trackingId}}
</pre>

---

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
