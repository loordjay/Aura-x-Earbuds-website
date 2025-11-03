document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalElem = document.getElementById("subtotal");
    const discountElem = document.getElementById("discount");
    const shippingElem = document.getElementById("shipping");
    const totalElem = document.getElementById("total");
    const paymentForm = document.getElementById("payment-form");
    const orderSuccess = document.getElementById("order-success");

    // Load cart items from localStorage or initialize empty array
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    function renderCartItems() {
        cartItemsContainer.innerHTML = "";
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
            paymentForm.style.display = "none";
            return;
        }
        paymentForm.style.display = "block";
        cartItems.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "product";
            itemDiv.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                </div>
                <div>
                    Price: $${item.price.toFixed(2)}
                </div>
                <div>
                    Quantity: <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input" />
                </div>
                <div>
                    <button data-index="${index}" class="remove-button">Remove</button>
                </div>
                <hr/>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
        attachQuantityListeners();
        attachRemoveListeners();
        updateSummary();
    }

    function attachQuantityListeners() {
        const quantityInputs = document.querySelectorAll(".quantity-input");
        quantityInputs.forEach(input => {
            input.addEventListener("change", function () {
                const index = this.getAttribute("data-index");
                let newQuantity = parseInt(this.value);
                if (isNaN(newQuantity) || newQuantity < 1) {
                    newQuantity = 1;
                    this.value = 1;
                }
                cartItems[index].quantity = newQuantity;
                saveCart();
                updateSummary();
            });
        });
    }

    function attachRemoveListeners() {
        const removeButtons = document.querySelectorAll(".remove-button");
        removeButtons.forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                cartItems.splice(index, 1);
                saveCart();
                renderCartItems();
            });
        });
    }

    function updateSummary() {
        let subtotal = 0;
        cartItems.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        const discount = 0;
        const shipping = 0;
        const total = subtotal - discount + shipping;

        subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
        discountElem.textContent = `$${discount.toFixed(2)}`;
        shippingElem.textContent = `$${shipping.toFixed(2)}`;
        totalElem.textContent = `$${total.toFixed(2)}`;
    }

    function saveCart() {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    paymentForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Simple validation
        const name = paymentForm.name.value.trim();
        const cardNumber = paymentForm["card-number"].value.trim();
        const expiry = paymentForm.expiry.value.trim();
        const cvv = paymentForm.cvv.value.trim();

        if (!name || !cardNumber || !expiry || !cvv) {
            alert("Please fill in all payment details.");
            return;
        }

        // Basic card number validation (length and digits)
        const cardNumberDigits = cardNumber.replace(/\s+/g, "");
        if (!/^\d{13,19}$/.test(cardNumberDigits)) {
            alert("Please enter a valid card number.");
            return;
        }

        // Basic expiry validation MM/YY
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            alert("Please enter a valid expiry date in MM/YY format.");
            return;
        }

        // Basic CVV validation (3 or 4 digits)
        if (!/^\d{3,4}$/.test(cvv)) {
            alert("Please enter a valid CVV.");
            return;
        }

        // Prepare data to send to backend
        const username = localStorage.getItem("username") || "guest";

        try {
            // Save cart data
            const cartResponse = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, items: cartItems }),
            });
            const cartData = await cartResponse.json();
            if (!cartResponse.ok) throw new Error(cartData.message || "Failed to save cart");

            // Save payment data
            const amount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const paymentResponse = await fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    nameOnCard: name,
                    cardNumber,
                    expiryDate: expiry,
                    cvv,
                    amount,
                }),
            });
            const paymentData = await paymentResponse.json();
            if (!paymentResponse.ok) throw new Error(paymentData.message || "Failed to save payment");

            // Save order data
            const orderResponse = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    cartId: cartData.cartId,
                    paymentId: paymentData.paymentId,
                }),
            });
            const orderData = await orderResponse.json();
            if (!orderResponse.ok) throw new Error(orderData.message || "Failed to place order");

            // Show success message and clear cart
            orderSuccess.style.display = "block";
            paymentForm.style.display = "none";
            cartItems = [];
            saveCart();
            renderCartItems();
            alert("Order placed successfully!");

        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    renderCartItems();
});
