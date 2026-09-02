// ==========================================
// 📚 مكتبة الأفق للقرطاسية
// APP.JS
// ==========================================

// ==========================================
// 📦 المنتجات
// ==========================================

let products = [];

// ==========================================
// 🧾 المبيعات
// ==========================================

let sales = [];

// ==========================================
// 🔑 مفاتيح التخزين
// ==========================================

const PRODUCTS_STORAGE_KEY = "alafaq_products";
const SALES_STORAGE_KEY = "alafaq_sales";

// ==========================================
// 📥 تحميل المبيعات
// ==========================================

const savedSales = localStorage.getItem(SALES_STORAGE_KEY);

if (savedSales) {

    try {

        sales = JSON.parse(savedSales);

        if (!Array.isArray(sales)) {
            sales = [];
        }

    } catch (error) {

        console.error("خطأ في قراءة سجل المبيعات:", error);

        sales = [];

    }

}

// ==========================================
// 📦 تحميل المنتجات
// ==========================================

const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);

if (savedProducts) {

    try {

        products = JSON.parse(savedProducts);

        if (!Array.isArray(products)) {
            products = [];
        }

        showProducts();

    } catch (error) {

        console.error("خطأ في قراءة المنتجات:", error);

        loadProductsFromJSON();

    }

} else {

    loadProductsFromJSON();

}
// ==========================================
// 🌐 تحميل المنتجات من JSON
// ==========================================

function loadProductsFromJSON() {

    fetch("products.json")

        .then(response => {

            if (!response.ok) {
                throw new Error("فشل تحميل products.json");
            }

            return response.json();

        })

        .then(data => {

            products = Array.isArray(data) ? data : [];

            saveProducts();

            showProducts();

        })

        .catch(error => {

            console.error("خطأ في تحميل المنتجات:", error);

            const content = document.getElementById("content");

            if (content) {

                content.innerHTML = `
                    <h2>⚠️ خطأ</h2>
                    <p>تعذر تحميل المنتجات.</p>
                    <p>تأكد من وجود ملف <strong>products.json</strong></p>
                `;

            }

        });

}

// ==========================================
// 💾 حفظ المنتجات
// ==========================================

function saveProducts() {

    localStorage.setItem(
        PRODUCTS_STORAGE_KEY,
        JSON.stringify(products)
    );

}

// ==========================================
// 💾 حفظ المبيعات
// ==========================================

function saveSales() {

    localStorage.setItem(
        SALES_STORAGE_KEY,
        JSON.stringify(sales)
    );

}

// ==========================================
// 🔢 تنسيق الأرقام
// ==========================================

function formatNumber(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("ar-IQ");

}

// ==========================================
// 🛡️ حماية النصوص
// ==========================================

function escapeAppText(text) {

    return String(text ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
// ==========================================
// 📦 عرض المنتجات
// ==========================================

function showProducts(list = products) {

    const content = document.getElementById("content");

    if (!content) {
        return;
    }

    if (!Array.isArray(list)) {
        list = products;
    }

    if (list.length === 0) {

        content.innerHTML = `

            <h2>📦 المنتجات</h2>

            <p>ماكو منتجات حاليًا.</p>

            <button onclick="addProductForm()">
                ➕ إضافة أول منتج
            </button>

        `;

        return;
    }

    content.innerHTML = `

        <h2>📦 منتجات مكتبة الأفق</h2>

        <p>
            عدد المنتجات:
            <strong>${formatNumber(list.length)}</strong>
        </p>

        <button onclick="showSales()">
            🛒 المبيعات
        </button>

        <button onclick="showSalesReport()">
            📊 تقرير المبيعات
        </button>

        <button onclick="showStock()">
            📦 المخزون
        </button>

        <hr style="margin:20px 0;">

        ${list.map(product => {

            const purchasePrice =
                Number(product.purchase_price || 0);

            const salePrice =
                Number(product.sale_price || 0);

            const quantity =
                Number(product.quantity || 0);

            const profit =
                salePrice - purchasePrice;

            return `
                            <div class="product">

                    <h3>
                        ${escapeAppText(product.name)}
                    </h3>

                    <p>
                        🏷️ التصنيف:
                        ${escapeAppText(product.category)}
                    </p>

                    <p>
                        💰 سعر الشراء:
                        <strong>
                            ${formatNumber(purchasePrice)}
                            دينار
                        </strong>
                    </p>

                    <p>
                        💵 سعر البيع:
                        <strong>
                            ${formatNumber(salePrice)}
                            دينار
                        </strong>
                    </p>

                    <p>
                        📦 الكمية:
                        <strong>
                            ${formatNumber(quantity)}
                            قطعة
                        </strong>
                    </p>

                    <p>
                        📈 ربح القطعة:
                        <strong>
                            ${formatNumber(profit)}
                            دينار
                        </strong>
                    </p>

                    ${
                        quantity <= 0
                        ? `
                            <p style="color:red;font-weight:bold;">
                                🚨 المنتج نافد
                            </p>
                        `
                        : quantity <= 5
                        ? `
                            <p style="color:#d88900;font-weight:bold;">
                                ⚠️ الكمية قليلة
                            </p>
                        `
                        : ""
                    }
                                        <div
                        class="product-actions"
                        style="
                            display:flex;
                            gap:8px;
                            margin-top:15px;
                            flex-wrap:wrap;
                        "
                    >

                        <button
                            type="button"
                            onclick="sellProduct(${product.id})"
                            style="
                                flex:1;
                            "
                        >
                            🛒 بيع
                        </button>

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editProduct(${product.id})"
                            style="
                                flex:1;
                            "
                        >
                            ✏️ تعديل
                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteProduct(${product.id})"
                            style="
                                flex:1;
                            "
                        >
                            🗑️ حذف
                        </button>

                    </div>

                </div>

            `;

                }).join("")}

        <hr>

        <button onclick="showSales()">
            🛒 سجل المبيعات
        </button>

        <button onclick="showTodayReport()">
            📅 تقرير اليوم
        </button>

        <button onclick="showMonthReport()">
            📅 تقرير الشهر
        </button>

        <button onclick="showProducts()">
            📦 المنتجات
        </button>

    `;

}
// ==========================================
// 📊 المخزون
// ==========================================

function showStock() {

    const content =
        document.getElementById("content");

    if (!content) {
        return;
    }

    const totalProducts =
        products.length;

    const totalQuantity =
        products.reduce(

            (total, product) => {

                return total +
                    Number(product.quantity || 0);

            },

            0

        );

    const totalStockValue =
        products.reduce(

            (total, product) => {

                return total +

                    Number(product.purchase_price || 0) *

                    Number(product.quantity || 0);

            },

            0

        );

    const totalExpectedProfit =
        products.reduce(

            (total, product) => {

                const sale =
                    Number(product.sale_price || 0);

                const purchase =
                    Number(product.purchase_price || 0);

                const quantity =
                    Number(product.quantity || 0);

                return total +

                    (sale - purchase) *

                    quantity;

            },

            0

        );
      const lowStock =
        products.filter(product => {

            const quantity =
                Number(product.quantity || 0);

            return (
                quantity > 0 &&
                quantity <= 5
            );

        });


    const outOfStock =
        products.filter(product => {

            return Number(product.quantity || 0) <= 0;

        });


    content.innerHTML = `

        <h2>📊 مخزون مكتبة الأفق</h2>

        <div class="stock-box">

            <h3>📦 عدد المنتجات</h3>

            <p>
                ${formatNumber(totalProducts)}
            </p>

        </div>

        <div class="stock-box">

            <h3>🔢 مجموع القطع</h3>

            <p>
                ${formatNumber(totalQuantity)}
            </p>

        </div>

        <div class="stock-box">

            <h3>💰 قيمة المخزون</h3>

            <p>
                ${formatNumber(totalStockValue)}
                دينار
            </p>

        </div>

        <div class="stock-box">

            <h3>📈 الربح المتوقع</h3>

            <p>
                ${formatNumber(totalExpectedProfit)}
                دينار
            </p>

        </div>

        <hr>

        <h3>⚠️ المنتجات قليلة المخزون</h3>
                ${
            lowStock.length === 0

            ?

            `
                <p>
                    ✅ لا توجد منتجات قليلة المخزون.
                </p>
            `

            :

            lowStock.map(product => `

                <div class="stock-product low-stock">

                    <h3>
                        ${escapeAppText(product.name)}
                    </h3>

                    <p>
                        📦 الكمية:
                        <strong>
                            ${formatNumber(product.quantity)}
                        </strong>
                    </p>

                    <p class="low-stock-warning">
                        ⚠️ الكمية قليلة
                    </p>

                </div>

            `).join("")
        }


        <h3 style="margin-top:20px;">
            🚨 المنتجات النافدة
        </h3>


        ${
            outOfStock.length === 0

            ?

            `
                <p>
                    ✅ لا توجد منتجات نافدة.
                </p>
            `

            :

            outOfStock.map(product => `

                <div class="stock-product out-of-stock">

                    <h3>
                        ${escapeAppText(product.name)}
                    </h3>

                    <p>
                        📦 الكمية:
                        <strong>0</strong>
                    </p>

                    <p class="out-of-stock-warning">
                        🚨 المنتج نافد
                    </p>

                </div>

            `).join("")
        }
                <br>

        <button onclick="showProducts()">
            📦 عرض جميع المنتجات
        </button>

        <button onclick="showSales()">
            🛒 المبيعات
        </button>

    `;

}
// ==========================================
// 🛒 بيع منتج
// ==========================================

function sellProduct(id) {

    const product =
        products.find(product =>
            String(product.id) === String(id)
        );

    if (!product) {

        alert("❌ لم يتم العثور على المنتج");

        return;

    }

    const available =
        Number(product.quantity || 0);

    if (available <= 0) {

        alert("❌ هذا المنتج نافد من المخزون");

        return;

    }

    const quantityText =
        prompt(

            `🛒 بيع: ${product.name}\n\n` +

            `📦 المتوفر: ${available} قطعة\n\n` +

            `أدخل الكمية:`,

            "1"

        );

    if (quantityText === null) {
        return;
    }

    const quantity =
        Number(quantityText);
  // ==========================================
// التحقق من كمية البيع
// ==========================================

    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        alert("⚠️ أدخل كمية صحيحة");

        return;

    }


    if (quantity > available) {

        alert(
            "❌ الكمية المطلوبة أكبر من المخزون\n\n" +
            "المتوفر: " +
            available +
            " قطعة"
        );

        return;

    }


// ==========================================
// حساب المبلغ والربح
// ==========================================

    const salePrice =
        Number(product.sale_price || 0);

    const purchasePrice =
        Number(product.purchase_price || 0);

    const total =
        salePrice * quantity;

    const profit =
        (salePrice - purchasePrice) * quantity;


// ==========================================
// إنشاء عملية البيع
// ==========================================

    const sale = {

        id: Date.now(),

        productId: product.id,

        productName: product.name,

        quantity: quantity,

        salePrice: salePrice,

        purchasePrice: purchasePrice,

        total: total,

        profit: profit,

        date: new Date().toISOString()

    };
  // ==========================================
// خصم الكمية
// ==========================================

    product.quantity =
        available - quantity;


// ==========================================
// حفظ عملية البيع
// ==========================================

    sales.push(sale);

    saveProducts();

    saveSales();


// ==========================================
// تحديث ذاكرة مساعد الأفق
// ==========================================

    if (typeof clearAIMemory === "function") {

        clearAIMemory();

    }


// ==========================================
// رسالة نجاح البيع
// ==========================================

    alert(

        "✅ تمت عملية البيع بنجاح\n\n" +

        "📦 المنتج: " +
        product.name +

        "\n🔢 الكمية: " +
        quantity +
        " قطعة" +

        "\n💵 المبلغ: " +
        formatNumber(total) +
        " دينار" +

        "\n📈 الربح: " +
        formatNumber(profit) +
        " دينار"

    );
  // ==========================================
// عرض المنتجات بعد البيع
// ==========================================

    showProducts();

}


// ==========================================
// 🌐 جعل دالة البيع متاحة
// ==========================================

window.sellProduct = sellProduct;
// ==========================================
// ✏️ تعديل المنتج
// ==========================================

function editProduct(id) {

    const product =
        products.find(product =>
            String(product.id) === String(id)
        );

    if (!product) {

        alert("❌ لم يتم العثور على المنتج");

        return;

    }

    const name =
        prompt(
            "اسم المنتج:",
            product.name
        );

    if (name === null) {
        return;
    }

    const category =
        prompt(
            "التصنيف:",
            product.category || ""
        );

    if (category === null) {
        return;
    }
  // ==========================================
// 💰 تعديل سعر الشراء
// ==========================================

    const purchasePriceText =
        prompt(
            "سعر الشراء:",
            product.purchase_price
        );

    if (purchasePriceText === null) {
        return;
    }

    const purchasePrice =
        Number(purchasePriceText);


// ==========================================
// 💵 تعديل سعر البيع
// ==========================================

    const salePriceText =
        prompt(
            "سعر البيع:",
            product.sale_price
        );

    if (salePriceText === null) {
        return;
    }

    const salePrice =
        Number(salePriceText);
  // ==========================================
// 🔢 تعديل الكمية
// ==========================================

    const quantityText =
        prompt(
            "الكمية:",
            product.quantity
        );

    if (quantityText === null) {
        return;
    }

    const quantity =
        Number(quantityText);


// ==========================================
// 🛡️ التحقق من البيانات
// ==========================================

    if (
        name.trim() === "" ||
        !Number.isFinite(purchasePrice) ||
        purchasePrice < 0 ||
        !Number.isFinite(salePrice) ||
        salePrice < 0 ||
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {

        alert("⚠️ تأكد من صحة البيانات");

        return;

    }
  // ==========================================
// 💾 حفظ التعديلات
// ==========================================

    product.name =
        name.trim();

    product.category =
        category.trim();

    product.purchase_price =
        purchasePrice;

    product.sale_price =
        salePrice;

    product.quantity =
        quantity;


// ==========================================
// 💾 حفظ المنتجات
// ==========================================

    saveProducts();


// ==========================================
// 🔄 تحديث العرض
// ==========================================

    showProducts();


// ==========================================
// ✅ رسالة النجاح
// ==========================================

    alert(
        "✅ تم تعديل المنتج بنجاح"
    );

}
// ==========================================
// ➕ إضافة منتج
// ==========================================

function addProductForm() {

    const content =
        document.getElementById("content");

    if (!content) {
        return;
    }

    content.innerHTML = `

        <h2>➕ إضافة منتج جديد</h2>

        <input
            id="newProductName"
            type="text"
            placeholder="اسم المنتج"
        >

        <input
            id="newProductCategory"
            type="text"
            placeholder="التصنيف"
        >

        <input
            id="newProductPurchase"
            type="number"
            placeholder="سعر الشراء"
        >

        <input
            id="newProductSale"
            type="number"
            placeholder="سعر البيع"
        >

        <input
            id="newProductQuantity"
            type="number"
            placeholder="الكمية"
        >
                <button
            type="button"
            onclick="addProduct()"
        >
            💾 حفظ المنتج
        </button>

        <button
            type="button"
            onclick="showProducts()"
        >
            ↩️ رجوع
        </button>

    `;

}
// ==========================================
// 💾 حفظ المنتج الجديد
// ==========================================

function addProduct() {

    const name =
        document.getElementById("newProductName").value.trim();

    const category =
        document.getElementById("newProductCategory").value.trim();

    const purchasePrice =
        Number(
            document.getElementById("newProductPurchase").value
        );

    const salePrice =
        Number(
            document.getElementById("newProductSale").value
        );

    const quantity =
        Number(
            document.getElementById("newProductQuantity").value
        );
  // ==========================================
// 🛡️ التحقق من البيانات
// ==========================================

    if (
        name === "" ||
        !Number.isFinite(purchasePrice) ||
        purchasePrice < 0 ||
        !Number.isFinite(salePrice) ||
        salePrice < 0 ||
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {

        alert("⚠️ تأكد من إدخال جميع البيانات بشكل صحيح");

        return;

    }


// ==========================================
// 🆔 إنشاء المنتج
// ==========================================

    const newProduct = {

        id: Date.now(),

        name: name,

        category: category,

        purchase_price: purchasePrice,

        sale_price: salePrice,

        quantity: quantity

    };
  // ==========================================
// 📦 إضافة المنتج للقائمة
// ==========================================

    products.push(newProduct);


// ==========================================
// 💾 حفظ المنتجات
// ==========================================

    saveProducts();


// ==========================================
// 🔄 عرض المنتجات
// ==========================================

    showProducts();


// ==========================================
// ✅ رسالة النجاح
// ==========================================

    alert(
        "✅ تمت إضافة المنتج بنجاح"
    );

}
// ==========================================
// 🗑️ حذف المنتج
// ==========================================

function deleteProduct(id) {

    const product =
        products.find(product =>
            String(product.id) === String(id)
        );

    if (!product) {

        alert("❌ لم يتم العثور على المنتج");

        return;

    }

    const confirmed =
        confirm(
            "هل تريد حذف المنتج:\n\n" +
            product.name +
            " ؟"
        );

    if (!confirmed) {
        return;
    }
  // ==========================================
// حذف المنتج من القائمة
// ==========================================

    products =
        products.filter(product =>
            String(product.id) !== String(id)
        );


// ==========================================
// 💾 حفظ المنتجات
// ==========================================

    saveProducts();


// ==========================================
// 🧠 تحديث ذاكرة المساعد
// ==========================================

    if (typeof clearAIMemory === "function") {

        clearAIMemory();

    }


// ==========================================
// 🔄 تحديث الشاشة
// ==========================================

    showProducts();


// ==========================================
// ✅ رسالة النجاح
// ==========================================

    alert(
        "✅ تم حذف المنتج بنجاح"
    );

}
// ==========================================
// 🔎 البحث عن المنتجات
// ==========================================

function searchProducts() {

    const input =
        document.getElementById("searchInput");

    if (!input) {
        return;
    }

    const searchText =
        input.value
            .trim()
            .toLowerCase();

    if (searchText === "") {

        showProducts();

        return;

    }

    const results =
        products.filter(product => {

            const name =
                String(product.name || "")
                    .toLowerCase();

            const category =
                String(product.category || "")
                    .toLowerCase();

            return (
                name.includes(searchText) ||
                category.includes(searchText)
            );

        });

    showProducts(results);

}
// ==========================================
// 📊 تقرير المبيعات
// ==========================================

function showSalesReport() {

    const content =
        document.getElementById("content");

    if (!content) {
        return;
    }

    const totalSales =
        sales.length;

    const totalItems =
        sales.reduce(
            (total, sale) => {

                return total +
                    Number(sale.quantity || 0);

            },
            0
        );

    const totalRevenue =
        sales.reduce(
            (total, sale) => {

                return total +
                    Number(sale.total || 0);

            },
            0
        );

    const totalProfit =
        sales.reduce(
            (total, sale) => {

                return total +
                    Number(sale.profit || 0);

            },
            0
        );
  // ==========================================
// 🧾 عرض ملخص المبيعات
// ==========================================

    content.innerHTML = `

        <h2>📊 تقرير المبيعات</h2>

        <div class="stock-box">

            <h3>🛒 عدد عمليات البيع</h3>

            <p>
                ${formatNumber(totalSales)}
            </p>

        </div>

        <div class="stock-box">

            <h3>🔢 مجموع القطع المباعة</h3>

            <p>
                ${formatNumber(totalItems)}
            </p>

        </div>

        <div class="stock-box">

            <h3>💵 إجمالي المبيعات</h3>

            <p>
                ${formatNumber(totalRevenue)}
                دينار
            </p>

        </div>

        <div class="stock-box">

            <h3>📈 إجمالي الأرباح</h3>

            <p>
                ${formatNumber(totalProfit)}
                دينار
            </p>

        </div>

        <hr>

        <h3>🧾 عمليات بيع اليوم</h3>

        ${
            getTodaySales().length === 0

            ?

            `
                <p>
                    📭 لا توجد مبيعات اليوم.
                </p>
            `

            :

            getTodaySales().map(sale => `

                <div class="product">

                    <h3>
                        🛒 ${escapeAppText(sale.productName)}
                    </h3>

                    <p>
                        🔢 الكمية:
                        ${formatNumber(sale.quantity)}
                        قطعة
                    </p>

                    <p>
                        💵 المبلغ:
                        ${formatNumber(sale.total)}
                        دينار
                    </p>

                    <p>
                        📈 الربح:
                        ${formatNumber(sale.profit)}
                        دينار
                    </p>

                </div>

            `).join("")
        }
        <hr>

        <button onclick="showSales()">
            🛒 سجل المبيعات
        </button>

        <button onclick="showProducts()">
            📦 المنتجات
        </button>

    `;
  }

// ==========================================
// 🛒 سجل المبيعات
// ==========================================

function showSales() {

    const content =
        document.getElementById("content");

    if (!content) {
        return;
    }

    content.innerHTML = `

        <h2>🛒 سجل المبيعات</h2>

        <button onclick="showSalesReport()">
            📊 التقرير
        </button>

        <button onclick="showProducts()">
            📦 المنتجات
        </button>

        <hr>
                ${
            sales.length === 0

            ?

            `
                <p>
                    📭 لا توجد عمليات بيع حتى الآن.
                </p>
            `

            :

            sales.map(sale => `

                <div class="product">

                    <h3>
                        🛒 ${escapeAppText(sale.productName)}
                    </h3>

                    <p>
                        🔢 الكمية:
                        <strong>
                            ${formatNumber(sale.quantity)}
                            قطعة
                        </strong>
                    </p>

                    <p>
                        💵 المبلغ:
                        <strong>
                            ${formatNumber(sale.total)}
                            دينار
                        </strong>
                    </p>

                    <p>
                        📈 الربح:
                        <strong>
                            ${formatNumber(sale.profit)}
                            دينار
                        </strong>
                    </p>

                    <p>
                        📅 التاريخ:
                        ${new Date(sale.date).toLocaleString("ar-IQ")}
                    </p>
                    <button
    type="button"
    onclick="printSale(${sale.id})"
>
    🧾 طباعة الوصل
</button>

                </div>

            `).join("")
                }
                    `;

}


// ==========================================
// 🌐 إتاحة الدوال
// ==========================================

window.showProducts = showProducts;

window.showStock = showStock;

window.showSales = showSales;

window.showSalesReport = showSalesReport;

window.addProductForm = addProductForm;

window.addProduct = addProduct;

window.editProduct = editProduct;

window.deleteProduct = deleteProduct;

window.searchProducts = searchProducts;
// ==========================================
// 🚀 تشغيل التطبيق
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // تحميل المبيعات
    const savedSales =
        localStorage.getItem(SALES_STORAGE_KEY);

    if (savedSales) {

        try {

            sales = JSON.parse(savedSales);

            if (!Array.isArray(sales)) {
                sales = [];
            }

        } catch (error) {

            sales = [];

        }

    }


    // البحث
    const searchInput =
        document.getElementById("searchInput");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchProducts
        );

    }


    // عرض المنتجات
    showProducts();

});
// ==========================================
// 🧾 طباعة وصل البيع
// ==========================================

function printSale(id) {

    const sale =
        sales.find(item =>
            String(item.id) === String(id)
        );

    if (!sale) {

        alert("❌ لم يتم العثور على عملية البيع");

        return;

    }

    const printWindow =
        window.open("", "_blank");

    if (!printWindow) {

        alert(
            "⚠️ تعذر فتح صفحة الطباعة"
        );

        return;

    }
  // ==========================================
// 🧾 محتوى الوصل
// ==========================================

    printWindow.document.write(`

        <!DOCTYPE html>

        <html lang="ar" dir="rtl">

        <head>

            <meta charset="UTF-8">

            <title>وصل بيع - مكتبة الأفق</title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    width: 80mm;
                    margin: 0 auto;
                    padding: 10px;
                    text-align: center;
                }

                h2 {
                    margin-bottom: 5px;
                }

                .line {
                    border-top: 1px dashed #000;
                    margin: 10px 0;
                }

                .info {
                    text-align: right;
                    line-height: 1.8;
                }

                .total {
                    font-size: 18px;
                    font-weight: bold;
                }

            </style>

        </head>

        <body>

            <h2>📚 مكتبة الأفق للقرطاسية</h2>

            <div>🧾 وصل بيع</div>

            <div class="line"></div>

            <div class="info">
                            <p>
                    📦 المنتج:
                    <strong>
                        ${escapeAppText(sale.productName)}
                    </strong>
                </p>

                <p>
                    🔢 الكمية:
                    <strong>
                        ${formatNumber(sale.quantity)}
                        قطعة
                    </strong>
                </p>

                <p>
                    💵 سعر القطعة:
                    <strong>
                        ${formatNumber(sale.salePrice)}
                        دينار
                    </strong>
                </p>

                <p class="total">
                    💰 الإجمالي:
                    ${formatNumber(sale.total)}
                    دينار
                </p>

                <p>
                    📅 التاريخ:
                    ${new Date(sale.date).toLocaleString("ar-IQ")}
                </p>

            </div>

            <div class="line"></div>

            <p>
                شكرًا لتسوقكم من مكتبة الأفق 🌹
            </p>
                        </body>

        </html>

    `);

    printWindow.document.close();


// ==========================================
// 🖨️ تنفيذ الطباعة
// ==========================================

    printWindow.focus();

    printWindow.print();

}
// ==========================================
// 📅 التحقق من مبيعات اليوم
// ==========================================

function isSaleToday(dateValue) {

    const saleDate =
        new Date(dateValue);

    const today =
        new Date();

    return (
        saleDate.getFullYear() ===
        today.getFullYear() &&

        saleDate.getMonth() ===
        today.getMonth() &&

        saleDate.getDate() ===
        today.getDate()
    );

}
// ==========================================
// 📊 حساب مبيعات اليوم
// ==========================================

function getTodaySales() {

    return sales.filter(sale => {

        return isSaleToday(sale.date);

    });

}


// ==========================================
// 💰 إحصائيات مبيعات اليوم
// ==========================================

function getTodaySalesStats() {

    const todaySales =
        getTodaySales();

    const totalSales =
        todaySales.length;

    const totalItems =
        todaySales.reduce(
            (total, sale) => {

                return total +
                    Number(sale.quantity || 0);

            },
            0
        );
  // ==========================================
// 💵 إجمالي مبيعات اليوم
// ==========================================

    const totalRevenue =
        todaySales.reduce(
            (total, sale) => {

                return total +
                    Number(sale.total || 0);

            },
            0
        );


// ==========================================
// 📈 إجمالي أرباح اليوم
// ==========================================

    const totalProfit =
        todaySales.reduce(
            (total, sale) => {

                return total +
                    Number(sale.profit || 0);

            },
            0
        );


// ==========================================
// 📦 إرجاع الإحصائيات
// ==========================================

    return {

        totalSales: totalSales,

        totalItems: totalItems,

        totalRevenue: totalRevenue,

        totalProfit: totalProfit

    };

}
// ==========================================
// 📅 تقرير مبيعات اليوم
// ==========================================

function showTodayReport() {

    const content =
        document.getElementById("content");

    if (!content) {
        return;
    }

    const stats =
        getTodaySalesStats();

    content.innerHTML = `

        <h2>📅 تقرير مبيعات اليوم</h2>

        <div class="stock-box">

            <h3>🛒 عمليات البيع</h3>

            <p>
                ${formatNumber(stats.totalSales)}
            </p>

        </div>

        <div class="stock-box">

            <h3>🔢 القطع المباعة</h3>

            <p>
                ${formatNumber(stats.totalItems)}
            </p>

        </div>

        <div class="stock-box">

            <h3>💵 إجمالي المبيعات</h3>

            <p>
                ${formatNumber(stats.totalRevenue)}
                دينار
            </p>

        </div>

        <div class="stock-box">

            <h3>📈 ربح اليوم</h3>

            <p>
                ${formatNumber(stats.totalProfit)}
                دينار
            </p>

        </div>

        <hr>

        <button onclick="showSales()">
            🛒 سجل المبيعات
        </button>
        <button onclick="showTodayReport()">
    📅 تقرير اليوم
</button>
<button onclick="showMonthReport()">
    📅 تقرير الشهر
</button>

        <button onclick="showProducts()">
            📦 المنتجات
        </button>

    `;
}
// ==========================================
// 📅 التحقق من مبيعات هذا الشهر
// ==========================================

function isSaleThisMonth(dateValue) {

    const saleDate =
        new Date(dateValue);

    const today =
        new Date();

    return (
        saleDate.getFullYear() ===
        today.getFullYear() &&

        saleDate.getMonth() ===
        today.getMonth()
    );

}

function getMonthSales() {

    const result = sales.filter(function (sale) {

        return isSaleThisMonth(sale.date);

    });

    return result;

}

// ==========================================
// 📊 إحصائيات مبيعات الشهر
// ==========================================

function getMonthSalesStats() {

    const monthSales =
        getMonthSales();

    const totalSales =
        monthSales.length;

    const totalItems =
        monthSales.reduce(
            (total, sale) => {

                return total +
                    Number(sale.quantity || 0);

            },
            0
        );

    const totalRevenue =
        monthSales.reduce(
            (total, sale) => {

                return total +
                    Number(sale.total || 0);

            },
            0
        );
  // ==========================================
// 📈 إجمالي أرباح الشهر
// ==========================================

    const totalProfit =
        monthSales.reduce(
            (total, sale) => {

                return total +
                    Number(sale.profit || 0);

            },
            0
        );


// ==========================================
// 📦 إرجاع إحصائيات الشهر
// ==========================================

    return {

        totalSales: totalSales,

        totalItems: totalItems,

        totalRevenue: totalRevenue,

        totalProfit: totalProfit

    };

}
// ==========================================
// 📅 تقرير مبيعات الشهر
// ==========================================

function showMonthReport() {

    const content =
        document.getElementById("content");

    if (!content) {
        return;
    }

    const stats =
        getMonthSalesStats();

    const monthSales =
        getMonthSales();

    const today =
        new Date();

    const monthName =
        today.toLocaleDateString(
            "ar-IQ",
            {
                month: "long",
                year: "numeric"
            }
        );
  // ==========================================
// 📊 محتوى التقرير الشهري
// ==========================================

    content.innerHTML = `

        <h2>📅 تقرير مبيعات ${monthName}</h2>

        <div class="stock-box">

            <h3>🛒 عمليات البيع</h3>

            <p>
                ${formatNumber(stats.totalSales)}
            </p>

        </div>

        <div class="stock-box">

            <h3>🔢 القطع المباعة</h3>

            <p>
                ${formatNumber(stats.totalItems)}
            </p>

        </div>

        <div class="stock-box">

            <h3>💵 إجمالي المبيعات</h3>

            <p>
                ${formatNumber(stats.totalRevenue)}
                دينار
            </p>

        </div>

        <div class="stock-box">

            <h3>📈 إجمالي الأرباح</h3>

            <p>
                ${formatNumber(stats.totalProfit)}
                دينار
            </p>

        </div>

        <hr>

        <h3>🧾 عمليات البيع هذا الشهر</h3>
                ${
            monthSales.length === 0

            ?

            `
                <p>
                    📭 لا توجد مبيعات هذا الشهر.
                </p>
            `

            :

            monthSales.map(sale => `

                <div class="product">

                    <h3>
                        🛒 ${escapeAppText(sale.productName)}
                    </h3>

                    <p>
                        🔢 الكمية:
                        ${formatNumber(sale.quantity)}
                        قطعة
                    </p>

                    <p>
                        💵 المبلغ:
                        ${formatNumber(sale.total)}
                        دينار
                    </p>

                    <p>
                        📈 الربح:
                        ${formatNumber(sale.profit)}
                        دينار
                    </p>

                    <p>
                        📅 التاريخ:
                        ${new Date(sale.date).toLocaleString("ar-IQ")}
                    </p>

                </div>

            `).join("")
                }
                        <hr>

        <button onclick="showSales()">
            🛒 سجل المبيعات
        </button>

        <button onclick="showTodayReport()">
            📅 تقرير اليوم
        </button>
        <button onclick="showMonthReport()">
    📅 تقرير الشهر
</button>

        <button onclick="showProducts()">
            📦 المنتجات
        </button>

    `;

}


// ==========================================
// 🌐 إتاحة التقرير الشهري
// ==========================================

window.showMonthReport =
    showMonthReport;