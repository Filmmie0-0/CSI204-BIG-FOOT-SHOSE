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

##  ที่มาและความสำคัญ (Background)

ในปัจจุบันการเลือกซื้อรองเท้าผ่านช่องทางออนไลน์ได้รับความนิยมอย่างมาก แต่ผู้ซื้อยังคงต้องการแพลตฟอร์มที่ใช้งานง่าย มีข้อมูลครบถ้วน และมีความปลอดภัย โครงการ **Big Foot Shoes** จึงถูกพัฒนาขึ้นเพื่อเป็นพื้นที่ศูนย์กลางที่ "แมตช์รองเท้าที่ใช่ให้กับผู้ใช้งาน" โดยรวบรวมสินค้าไว้ในที่เดียว พร้อมระบบจัดการหลังบ้านที่มีประสิทธิภาพ เพื่อเติมเต็มประสบการณ์การช้อปปิ้งออนไลน์ให้ราบรื่นและสมบูรณ์แบบที่สุด

##  เป้าหมายทางธุรกิจและขอบเขต (Objectives & Scope)

### วัตถุประสงค์
* พัฒนาเว็บไซต์อีคอมเมิร์ซสำหรับจำหน่ายรองเท้าที่สามารถใช้งานได้จริง
* เพื่อให้ลูกค้าสามารถค้นหา เลือกสินค้า และสั่งซื้อได้อย่างสะดวกและปลอดภัย
* เพื่อให้ผู้ดูแลระบบ (Admin) และพนักงาน (Staff) สามารถจัดการสินค้า สต๊อก และคำสั่งซื้อได้อย่างมีประสิทธิภาพ

### ขอบเขตของระบบ
---

## ✨ ฟีเจอร์หลักของระบบ (Key Features)
* **การจัดการสมาชิก (Authentication):** สมัครสมาชิก และเข้าสู่ระบบด้วยความปลอดภัยแบบ JWT
* **การค้นหาสินค้า (Product Catalog):** ค้นหาสินค้า ดูรายละเอียด หมวดหมู่ ตัวเลือกย่อย (สี/ไซส์) และรีวิว
* **ตะกร้าสินค้า (Shopping Cart):** จัดการสินค้าในตะกร้า เพิ่ม/ลดจำนวน พร้อมคำนวณยอดรวม
* **ระบบสั่งซื้อสินค้า (Checkout & Orders):** จัดการที่อยู่จัดส่ง คำนวณค่าส่ง และสร้างใบสั่งซื้อ
* **ระบบชำระเงิน (Payment Simulation):** จำลองการชำระเงินผ่านระบบ (เช่น บัตรเครดิต, PromptPay, COD)
* **ติดตามคำสั่งซื้อ (Order Tracking):** ตรวจสอบประวัติการสั่งซื้อ และสถานะการจัดส่ง (Tracking)
* **การจัดการสินค้าและสต็อก (Product Management):** เพิ่ม แก้ไข ลบ ข้อมูลสินค้า หมวดหมู่ รูปภาพ และจัดการคลังสินค้า
* **การจัดการคำสั่งซื้อ (Order Management):** ตรวจสอบรายการสั่งซื้อ อัปเดตสถานะการชำระเงิน และสถานะการจัดส่ง
* **แดชบอร์ดรายงาน (Dashboard & Reports):** สรุปภาพรวมยอดขาย จำนวนคำสั่งซื้อ และแจ้งเตือนสินค้าใกล้หมดสต็อก

---

##  การวิเคราะห์ระบบและฟังก์ชันการทำงาน (Functional Requirements)

ระบบแบ่งผู้ใช้งานออกเป็น 3 บทบาทหลัก ได้แก่ **Customer (ลูกค้า)**, **Staff (พนักงาน)** และ **Admin (ผู้ดูแลระบบ)**

###  ฟังก์ชันสำหรับ Customer
| รหัส | ฟังก์ชัน (Function) | รายละเอียด | ความสำคัญ |
|---|---|---|---|
| C01 | Register / Login | สร้างบัญชี และเข้าสู่ระบบ | High |
| C02 | แก้ไขข้อมูลส่วนตัว | แก้ไขชื่อ อีเมล รหัสผ่าน ที่อยู่ เบอร์โทรศัพท์ | High |
| C03 | ดูรายละเอียดสินค้า | แสดงรายการรองเท้า รูปภาพ ชื่อ ราคา ประเภท | High |
| C04 | ค้นหาสินค้า | ค้นหาด้วยคีย์เวิร์ด หรือชื่อสินค้า | High |
| C05 | ฟิลเตอร์ประเภทสินค้า | กรองตามประเภท ราคา หรือแบรนด์ | Medium |
| C06 | ตะกร้าสินค้า | เพิ่ม/ลด สินค้า และแสดงยอดชำระรวม | High |
| C07 | การชำระเงิน | เลือกช่องทางการชำระเงินและยืนยันคำสั่งซื้อ | High |
| C08 | ตรวจสอบที่อยู่ | เลือกที่อยู่เดิม หรือเพิ่มที่อยู่ใหม่สำหรับการจัดส่ง | High |
| C09 | การติดตามสถานะ | ดูสถานะคำสั่งซื้อ (ชำระเงินแล้ว, รอจัดส่ง, กำลังจัดส่ง, สำเร็จ) | High |
| C10 | ประวัติการสั่งซื้อ | ตรวจสอบรายการออเดอร์ที่เคยดำเนินการในอดีต | Medium |

###  ฟังก์ชันสำหรับ Admin / Staff
| รหัส | ฟังก์ชัน (Function) | รายละเอียด | ความสำคัญ |
|---|---|---|---|
| A01 | Login | เข้าสู่ระบบสำหรับผู้ดูแลและพนักงาน | High |
| A02 | จัดการสิทธิ์การเข้าถึง | เพิ่มสิทธิ์พนักงานหรือ Admin บัญชีอื่น | Low |
| A03 | ดูข้อมูล Customer | ตรวจสอบรายชื่อและข้อมูลลูกค้าในระบบ | Medium |
| A04 | จัดการผู้ใช้งาน | ระงับ หรือแก้ไขข้อมูลบัญชีผู้ใช้ | High |
| A05 | จัดการสินค้า (CRUD) | เพิ่ม ลบ แก้ไข และอัปเดตข้อมูลสินค้าในแค็ตตาล็อก | High |
| A06 | จัดการคำสั่งซื้อ | อัปเดตและปรับปรุงสถานะออเดอร์ให้ลูกค้าทราบ | High |
| A07 | Dashboard | แสดงภาพรวมยอดการสั่งซื้อ รายได้ และจำนวนลูกค้า | Medium |

###  ฟังก์ชันการทำงานอัตโนมัติของระบบ (System)
| รหัส | ฟังก์ชัน (Function) | รายละเอียด | ความสำคัญ |
|---|---|---|---|
| S01 | ปรับลดสต๊อกสินค้า | จำนวนสินค้าในสต๊อกลดลงอัตโนมัติเมื่อเกิดการสั่งซื้อสำเร็จ | High |
| S02 | ตรวจสอบ Out of stock | ป้องกันการกดสั่งซื้อทันทีหากสินค้าในสต๊อกหมด | High |

---

##  การออกแบบและเทคโนโลยี (Design & Technologies)

โครงการนี้พัฒนาภายใต้สถาปัตยกรรม **MERN Stack** เพื่อให้ระบบมีความยืดหยุ่นและรวดเร็ว
* **Frontend:** `React.js`, `Bootstrap` (ออกแบบให้รองรับการใช้งานทุกขนาดหน้าจอ Responsive)
* **Backend:** `Node.js`, `Express.js` (ให้บริการ RESTful API)
* **Database:** `MongoDB`
* **UI/UX Design:** `Figma` (ออกแบบหน้าจอผู้ใช้งาน), `Draw.io` (เขียนแผนภาพ System Diagrams)
* **Version Control:** การทำงานร่วมกันเป็นทีมผ่าน `Git` และ `GitHub`

---
## USE CASEDIAGRAM
<p align="center">
  <img width="990" height="990" alt="use casediagram" src="https://github.com/user-attachments/assets/09523bb5-7196-4682-ad99-dfd7ee82f4fe" />
</p>

---
## 🗄️ โครงสร้างฐานข้อมูล (Database Schema)

```dbml
// นำโค้ดส่วนนี้ไปวางใน dbdiagram.io ได้เลย
Table users {
  id integer [primary key, increment]
  username varchar(50) [unique, not null]
  email varchar(100) [unique, not null]
  password_hash varchar(255) [not null]
  first_name varchar(50)
  last_name varchar(50)
  phone_number varchar(20)
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
  created_at timestamp [default: `now()` ]
  updated_at timestamp [default: `now()` ]
}

Table order_items {
  id integer [primary key, increment]
  order_id integer
  product_id integer
  variant_id integer [null]
  quantity integer [not null]
  price_per_unit decimal(10,2) [not null]
}

Table payments {
  id integer [primary key, increment]
  order_id integer [unique]
  payment_method varchar(50) [not null]
  payment_status varchar(30) [default: 'pending']
  transaction_id varchar(150)
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


---

##  การทดสอบระบบ (Testing Approach)

* **Manual Testing:** ทดสอบการทำงานพื้นฐานตามฟังก์ชัน เช่น จำลองการนำสินค้าใส่ตะกร้าและทดสอบ Flow การชำระเงิน
* **API Testing:** ตรวจสอบความถูกต้องของการรับส่งข้อมูล Backend API ด้วย `Postman`
* **Performance Testing:** ใช้ `JMeter` จำลองผู้ใช้งานจำนวนมากพร้อมกัน (Load Test) เพื่อวิเคราะห์ขีดจำกัดของระบบ
* **UAT (User Acceptance Testing):** ตรวจสอบความสมบูรณ์ของระบบก่อนนำขึ้นใช้งานจริง

---

##  การนำระบบขึ้นใช้งานและบำรุงรักษา (Deployment & Maintenance)

### การ Deployment
* **Frontend:** ติดตั้งระบบแสดงผลผ่าน `Vercel` เนื่องจากมีความเสถียรและเหมาะสมกับ React
* **Backend & Database:** ติดตั้งผ่าน `Render` หรือ `Heroku` พร้อมเชื่อมต่อกับระบบฐานข้อมูลแบบ Cloud

### แผนการบำรุงรักษา (Maintenance & SLA)
* **การตรวจสอบ (Monitoring):** ดูแลระบบหลังบ้านให้พร้อมรองรับผู้ใช้งานตลอดเวลา (ตั้งเป้า Uptime > 99.9%)
* **การจัดการแก้ไขข้อผิดพลาด:** 
  * **ปัญหาระดับวิกฤต (Critical):** เช่น ไม่สามารถเชื่อมต่อฐานข้อมูลได้ จะเร่งแก้ไขให้เสร็จสิ้นภายใน 4 ชั่วโมง
  * **ปัญหาทั่วไป (Medium/Low):** เช่น การแสดงผลคลาดเคลื่อนเล็กน้อย จะถูกรวบรวมเพื่ออัปเดตแก้ไขในรอบถัดไป
* **การสำรองข้อมูล (Backup):** มีแผนการสำรองฐานข้อมูลอย่างสม่ำเสมอเพื่อป้องกันข้อมูลสูญหาย
