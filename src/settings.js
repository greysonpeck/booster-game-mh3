document.addEventListener("DOMContentLoaded", () => {
    const editPrice = document.getElementById("edit-price");
    const boosterPriceElement = document.getElementById("pricePerBooster");
    const priceModal = document.getElementById("price-modal-container");
    const currentPrice = document.getElementById("pricePerBooster");
    const modalPrice = document.getElementById("modal-price");
    const priceUp = document.getElementById("price-up");
    const priceDown = document.getElementById("price-down");
    const lightShade = document.querySelector(".light-shade");

    activePriceModal = false;
    modalPrice.innerText = USDollar.format(boosterValue);

    currentPrice.innerText = USDollar.format(boosterValue);
    modalPrice.innerText = USDollar.format(boosterValue);

    // Initialize?
    let currentSet = getCookie("currentSet").replaceAll("'", "");

    function priceChange() {
        currentSet = getCookie("currentSet").replaceAll("'", "");
        if (currencyMode === "CAD") {
            currentPrice.innerText = USDollar.format(boosterValue);
            modalPrice.innerText = USDollar.format(boosterValue);
            document.cookie = "boosterValue_CAN_" + currentSet + "=" + boosterValue;
        } else {
            currentPrice.innerText = USDollar.format(boosterValue);
            modalPrice.innerText = USDollar.format(boosterValue);
            document.cookie = "boosterValue_" + currentSet + "=" + boosterValue;
        }
    }

    if (currencyMode === "CAD") {
        // if we have the cookie "boosterprice_CAN_[your set here]"
        if (getCookie("boosterValue_CAN_" + currentSet)) {
            // console.log("wow, we have it (CAD)");
        } else {
            // console.log("no, we do not have it (CAD)");
        }
    } else {
        if (getCookie("boosterValue_" + currentSet)) {
            // console.log("wow, we have it (USD)");
        } else {
            // console.log("no, we do not have it (USD)");
        }
    }

    // Click booster price, get modal
    editPrice.addEventListener("click", function () {
        umamiAnalytics("Price change open");
        modalPrice.innerText = USDollar.format(boosterValue);

        priceModal.classList.remove("hidden");
        lightShade.classList.remove("opacity-0", "-z-10");
        activePriceModal = true;
    });

    // Click booster price up
    priceUp.addEventListener("click", function () {
        if (boosterValue < 245) {
            boosterValue = Number(boosterValue) + 1;
            priceChange();
        } else {
            // be for real
        }
    });

    // Click booster price up
    priceDown.addEventListener("click", function () {
        if (boosterValue > 5) {
            boosterValue = Number(boosterValue) - 1;
            priceChange();
        } else {
            // be for real
        }
    });

    document.addEventListener("click", function (event) {
        if (!activePriceModal) return;
        if (!priceModal.contains(event.target) && event.target !== editPrice && event.target !== currentPrice) {
            priceModal.classList.add("hidden");
            lightShade.classList.add("opacity-0", "-z-10");
        }
    });

    document.addEventListener("keydown", (event) => {
        if (activePriceModal && event.key === "Escape") {
            priceModal.classList.add("hidden");
            lightShade.classList.add("opacity-0", "-z-10");

            activePriceModal = false;
        }
    });
});
