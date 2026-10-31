const searchBox = document.getElementById("searchBox");
const output = document.querySelector(".output");
const currencySelect = document.getElementById("currency");


const exchangeRates = {
    MYR: 1,
    USD: 0.22,
    EUR: 0.19
};



const plushies = [
    {
        id: 999,
        title: "Cute Teddy Bear",
        price: 25.00,
        image: "images/Example.jpg",
        description: "A soft and cuddly teddy bear!"
    },
    {
        id: 998,
        title: "Small Jade Plushie",
        price: 99.00,
        image: "images/Jade.png",
        description: "A little Jade to hug!"
    },
    {
        id: 997,
        title: "Ilden Plushie",
        price: 42.00,
        image: "images/Ilden.png",
        description: "Your adorable Ilden companion!"
    },
    {
        id: 996,
        title: "Nivilette Plushie",
        price: 67.00,
        image: "images/Fox.png",
        description: "A cute little fox plushie!"
    },
    {
        id: 995,
        title: "Bunny Pod Plushie",
        price: 100.00,
        image: "images/Bnnuy.png",
        description: "A fluffy bunny friend!"
    },
    {
        id: 994,
        title: "Sir Kaf Chef Plushie",
        price: 80.00,
        image: "images/SirKafChef.png",
        description: "The cutest little chef!"
    }
];

function displayProducts(productList) {

    output.innerHTML = "";

    const selectedCurrency = currencySelect.value;
    const rate = exchangeRates[selectedCurrency];

    productList.forEach(product => {

        const card = document.createElement("div");
        card.className = "plushie-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>${selectedCurrency} ${(product.price * rate).toFixed(2)}</p>

            <button onclick="addToCart(${product.id})">
                Add to Cart 🛒
            </button>
        `;

        const productImage = card.querySelector("img");
        productImage.addEventListener("error", function() {
            console.error("Image failed to load:", product.image);
        }, { once: true });

        output.appendChild(card);

    });
}



fetch("https://api.escuelajs.co/api/v1/products")
.then(response => {

    if (!response.ok) {
        throw new Error("API request failed!");
    }

    return response.json();

})
.then(productData => {

    console.log("API connected successfully!");
    console.log(productData);

    // Display only our custom plushies
    displayProducts(plushies);

})
.catch(error => {

    console.error("Error fetching API:", error);

    // Display custom plushies even if API fails
    displayProducts(plushies);

});



searchBox.addEventListener("input", function() {

    const searchText = searchBox.value.toLowerCase();

    const filteredPlushies = plushies.filter(product =>
        product.title.toLowerCase().includes(searchText)
    );

    displayProducts(filteredPlushies);

});



currencySelect.addEventListener("change", function() {

    const searchText = searchBox.value.toLowerCase();

    const filteredPlushies = plushies.filter(product =>
        product.title.toLowerCase().includes(searchText)
    );

    displayProducts(filteredPlushies);
    displayCart();

});


let cart = [];


// Add products to cart
function addToCart(productId) {

    const product = plushies.find(item => item.id === productId);

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    displayCart();

}



function displayCart() {

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    cartItems.innerHTML = "";

    const selectedCurrency = currencySelect.value;
    const rate = exchangeRates[selectedCurrency];

    let total = 0;

    cart.forEach(item => {

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        const itemTotal = item.price * item.quantity * rate;

        total += itemTotal;

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">

            <div class="cart-product-info">
                <h3>${item.title}</h3>
                <p>${selectedCurrency} ${itemTotal.toFixed(2)}</p>
            </div>

            <div class="cart-controls">

                <button onclick="changeQuantity(${item.id}, -1)">
                    −
                </button>

                <span>${item.quantity}</span>

                <button onclick="changeQuantity(${item.id}, 1)">
                    +
                </button>

            </div>

            <button class="remove-button"
                onclick="removeFromCart(${item.id})">
                Remove
            </button>
        `;

        cartItems.appendChild(cartItem);

    });

    cartTotal.textContent =
        `Total: ${selectedCurrency} ${total.toFixed(2)}`;
        displayOrderSummary();

}



function changeQuantity(productId, amount) {

    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        removeFromCart(productId);
        return;

    }

    displayCart();

}


function removeFromCart(productId) {

    cart = cart.filter(item => item.id !== productId);

    displayCart();

}


// Display checkout order summary
function displayOrderSummary() {

    const orderSummary = document.getElementById("orderSummary");

    orderSummary.innerHTML = "";

    const selectedCurrency = currencySelect.value;
    const rate = exchangeRates[selectedCurrency];

    if (cart.length === 0) {
        orderSummary.textContent = "Your cart is empty.";
        return;
    }

    cart.forEach(item => {

        const itemTotal = item.price * item.quantity * rate;

        const summaryItem = document.createElement("p");

        summaryItem.textContent =
            `${item.title} x ${item.quantity} - ${selectedCurrency} ${itemTotal.toFixed(2)}`;

        orderSummary.appendChild(summaryItem);

    });

}
