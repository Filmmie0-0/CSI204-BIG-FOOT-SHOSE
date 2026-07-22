# 👟 Big Foot Shoes

แพลตฟอร์มอีคอมเมิร์ซสำหรับจัดจำหน่ายรองเท้าและอุปกรณ์ดูแลรองเท้าแบบครบวงจร โครงการนี้เป็นส่วนหนึ่งของการศึกษาและฝึกฝนกระบวนการพัฒนาซอฟต์แวร์ (SDLC) และการทำงานร่วมกันเป็นทีม

---

##  รายชื่อสมาชิกกลุ่ม

| ลำดับ | รหัสนักศึกษา | ชื่อ-นามสกุล | หน้าที่รับผิดชอบ |
|---|---|---|---|
| 1 | 65075821 | อภิวัฒ คุณทรัพย์ | Frontend |
| 2 | 67160172 | ภัสสร เพ็ญพรเลิศชัย | Design, Frontend |
| 3 | 67164463 | ณัฐดนัย กาสินพิลา | Backend |
| 4 | 67172347 | รัฐภูมิ ลิ้มเลิศ | Backend |
| 5 | 67172354 | บุราชัย สละสำราญ | Design, Frontend |

---

##  ที่มาและความสำคัญ

ในปัจจุบันการเลือกซื้อรองเท้าผ่านช่องทางออนไลน์ได้รับความนิยมอย่างมาก แต่ผู้ซื้อยังคงต้องการแพลตฟอร์มที่ใช้งานง่าย มีข้อมูลครบถ้วน และมีความปลอดภัย โครงการ **Big Foot Shoes** จึงถูกพัฒนาขึ้นเพื่อเป็นพื้นที่ศูนย์กลางที่ "แมตช์รองเท้าที่ใช่ให้กับผู้ใช้งาน" โดยรวบรวมสินค้าไว้ในที่เดียว พร้อมระบบจัดการหลังบ้านที่มีประสิทธิภาพ เพื่อเติมเต็มประสบการณ์การช้อปปิ้งออนไลน์ให้ราบรื่นและสมบูรณ์แบบที่สุด

##  เป้าหมายทางธุรกิจและขอบเขต

### วัตถุประสงค์
* พัฒนาเว็บไซต์อีคอมเมิร์ซสำหรับจำหน่ายรองเท้า
* เพื่อให้ลูกค้าสามารถค้นหา เลือกสินค้า และสั่งซื้อได้อย่างสะดวกและปลอดภัย
* เพื่อให้ผู้ดูแลระบบ (Admin) และพนักงาน (Staff) สามารถจัดการสินค้า สต๊อก และคำสั่งซื้อได้อย่างมีประสิทธิภาพ

### ขอบเขตของระบบ
* **การจัดการสมาชิก (Authentication):** สมัครสมาชิก และเข้าสู่ระบบด้วยความปลอดภัยแบบ JWT
* **การค้นหาสินค้า (Product Catalog):** ค้นหาสินค้า ดูรายละเอียด หมวดหมู่ ไซส์ และรีวิว
* **ตะกร้าสินค้า (Shopping Cart):** จัดการสินค้าในตะกร้า เพิ่ม/ลดจำนวน พร้อมคำนวณยอดรวม
* **ระบบสั่งซื้อสินค้า (Checkout & Orders):** จัดการที่อยู่จัดส่ง คำนวณค่าส่ง และสร้างใบสั่งซื้อ
* **ระบบชำระเงิน (Payment Simulation):** จำลองการชำระเงินผ่านระบบ (เช่น บัตรเครดิต, PromptPay, COD)
* **ติดตามคำสั่งซื้อ (Order Tracking):** ตรวจสอบประวัติการสั่งซื้อ และสถานะการจัดส่ง (Tracking)
* **การจัดการสินค้าและสต็อก (Product Management):** เพิ่ม แก้ไข ลบ ข้อมูลสินค้า หมวดหมู่ รูปภาพ และจัดการคลังสินค้า
* **การจัดการคำสั่งซื้อ (Order Management):** ตรวจสอบรายการสั่งซื้อ อัปเดตสถานะการชำระเงิน และสถานะการจัดส่ง
* **แดชบอร์ดรายงาน (Dashboard & Reports):** สรุปภาพรวมยอดขาย จำนวนคำสั่งซื้อ และแจ้งเตือนสินค้าใกล้หมดสต็อก

---

##  แผนการดำเนินงาน

เพื่อการจัดการและติดตามความคืบหน้าของโครงการ ได้แบ่งแผนการดำเนินงานออกเป็น 4 ระยะ (Phases) ดังนี้:
* **Phase 1: Design & Database** - ออกแบบ UX/UI (Figma), วางโครงสร้างระบบ และออกแบบฐานข้อมูล (DB Schema)
* **Phase 2: Frontend** - พัฒนาหน้าเว็บด้วย React.js
* **Phase 3: Backend & API** - พัฒนาระบบหลังบ้านด้วย Node.js/Express, เชื่อมต่อ MongoDB, และทำระบบ Authentication (JWT)
* **Phase 4: Testing** - ทดสอบการทำงานของระบบ (UAT)

---

##  การวิเคราะห์ระบบและฟังก์ชันการทำงาน (Functional Requirements)

ระบบแบ่งผู้ใช้งานออกเป็น 3 บทบาทหลัก ได้แก่ **Customer (ลูกค้า)**, **Staff (พนักงาน)** และ **Admin (ผู้ดูแลระบบ)**

###  ฟังก์ชันสำหรับ Customer
| รหัส | ฟังก์ชัน (Function) | รายละเอียด | ความสำคัญ |
|---|---|---|---|
| C01 | Register / Login | สร้างบัญชี และเข้าสู่ระบบ 
| C02 | แก้ไขข้อมูลส่วนตัว | แก้ไขชื่อ อีเมล รหัสผ่าน
| C03 | ดูรายละเอียดสินค้า | แสดงรายการรองเท้า รูปภาพ ชื่อ ราคา ประเภท 
| C04 | ค้นหาสินค้า | ค้นหาด้วยคีย์เวิร์ด หรือชื่อสินค้า 
| C05 | ฟิลเตอร์ประเภทสินค้า | กรองตามประเภท ราคา
| C06 | ตะกร้าสินค้า | เพิ่ม/ลด สินค้า และแสดงยอดชำระรวม 
| C07 | การชำระเงิน | เลือกช่องทางการชำระเงินและยืนยันคำสั่งซื้อ 
| C08 | ตรวจสอบที่อยู่ | เลือกที่อยู่เดิม หรือเพิ่มที่อยู่ใหม่สำหรับการจัดส่ง 
| C09 | การติดตามสถานะ | ดูสถานะคำสั่งซื้อ (ชำระเงินแล้ว, รอจัดส่ง, กำลังจัดส่ง, สำเร็จ) 
| C10 | ประวัติการสั่งซื้อ | ตรวจสอบรายการออเดอร์ที่เคยดำเนินการในอดีต 
| C11 | ลืมรหัสผ่าน | รีเซ็ตรหัสผ่านผ่านอีเมลหรือเมื่อผู้ใช้ลืมรหัสผ่าน

###  ฟังก์ชันสำหรับ Admin / Staff
| รหัส | ฟังก์ชัน (Function) | รายละเอียด | ความสำคัญ |
|---|---|---|---|
| A01 | Login | เข้าสู่ระบบสำหรับผู้ดูแลและพนักงาน 
| A02 | จัดการสิทธิ์การเข้าถึง | เพิ่มสิทธิ์พนักงานหรือ Admin บัญชีอื่น 
| A03 | ดูข้อมูล Customer | ตรวจสอบรายชื่อและข้อมูลลูกค้าในระบบ 
| A04 | จัดการผู้ใช้งาน | ระงับ หรือแก้ไขข้อมูลบัญชีผู้ใช้ 
| A05 | จัดการสินค้า (CRUD) | เพิ่ม ลบ แก้ไข และอัปเดตข้อมูลสินค้าในแค็ตตาล็อก 
| A06 | จัดการคำสั่งซื้อ | อัปเดตและปรับปรุงสถานะออเดอร์ให้ลูกค้าทราบ 
| A07 | Dashboard | แสดงภาพรวมยอดการสั่งซื้อ รายได้ และจำนวนลูกค้า 

###  ฟังก์ชันการทำงานอัตโนมัติของระบบ (System)
| รหัส | ฟังก์ชัน (Function) | รายละเอียด | ความสำคัญ |
|---|---|---|---|
| S01 | ปรับลดสต๊อกสินค้า | จำนวนสินค้าในสต๊อกลดลงอัตโนมัติเมื่อเกิดการสั่งซื้อสำเร็จ 
| S02 | ตรวจสอบ Out of stock | ป้องกันการกดสั่งซื้อทันทีหากสินค้าในสต๊อกหมด 
| S03 | ระบบแจ้งเตือนอัตโนมัติ | แจ้งเตือนผู้ใช้อัตโนมัติเมื่อมีการเปลี่ยนสถานะออเดอร์ (เช่น จัดส่งแล้ว)

---

##  การออกแบบและเทคโนโลยี (Design & Technologies)

โครงการนี้พัฒนาภายใต้สถาปัตยกรรม **MERN Stack** เพื่อให้ระบบมีความยืดหยุ่นและรวดเร็ว
* **Frontend:** `React.js`, `Bootstrap` (ออกแบบให้รองรับการใช้งานทุกขนาดหน้าจอ Responsive)
* **Backend:** `Node.js`, `Express.js` (ให้บริการ RESTful API)
* **Database:** `MongoDB`
* **UI/UX Design:** `Figma` (ออกแบบหน้าจอผู้ใช้งาน), `Draw.io` (เขียนแผนภาพ System Diagrams)
* **Version Control:** การทำงานร่วมกันเป็นทีมผ่าน`GitHub`

---

## ⚙️ การติดตั้งและรันโปรเจกต์ (Installation & Setup)

### สิ่งที่ต้องมีล่วงหน้า (Prerequisites)
* Node.js (เวอร์ชัน 16 ขึ้นไป)
* MongoDB (Local หรือ MongoDB Atlas)

### วิธีการติดตั้ง
1. **Clone Repository**
   ```bash
   git clone <repository_url>
   cd project
   ```
2. **ตั้งค่า Backend**
   ```bash
   cd backend
   npm install
   npm run start
   ```
3. **ตั้งค่า Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---
## USE CASEDIAGRAM
<p align="center">
  <img width="990" height="990" alt="USE CASEDIAGRAM" src="https://github.com/user-attachments/assets/19a74bd8-3bc2-4a17-a515-b36d4dda1512" />
" />
</p>

---
## Class Diagram
<p align="center">
  <img width="990" height="990" alt="Class Diagram" src="https://github.com/user-attachments/assets/51eee758-ac1c-4dde-9f9a-cc76b90c2f41" />
</p>

---
## Sequence Diagram
<p align="center">
   <img width="990" height="990" alt="Sequence Diagram" src="https://github.com/user-attachments/assets/027fc7b0-c04e-49f8-be1c-bbf3fc0a562d" />
</p>

---
## System UAT (User Acceptance Testing)

จากการทดสอบ User Acceptance Testing (UAT) ของระบบ **BIG FOOT SHOES** โดยกลุ่มผู้ใช้งาน (Customer, Staff, Admin) พบข้อผิดพลาดที่ต้องดำเนินการแก้ไขเร่งด่วนเพื่อปรับปรุงระบบให้พร้อมใช้งานจริง ดังนี้

### Critical Issues
- **Authentication & Security (ระบบสมาชิกและความปลอดภัย):** 
  - ข้อมูลการสมัครสมาชิกและการเข้าสู่ระบบไม่ถูกบันทึกลง Database ทำให้ผู้ใช้ทุกระดับ (Role) ไม่สามารถ Login ได้
  - ขาดการตรวจสอบสิทธิ์ (Role Authorization) อย่างรัดกุม ลูกค้าทั่วไปสามารถเข้าถึงโครงสร้างหน้า `/admin` ได้ผ่านการพิมพ์ URL(แก้ไขแล้ว)
- **Payment & Checkout (ระบบตะกร้าสินค้าและการชำระเงิน):** 
  - ระบบล็อกช่องทางการชำระเงินไว้ที่ค่าเริ่มต้น (เช่น เครดิตการ์ด) ไม่ว่าผู้ใช้จะเลือกช่องทางใดก็ตาม(แก้ไขแล้ว)
  - โครงสร้างข้อมูล (Payload) ระหว่าง Frontend และ Backend ไม่ตรงกัน ทำให้ไม่สามารถส่งข้อมูลยืนยันคำสั่งซื้อได้สำเร็จ(แก้ไขแล้ว)
- **Order Management (ระบบจัดการคำสั่งซื้อหลังบ้าน):**
  - Admin และ Staff ไม่สามารถเปิดตรวจสอบไฟล์ภาพสลิปโอนเงินที่ลูกค้าแนบมาได้ และสถานะการชำระเงินไม่มีการอัปเดต(แก้ไขแล้ว)

### High & Medium Issues (ปัญหาที่ควรปรับปรุง)
- **Stock Validation (ระบบจัดการสต๊อก):** 
  - ระบบไม่มีการตรวจสอบและจำกัดจำนวนสินค้าตามสต๊อกจริง ทำให้ลูกค้ากดเพิ่มสินค้าลงตะกร้าได้ไม่จำกัด(แก้ไขแล้ว)
- **Search & Filters (ระบบค้นหาและตัวกรอง):** 
  - ฟังก์ชันค้นหาสินค้าด้วยคีย์เวิร์ดยังไม่ทำงาน และยังไม่มี UI ช่องค้นหาในหน้า Frontend(แก้ไขแล้ว)
  - ตัวกรองสินค้า (Filter) ตามสี (Color) และหมวดหมู่ (Style) ไม่แสดงผลลัพธ์สินค้าตามที่ผู้ใช้เลือก(แก้ไขแล้ว)
- **Dashboard & UI (ระบบแสดงผล):**
  - หน้า Dashboard ของ Admin ไม่แสดงข้อมูลสรุปยอดขายและรายได้รวม(แก้ไขแล้ว)
  - ไม่มีหน้า UI สำหรับให้เจ้าหน้าที่จัดการ (เพิ่ม/ลด/แก้ไข) ข้อมูลหมวดหมู่สินค้า(แก้ไขแล้ว)
  - หน้าจอของลูกค้า (Customer) ไม่สามารถดึงข้อมูลสถานะคำสั่งซื้อล่าสุด (เช่น กำลังจัดส่ง) มาแสดงผลได้(แก้ไขแล้ว)

---

### Action Plan / แนวทางการแก้ไข (Next Steps)
1. **Fix API Payload & Database Schema (High Priority):** ตรวจสอบและปรับแก้ JSON Payload ระหว่าง Frontend/Backend ให้ตรงกัน โดยเฉพาะในส่วนของระบบ Login/Register และระบบ Checkout(แก้ไขแล้ว)
2. **Implement Role-Based Access Control (RBAC):** เพิ่ม Middleware หรือ Route Guard ป้องกันไม่ให้ผู้ใช้ที่ไม่มีสิทธิ์เข้าถึง Route `/admin`(แก้ไขแล้ว)
3. **Fix Payment Logic & Receipt Rendering:** แก้ไข Logic การเลือกช่องทางชำระเงินให้ส่งค่าตามจริง และพัฒนาระบบ Image Rendering สำหรับดูสลิปโอนเงินในหน้าต่างของ Admin/Staff(แก้ไขแล้ว)
4. **Enable Stock Validation:** เพิ่มเงื่อนไขตรวจสอบจำนวนสินค้าคงเหลือทั้งฝั่ง Frontend (ปิดปุ่มเมื่อเกินจำนวน) และ Backend (ตรวจสอบซ้ำก่อนเซฟลง Database)(แก้ไขแล้ว)

---

## 🗄️ โครงสร้างฐานข้อมูล (Database Schema)

```dbml
Table users {
  id integer [primary key, increment]
  username varchar(50) [unique, not null]
  email varchar(100) [unique, not null]
  password_hash varchar(255) [not null]
  first_name varchar(50)
  last_name varchar(50)
  phone_number varchar(20)
  profile_image varchar(255)
  role varchar(20) [default: 'customer']
  status varchar(20) [default: 'active']
  created_at timestamp [default: `now()` ]
  updated_at timestamp [default: `now()` ]
}

Table addresses {
  id integer [primary key, increment]
  user_id integer
  address_type varchar(20)
  receiver_name varchar(100) [not null]
  receiver_phone varchar(20) [not null]
  address_line1 varchar(255) [not null]
  address_line2 varchar(255)
  city varchar(100) [not null]
  state varchar(100) [not null]
  postal_code varchar(20) [not null]
  is_default boolean [default: false]
  created_at timestamp [default: `now()` ]
}

Table categories {
  id integer [primary key, increment]
  name varchar(100) [not null]
  description text
  parent_id integer
  created_at timestamp [default: `now()` ]
}

Table products {
  id integer [primary key, increment]
  category_id integer
  name varchar(150) [not null]
  sku varchar(100) [unique, not null]
  description text
  price decimal(10,2) [not null]
  discount_price decimal(10,2)
  image_url varchar(255)
  sizes varchar(255) [note: 'Array of strings']
  gender varchar(20)
  countInStock integer [default: 10]
  status varchar(20) [default: 'active']
  created_at timestamp [default: `now()` ]
  updated_at timestamp [default: `now()` ]
}

Table product_variants {
  id integer [primary key, increment]
  product_id integer
  variant_name varchar(50) [not null]
  variant_value varchar(50) [not null]
  additional_price decimal(10,2) [default: 0]
  stock_quantity integer [default: 0]
}

Table product_images {
  id integer [primary key, increment]
  product_id integer
  image_url varchar(255) [not null]
  is_primary boolean [default: false]
  sort_order integer [default: 0]
}

Table carts {
  id integer [primary key, increment]
  user_id integer [unique]
  created_at timestamp [default: `now()` ]
  updated_at timestamp [default: `now()` ]
}

Table cart_items {
  id integer [primary key, increment]
  cart_id integer
  product_id integer
  variant_id integer [null]
  quantity integer [not null, default: 1]
  created_at timestamp [default: `now()` ]
}

Table orders {
  id integer [primary key, increment]
  user_id integer
  shipping_address_id integer
  billing_address_id integer
  total_amount decimal(10,2) [not null]
  shipping_fee decimal(10,2) [default: 0]
  order_status varchar(30) [default: 'pending']
  tracking_number varchar(100)
  payment_method varchar(50) [default: 'Credit / Debit Card']
  created_at timestamp [default: `now()` ]
  updated_at timestamp [default: `now()` ]
}

Table order_items {
  id integer [primary key, increment]
  order_id integer
  product_id integer
  variant_id integer [null]
  selectedSize varchar(50)
  quantity integer [not null]
  price_per_unit decimal(10,2) [not null]
}

Table payments {
  id integer [primary key, increment]
  order_id integer [unique]
  payment_method varchar(50) [not null]
  payment_status varchar(30) [default: 'pending']
  transaction_id varchar(150)
  slip_image varchar(255)
  amount_paid decimal(10,2) [not null]
  paid_at timestamp
}

Table product_reviews {
  id integer [primary key, increment]
  user_id integer
  product_id integer
  rating integer [not null]
  comment text
  created_at timestamp [default: `now()` ]
}
{
Ref: addresses.user_id > users.id
Ref: categories.parent_id > categories.id
Ref: products.category_id > categories.id
Ref: product_variants.product_id > products.id
Ref: product_images.product_id > products.id
Ref: carts.user_id - users.id
Ref: cart_items.cart_id > carts.id
Ref: cart_items.product_id > products.id
Ref: cart_items.variant_id > product_variants.id
Ref: orders.user_id > users.id
Ref: orders.shipping_address_id > addresses.id
Ref: orders.billing_address_id > addresses.id
Ref: order_items.order_id > orders.id
Ref: order_items.product_id > products.id
Ref: order_items.variant_id > product_variants.id
Ref: payments.order_id - orders.id 
Ref: product_reviews.user_id > users.id
Ref: product_reviews.product_id > products.id
}

---

##  การทดสอบระบบ (Testing Approach)

* **Manual Testing:** ทดสอบการทำงานพื้นฐานตามฟังก์ชัน เช่น จำลองการนำสินค้าใส่ตะกร้าและทดสอบ Flow การชำระเงิน
* **API Testing:** ตรวจสอบความถูกต้องของการรับส่งข้อมูล Backend API ด้วย `Postman`
* **UAT (User Acceptance Testing):** ตรวจสอบความสมบูรณ์ของระบบก่อนนำขึ้นใช้งานจริง

---

### แผนการบำรุงรักษา (Maintenance & SLA)
* **การตรวจสอบ (Monitoring):** ดูแลระบบหลังบ้านให้พร้อมรองรับผู้ใช้งานตลอดเวลา
* **การจัดการแก้ไขข้อผิดพลาด:** 
  * **ปัญหาระดับวิกฤต (Critical):** เช่น ไม่สามารถเชื่อมต่อฐานข้อมูลได้ จะเร่งแก้ไขให้เสร็จสิ้นภายใน 4 ชั่วโมง
  * **ปัญหาทั่วไป (Medium/Low):** เช่น การแสดงผลคลาดเคลื่อนเล็กน้อย จะถูกรวบรวมเพื่ออัปเดตแก้ไขในรอบถัดไป
* **การสำรองข้อมูล (Backup):** มีแผนการสำรองฐานข้อมูลอย่างสม่ำเสมอเพื่อป้องกันข้อมูลสูญหาย

---

##  อัปเดตและปัญหาที่พบ

### การอัปเดตล่าสุด 
* **เพิ่มหน้าแสดงสินค้า:** พัฒนาหน้าแสดงผลสินค้าแยกตามหมวดหมู่เพศ พร้อมระบบดึงข้อมูลจาก Backend API (`/products`)
* **ระบบคัดกรองสินค้า:** เพิ่มฟังก์ชันการกรองสินค้าตามรูปแบบ, ขนาด, และช่วงราคา รวมทั้งการจัดเรียง (เรียงตามราคา, สินค้าใหม่, และยอดนิยม) ผ่าน `FilterDrawer`
* **การแสดงผลสถานะการโหลด:** เพิ่ม Placeholder (Skeleton Loading) ระหว่างการรอข้อมูลเพื่อประสบการณ์การใช้งานที่ดีขึ้น

### ปัญหาที่พบและการแก้ไข

* **ปัญหาการแสดงผลข้อมูลที่ไม่สมบูรณ์ระหว่างคัดกรองสินค้า:** พบปัญหาข้อผิดพลาดจากการคัดกรองข้อมูลที่บางฟิลด์อาจไม่มีค่า (Null/Undefined) 
  * **การแก้ไข:** เพิ่มเงื่อนไขตรวจสอบความถูกต้องของข้อมูล (เช่น `Array.isArray`) ก่อนทำการประมวลผล เพื่อป้องกันข้อผิดพลาดในการเรนเดอร์ (Render Error)
* **ปัญหาการตอบสนองของ API ล่าช้าหรือไม่มีข้อมูล:** 
  * **การแก้ไข:** เพิ่มการดักจับข้อผิดพลาด (Error Handling) และแสดงข้อความแจ้งเตือน (Fallback UI) เมื่อไม่พบข้อมูลสินค้าหรือเซิร์ฟเวอร์ไม่ตอบสนอง