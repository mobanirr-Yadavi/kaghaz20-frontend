# پیاده‌سازی مدیریت آدرس و Checkout جدید — Backend (ASP.NET Core)

## زمینه

فرانت (Next.js) فرایند Checkout را عوض کرده است. کاربر دیگر نام، موبایل و آدرس را دستی وارد نمی‌کند:

- نام و موبایل گیرنده از پروفایل کاربر خوانده می‌شود.
- کاربر یکی از آدرس‌های ذخیره‌شده‌اش را انتخاب می‌کند (یا آدرس جدید اضافه می‌کند).
- سفارش فقط با `addressId` و اقلام ثبت می‌شود.

کد فرانت آماده است، اما این سه endpoint روی سرور وجود ندارند و **404** می‌دهند:

- `GET /api-v1/Address/GetMyAddresses`
- `POST /api-v1/Address/Create`
- `POST /api-v1/Order/Create`

تا وقتی این‌ها پیاده‌سازی نشوند، ثبت سفارش در سایت کار نمی‌کند.

## قراردادهای فعلی پروژه (همین‌ها رعایت شود)

- مسیرها Action-based هستند: `/api-v1/{Controller}/{Action}`
- همه پاسخ‌ها در قالب فعلی باشند:
  `{ "isSuccess": bool, "time": "...", "data": ..., "message": "...", "errors": [] }`
- احراز هویت: JWT در هدر `Authorization: Bearer <token>`. بدون توکن معتبر ← **401** با همان پیام فعلی «احراز هویت الزامی است».
- CORS و بررسی Origin مثل endpointهای فعلی (`https://www.kaghaz20.ir` و `http://localhost:3000`).
- خطای اعتبارسنجی ← **400** با `isSuccess: false`، پیام فارسی در `message` و جزئیات در `errors`. فرانت `message` را مستقیم به کاربر نشان می‌دهد.

---

## ۱) موجودیت Address

| فیلد | نوع | توضیح |
|---|---|---|
| Id | Guid | |
| UserId | Guid/string | مالک آدرس (از توکن، نه از body) |
| Title | string, max 50 | مثل «خانه»، «محل کار» |
| Province | string, max 50 | استان |
| City | string, max 60 | شهر |
| FullAddress | string, max 400 | آدرس کامل |
| PostalCode | string(10) | فقط ۱۰ رقم انگلیسی |
| IsDefault | bool | هر کاربر حداکثر یک آدرس پیش‌فرض |
| CreatedAt | DateTime | |

## ۲) GET /api-v1/Address/GetMyAddresses

- فقط آدرس‌های **کاربر لاگین‌شده**.
- مرتب‌سازی: آدرس پیش‌فرض اول، بعد جدیدترین.
- اگر آدرسی نیست ← `data: []` (نه 404).

```json
{
  "isSuccess": true,
  "data": [
    {
      "id": "guid",
      "title": "خانه",
      "province": "تهران",
      "city": "تهران",
      "fullAddress": "خیابان ...",
      "postalCode": "1234567890",
      "isDefault": true
    }
  ]
}
```

## ۳) POST /api-v1/Address/Create

Body:

```json
{ "title": "خانه", "province": "تهران", "city": "تهران", "fullAddress": "آدرس کامل", "postalCode": "1234567890" }
```

اعتبارسنجی:

- title، province، city اجباری (بعد از Trim خالی نباشند).
- fullAddress حداقل ۱۰ کاراکتر.
- postalCode دقیقاً ۱۰ رقم (`^\d{10}$`). اگر ارقام فارسی آمد، قبل از بررسی به انگلیسی تبدیل شود.
- UserId فقط از توکن خوانده شود.

منطق:

- اگر اولین آدرس کاربر است ← `IsDefault = true`.
- (اختیاری) سقف تعداد آدرس، مثلاً ۲۰.

پاسخ: **آدرس ساخته‌شده همراه با `id`** در `data` (همان شکل آیتم GetMyAddresses). فرانت با همین id آدرس جدید را انتخاب می‌کند.

## ۴) POST /api-v1/Order/Create

Body:

```json
{
  "addressId": "guid",
  "items": [{ "productId": "guid", "quantity": 2 }],
  "shippingMethod": "express"
}
```

- `shippingMethod` یکی از `"express"` (پیک موتوری تهران) یا `"tipax"` (تیپاکس).

اعتبارسنجی:

- `addressId` باید وجود داشته باشد و **متعلق به همین کاربر باشد**. در غیر این صورت 400 یا 404 با پیام «آدرس انتخاب‌شده معتبر نیست.» (هرگز آدرس کاربر دیگر پذیرفته نشود.)
- `items` خالی نباشد، `quantity` ≥ 1، محصولات موجود باشند و موجودی کافی باشد (مثل منطق فعلی CreateOrder).
- `shippingMethod` یکی از مقادیر مجاز باشد.

منطق:

- مبلغ سفارش مثل الان **فقط از قیمت دیتابیس** محاسبه شود (قیمت از فرانت گرفته نمی‌شود).
- **Snapshot آدرس:** اطلاعات آدرس و گیرنده در لحظه ثبت، داخل خود سفارش کپی شود، نه فقط AddressId. اگر کاربر بعداً آدرس یا پروفایلش را ویرایش یا حذف کرد، سفارش‌های قبلی نباید تغییر کنند:
  - `ReceiverFullName` = FirstName + LastName پروفایل
  - `ReceiverPhoneNumber` = PhoneNumber پروفایل
  - `ShippingAddress` = متن کامل آدرس (عنوان، استان، شهر، آدرس، کد پستی)
  - `ShippingMethod`
  - (اختیاری) `AddressId` برای رفرنس

پاسخ: مثل CreateOrder فعلی، `data` شامل `id` سفارش باشد. فرانت بعد از آن `POST /api-v1/Payment/Request` با `{ "orderId": "..." }` را صدا می‌زند که **بدون تغییر** می‌ماند.

## ۵) سازگاری با پنل‌ها (مهم)

پنل ادمین و پنل کاربر در فرانت برای نمایش سفارش‌ها از این فیلدها استفاده می‌کنند:
`receiverFullName`، `receiverPhoneNumber`، `shippingAddress`، `status`، `totalAmount`، `createdAt`، `items`

پس این endpointها باید مثل قبل همین فیلدها را برگردانند (از روی Snapshot بخش ۴) و `shippingMethod` هم به پاسخ اضافه شود:
`Order/GetUserOrders`، `Order/GetUserOrdersPaged`، `Admin/GetAllOrders`، `Admin/GetOrdersPaged`

بدون این مورد، ستون نام گیرنده و جزئیات ارسال در پنل ادمین خالی نمایش داده می‌شود.

## ۶) دوره گذار

`Order/CreateOrder` فعلاً حذف نشود. بعد از اینکه Checkout جدید روی سایت پایدار شد، می‌توان آن را Deprecated کرد.

## ۷) اختیاری (برای مدیریت آدرس در پروفایل؛ فرانت فعلاً استفاده نمی‌کند)

- `PUT /api-v1/Address/Update/{id}` (فقط آدرس خود کاربر)
- `DELETE /api-v1/Address/Delete/{id}` (Soft delete تا سفارش‌های قدیمی سالم بمانند)
- `POST /api-v1/Address/SetDefault/{id}`

## چک‌لیست تست

- [ ] بدون توکن ← هر سه endpoint جواب 401 بدهند.
- [ ] کاربر بدون آدرس ← GetMyAddresses جواب `data: []` بدهد.
- [ ] Create با کد پستی ۹ رقمی ← 400 با پیام فارسی.
- [ ] اولین آدرس ← `isDefault: true`.
- [ ] Create، `id` آدرس جدید را برگرداند.
- [ ] Order/Create با addressId کاربر دیگر ← رد شود.
- [ ] مبلغ سفارش از دیتابیس محاسبه شود.
- [ ] بعد از ویرایش یا حذف آدرس، سفارش قبلی همان آدرس قدیمی را نشان دهد.
- [ ] Admin/GetOrdersPaged، `receiverFullName`، `shippingAddress` و `shippingMethod` را برگرداند.
- [ ] Payment/Request با orderId جدید مثل قبل کار کند.

## فایل‌های مرتبط در فرانت

- `components/cart/CheckoutForm.tsx` — Checkout، انتخاب آدرس و ثبت سفارش
- `components/cart/AddressModal.tsx` — فرم افزودن آدرس
- `lib/addresses.ts` — فراخوانی APIهای آدرس و پروفایل
