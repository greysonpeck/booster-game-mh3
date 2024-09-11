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
    } else {
        pullMH3();
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
            }
        } else {
            setMH3();
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
        cardSection.append(cardSet);

        setLabel = document.createElement("div");
        setLabel.classList.add("card-info", "relative", "flex", "items-end", "sm:text-base", "text-xs", "pb-1.5");
        setLabel.innerHTML = '<div class="slot-label">' + label + " (" + quantity + ")</div>" + '<div id="' + id + '-sum" class="pr-3 font-bold"></div>';
        cardSet.append(setLabel);

        for (var i = 0; i < quantity; i++) {
            const card = document.createElement("div");
            topVar = "top-pos-" + (i + 1);
            card.classList.add("text-center", "w-44", "sm:w-[240px]", "absolute", "-z-10", topVar);
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
