// ==========================================
// 🤖 مساعد الأفق - AI.JS
// نسخة كاملة ومتوافقة مع products.json
// ==========================================


// ==========================================
// 🧠 ذاكرة آخر منتج
// ==========================================

let aiLastProduct = null;


// ==========================================
// 📦 الحصول على المنتجات
// ==========================================

function getAIProducts() {

    if (
        typeof products !== "undefined" &&
        Array.isArray(products)
    ) {
        return products;
    }

    return [];
}


// ==========================================
// 🔢 الحصول على الكمية
// ==========================================

function getAIQuantity(product) {

    if (!product) {
        return 0;
    }

    const value = Number(product.quantity);

    return Number.isFinite(value) ? value : 0;
}


// ==========================================
// 💰 سعر الشراء
// ==========================================

function getAIBuyPrice(product) {

    if (!product) {
        return 0;
    }

    const fields = [
        "purchase_price",
        "purchasePrice",
        "buyPrice",
        "costPrice",
        "cost",
        "buy"
    ];

    for (const field of fields) {

        if (
            product[field] !== undefined &&
            product[field] !== null &&
            product[field] !== ""
        ) {

            const value = Number(product[field]);

            if (Number.isFinite(value)) {
                return value;
            }
        }
    }

    return 0;
}


// ==========================================
// 💵 سعر البيع
// ==========================================

function getAISellPrice(product) {

    if (!product) {
        return 0;
    }

    const fields = [
        "sale_price",
        "salePrice",
        "sellPrice",
        "sellingPrice",
        "price",
        "sell"
    ];

    for (const field of fields) {

        if (
            product[field] !== undefined &&
            product[field] !== null &&
            product[field] !== ""
        ) {

            const value = Number(product[field]);

            if (Number.isFinite(value)) {
                return value;
            }
        }
    }

    return 0;
}


// ==========================================
// 📈 ربح القطعة
// ==========================================

function getAIProfit(product) {

    const sale =
        getAISellPrice(product);

    const purchase =
        getAIBuyPrice(product);

    return sale - purchase;
}


// ==========================================
// 📊 ربح كامل الكمية
// ==========================================

function getAITotalProductProfit(product) {

    const quantity =
        getAIQuantity(product);

    const profit =
        getAIProfit(product);

    return profit * quantity;
}


// ==========================================
// 🔢 تنسيق الأرقام
// ==========================================

function formatAINumber(number) {

    const value = Number(number);

    if (!Number.isFinite(value)) {
        return "0";
    }

    return value.toLocaleString("ar-IQ");
}


// ==========================================
// 🛡️ حماية النص
// ==========================================

function escapeAIText(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// 🔤 توحيد النص العربي
// ==========================================

function normalizeArabic(text) {

    return String(text || "")
        .toLowerCase()

        // إزالة التشكيل
        .replace(/[\u064B-\u065F\u0670]/g, "")

        // توحيد الألف
        .replace(/[إأآٱ]/g, "ا")

        // توحيد الياء
        .replace(/ى/g, "ي")

        // توحيد التاء المربوطة
        .replace(/ة/g, "ه")

        // توحيد بعض أشكال الهمزة
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")

        // إزالة علامات الترقيم
        .replace(/[؟?!.,،؛:()[\]{}"'`]/g, " ")

        // إزالة المسافات الزائدة
        .replace(/\s+/g, " ")

        .trim();
}


// ==========================================
// 🚫 كلمات لا تعتبر اسم منتج
// ==========================================

function getAIStopWords() {

    return [

        "كم",
        "شكد",
        "شنو",
        "شنو",
        "ما",
        "ماذا",
        "متى",
        "وين",
        "اين",
        "وينه",
        "هل",
        "هو",
        "هي",

        "اريد",
        "أريد",
        "اعرف",
        "اعرفلي",
        "خبرني",
        "قللي",

        "سعر",
        "السعر",
        "اسعار",
        "الاسعار",
        "بكم",
        "يكلف",
        "تكلف",

        "كمية",
        "كميه",
        "الكميه",
        "الكمية",

        "باقي",
        "المتبقي",
        "متبقي",
        "موجود",
        "موجوده",
        "موجودة",
        "متوفر",
        "متوفره",
        "متوفرة",

        "ربح",
        "الربح",
        "ارباح",
        "الارباح",
        "ربحي",

        "قطعة",
        "قطعه",
        "قطع",
        "القطع",

        "منتج",
        "المنتج",
        "منتجات",
        "المنتجات",

        "صنف",
        "الصنف",
        "اصناف",
        "الاصناف",

        "مخزون",
        "المخزون",
        "مخزوني",

        "بضاعة",
        "البضاعة",
        "بضاعه",
        "البضاعه",

        "قليل",
        "قليله",
        "قليلة",
        "قليلين",

        "نافد",
        "نافده",
        "نافدة",
        "نفد",
        "ناقص",

        "خلص",
        "خلصت",
        "منتهي",

        "منه",
        "منها",
        "هذا",
        "هذه",

        "عندي",
        "عندك",
        "عندكم",
        "عندنا",

        "الي",
        "اللي",
        "الذي",
        "التي",

        "من",
        "عن",
        "في",
        "الى",
        "إلى",
        "على",
        "و",
        "او",
        "أو"
    ];
}


// ==========================================
// 🧹 تنظيف كلمات السؤال
// ==========================================

function cleanAIWords(words) {

    const stopWords =
        getAIStopWords();

    return words.filter(word => {

        if (!word) {
            return false;
        }

        if (word.length < 2) {
            return false;
        }

        return !stopWords.includes(word);

    });
}
// ==========================================
// 🔎 البحث عن المنتج
// ==========================================

function findAIProduct(question) {

    const productsList = getAIProducts();

    if (!productsList.length) {
        return null;
    }

    const normalizedQuestion =
        normalizeArabic(question);

    // ------------------------------------------
    // البحث بالاسم الكامل أولاً
    // ------------------------------------------

    let bestProduct = null;
    let bestScore = 0;

    for (const product of productsList) {

        if (!product || !product.name) {
            continue;
        }

        const productName =
            normalizeArabic(product.name);

        if (!productName) {
            continue;
        }

        let score = 0;

        // تطابق الاسم الكامل
        if (normalizedQuestion.includes(productName)) {
            score = productName.length + 100;
        }

        // --------------------------------------
        // تقسيم اسم المنتج إلى كلمات
        // --------------------------------------

        const productWords =
            cleanAIWords(productName.split(" "));

        const questionWords =
            normalizedQuestion.split(" ");

        for (const productWord of productWords) {

            if (questionWords.includes(productWord)) {
                score += productWord.length + 5;
            }

            // تطابق جزئي للكلمات الطويلة
            if (
                productWord.length >= 3 &&
                normalizedQuestion.includes(productWord)
            ) {
                score += productWord.length;
            }
        }

        // --------------------------------------
        // اختيار أفضل منتج
        // --------------------------------------

        if (score > bestScore) {

            bestScore = score;
            bestProduct = product;
        }
    }

    // ------------------------------------------
    // لا نعتبر التطابق الضعيف منتجاً
    // ------------------------------------------

    if (bestScore < 5) {
        return null;
    }

    aiLastProduct = bestProduct;

    return bestProduct;
}


// ==========================================
// 🧠 الحصول على المنتج من الذاكرة
// ==========================================

function getAILastProduct() {

    if (
        aiLastProduct &&
        typeof aiLastProduct === "object"
    ) {
        return aiLastProduct;
    }

    return null;
}


// ==========================================
// 🔍 هل السؤال عن المنتج السابق؟
// ==========================================

function isAIReferenceQuestion(question) {

    const q =
        normalizeArabic(question);

    const words = [

        "منه",
        "منها",
        "هذا",
        "هذه",
        "المنتج",
        "المنتج السابق",
        "نفس المنتج",
        "هذا المنتج",
        "هاي",
        "هذا الصنف",
        "هالصنف"
    ];

    return words.some(word =>
        q.includes(word)
    );
}


// ==========================================
// 💰 تحديد نوع السؤال
// ==========================================

function getAIIntent(question) {

    const q =
        normalizeArabic(question);

    // ------------------------------------------
    // تحية
    // ------------------------------------------

    if (
        q === "هلا" ||
        q === "هلا بيك" ||
        q === "السلام عليكم" ||
        q === "سلام عليكم" ||
        q === "مرحبا" ||
        q === "اهلا" ||
        q === "اهلا وسهلا" ||
        q === "هلو" ||
        q === "شلونك" ||
        q === "كيفك"
    ) {
        return "greeting";
    }


    // ------------------------------------------
    // عدد المنتجات
    // ------------------------------------------

    if (
        q.includes("عدد المنتجات") ||
        q.includes("عدد المنتج") ||
        q.includes("شكد منتج") ||
        q.includes("كم منتج") ||
        q.includes("شكد صنف") ||
        q.includes("كم صنف") ||
        q.includes("عدد الاصناف") ||
        q.includes("عدد الاصناف")
    ) {
        return "count_products";
    }


    // ------------------------------------------
    // مجموع القطع
    // ------------------------------------------

    if (
        q.includes("مجموع القطع") ||
        q.includes("مجموع الكميات") ||
        q.includes("مجموع الكميه") ||
        q.includes("مجموع الكمية") ||
        q.includes("شكد قطعة") ||
        q.includes("شكد قطعه") ||
        q.includes("كم قطعة") ||
        q.includes("كم قطعه") ||
        q.includes("شكد عندي قطعة") ||
        q.includes("شكد عندي قطعه") ||
        q.includes("مجموع البضاعة") ||
        q.includes("مجموع البضاعه")
    ) {
        return "total_quantity";
    }


    // ------------------------------------------
    // قيمة المخزون
    // ------------------------------------------

    if (
        q.includes("قيمة المخزون") ||
        q.includes("قيمه المخزون") ||
        q.includes("قيمة البضاعة") ||
        q.includes("قيمه البضاعه") ||
        q.includes("قيمة البضاعه") ||
        q.includes("قيمة مخزوني") ||
        q.includes("شكد قيمة المخزون") ||
        q.includes("شكد قيمه المخزون")
    ) {
        return "stock_value";
    }


    // ------------------------------------------
    // الربح المتوقع
    // ------------------------------------------

    if (
        q.includes("الربح المتوقع") ||
        q.includes("ربح المخزون") ||
        q.includes("ربح البضاعة") ||
        q.includes("ربح البضاعه") ||
        q.includes("ارباح المخزون") ||
        q.includes("ارباح البضاعة") ||
        q.includes("ارباح البضاعه") ||
        q.includes("شكد الربح الكلي") ||
        q.includes("كم الربح الكلي") ||
        q.includes("مجموع الربح")
    ) {
        return "total_profit";
    }


    // ------------------------------------------
    // المنتجات النافدة
    // ------------------------------------------

    if (
        q.includes("المنتجات النافدة") ||
        q.includes("المنتجات النافده") ||
        q.includes("المنتجات التي نفدت") ||
        q.includes("المنتجات الي نفدت") ||
        q.includes("شنو النافد") ||
        q.includes("شنو النافده") ||
        q.includes("شنو الي خلص") ||
        q.includes("شنو اللي خلص") ||
        q.includes("شنو المنتجات الخالصة") ||
        q.includes("الاصناف النافدة")
    ) {
        return "out_of_stock";
    }


    // ------------------------------------------
    // المنتجات قليلة المخزون
    // ------------------------------------------

    if (
        q.includes("قليلة المخزون") ||
        q.includes("قليله المخزون") ||
        q.includes("قليل المخزون") ||
        q.includes("المنتجات القليلة") ||
        q.includes("المنتجات القليله") ||
        q.includes("اصناف قليلة") ||
        q.includes("اصناف قليله") ||
        q.includes("شنو قليل") ||
        q.includes("شنو القليل") ||
        q.includes("قرب يخلص") ||
        q.includes("قربت تخلص")
    ) {
        return "low_stock";
    }


    // ------------------------------------------
    // سعر الشراء
    // ------------------------------------------

    if (
        q.includes("سعر الشراء") ||
        q.includes("سعر شراء") ||
        q.includes("سعر التكلفة") ||
        q.includes("سعر تكلفه") ||
        q.includes("سعر كلفته") ||
        q.includes("سعر كلفه")
    ) {
        return "purchase_price";
    }


    // ------------------------------------------
    // سعر البيع
    // ------------------------------------------

    if (
        q.includes("سعر البيع") ||
        q.includes("سعر بيع") ||
        q.includes("بكم") ||
        q.includes("يكلف") ||
        q.includes("تكلف")
    ) {
        return "sale_price";
    }


    // ------------------------------------------
    // الربح
    // ------------------------------------------

    if (
        q.includes("شكد ربحه") ||
        q.includes("كم ربحه") ||
        q.includes("شكد الربح") ||
        q.includes("كم الربح") ||
        q.includes("ربحه") ||
        q.includes("ربح القطعة") ||
        q.includes("ربح القطعه") ||
        q.includes("الربح")
    ) {
        return "profit";
    }


    // ------------------------------------------
    // الكمية / المتبقي
    // ------------------------------------------

    if (
        q.includes("كم باقي") ||
        q.includes("شكد باقي") ||
        q.includes("كم متبقي") ||
        q.includes("شكد متبقي") ||
        q.includes("كمية") ||
        q.includes("كميه") ||
        q.includes("المتبقي") ||
        q.includes("باقي منه") ||
        q.includes("باقي منها") ||
        q.includes("شكد عندي") ||
        q.includes("كم عندي")
    ) {
        return "quantity";
    }


    // ------------------------------------------
    // التوفر
    // ------------------------------------------

    if (
        q.includes("موجود") ||
        q.includes("موجوده") ||
        q.includes("موجودة") ||
        q.includes("متوفر") ||
        q.includes("متوفره") ||
        q.includes("متوفرة") ||
        q.includes("عندي منه") ||
        q.includes("عندي منها")
    ) {
        return "availability";
    }


    // ------------------------------------------
    // معلومات المنتج
    // ------------------------------------------

    if (
        q.includes("معلومات") ||
        q.includes("تفاصيل") ||
        q.includes("بيانات") ||
        q.includes("شنو هذا")
    ) {
        return "product_info";
    }


    // ------------------------------------------
    // سؤال عام عن السعر
    // ------------------------------------------

    if (
        q.includes("السعر") ||
        q.includes("سعره") ||
        q.includes("سعرها") ||
        q.includes("اسعار") ||
        q.includes("الاسعار")
    ) {
        return "sale_price";
    }


    return "unknown";
}


// ==========================================
// 🧮 حساب إحصائيات المخزون
// ==========================================

function getAIStockStats() {

    const list =
        getAIProducts();

    let totalQuantity = 0;
    let stockValue = 0;
    let totalProfit = 0;

    for (const product of list) {

        const quantity =
            getAIQuantity(product);

        const buy =
            getAIBuyPrice(product);

        const profit =
            getAIProfit(product);

        totalQuantity += quantity;

        stockValue +=
            buy * quantity;

        totalProfit +=
            profit * quantity;
    }

    return {

        productCount: list.length,

        totalQuantity:
            totalQuantity,

        stockValue:
            stockValue,

        totalProfit:
            totalProfit
    };
}
// ==========================================
// 🤖 توليد إجابة مساعد الأفق
// ==========================================

function generateAIAnswer(question) {

    const q =
        normalizeArabic(question);

    const productsList =
        getAIProducts();

    // ======================================
    // لا توجد منتجات
    // ======================================

    if (!productsList.length) {

        return `
            <div class="ai-message ai-bot">
                📦 لا توجد منتجات حالياً في المخزون.
            </div>
        `;
    }


    // ======================================
    // تحديد نوع السؤال
    // ======================================

    const intent =
        getAIIntent(question);


    // ======================================
    // التحية
    // ======================================

    if (intent === "greeting") {

        return `
            <div class="ai-message ai-bot">
                👋 أهلاً وسهلاً بيك في <strong>مساعد الأفق</strong> 🌹
                <br><br>
                شلون أگدر أساعدك؟
                <br>
                أگدر أخبرك عن:
                <br>💰 الأسعار
                <br>📦 الكميات
                <br>📊 المخزون
                <br>📈 الأرباح
                <br>⚠️ المنتجات القليلة
                <br>❌ المنتجات النافدة
            </div>
        `;
    }


    // ======================================
    // عدد المنتجات
    // ======================================

    if (intent === "count_products") {

        const count =
            productsList.length;

        return `
            <div class="ai-message ai-bot">
                📦 عدد المنتجات الموجودة عندك هو:
                <br><br>
                <strong>${formatAINumber(count)} منتج</strong>
            </div>
        `;
    }


    // ======================================
    // مجموع القطع
    // ======================================

    if (intent === "total_quantity") {

        const stats =
            getAIStockStats();

        return `
            <div class="ai-message ai-bot">
                📦 مجموع القطع الموجودة بالمخزون:
                <br><br>
                <strong>${formatAINumber(stats.totalQuantity)} قطعة</strong>
            </div>
        `;
    }


    // ======================================
    // قيمة المخزون
    // ======================================

    if (intent === "stock_value") {

        const stats =
            getAIStockStats();

        return `
            <div class="ai-message ai-bot">
                💰 قيمة المخزون بسعر الشراء:
                <br><br>
                <strong>${formatAINumber(stats.stockValue)} د.ع</strong>
            </div>
        `;
    }


    // ======================================
    // الربح المتوقع
    // ======================================

    if (intent === "total_profit") {

        const stats =
            getAIStockStats();

        return `
            <div class="ai-message ai-bot">
                📈 الربح المتوقع من بيع كامل المخزون:
                <br><br>
                <strong>${formatAINumber(stats.totalProfit)} د.ع</strong>
            </div>
        `;
    }


    // ======================================
    // المنتجات قليلة المخزون
    // ======================================

    if (intent === "low_stock") {

        const lowStock =
            productsList.filter(product => {

                const quantity =
                    getAIQuantity(product);

                return quantity > 0 && quantity <= 5;
            });


        if (!lowStock.length) {

            return `
                <div class="ai-message ai-bot">
                    ✅ حالياً ماكو منتجات قليلة المخزون.
                </div>
            `;
        }


        let html = `
            <div class="ai-message ai-bot">
                ⚠️ المنتجات قليلة المخزون:
                <br><br>
        `;


        lowStock.forEach((product, index) => {

            html += `
                <div style="
                    margin:6px 0;
                    padding:8px;
                    border-radius:8px;
                    background:rgba(255,193,7,0.12);
                ">
                    ${index + 1}. 
                    <strong>
                        ${escapeAIText(product.name)}
                    </strong>
                    <br>
                    📦 المتبقي:
                    <strong>
                        ${formatAINumber(
                            getAIQuantity(product)
                        )}
                    </strong>
                    قطعة
                </div>
            `;
        });


        html += `
            </div>
        `;

        return html;
    }


    // ======================================
    // المنتجات النافدة
    // ======================================

    if (intent === "out_of_stock") {

        const outOfStock =
            productsList.filter(product => {

                return getAIQuantity(product) <= 0;
            });


        if (!outOfStock.length) {

            return `
                <div class="ai-message ai-bot">
                    ✅ ماكو منتجات نافدة حالياً.
                </div>
            `;
        }


        let html = `
            <div class="ai-message ai-bot">
                ❌ المنتجات النافدة:
                <br><br>
        `;


        outOfStock.forEach((product, index) => {

            html += `
                <div style="
                    margin:6px 0;
                    padding:8px;
                    border-radius:8px;
                    background:rgba(220,53,69,0.12);
                ">
                    ${index + 1}.
                    <strong>
                        ${escapeAIText(product.name)}
                    </strong>
                </div>
            `;
        });


        html += `
            </div>
        `;

        return html;
    }


    // ======================================
    // البحث عن المنتج
    // ======================================

    let product =
        findAIProduct(question);


    // ======================================
    // إذا ما وجد المنتج
    // ======================================

    if (!product) {

        // محاولة استخدام آخر منتج
        if (
            isAIReferenceQuestion(question) &&
            getAILastProduct()
        ) {
            product =
                getAILastProduct();
        }
    }


    // ======================================
    // إذا بقي بدون منتج
    // ======================================

    if (!product) {

        return `
            <div class="ai-message ai-bot">
                🤔 ما قدرت أحدد المنتج المقصود.
                <br><br>
                اكتب اسم المنتج مثل:
                <br>
                <strong>سعر دفتر 100 ورقة</strong>
                <br>
                أو:
                <br>
                <strong>شكد باقي من دفتر 100 ورقة؟</strong>
            </div>
        `;
    }


    // ======================================
    // بيانات المنتج
    // ======================================

    const name =
        escapeAIText(product.name);

    const quantity =
        getAIQuantity(product);

    const purchasePrice =
        getAIBuyPrice(product);

    const salePrice =
        getAISellPrice(product);

    const profit =
        getAIProfit(product);

    const totalProfit =
        getAITotalProductProfit(product);


    // ======================================
    // سعر الشراء
    // ======================================

    if (intent === "purchase_price") {

        return `
            <div class="ai-message ai-bot">
                📦 المنتج:
                <strong>${name}</strong>
                <br><br>
                💰 سعر الشراء:
                <strong>
                    ${formatAINumber(purchasePrice)} د.ع
                </strong>
            </div>
        `;
    }


    // ======================================
    // سعر البيع
    // ======================================

    if (intent === "sale_price") {

        return `
            <div class="ai-message ai-bot">
                📦 المنتج:
                <strong>${name}</strong>
                <br><br>
                💵 سعر البيع:
                <strong>
                    ${formatAINumber(salePrice)} د.ع
                </strong>
            </div>
        `;
    }


    // ======================================
    // الكمية
    // ======================================

    if (intent === "quantity") {

        return `
            <div class="ai-message ai-bot">
                📦 المنتج:
                <strong>${name}</strong>
                <br><br>
                🔢 المتبقي بالمخزون:
                <strong>
                    ${formatAINumber(quantity)}
                </strong>
                قطعة
            </div>
        `;
    }


    // ======================================
    // التوفر
    // ======================================

    if (intent === "availability") {

        if (quantity > 0) {

            return `
                <div class="ai-message ai-bot">
                    ✅ نعم، المنتج
                    <strong>${name}</strong>
                    متوفر.
                    <br><br>
                    📦 المتبقي:
                    <strong>
                        ${formatAINumber(quantity)}
                    </strong>
                    قطعة
                </div>
            `;
        }


        return `
            <div class="ai-message ai-bot">
                ❌ للأسف المنتج
                <strong>${name}</strong>
                نافد حالياً.
            </div>
        `;
    }


    // ======================================
    // الربح
    // ======================================

    if (intent === "profit") {

        return `
            <div class="ai-message ai-bot">
                📦 المنتج:
                <strong>${name}</strong>
                <br><br>
                💵 سعر البيع:
                ${formatAINumber(salePrice)} د.ع
                <br>
                💰 سعر الشراء:
                ${formatAINumber(purchasePrice)} د.ع
                <br><br>
                📈 ربح القطعة:
                <strong>
                    ${formatAINumber(profit)} د.ع
                </strong>
                <br>
                📊 ربح الكمية الموجودة:
                <strong>
                    ${formatAINumber(totalProfit)} د.ع
                </strong>
            </div>
        `;
    }


    // ======================================
    // معلومات المنتج
    // ======================================

    if (intent === "product_info") {

        return `
            <div class="ai-message ai-bot">

                📦 <strong>${name}</strong>

                <br><br>

                🏷️ التصنيف:
                <strong>
                    ${escapeAIText(
                        product.category || "غير محدد"
                    )}
                </strong>

                <br><br>

                💰 سعر الشراء:
                <strong>
                    ${formatAINumber(purchasePrice)} د.ع
                </strong>

                <br>

                💵 سعر البيع:
                <strong>
                    ${formatAINumber(salePrice)} د.ع
                </strong>

                <br>

                📦 الكمية:
                <strong>
                    ${formatAINumber(quantity)}
                </strong>

                <br>

                📈 ربح القطعة:
                <strong>
                    ${formatAINumber(profit)} د.ع
                </strong>

            </div>
        `;
    }


    // ======================================
    // سؤال غير محدد لكن يوجد منتج
    // ======================================

    return `
        <div class="ai-message ai-bot">

            📦 <strong>${name}</strong>

            <br><br>

            💵 سعر البيع:
            <strong>
                ${formatAINumber(salePrice)} د.ع
            </strong>

            <br>

            📦 المتوفر:
            <strong>
                ${formatAINumber(quantity)}
            </strong>
            قطعة

            <br>

            📈 ربح القطعة:
            <strong>
                ${formatAINumber(profit)} د.ع
            </strong>

        </div>
    `;
}
// ==========================================
// 🤖 فتح مساعد الأفق
// ==========================================

function openAI() {

    const content =
        document.getElementById("content");

    if (!content) {

        alert("لم يتم العثور على منطقة المحتوى");

        return;
    }


    content.innerHTML = `

        <div class="ai-container">

            <div class="ai-header">

                <h2>🤖 مساعد الأفق</h2>

                <p>
                    مساعدك الذكي لإدارة منتجات
                    ومخزون مكتبة الأفق
                </p>

            </div>


            <div
                id="aiMessages"
                class="ai-messages"
            >

                <div class="ai-message ai-bot">

                    👋 أهلاً وسهلاً بيك 🌹

                    <br><br>

                    أنا <strong>مساعد الأفق</strong> 🤖

                    <br>

                    أگدر أساعدك بمعرفة:

                    <br>💰 أسعار المنتجات

                    <br>📦 الكميات والمخزون

                    <br>📈 الأرباح

                    <br>⚠️ المنتجات قليلة المخزون

                    <br>❌ المنتجات النافدة

                    <br><br>

                    جرّب اكتب:
                    <br>

                    <strong>
                        شكد سعر دفتر 100 ورقة؟
                    </strong>

                </div>

            </div>


            <div class="ai-examples">

                <button
                    onclick="aiExample('عدد المنتجات')"
                >
                    📦 عدد المنتجات
                </button>

                <button
                    onclick="aiExample('شكد باقي من دفتر 100 ورقة ديلوكس؟')"
                >
                    🔢 كمية دفتر
                </button>

                <button
                    onclick="aiExample('سعر دفتر 100 ورقة ديلوكس')"
                >
                    💰 سعر منتج
                </button>

                <button
                    onclick="aiExample('شكد ربح دفتر 100 ورقة ديلوكس؟')"
                >
                    📈 ربح منتج
                </button>

                <button
                    onclick="aiExample('شنو المنتجات قليلة المخزون؟')"
                >
                    ⚠️ قليل المخزون
                </button>

            </div>


            <div class="ai-input-area">

                <input
                    type="text"
                    id="aiInput"
                    placeholder="اكتب سؤالك هنا..."
                    autocomplete="off"
                >

                <button
                    type="button"
                    onclick="askAI()"
                >
                    إرسال 🚀
                </button>

            </div>


            <button
                type="button"
                onclick="showProducts()"
                class="ai-back-button"
            >
                🔙 العودة للمنتجات
            </button>

        </div>
    `;


    // ======================================
    // التركيز على حقل الإدخال
    // ======================================

    const input =
        document.getElementById("aiInput");

    if (input) {

        input.focus();


        // إرسال بالضغط على Enter

        input.addEventListener(
            "keydown",
            function(event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    askAI();
                }
            }
        );
    }
}


// ==========================================
// 📝 إرسال سؤال جاهز
// ==========================================

function aiExample(question) {

    const input =
        document.getElementById("aiInput");

    if (!input) {
        return;
    }

    input.value = question;

    input.focus();

    askAI();
}


// ==========================================
// 🚀 إرسال السؤال
// ==========================================

function askAI() {

    const input =
        document.getElementById("aiInput");

    const messages =
        document.getElementById("aiMessages");


    if (!input || !messages) {

        return;
    }


    const question =
        input.value.trim();


    if (!question) {

        return;
    }


    // ======================================
    // عرض سؤال المستخدم
    // ======================================

    const userMessage =
        document.createElement("div");

    userMessage.className =
        "ai-message ai-user";

    userMessage.textContent =
        question;

    messages.appendChild(userMessage);


    // ======================================
    // تفريغ الحقل
    // ======================================

    input.value = "";


    // ======================================
    // توليد الإجابة
    // ======================================

    const answer =
        generateAIAnswer(question);


    // ======================================
    // عرض الإجابة
    // ======================================

    const botMessage =
        document.createElement("div");

    botMessage.className =
        "ai-message ai-bot";

    botMessage.innerHTML =
        answer.replace(
            /^<div class="ai-message ai-bot">/,
            ""
        ).replace(
            /<\/div>$/,
            ""
        );


    messages.appendChild(botMessage);


    // ======================================
    // النزول إلى آخر المحادثة
    // ======================================

    messages.scrollTop =
        messages.scrollHeight;
}


// ==========================================
// 🧹 مسح ذاكرة المنتج
// ==========================================

function clearAIMemory() {

    aiLastProduct = null;
}


// ==========================================
// 📊 تحديث المساعد بعد تعديل المنتجات
// ==========================================

function refreshAI() {

    aiLastProduct = null;

    const messages =
        document.getElementById("aiMessages");

    if (!messages) {
        return;
    }

    messages.innerHTML = `

        <div class="ai-message ai-bot">

            🔄 تم تحديث بيانات المساعد.

            <br><br>

            أصبحت معلومات المنتجات والمخزون
            محدثة الآن ✅

        </div>

    `;
}


// ==========================================
// 🧪 اختبار سريع للمساعد
// ==========================================

function testAI() {

    const list =
        getAIProducts();

    console.log(
        "🤖 مساعد الأفق"
    );

    console.log(
        "عدد المنتجات:",
        list.length
    );

    if (list.length) {

        const product =
            list[0];

        console.log(
            "أول منتج:",
            product.name
        );

        console.log(
            "سعر الشراء:",
            getAIBuyPrice(product)
        );

        console.log(
            "سعر البيع:",
            getAISellPrice(product)
        );

        console.log(
            "الكمية:",
            getAIQuantity(product)
        );

        console.log(
            "ربح القطعة:",
            getAIProfit(product)
        );
    }
}