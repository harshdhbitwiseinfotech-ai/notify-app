/*
  Notify Widget
  Shopify Back In Stock Notification System
*/

document.addEventListener("DOMContentLoaded", () => {
  const widgets = document.querySelectorAll(".notify-widget");

  widgets.forEach((widget) => {
    initializeNotifyWidget(widget);
  });
});

function initializeNotifyWidget(widget) {
  const productId = widget.dataset.productId;
  const variantId = widget.dataset.variantId;
  const available = widget.dataset.available === "true";

  const button = widget.querySelector(".notify-button");
  const emailInput = widget.querySelector(".notify-email");
  const message = widget.querySelector(".notify-message");

  /*
    Product available
    Remove notify system
    Shopify Add To Cart remains normal
  */

  if (available) {
    widget.style.display = "none";
    return;
  }

  button.addEventListener("click", async () => {
    const email = emailInput.value.trim();

    if (!email) {
      message.innerHTML = "Please enter your email";
      message.className = "error";
      return;
    }

    button.disabled = true;
    button.innerHTML = "Saving...";

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          productId,
          variantId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        button.innerHTML = "✓ Notified";
        button.classList.add("notified");
        emailInput.disabled = true;
        message.innerHTML = "You will be notified when available";
        message.className = "success";
      } else {
        button.disabled = false;
        button.innerHTML = "Notify Me";
        message.innerHTML = data.message || "Something went wrong";
      }
    } catch (error) {
      console.error("Notify Error:", error);
      button.disabled = false;
      button.innerHTML = "Notify Me";
      message.innerHTML = "Server error";
    }
  });
}