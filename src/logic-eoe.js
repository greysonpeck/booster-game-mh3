const ghostLinkHalf_EOE = "https://api.scryfall.com/cards/random?q=set%3Aeoe+unique%3Aprints+";
const topOutLink_EOE = "https://api.scryfall.com/cards/search?order=usd&q=set%3Aeoe+unique%3Aprints+USD%3E%3D15";
const boosterType_EOE = "Collector";

window.setName = "EOE";
window.EOE = {
    totalCards: 14,
};
window.cardInfo = window.cardInfo || {};

function setEOE() {
    currentSet = "EOE";
    document.cookie = "currentSet = 'EOE'";
    boosterValue = 40;
    CAN_boosterValue = 60;
    msrp = 24.99;

    priceCutActive = true;
    priceCut = 1;

    document.getElementById("set-header").innerText = "UNDER CONSTRUCTION";
    document.getElementById("booster-type").innerText = boosterType_EOE + " Booster";

    document.body.style.backgroundImage = "url(img/EOE_bg_dark.jpg)";
    clearSlots();
    makeEOESlots();
    clearMoney();
    changeSet();
}

function makeEOESlots() {
    // makeSlot("foil", "Foil Wildcard", true);
    makeSlot("landcelestial", "Full-Art Celestial Land", true);
    makeSlot("raremythic", "Foil Rare/Mythic", true);
    makeSlot("nfcommander", "Non-foil Commander");
    makeSlot("nfboosterfun", "Non-foil Booster Fun");
    makeSlot("landstellar", "Stellar Sights Land", true);
    makeSlot("uncommon", "Foil Uncommons", true, 4);
    makeSlot("common", "Foil Commons", true, 5);
}

function pullEOE() {
    // Prevent slider from triggering pulls multiple times
    if (activeCheck == false) {
        activeCheck = true;

        // Reset the slider
        const slider = document.querySelector("#sound-slider");
        slider.value = 10;

        commonPull_EOE();

        uncommonPull_FDN();

        landCelestialPull_EOE();

        rareMythic_EOE();

        nfCommander_EOE();

        landStellarPull_EOE();

        nfBoosterFun_EOE();

        sumTotals();
    } else {
        console.log("already working");
    }
}

async function commonPull_EOE() {
    //  Get card from Scryfall
    for (i = 1; i <= 5; i++) {
        // set:fdn rarity:c (cn<=253 or cn=262)
        commonType = "Main Set Common";
        commonRarity = "87%";
        commonLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+rarity%3Ac+-type%3Abasic";

        let response = await fetch(commonLink);
        let commonCard = await response.json();

        window.cardInfo.common = ["5 Main-set Commons", "Appears 100% of the time."];

        commonName = commonCard.name;
        commonPrice = convertCurrency(commonCard.prices.usd_foil * priceCut);

        //  Set img source
        commonImage = commonCard.image_uris.normal;

        var commonImageId = "common-image-" + i;
        commonImageElement = document.getElementById(commonImageId);
        commonImageElement.src = commonImage;

        //  When card has loaded...Flip and wait accordingly
        const commonStack = document.getElementById("common-image-" + i).parentElement;
        commonImageElement.addEventListener("load", cardImageLoaded(commonImageElement, commonImage, commonStack));

        var commonPrice = convertCurrency(commonCard.prices.usd_foil * priceCut);

        //  Create Common Sum Element
        commonSum = commonSum + commonPrice;

        //  Push price to price array
        myPrices.push(commonPrice);

        const commonSumElement = document.getElementById("common-sum");
        commonSumElement.innerText = commonSum;

        // Set Sum on page, clear value.
        commonSumElement.innerText = "$" + commonSum.toFixed(2);
        // commonSum = 0;
    }
}

async function uncommonPull_FDN() {
    // Clear out all uncommon card divs, if they exist
    uncommonSet = document.getElementById("uncommon-set");

    //  Get card from Scryfall
    for (j = 1; j < 5; j++) {
        uncommonLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+rarity%3Au";

        // set:fdn rarity:u (is:booster OR border:borderless)
        let response = await fetch(uncommonLink);
        let uncommonCard = await response.json();
        uncommonName = uncommonCard.name;

        //  Replace Img Source, check for DFC
        uncommonImage = uncommonCard.image_uris.normal;

        var uncommonImageId = "uncommon-image-" + j;
        uncommonImageElement = document.getElementById(uncommonImageId);
        uncommonImageElement.src = uncommonImage;

        //  When card has loaded...Flip and wait accordingly
        const uncommonStack = document.getElementById("uncommon-image-" + j).parentElement;
        uncommonImageElement.addEventListener("load", cardImageLoaded(uncommonImageElement, uncommonImage, uncommonStack));

        var uncommonPrice = convertCurrency(uncommonCard.prices.usd_foil * priceCut);

        //  Create Uncommon Sum Element
        uncommonSum = uncommonSum + uncommonPrice;

        //  Push price to price array
        myPrices.push(uncommonPrice);
    }

    window.cardInfo.uncommon = ["4 Main-set Uncommons", "Appears 100% of the time."];

    const uncommonSumElement = document.getElementById("uncommon-sum");
    uncommonSumElement.innerText = uncommonSum;

    // Set Sum on page, clear value.
    uncommonSumElement.innerText = "$" + uncommonSum.toFixed(2);
    uncommonSum = 0;
}

async function rareMythic_EOE() {
    // Random number between 0 and 100
    rareMythicRoll = getRandomNumber(0, 100);
    var rareMythicLink = "";

    // Override roll
    // rareRoll = 94.9;

    if (rareMythicRoll <= 86) {
        // set:fdn is:booster rarity:r
        rareMythicType = "Default frame, Rare (Foil)";
        rareMythicRarity = "86%";
        rareMythicLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+rarity%3Ar+CN<286&unique=cards";
    } else {
        // set:fdn is:booster rarity:m
        rareMythicType = "Default frame, Mythic (Foil)";
        rareMythicRarity = "14%";
        rareMythicLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+rarity%3Am+CN<286&unique=cards";
    }

    let response = await fetch(rareMythicLink);

    // waits until Scryfall fetch completes...
    let card = await response.json();
    rareMythicName = card.name;
    window.cardInfo.raremythic = [rareMythicName, rareMythicType, rareMythicRarity];
    rareMythicPrice = convertCurrency(card.prices.usd_foil * priceCut);

    // TO FIX: figure out if DFC....
    rareMythicImagePrimary = card.image_uris.normal;

    //   Replace Img Source
    var rareMythicImageId = "raremythic-image";
    document.getElementById(rareMythicImageId).src = rareMythicImagePrimary;
    rareMythicImageElement = document.getElementById(rareMythicImageId);
    rareMythicImageElement.src = rareMythicImagePrimary;

    //  When card has loaded...Flip and wait accordingly
    let rareMythicStack = document.getElementById("raremythic-image").closest(".both-cards");
    rareMythicImageElement.addEventListener("load", cardImageLoaded(rareMythicImageElement, rareMythicImagePrimary, rareMythicStack));

    //  Insert Price
    const rarePriceElement = document.getElementById("raremythic-price");
    rarePriceElement.innerText = USDollar.format(rareMythicPrice);

    //  Insert Roll
    const rareMythicRollElement = document.getElementById("raremythic-roll");
    rareMythicRollElement.innerText = "Roll: " + rareMythicRoll.toFixed(0);

    //  Push price to price array
    myPrices.push(rareMythicPrice);
}

async function nfCommander_EOE() {
    // Random number between 0 and 100
    nfCommanderRoll = getRandomNumber(0, 100);
    var nfCommanderLink = "";

    // Override roll
    // nfCommanderRoll = 94.9;

    if (nfCommanderRoll <= 91) {
        // set:fdn rarity:r is:borderless
        nfCommanderType = "Extended-art Commander, Rare";
        nfCommanderRarity = "91%";
        nfCommanderLink = "https://api.scryfall.com/cards/random?q=set%3Aeoc+rarity%3Ar+is%3Aextendedart";
    } else {
        // set:fdn is:borderless rarity:m
        nfCommanderType = "Borderless Commander, Mythic";
        nfCommanderRarity = "9%";
        nfCommanderLink = "https://api.scryfall.com/cards/random?q=set%3Aeoc+rarity%3Am+cn<5";
    }

    let response = await fetch(nfCommanderLink);

    // waits until Scryfall fetch completes...
    let card = await response.json();
    nfCommanderName = card.name;
    window.cardInfo["nfcommander"] = [nfCommanderName, nfCommanderType, nfCommanderRarity];
    nfCommanderPrice = convertCurrency(card.prices.usd * priceCut);

    // TO FIX: figure out if DFC....
    nfCommanderImagePrimary = card.image_uris.normal;

    //   Replace Img Source
    var nfCommanderImageId = "nfcommander-image";
    document.getElementById(nfCommanderImageId).src = nfCommanderImagePrimary;
    nfCommanderImageElement = document.getElementById(nfCommanderImageId);
    nfCommanderImageElement.src = nfCommanderImagePrimary;

    //  When card has loaded...Flip and wait accordingly
    let nfCommanderStack = document.getElementById("nfcommander-image").closest(".both-cards");
    nfCommanderImageElement.addEventListener("load", cardImageLoaded(nfCommanderImageElement, nfCommanderImagePrimary, nfCommanderStack));

    //  Insert Price
    const nfCommanderElement = document.getElementById("nfcommander-price");
    nfCommanderElement.innerText = USDollar.format(nfCommanderPrice);

    //  Insert Roll
    const nfCommanderRollElement = document.getElementById("nfcommander-roll");
    nfCommanderRollElement.innerText = "Roll: " + nfCommanderRoll.toFixed(0);

    //  Push price to price array
    myPrices.push(nfCommanderPrice);
}

async function nfBoosterFun_EOE() {
    // Random number between 0 and 100
    nfBoosterFunRoll = getRandomNumber(0, 100);
    var nfBoosterFunLink = "";

    // Override roll
    // nfBoosterFunRoll = 99.1;

    if (nfBoosterFunRoll <= 47) {
        nfBoosterFunType = "Non-foil Extended-art, Rare";
        nfBoosterFunRarity = "47%";
        nfBoosterFunLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+rarity%3Ar++%28CN>%3D317+AND+CN<%3D356%29&unique=cards";
    } else if (nfBoosterFunRoll <= 52) {
        nfBoosterFunType = "Extended-art, Mythic";
        nfBoosterFunRarity = "5%";
        nfBoosterFunLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+rarity%3Am+%28CN>%3D317+AND+CN<%3D356%29&unique=cards";
    } else if (nfBoosterFunRoll <= 59) {
        nfBoosterFunType = "Rare Borderless Viewport Land";
        nfBoosterFunRarity = "7%";
        nfBoosterFunLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+rarity%3Ar++%28CN>%3D277+AND+CN<%3D286%29&unique=cards";
    } else if (nfBoosterFunRoll <= 63) {
        nfBoosterFunType = "Mythic Borderless Viewport Land";
        nfBoosterFunRarity = "4%";
        nfBoosterFunLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+rarity%3Am+%28CN>%3D277+AND+CN<%3D286%29&unique=cards";
    } else if (nfBoosterFunRoll <= 80) {
        nfBoosterFunType = "Rare Borderless Triumphant";
        nfBoosterFunRarity = "17%";
        nfBoosterFunLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+rarity%3Ar+%28CN>%3D287+AND+CN<%3D302%29&unique=cards";
    } else if (nfBoosterFunRoll <= 83) {
        nfBoosterFunType = "Mythic Borderless Triumphant";
        nfBoosterFunRarity = "3%";
        nfBoosterFunLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+rarity%3Am+%28CN>%3D287+AND+CN<%3D302%29&unique=cards";
    } else if (nfBoosterFunRoll <= 98) {
        nfBoosterFunType = "Rare Borderless Surreal Space";
        nfBoosterFunRarity = "15%";
        nfBoosterFunLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+rarity%3Ar+%28CN>%3D303+AND+CN<%3D316%29&unique=cards";
    } else {
        nfBoosterFunType = "Mythic Borderless Surreal Space";
        nfBoosterFunRarity = "2%";
        nfBoosterFunLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+rarity%3Am+%28CN>%3D303+AND+CN<%3D316%29&unique=cards";
    }

    let response = await fetch(nfBoosterFunLink);

    // waits until Scryfall fetch completes...
    let card = await response.json();
    nfBoosterFunName = card.name;
    window.cardInfo.nfboosterfun = [nfBoosterFunName, nfBoosterFunType, nfBoosterFunRarity];

    nfBoosterFunPrice = convertCurrency(card.prices.usd * priceCut);

    // Replace Img Source
    nfBoosterFunImagePrimary = card.image_uris.normal;
    nfBoosterFunImageElement = document.getElementById("nfboosterfun-image");
    nfBoosterFunImageElement.src = nfBoosterFunImagePrimary;

    //  When card has loaded...Flip and wait accordingly
    let nfBoosterFunStack = nfBoosterFunImageElement.parentElement;
    nfBoosterFunStack = document.getElementById("nfboosterfun-image").closest(".both-cards");
    nfBoosterFunImageElement.addEventListener("load", cardImageLoaded(nfBoosterFunImageElement, nfBoosterFunImagePrimary, nfBoosterFunStack));

    //  Insert Price
    const nfBoosterFunPriceElement = document.getElementById("nfboosterfun-price");
    nfBoosterFunPriceElement.innerText = USDollar.format(nfBoosterFunPrice);

    //  Insert Roll
    const nfBoosterFunRollElement = document.getElementById("nfboosterfun-roll");
    nfBoosterFunRollElement.innerText = "Roll: " + nfBoosterFunRoll.toFixed(0);

    //  Push price to price array
    myPrices.push(nfBoosterFunPrice);
}

async function landCelestialPull_EOE() {
    // Random number between 0 and 100
    landCelestialRoll = getRandomNumber(0, 100);
    var landCelestialLink = "";

    // Override roll
    // landCelestialRoll = 99.1;

    if (landCelestialRoll <= 34.5) {
        // Foil full-art land
        landCelestialLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+type%3Abasic+is%3Afullart";
        landCelestialType = "Full-art Celestial Basic Land (Foil)";
        landCelestialRarity = "66.6%";
    } else {
        landCelestialLink = "https://api.scryfall.com/cards/random?q=set%3Aeoe+type%3Abasic+is%3Afullart+is%3Agalaxyfoil";
        landCelestialType = "Full-art Celestial Basic Land (Galaxy Foil)";
        landCelestialRarity = "33.3%";
    }

    let response = await fetch(landCelestialLink);

    // waits until Scryfall fetch completes...
    let card = await response.json();
    landCelestialName = card.name;
    window.cardInfo.landcelestial = [landCelestialName, landCelestialType, landCelestialRarity];

    var landCelestialImageElement = document.getElementById("landcelestial-image").previousElementSibling;

    // Add foil effect if foil
    landCelestialImageElement.classList.add("foil-gradient");

    // Set price, foil price if foil
    landCelestialPrice = Number(card.prices.usd_foil * priceCut);

    //   Replace Img Source
    landCelestialImagePrimary = card.image_uris.normal;
    document.getElementById("landcelestial-image").src = landCelestialImagePrimary;

    //  When Land/Common Image has loaded...Flip and wait accordingly
    const landCelestialStack = landCelestialImageElement.closest(".both-cards");
    landCelestialImageElement.addEventListener("load", cardImageLoaded(landCelestialImageElement, landCelestialImagePrimary, landCelestialStack));

    //  Insert Price
    const landCelestialPriceElement = document.getElementById("landcelestial-price");
    landCelestialPriceElement.innerText = USDollar.format(landCelestialPrice);

    //  Insert Roll
    const landCelestialRollElement = document.getElementById("landcelestial-roll");
    landCelestialRollElement.innerText = "N/A";

    //  Push price to price array
    myPrices.push(landCelestialPrice);
}

async function landStellarPull_EOE() {
    // Random number between 0 and 100.5
    landStellarRoll = getRandomNumber(0, 100.5);
    var landStellarLink = "";

    // Override roll
    // landStellarRoll = 99.1;

    if (landStellarRoll <= 36) {
        // Foil full-art land
        landStellarLink = "https://api.scryfall.com/cards/random?q=set%3Aeos+rarity%3Ar+%28CN>%3D1+AND+CN<%3D45%29&unique=cards";
        landStellarType = "Stellar Sights Land, Rare";
        landStellarRarity = "36%";
    } else if (landStellarRoll <= 45) {
        landStellarLink = "https://api.scryfall.com/cards/random?q=set%3Aeos+rarity%3Am+%28CN>%3D1+AND+CN<%3D45%29&unique=cards";
        landStellarType = "Stellar Sights Land, Mythic";
        landStellarRarity = "9%";
    } else if (landStellarRoll <= 63) {
        landStellarLink = "https://api.scryfall.com/cards/random?q=set%3Aeos+rarity%3Ar+%28CN>%3D46+AND+CN<%3D90%29&unique=cards";
        landStellarType = "Poster Stellar Sights Land, Rare";
        landStellarRarity = "18%%";
    } else if (landStellarRoll <= 67) {
        landStellarLink = "https://api.scryfall.com/cards/random?q=set%3Aeos+rarity%3Am+%28CN>%3D46+AND+CN<%3D90%29&unique=cards";
        landStellarType = "Poster Stellar Sights Land, Mythic";
        landStellarRarity = "4%";
    } else if (landStellarRoll <= 79) {
        landStellarLink = "https://api.scryfall.com/cards/random?q=set%3Aeos+rarity%3Ar+%28CN>%3D1+AND+CN<%3D45%29&unique=cards";
        landStellarType = "Stellar Sights Land, Rare (Foil)";
        landStellarRarity = "12%";
    } else if (landStellarRoll <= 82) {
        landStellarLink = "https://api.scryfall.com/cards/random?q=set%3Aeos+rarity%3Am+%28CN>%3D1+AND+CN<%3D45%29&unique=cards";
        landStellarType = "Stellar Sights Land, Mythic (Foil)";
        landStellarRarity = "3%";
    } else if (landStellarRoll <= 88) {
        landStellarLink = "https://api.scryfall.com/cards/random?q=set%3Aeos+rarity%3Ar+%28CN>%3D46+AND+CN<%3D90%29&unique=cards";
        landStellarType = "Poster Stellar Sights Land, Rare (Foil)";
        landStellarRarity = "6%";
    } else if (landStellarRoll <= 89.5) {
        landStellarLink = "https://api.scryfall.com/cards/random?q=set%3Aeos+rarity%3Am+%28CN>%3D46+AND+CN<%3D90%29&unique=cards";
        landStellarType = "Poster Stellar Sights Land, Mythic (Foil)";
        landStellarRarity = "1.5%";
    } else if (landStellarRoll <= 95.5) {
        landStellarLink = "https://api.scryfall.com/cards/random?q=set%3Aeos+rarity%3Ar+%28CN>%3D91+AND+CN<%3D135%29&unique=cards";
        landStellarType = "Stellar Sights Land, Rare (Galaxy Foil)";
        landStellarRarity = "6%";
    } else if (landStellarRoll <= 97) {
        landStellarLink = "https://api.scryfall.com/cards/random?q=set%3Aeos+rarity%3Am+%28CN>%3D91+AND+CN<%3D135%29&unique=cards";
        landStellarType = "Stellar Sights Land, Mythic (Galaxy Foil)";
        landStellarRarity = "1.5%";
    } else if (landStellarRoll <= 100) {
        landStellarLink = "https://api.scryfall.com/cards/random?q=set%3Aeos+rarity%3Ar+%28CN>%3D135+AND+CN<%3D180%29&unique=cards";
        landStellarType = "Poster Stellar Sights Land, Rare (Galaxy Foil)";
        landStellarRarity = "3%";
    } else {
        landStellarLink = "https://api.scryfall.com/cards/random?q=set%3Aeos+rarity%3Am+%28CN>%3D135+AND+CN<%3D180%29&unique=cards";
        landStellarType = "Poster Stellar Sights Land, Mythic (Galaxy Foil)";
        landStellarRarity = "< 1%";
    }

    let response = await fetch(landStellarLink);

    // waits until Scryfall fetch completes...
    let card = await response.json();
    landStellarName = card.name;
    window.cardInfo.landstellar = [landStellarName, landStellarType, landStellarRarity];

    var landStellarImageElement = document.getElementById("landstellar-image").previousElementSibling;

    // Add foil effect if foil

    //  Add foil effect
    if (landStellarType.includes("Galaxy Foil")) {
        landStellarImageElement.previousElementSibling.classList.add("galaxy-gradient");
    } else if (landStellarType.includes("(Foil)")) {
        landStellarImageElement.previousElementSibling.classList.remove("galaxy-gradient");
        landStellarImageElement.classList.add("foil-gradient");
    } else {
        landStellarImageElement.classList.remove("galaxy-gradient");
        landStellarImageElement.classList.remove("foil-gradient");
    }

    // Set price, foil price if foil
    if (!landStellarType.includes("(Foil)")) {
        landStellarPrice = Number(card.prices.usd * priceCut);
    } else {
        landStellarPrice = Number(card.prices.usd_foil * priceCut);
    }

    //   Replace Img Source
    landStellarImagePrimary = card.image_uris.normal;
    document.getElementById("landstellar-image").src = landStellarImagePrimary;

    //  When Land/Common Image has loaded...Flip and wait accordingly
    const landStellarStack = landStellarImageElement.closest(".both-cards");
    landStellarImageElement.addEventListener("load", cardImageLoaded(landStellarImageElement, landStellarImagePrimary, landStellarStack));

    //  Insert Price
    const landStellarPriceElement = document.getElementById("landstellar-price");
    landStellarPriceElement.innerText = USDollar.format(landStellarPrice);

    //  Insert Roll
    const landStellarRollElement = document.getElementById("landstellar-roll");
    landStellarRollElement.innerText = "N/A";

    //  Push price to price array
    myPrices.push(landStellarPrice);
}
