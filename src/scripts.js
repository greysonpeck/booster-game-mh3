newTotal = 0;
boosterValue = 8;
boostersBought = 0;
commonSum = 0;
uncommonSum = 0;
currencyMode = "";
currentSet = "MH3";

const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
};

myPrices = [];

var activeCheck = false;

function pullBooster() {
    if (currentSet === "DSK") {
        pullDSK();
    } else if (currentSet === "MH3") {
        pullMH3();
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

    const card = document.createElement("div");
    card.classList.add("text-center", "w-44", "sm:w-[240px]", "shrink-0", "text-nowrap", "pt-[12px]", "sm:pt-0");

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

    if (quantity) {
        // Quantity stuff
        const cardSet = document.createElement("div");
        cardSet.id = id + "-set";
        cardSet.classList.add("w-44", "sm:w-[240px]", "pt-[12px]", "sm:pt-0");

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
        }
        cardSet.append(setLabel);

        for (var i = 0; i < quantity; i++) {
            const card = document.createElement("div");
            topVar = "top-pos-" + (i + 1);
            card.classList.add("text-center", "w-44", "sm:w-[240px]", "absolute", topVar);
            card.id = id + "-" + (i + 1);
            cardSet.append(card);

            const cardImg = document.createElement("img");

            cardImg.id = id + "-image-" + (i + 1);

            cardImg.classList.add("card-default", "h-auto", "rounded-xl");
            cardImg.src = "./img/card_default.jpeg";
            cardImg.alt = "Default Magic card back";
            card.append(cardImg);
        }
    } else if (hasFoil) {
        cardSection.append(card);
        card.append(cardInfo);

        // const foilBlock = document.createElement("div");
        // foilBlock.id = "foil-card";
        // foilBlock.classList.add("effect-block");
        // foilBlock.innerHTML = ' <div class=""></div><img id="foil-image" class="card-default -z-10 rounded-xl" width="240px" height="auto" src="./img/card_default.jpeg" alt="some" />';
        // card.append(foilBlock);

        const foilBlock = document.createElement("div");
        foilBlock.id = id + "-card";
        foilBlock.classList.add("effect-block");
        foilBlock.innerHTML =
            ' <div class=""></div><img id="' +
            id +
            '-image" class="card-default -z-10 rounded-xl" width="240px" height="auto" src="./img/card_default.jpeg" alt="some" />';
        card.append(foilBlock);
    } else {
        cardSection.append(card);
        card.append(cardInfo);

        const cardImg = document.createElement("img");
        cardImg.id = id + "-image";
        cardImg.classList.add("card-default", "rounded-xl");
        cardImg.src = "./img/card_default.jpeg";
        cardImg.alt = "Default Magic card back";
        card.append(cardImg);
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
        ghostFoilHolderElement.classList.add("foil-gradient");
    } else if (ghostCard.foil && ghostCard.prices.usd_foil >= boosterSpendBottom && ghostCard.prices.usd_foil <= boosterSpendTop) {
        ghostFoilElement.innerText = "foil ";
        ghostPrice = convertCurrency(Number(ghostCard.prices.usd_foil)).toFixed(0);
        ghostFoilHolderElement.classList.add("foil-gradient");
    } else if (ghostCard.foil && ghostCard.prices.usd >= boosterSpendBottom && ghostCard.prices.usd <= boosterSpendTop) {
        ghostFoilHolderElement.classList.remove("foil-gradient");
        ghostFoilElement.innerText = "";
        ghostTexturedElement.classList.remove("block");
        ghostTexturedElement.classList.add("hidden");
    } else {
        ghostFoilHolderElement.classList.remove("foil-gradient");
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

    //  Replace Img Source
    document.getElementById("ghost-image").src = ghostImagePrimary;

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
