# NutriPlan — Project Notes

## 1. How I Run the Project

I developed and tested the frontend locally using **VS Code Live Server**.

I also created a **Node.js + Express backend** to handle nutrition and product API requests.

**Local URLs:**
- Frontend: `http://127.0.0.1:5500`
- Backend: `http://localhost:3000`

> ملاحظة: الـ Frontend بيشتغل عن طريق Live Server، والـ Backend لازم يكون شغال علشان بيانات التغذية والمنتجات تظهر.

## 2. API Integration

I used the following APIs:

- **TheMealDB:** Meal information and recipes.
- **USDA FoodData Central:** Nutrition information.
- **Open Food Facts:** Product search and barcode lookup.

The USDA API key is stored in a `.env` file for security.

> ملاحظة: استخدمت Backend علشان أتعامل مع الـ APIs، وأخلي الـ API Key بعيد عن كود الـ Frontend.


## 3. Running the Project Locally

The project requires **Node.js** and **VS Code Live Server**.

### Step 1: Install Dependencies

Open the project folder in VS Code, then open the terminal and run:

```bash
npm install
```

This command installs the required packages inside `node_modules`.

> ملاحظة: فولدر `node_modules` مش موجود في ملفات التسليم لأنه كبير، لكن المصحح يقدر ينزّله باستخدام الأمر ده.

### Step 2: Configure the API Key

Create a `.env` file inside the `server` folder.

Use `.env.example` as a reference and add your own USDA API key.

> ملاحظة: ملف `.env` الأصلي مش موجود في التسليم لحماية الـ API Key.

### Step 3: Start the Backend

Run:

```bash
npm start
```

Backend URL: `http://localhost:3000`

### Step 4: Start the Frontend

Open `index.html` using the **VS Code Live Server** extension.

Frontend URL: `http://127.0.0.1:5500`

> ملاحظة: لازم الـ Backend والـ Live Server يكونوا شغالين مع بعض. فتح `index.html` بدبل كليك مش كفاية لأن المشروع بيستخدم JavaScript ES Modules.

## 4. Files Excluded from Submission

The following files and folders are not included in the ZIP:

- `node_modules/` — Can be recreated using `npm install`.
- `.env` — Contains private API credentials.
- `.git/` — Local Git history, if present.

The following files are included:

- `package.json`
- `package-lock.json`
- `.env.example`
- `server/`
- `src/`
- `index.html`

> ملاحظة: استبعدت الملفات اللي مش ضرورية للتسليم أو اللي فيها بيانات خاصة، لكن سيبت كل الملفات المطلوبة لتشغيل المشروع.

## 5. Data Storage

Food Log data is saved in the browser using **LocalStorage**.

No database is required.

> ملاحظة: البيانات بتتحفظ في نفس المتصفح، يعني لو فتحت المشروع من متصفح تاني مش هتلاقي نفس الـ Food Log.