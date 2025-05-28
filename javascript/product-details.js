document.addEventListener("DOMContentLoaded", function () {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  // Function to show alert below action buttons
  function showAlert(message, type = "success") {
    const actionButtons = document.querySelector(".action-buttons");
    if (!actionButtons) return;

    // Remove any existing alert
    const existingAlert = actionButtons.querySelector(".alert-message");
    if (existingAlert) existingAlert.remove();

    // Create alert element
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert-message ${type}`;
    alertDiv.textContent = message;
    alertDiv.style.marginTop = "10px";
    alertDiv.style.padding = "10px";
    alertDiv.style.borderRadius = "5px";
    alertDiv.style.textAlign = "center";
    alertDiv.style.fontSize = "0.9rem";
    alertDiv.style.color = type === "success" ? "#e67e22" : "#d35400";
    alertDiv.style.backgroundColor = "#fff";
    alertDiv.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";

    // Insert alert after action buttons
    actionButtons.insertAdjacentElement("afterend", alertDiv);

    // Remove alert after 3 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  if (product) {
    document.getElementById("product-image").src = product.image;
    document.getElementById("product-name").innerText = product.name;
    document.getElementById("product-description").innerText = product.description;
    document.getElementById("product-price").innerText = `${product.price}`;
    document.getElementById("nutrient").innerText = product.nutrients.join(", ");
    document.getElementById("calories").innerText = product.calories;
    document.getElementById("health-benefits").innerText = product.healthBenefits;

    // Handle Add to Wishlist
    const addToWishlistBtn = document.getElementById("add-to-wishlist");
    addToWishlistBtn.addEventListener("click", () => {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const existingItem = wishlist.find(item => item.id === product.id);
      if (existingItem) {
        showAlert(`${product.name} is already in your wishlist!`, "error");
      } else {
        wishlist.push({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price.replace(/[^\d.]/g, '')),
          image: product.image
        });
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        showAlert(`${product.name} has been added to your wishlist!`, "success");
      }
    });

    // Handle Add to Cart
    const addToCartBtn = document.getElementById("add-to-cart");
    addToCartBtn.addEventListener("click", () => {
      const quantity = parseInt(document.getElementById("quantity").value, 10);
      if (quantity <= 0 || isNaN(quantity)) {
        showAlert("Please enter a valid quantity.", "error");
        return;
      }

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
        showAlert(`Updated quantity of ${product.name} in your cart!`, "success");
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price.replace(/[^\d.]/g, '')),
          image: product.image,
          quantity: quantity
        });
        showAlert(`${product.name} has been added to your cart!`, "success");
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    });

    // Handle Buy Now
    const buyNowBtn = document.getElementById("buy-now");
    buyNowBtn.addEventListener("click", () => {
      const quantity = parseInt(document.getElementById("quantity").value, 10);
      if (quantity <= 0 || isNaN(quantity)) {
        showAlert("Please enter a valid quantity.", "error");
        return;
      }

      const order = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price.replace(/[^\d.]/g, '')),
        image: product.image,
        quantity: quantity
      };

      localStorage.setItem("order", JSON.stringify(order));
      showAlert(`Proceeding to checkout for ${quantity} ${product.name}(s).`, "success");
      setTimeout(() => {
        window.location.href = "checkout.html";
      }, 2000);
    });
  }
});