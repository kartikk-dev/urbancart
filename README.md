# UrbanCart | Mini E-Commerce Web Application

**A responsive, Diwali-themed e-commerce storefront built with HTML5, CSS3 and Vanilla JavaScript.**

UrbanCart is a frontend mini e-commerce application developed as part of InternCircle's Project 05 for Full Stack Web Development.

The project focuses on building a functional shopping experience using JavaScript objects and arrays, dynamic DOM rendering, cart state management, price calculations, browser storage and responsive interface design.

The storefront features a curated catalogue of everyday products with a Diwali-inspired shopping experience, interactive cart management and a simulated Cash on Delivery checkout flow.

---

## 1. Project Overview

| Detail | Information |
|---|---|
| Project Name | UrbanCart |
| Project Type | Mini E-Commerce Web Application |
| Internship Task | InternCircle Project 05 |
| Internship Domain | Full Stack Web Development |
| Selected Project Option | Mini E-Commerce Shop |
| Frontend | HTML5, CSS3, JavaScript |
| Data Management | JavaScript Objects and Arrays |
| Browser Storage | localStorage |
| Currency | Indian Rupee (INR) |
| Product Catalogue | 12 Products |
| Payment Mode | Simulated Cash on Delivery |
| Application Type | Frontend Demonstration |

## 2. Key Features

### Product Catalogue
- 12 products defined through a JavaScript product data array.
- Each product contains an ID, name, numerical price, category and image information.
- Product cards are generated dynamically from the JavaScript data.
- Product images, descriptions, pricing and availability are presented through a structured catalogue.
- Selected products display promotional discounts and offer labels.

### Product Discovery
- Search products by name.
- Filter products by category.
- Sort products using available sorting options.
- Dynamically update the catalogue based on the selected filters.

### Shopping Cart Management
- Add products to the cart.
- Increase or decrease product quantities.
- Remove individual products.
- Calculate individual product line totals.
- Display the total number of items in the cart.
- Display a dedicated empty-cart state.
- Update the cart interface automatically when its contents change.

### Automatic Price Calculation

The cart calculates the order amount using the selected products and their quantities.

**Pricing structure:**

| Charge | Calculation |
|---|---|
| Subtotal | Sum of product price multiplied by quantity |
| Delivery | ₹30 for orders below ₹500 |
| Free Delivery | Orders of ₹500 or above |
| Handling and GST | Combined fixed charge of ₹20 |
| Grand Total | Subtotal + Delivery + Handling and GST |

The delivery and handling charges are recalculated automatically whenever the cart changes.

An empty cart has a total value of ₹0.

All displayed monetary values use Indian currency formatting with the `en-IN` locale and `INR` currency.

### Checkout Preview
- Checkout opens in a modal dialog.
- Displays selected products and their quantities.
- Shows subtotal, delivery charges, handling and GST, and grand total.
- Provides a final review before order confirmation.
- Includes customer detail validation.

### Cash on Delivery Demonstration
The checkout flow supports a simulated Cash on Delivery option.

The customer is asked to provide:
- Full name.
- Delivery address.
- Valid 10-digit Indian mobile number.

After validation, the customer can review the COD confirmation and proceed to the simulated order placement screen.

The final confirmation screen displays a generated demonstration order reference and an illustrative delivery message.

### Order Confirmation Experience
- Full-screen order confirmation interface.
- Animated text reveal.
- Simulated order reference.
- Festive fireworks animation.
- Continue shopping action.

### Festive Interface
- Diwali-inspired visual design.
- Promotional announcement section.
- Interactive Burst Cracker button.
- Canvas-based fireworks animation.
- Rotating promotional hero content.
- Responsive product and shopping layouts.

### Responsive Design
The application is designed to support:
- Desktop screens.
- Laptop screens.
- Tablets.
- Mobile phones.

The catalogue, navigation, product cards, cart drawer and checkout interface adapt to different screen sizes.

---

## 3. Technologies Used

| Technology | Implementation |
|---|---|
| HTML5 | Semantic page structure and native dialog elements |
| CSS3 | Layout, responsive styling, transitions and animations |
| JavaScript | Application logic, DOM manipulation and event handling |
| JavaScript ES Modules | Separation of application functionality into modules |
| JavaScript Arrays and Objects | Product catalogue and cart data |
| Array Methods | `map()`, `filter()`, `find()` and `reduce()` |
| localStorage | Persistent browser-side cart storage |
| Canvas API | Fireworks animation |
| Unsplash | Externally hosted product imagery |

The project uses native frontend technologies without requiring a JavaScript framework or a build tool.

---

## 4. Project Requirements and Implementation

UrbanCart follows the requirements specified in the InternCircle Project 05 learner guide.

| InternCircle Requirement | UrbanCart Implementation |
|---|---|
| Dynamic rendering from JavaScript objects | Product cards are generated from a JavaScript product array. |
| Minimum 8 products | 12 product records are included. |
| Product data with name and price | Product records contain names, numerical prices, IDs, categories and image information. |
| Add products to cart | Implemented through `addToCart(id)`. |
| Change item quantities | Implemented through `changeQuantity(id, delta)`. |
| Remove products | Implemented through `removeItem(id)`. |
| Cart item count | Calculated from the quantities of cart items. |
| Total price calculation | Subtotal and order totals are calculated programmatically. |
| Indian currency formatting | Uses `toLocaleString()` with the `en-IN` locale and `INR` currency. |
| Checkout preview | Implemented using a native HTML dialog. |
| Cart persistence | Cart data is stored and restored using localStorage. |
| Responsive interface | Layout adapts to mobile, tablet and desktop screens. |
| Demonstration-only checkout | No actual payment is processed. |

### JavaScript Concepts Applied

The application uses core JavaScript concepts, including:

- Objects and arrays for structured product data.
- ES modules for separating application responsibilities.
- DOM manipulation for dynamic interface updates.
- Event listeners for user interactions.
- Array methods such as `map()`, `filter()`, `find()` and `reduce()`.
- Functions for reusable cart and checkout operations.
- JSON serialization for browser storage.
- Conditional logic for delivery charges and checkout validation.
- `localStorage` for retaining cart contents between page reloads.

---

## 5. Application Architecture

UrbanCart follows a modular frontend structure to keep product data, cart operations, application behaviour and styling separate.

### Project Directory

```text
urbancart/
│
├── index.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── products.js
│   ├── cart.js
│   └── app.js
│
├── assets/
│   └── images/
│
└── README.md
```

### Module Responsibilities

**`index.html`**

Contains the main application structure, product catalogue container, navigation, cart drawer, checkout dialogs and order confirmation interface.

**`css/styles.css`**

Contains the visual design system, product layouts, responsive breakpoints, cart and checkout styling, transitions and animations.

**`js/products.js`**

Stores the product catalogue as structured JavaScript objects, including product IDs, names, prices, categories and image details.

**`js/cart.js`**

Manages cart state and shopping calculations. It handles adding products, changing quantities, removing products, retrieving cart contents, calculating totals and saving cart data to localStorage.

**`js/app.js`**

Connects the application modules to the user interface. It handles dynamic product rendering, search, category filtering, sorting, cart interactions, checkout validation, COD confirmation, order success and fireworks animation.

---

## 6. Cart Data Management

The shopping cart uses a JavaScript object with product IDs as keys and quantities as values.

A simplified example:

```javascript
const cart = {
  1: 2,
  3: 1,
  5: 4
};
```

In this example, the cart contains:
- 2 units of product ID 1.
- 1 unit of product ID 3.
- 4 units of product ID 5.

Product information is retrieved from the product catalogue using the corresponding product ID.

The application calculates the subtotal by multiplying each product's numerical price by its selected quantity and accumulating the results.

Cart information is serialized into JSON before being saved in browser localStorage.

The application restores the saved cart when the page is loaded again.

---

## 7. Running the Project Locally

### Prerequisites

- Visual Studio Code.
- A modern web browser.
- Git.
- Python for the optional local HTTP server, or the VS Code Live Server extension.

### Installation

**Step 1: Clone the repository**

```bash
git clone https://github.com/kartikk-dev/urbancart.git
```

**Step 2: Navigate to the project directory**

```bash
cd urbancart
```

**Step 3: Open the project in Visual Studio Code**

```bash
code .
```

**Step 4: Start a local server**

Using Python:

```bash
py -m http.server 5500
```

Alternatively, open `index.html` using the VS Code Live Server extension.

**Step 5: Open the application**

Visit:

```text
http://localhost:5500
```

No package installation, framework setup, environment variables or API keys are required.

Product imagery is externally hosted, so an internet connection is required for those images to load.

---

## 8. Testing and Validation

The application has been tested through the following user flows:

| Test Case | Expected Behaviour |
|---|---|
| Add a product | Product appears in the cart. |
| Add the same product again | Quantity increases. |
| Increase quantity | Cart quantity and totals update. |
| Decrease quantity | Quantity and totals update. |
| Remove a product | Selected product is removed. |
| Remove the last product | Empty-cart state is displayed. |
| Search products | Matching products are displayed. |
| Filter categories | Catalogue updates to the selected category. |
| Sort products | Products are reordered accordingly. |
| Cart refresh | Saved cart is restored from localStorage. |
| Subtotal below ₹500 | ₹30 delivery charge is applied. |
| Subtotal of ₹500 or above | Delivery is free. |
| Handling and GST | Combined ₹20 charge is applied to a non-empty cart. |
| Checkout validation | Invalid or incomplete customer details are rejected. |
| COD confirmation | Customer can review and confirm the demonstration order. |
| Order placement | Simulated confirmation screen is displayed. |
| Mobile viewport | Interface adapts to smaller screen sizes. |

---

## 9. Important Project Limitations

UrbanCart is a frontend demonstration application and is not a production-ready e-commerce platform.

- No backend server or database is connected.
- No actual payment is collected or processed.
- Cash on Delivery is simulated entirely in the browser.
- Orders are not transmitted to a merchant or fulfilment system.
- Customer details are used within the checkout demonstration and are not submitted to a backend.
- The generated order reference is for demonstration purposes only.
- The displayed two-day delivery message is illustrative and does not represent an actual delivery commitment.
- Cart persistence is browser-specific through localStorage.

These limitations are intentional for the scope of this frontend internship project.

---

## 10. Internship Project Submission

**Selected Option:** Mini E-Commerce Shop.

UrbanCart implements a dynamic product catalogue containing 12 products stored as JavaScript objects. Product cards are generated dynamically, and customers can add products, change quantities, remove items and view automatically calculated cart totals.

The application calculates the subtotal from product prices and quantities, applies a ₹30 delivery charge for orders below ₹500, provides free delivery for orders of ₹500 or above, and adds a combined handling and GST charge of ₹20. All monetary values are displayed in Indian Rupees.

The shopping cart persists through browser localStorage. A modal checkout preview allows customers to review their order, while the Cash on Delivery flow is a simulated demonstration with no actual payment processing or backend order submission.

**Project Links**

- Source Code: https://github.com/kartikk-dev/urbancart
- Live Application: To be added after deployment.

---

## 11. Author

**Kartik Verma**

Full Stack Web Development Intern

- GitHub: [kartikk-dev](https://github.com/kartikk-dev)
- Project Repository: [UrbanCart](https://github.com/kartikk-dev/urbancart)

---

**UrbanCart was developed as an academic internship project to demonstrate practical frontend development, JavaScript programming, application state management and responsive web design.*