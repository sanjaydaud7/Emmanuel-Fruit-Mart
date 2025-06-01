document.addEventListener("DOMContentLoaded", async function () {
  const menuList = document.getElementById("menuList");
  const productContainer = document.getElementById("productContainer");
  const recentlyViewedContainer = document.getElementById("recentlyViewedContainer");
  const relatedProductsContainer = document.getElementById("relatedProductsContainer");
  const popularProductsContainer = document.getElementById("popularProductsContainer");
  const searchResultsContainer = document.getElementById("searchResultsContainer");
  const searchQuerySpan = document.getElementById("searchQuery");
  const noResults = document.getElementById("noResults");

  let products = [];

  // Fetch Products from MongoDB
  async function fetchProducts() {
    try {
      console.log('Fetching products from MongoDB...');
      const response = await fetch('https://testing-ecommerce-3fbd.onrender.com/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
      }

      const productsData = await response.json();
      console.log('Fetched products from MongoDB:', productsData);

      // Map data to ensure correct format
      products = productsData.map(product => ({
        id: product.id,
        name: product.name || 'Unknown Product',
        price: product.price || 'N/A',
        image: product.image || 'https://via.placeholder.com/150',
        category: product.category || 'Unknown',
        description: product.description || '',
        nutrients: Array.isArray(product.nutrients) ? product.nutrients : [],
        calories: product.calories || 'N/A',
        healthBenefits: product.healthBenefits || '',
        tags: Array.isArray(product.tags) ? product.tags : [],
      }));

      console.log('Processed products:', products);

      // Verify DOM elements
      if (!productContainer) console.error('productContainer not found in DOM');
      if (!recentlyViewedContainer) console.error('recentlyViewedContainer not found in DOM');
      if (!popularProductsContainer) console.error('popularProductsContainer not found in DOM');
      if (!relatedProductsContainer) console.error('relatedProductsContainer not found in DOM');
      if (!searchResultsContainer) console.error('searchResultsContainer not found in DOM');
      if (!searchQuerySpan) console.error('searchQuerySpan not found in DOM');
      if (!noResults) console.error('noResults not found in DOM');

      // Load all sections
      loadAllProducts();
      loadRecentlyViewed();
      loadPopularProducts();
      loadSearchResults();
    } catch (error) {
      console.error('Error fetching products:', error.message);
      products = [];
      if (productContainer) {
        productContainer.innerHTML = `<p>Failed to load products: ${error.message}. Please try again later.</p>`;
      }
    }
  }

  // Update Menu List
  function updateMenuList() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.email) {
      const profilePhoto = loggedInUser.profilePhoto || "https://via.placeholder.com/40";
      menuList.innerHTML = `
        <li>
          <a href="../small/edit-profile.html">
            <img src="${profilePhoto}" alt="Profile" class="profile-icon" />
          </a>
        </li>
        <li><a href="wishlist.html">Wishlist</a></li>
        <li><a href="cart.html"><i class="fa-solid fa-cart-shopping"></i></a></li>
        <li><a href="#" id="logoutBtn">Logout</a></li>
      `;
      document.getElementById("logoutBtn")?.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        updateMenuList();
      });
    } else {
      menuList.innerHTML = `
        <li><a href="login/login.html">Login/SignUp</a></li>
        <li><a href="wishlist.html">Wishlist</a></li>
        <li><a href="cart.html"><i class="fa-solid fa-cart-shopping"></i></a></li>
      `;
    }
  }

  // Toggle Menu
  if (menuList) {
    menuList.style.maxHeight = "0px";
    window.toggleMenu = function () {
      if (menuList.style.maxHeight === "0px") {
        menuList.style.maxHeight = "300px";
        menuList.style.backgroundColor = "white";
      } else {
        menuList.style.maxHeight = "0px";
      }
    };
  }

  // Offer Bar
  const offerText = document.querySelector(".offer-text");
  if (offerText) {
    const offers = [
      "🔥 Limited Time Offer: Get 50% Off on All Products! 🚀",
      "🎉 Buy 1 Get 1 Free on Selected Items! 🛍️",
      "🚚 Free Shipping on Orders Over $99! 🌎",
      "💥 Flash Sale: Extra 20% Off - Use Code: FLASH20 💳"
    ];
    let combinedOffers = offers.join("     •     ");
    offerText.innerHTML = combinedOffers + "     •     " + combinedOffers;
    let animationDuration = combinedOffers.length / 2;
    offerText.style.animation = `scroll-left ${animationDuration}s linear infinite`;
  }

  // Hero Section
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    const backgrounds = [
      "url('/images/bg1.jpg')",
      "url('/images/bg2.jpg')",
      "url('/images/bg3.jpg')",
      "url('/images/bg4.jpeg')",
      "url('/images/bg5.jpeg')",
      "url('/images/bg6.jpeg')"
    ];
    let index = 0;
    function changeBackground() {
      heroSection.style.backgroundImage = backgrounds[index];
      index = (index + 1) % backgrounds.length;
    }
    setInterval(changeBackground, 2000);
  }

  // Product Functions
  function createProductElement(product) {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${product.price}</p>
    `;

    const calorieLabel = document.createElement("div");
    calorieLabel.textContent = `Calories: ${product.calories}`;
    calorieLabel.classList.add("calorie-label");
    calorieLabel.style.display = "none";

    productDiv.addEventListener("mouseenter", () => calorieLabel.style.display = "block");
    productDiv.addEventListener("mouseleave", () => calorieLabel.style.display = "none");
    productDiv.appendChild(calorieLabel);

    const viewBtn = document.createElement("button");
    viewBtn.innerText = "View Product";
    viewBtn.className = "view-btn";
    viewBtn.addEventListener("click", () => viewProduct(product.id));
    productDiv.appendChild(viewBtn);

    return productDiv;
  }

  function viewProduct(productId) {
    const selectedProduct = products.find(p => p.id === productId);
    if (!selectedProduct) return;

    localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));

    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    recentlyViewed = recentlyViewed.filter(p => p.id !== selectedProduct.id);
    recentlyViewed.unshift(selectedProduct);
    if (recentlyViewed.length > 7) recentlyViewed.pop();
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));

    let viewCounts = JSON.parse(localStorage.getItem("viewCounts")) || {};
    viewCounts[productId] = (viewCounts[productId] || 0) + 1;
    localStorage.setItem("viewCounts", JSON.stringify(viewCounts));

    loadRecentlyViewed();
    loadRelatedProducts(selectedProduct.category);
    loadPopularProducts();
    window.location.href = "product-details.html";
  }

  function loadAllProducts() {
    if (productContainer) {
      productContainer.innerHTML = "";
      products.forEach(product => {
        const productDiv = createProductElement(product);
        productContainer.appendChild(productDiv);
      });
    }
  }

  function loadRecentlyViewed() {
    if (recentlyViewedContainer) {
      const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      recentlyViewedContainer.innerHTML = "";
      recentlyViewed.forEach(product => {
        const productDiv = createProductElement(product);
        const removeIcon = document.createElement("span");
        removeIcon.classList.add("remove-icon");
        removeIcon.innerHTML = "✕";
        removeIcon.addEventListener("click", () => removeProduct(product.id));
        productDiv.appendChild(removeIcon);
        recentlyViewedContainer.appendChild(productDiv);
      });
    }
  }

  function removeProduct(productId) {
    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    recentlyViewed = recentlyViewed.filter(p => p.id !== productId);
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
    loadRecentlyViewed();
  }

  function loadPopularProducts() {
    if (popularProductsContainer) {
      const viewCounts = JSON.parse(localStorage.getItem("viewCounts")) || {};
      const sortedIds = Object.entries(viewCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(entry => parseInt(entry[0]));

      popularProductsContainer.innerHTML = "";
      sortedIds.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) popularProductsContainer.appendChild(createProductElement(product));
      });
    }
  }

  function loadRelatedProducts(category) {
    if (relatedProductsContainer) {
      relatedProductsContainer.innerHTML = "";
      const relatedProducts = products.filter(p => p.category === category).slice(0, 4);
      relatedProducts.forEach(product => relatedProductsContainer.appendChild(createProductElement(product)));
    }
  }

  // Utility: Simple similarity function (Levenshtein Distance)
  function getLevenshteinDistance(a, b) {
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  // Utility: Check if two words are similar enough
  function isSimilar(str1, str2) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
    if (str1 === str2) return true;
    // Allow up to 2 edits for short words, 3 for longer
    const maxDistance = str1.length > 6 ? 3 : 2;
    return getLevenshteinDistance(str1, str2) <= maxDistance;
  }

  // Enhanced Search Functionality
  function loadSearchResults() {
    if (searchResultsContainer && searchQuerySpan && noResults) {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get("q")?.trim().toLowerCase() || "";
      searchQuerySpan.textContent = query || "All Products";

      if (!query) {
        searchResultsContainer.innerHTML = "";
        products.forEach(product => {
          const productDiv = createProductElement(product);
          searchResultsContainer.appendChild(productDiv);
        });
        noResults.style.display = "none";
        return;
      }

      // Main filter: direct match or similar
      const filteredProducts = products.filter(product => {
        // Check name, category, description, nutrients, healthBenefits, tags
        const fields = [
          product.name,
          product.category,
          product.description,
          ...(Array.isArray(product.nutrients) ? product.nutrients : (product.nutrients || "").split(";")),
          product.healthBenefits,
          ...(Array.isArray(product.tags) ? product.tags : (product.tags || "").split(";"))
        ];
        return fields.some(field => {
          if (!field) return false;
          // Direct match
          if (field.toLowerCase().includes(query)) return true;
          // Similarity check for each word in field
          return field
            .toLowerCase()
            .split(/[\s,;]+/)
            .some(word => isSimilar(word, query));
        });
      });

      searchResultsContainer.innerHTML = "";
      if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
          const productDiv = createProductElement(product);
          searchResultsContainer.appendChild(productDiv);
        });
        noResults.style.display = "none";
      } else {
        // Show preview: closest matches (top 3 by similarity)
        // Compute similarity score for each product name
        const scored = products.map(product => {
          const name = product.name.toLowerCase();
          const dist = getLevenshteinDistance(name, query);
          return { product, dist };
        });
        scored.sort((a, b) => a.dist - b.dist);
        const preview = scored.slice(0, 3).map(s => s.product);

        noResults.style.display = "block";
        if (preview.length > 0) {
          const previewDiv = document.createElement("div");
          previewDiv.innerHTML = "<div style='margin:10px 0 5px 0;font-weight:bold;'>Did you mean:</div>";
          preview.forEach(product => {
            const productDiv = createProductElement(product);
            previewDiv.appendChild(productDiv);
          });
          searchResultsContainer.appendChild(previewDiv);
        }
      }
    } else {
      console.error('Missing required DOM elements for search functionality');
    }
  }

  // Initialize
  updateMenuList();
  await fetchProducts(); // Fetch products and load all sections
});