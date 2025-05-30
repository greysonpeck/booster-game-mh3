newTotal = 0;
boosterValue = 8;
boostersBought = 0;
commonSum = 0;
uncommonSum = 0;
currencyMode = "";
currentSet = "MH3";

function waitforme(millisec) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("");
        }, millisec);
    });
}

const cardImageLoaded = async (cardType, cardImagePrimary, cardStack) => {
    cardStack.classList.add("flipped");
    if (!rareFirstFlip) {
        // Not the first flip
        // console.log("Waiting 1400ms before flipping the stack");
        await waitforme(1400);
    } else {
        // first flip
    }

    //  Flipping
    cardStack.classList.remove("flipped");

    cardType.src = cardImagePrimary;
};

const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
};

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

myPrices = [];

var activeCheck = false;

function pullBooster() {
    if (currentSet === "DSK") {
        pullDSK();
    } else if (currentSet === "MH3") {
        pullMH3();
    } else if (currentSet === "FIN") {
        pullFIN();
    } else {
        pullFDN();
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function convertCurrency(value) {
    if (currencyMode == "CAD") {
        value = fx(value).from("USD").to("CAD").toFixed(2);
        return Number(value);
    } else {
        return Number(value);
    }
}

function convertToUSD(value) {
    if (currencyMode == "CAD") {
        value = fx(value).from("CAD").to("USD").toFixed(2);
        return Number(value);
    } else {
        return Number(value);
    }
}

let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

// Load DOM content, then execute
document.addEventListener(
    "DOMContentLoaded",

    function init() {
        currentMoneyElement = document.getElementById("current-money");
        const toggle = document.getElementById("currency");

        function initializeCAD() {
            currencyMode = "CAD";
            toggle.classList.add("toggle-cad");
            boosterValue = 12;
            document.getElementById("pricePerBooster").innerText = USDollar.format(boosterValue);
            currentMoneyElement.classList.remove("px-3");
            console.log("Initializing cad...");
            console.log("currency mode = " + currencyMode);
        }

        function initializeUSD() {
            boosterValue = 8;
            document.getElementById("pricePerBooster").innerText = USDollar.format(boosterValue);
            currentMoneyElement.classList.remove("px-3");
        }

        // On load, if a CAD cookie exist, initialize to CAD and set toggle visually.
        // If USD cookie, do nothing, load as normal.
        // If no cookie yet, set cookie
        if (getCookie("currencyMode")) {
            if (getCookie("currencyMode") == "'CAD'") {
                console.log("Canadian Loonie gang");
                initializeCAD();
                toggle.classList.toggle("on");
            } else {
                console.log("USA MONEY GANG");
                currentMoneyElement.classList.remove("px-3");
            }
        } else {
            currencyMode = "USD";
            document.cookie = "currencyMode = 'USD'";
            initializeUSD();
        }

        // Toggle click event
        function initializeMoney() {
            // Initialize all values
            boostersBought = 0;
            newTotal = 0;
            commonSum = 0;
            uncommonSum = 0;
            myPrices = [];
            document.getElementById("boosters-bought").innerText = "--";
            document.getElementById("current-money").innerText = "$ --";
            currentMoneyElement.classList.remove("bg-rose-500", "bg-emerald-500", "px-3");

            // Initialize to CAD settings if toggled while on USD and vice-versa.
            if (getCookie("currencyMode") == "'USD'") {
                initializeCAD();
                document.cookie = "currencyMode = 'CAD'";
                window.location.reload();
            } else {
                initializeUSD();
                document.cookie = "currencyMode = 'USD'";
                boosterValue = 8;
                window.location.reload();
            }
            toggle.classList.toggle("on");
        }

        toggle.addEventListener("click", () => {
            initializeMoney();
        });

        if (getCookie("currentSet")) {
            if (getCookie("currentSet") == "'MH3'") {
                setMH3();
            } else if (getCookie("currentSet") == "'DSK'") {
                setDSK();
            } else if (getCookie("currentSet") == "'FIN'") {
                setFIN();
            } else {
                setFDN();
            }
        } else {
            setFDN();
        }
    },
    false
);

// Card maker

function clearMoney() {
    currentSetElement = document.getElementById("current-set");
    currentMoneyElement = document.getElementById("current-money");

    // Toggle click event
    function initializeMoney() {
        // Initialize all values
        boostersBought = 0;
        newTotal = 0;
        commonSum = 0;
        uncommonSum = 0;
        myPrices = [];
        document.getElementById("boosters-bought").innerText = "--";
        document.getElementById("current-money").innerText = "$ --";
        currentMoneyElement.classList.remove("bg-rose-500", "bg-emerald-500", "px-3");
    }

    initializeMoney();
}

function clearSlots() {
    const cardSection = document.getElementById("card-section");
    while (cardSection.childElementCount > 1) {
        cardSection.removeChild(cardSection.lastChild);
    }

    // Clear Ghost Card and associated material
    document.getElementById("snark").classList.add("hidden");
    document.getElementById("ghost-image").src = "img/card_default.jpeg";
    document.getElementById("foil-holder").style.display = "none";
}

function makeSlot(id, label, hasFoil, quantity) {
    const cardSection = document.getElementById("card-section");

    //  Make card container
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container", "perspective-midrange");

    const slotContainer = document.createElement("div");
    slotContainer.classList.add("total-card", "h-[356px]", "w-fit", "text-nowrap", "mb-1", "sm:pt-0");

    const cardInfo = document.createElement("div");
    cardInfo.classList.add("card-info", "flex", "items-end", "sm:text-base", "text-xs", "pb-1.5");
    cardInfo.innerHTML =
        '<div class="slot-label">' +
        label +
        "</div>" +
        '<div id="' +
        id +
        '-price" class="pr-3 font-bold"></div>' +
        '<div id="' +
        id +
        '-roll" class="hidden"></div>';

    const bothCards = document.createElement("div");
    bothCards.classList.add("both-cards", "flipped");

    const cardBack = document.createElement("img");
    cardBack.classList.add("card", "card-back", "card-face", "rounded-xl", "backface-hidden", "rotate-y-180");
    cardBack.src = "./img/card_default.jpeg";

    const foilBlock = document.createElement("div");
    foilBlock.classList.add("card-container", "perspective-midrange");
    foilBlock.innerHTML =
        '<div class="both-cards flipped">' +
        '<div class="" style="position:absolute;">' +
        // old stuff
        ' <div class="foil-hold foil-gradient"></div><img id="' +
        id +
        '-image" class="card-default -z-10 rounded-xl" width="240px" height="auto" src="./img/card_default.jpeg" alt="some" />' +
        // close div
        "</div>" +
        // hardcode card back
        '<img class="card-back card card-face rounded-xl backface-hidden rotate-y-180" src="./img/card_default.jpeg">';

    if (quantity) {
        // Quantity stuff
        const cardSet = document.createElement("div");
        cardSet.id = id + "-set";
        cardSet.classList.add("mb-1", "sm:pt-0");

        // Check for dummy/spacer slot
        if (quantity && quantity < 1) {
            cardSet.classList.add("sm:hidden", "block");
        } else {
            // nothing
        }
        cardSection.append(cardSet);

        setLabel = document.createElement("div");
        setLabel.classList.add("card-info", "relative", "flex", "items-end", "sm:text-base", "text-xs", "pb-1.5");
        if (quantity < 1) {
            setLabel.innerHTML = "";
        } else {
            setLabel.innerHTML = '<div class="slot-label">' + label + " (" + quantity + ")</div>" + '<div id="' + id + '-sum" class="pr-3 font-bold"></div>';
            let stackHeightValue = quantity * 40 + 312;
            cardSet.style.height = stackHeightValue + "px";
        }
        cardSet.append(setLabel);

        for (var i = 0; i < quantity; i++) {
            const perspectiveContainer = document.createElement("div");
            perspectiveContainer.classList.add("card-container", "perspective-midrange");
            cardSet.append(perspectiveContainer);

            const bothContainer = document.createElement("div");
            bothContainer.classList.add("both-cards", "flipped");

            topVar = "top-pos-" + i;

            const cardImg = document.createElement("img");
            cardImg.id = id + "-image-" + (i + 1);
            cardImg.classList.add("card-face", "card-default", "rounded-xl", topVar);
            cardImg.src = "./img/card_default.jpeg";
            cardImg.alt = "Default Magic card back";

            const card = document.createElement("img");
            card.classList.add("card", "card-back", "card-face", "rounded-xl", "backface-hidden", "rotate-y-180", topVar);
            card.src = "./img/card_default.jpeg";
            card.id = id + "-" + (i + 1);

            // Nest elements
            perspectiveContainer.append(bothContainer);
            bothContainer.append(cardImg);
            bothContainer.append(card);

            if (hasFoil) {
                bothContainer.classList.add("absolute", topVar);
                cardImg.classList.remove(topVar);
                card.classList.remove(topVar);

                const foilMulti = document.createElement("div");
                foilMulti.classList.add("foil-hold", "foil-gradient", "foil-in-list");
                bothContainer.insertBefore(foilMulti, card);
            }
        }
    } else if (hasFoil) {
        cardSection.append(slotContainer);
        slotContainer.append(cardInfo);

        // const foilBlock = document.createElement("div");
        // foilBlock.id = "foil-card";
        // foilBlock.classList.add("effect-block");
        // foilBlock.innerHTML = ' <div class=""></div><img id="foil-image" class="card-default -z-10 rounded-xl" width="240px" height="auto" src="./img/card_default.jpeg" alt="some" />';
        // card.append(foilBlock);

        slotContainer.append(foilBlock);
    } else {
        cardSection.append(slotContainer);
        slotContainer.append(cardInfo);

        // Append Card Container
        slotContainer.append(cardContainer);
        cardContainer.append(bothCards);

        const cardImg = document.createElement("img");
        cardImg.id = id + "-image";
        cardImg.classList.add("card-face", "card-default", "rounded-xl");
        cardImg.src = "./img/card_default.jpeg";
        cardImg.alt = "Default Magic card back";

        bothCards.append(cardImg);
        bothCards.append(cardBack);
    }
}

function setGhostData() {
    if (ghostName.includes(",")) {
        ghostName = ghostName.substring(0, ghostName.indexOf(","));
    } else {
        // let it rock
    }

    //  Set price, check for etched
    if (ghostCard.tcgplayer_etched_id) {
        ghostPrice = convertCurrency(Number(ghostCard.prices.usd_etched)).toFixed(0);
    } else {
        ghostPrice = convertCurrency(Number(ghostCard.prices.usd)).toFixed(0);
    }

    ghostFoilHolderElement = document.getElementById("foil-holder");
    ghostTexturedElement = document.getElementById("ghost-textured");

    //  Set treatment
    const ghostFoilElement = document.getElementById("ghost-foil");

    if (ghostCard.prices.usd_foil && ghostCard.prices.usd == null) {
        ghostFoilElement.innerText = "textured foil ";
        ghostPrice = convertCurrency(Number(ghostCard.prices.usd_foil)).toFixed(0);
        ghostTexturedElement.classList.add("block");
        ghostTexturedElement.classList.remove("hidden");
        // ghostFoilHolderElement.classList.add("foil-gradient");
    } else if (ghostCard.foil && ghostCard.prices.usd_foil >= boosterSpendBottom && ghostCard.prices.usd_foil <= boosterSpendTop) {
        ghostFoilElement.innerText = "foil ";
        ghostPrice = convertCurrency(Number(ghostCard.prices.usd_foil)).toFixed(0);
        // ghostFoilHolderElement.classList.add("foil-gradient");
    } else if (ghostCard.foil && ghostCard.prices.usd >= boosterSpendBottom && ghostCard.prices.usd <= boosterSpendTop) {
        // ghostFoilHolderElement.classList.remove("foil-gradient");
        ghostFoilElement.innerText = "";
        ghostTexturedElement.classList.remove("block");
        ghostTexturedElement.classList.add("hidden");
    } else {
        // ghostFoilHolderElement.classList.remove("foil-gradient");
        ghostFoilElement.innerText = "";
        ghostTexturedElement.classList.remove("block");
        ghostTexturedElement.classList.add("hidden");
    }

    if (ghostCard.frame == "1997") {
        ghostTreatment = "retro frame ";
        // } else if (ghostCard.promo_types[0]) {
        //   ghostTreatment = "borderless concept art ";
    } else if (ghostCard.border_color == "borderless") {
        ghostTreatment = "borderless ";
    } else if (ghostCard.finishes[0] == "etched") {
        ghostTreatment = "etched ";
    } else {
        ghostTreatment = "";
    }

    const ghostTreatmentElement = document.getElementById("ghost-treatment");
    ghostTreatmentElement.innerText = ghostTreatment;

    // TO FIX: figure out if DFC....
    if (ghostCard.layout == "transform" || ghostCard.layout == "modal_dfc") {
        ghostImagePrimary = ghostCard.card_faces[0].image_uris.normal;
    } else {
        ghostImagePrimary = ghostCard.image_uris.normal;
    }

    //  Flipping
    document.getElementById("ghost-card").parentElement.classList.remove("flipped");

    //  Replace Img Source
    ghostImageElement = document.getElementById("ghost-image");

    //  When Ghost Image has loaded...Flip and wait accordingly
    const ghostStack = ghostImageElement.closest(".both-cards");
    ghostImageElement.addEventListener("load", cardImageLoaded(ghostImageElement, ghostImagePrimary, ghostStack));

    //  Insert Price
    const ghostPriceElement = document.getElementById("ghost-price");
    ghostPriceElement.innerText = ghostPrice;

    //  Insert Name
    const ghostNameElement = document.getElementById("ghost-name");
    ghostNameElement.innerText = ghostName;

    //  Reveal snark
    const snarkBox = document.getElementById("snark");
    snarkBox.classList.remove("hidden");
}
