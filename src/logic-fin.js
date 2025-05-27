function setFIN() {
    currentSet = "FIN";
    document.cookie = "currentSet = 'FIN'";

    document.getElementById("set-header").innerText = "FINAL FANTASY";

    document.getElementById("set-toggle-1").innerText = "go foundations";
    document.getElementById("set-toggle-1").addEventListener("click", () => {
        setFDN();
    });
    document.getElementById("set-toggle-2").innerText = "go duskmourn";
    document.getElementById("set-toggle-2").addEventListener("click", () => {
        setDSK();
    });
    document.getElementById("set-toggle-3").innerText = "go modern horizons 3";
    document.getElementById("set-toggle-3").addEventListener("click", () => {
        setDSK();
    });
    document.body.style.backgroundImage = "url(img/FIN_bg2.jpg)";

    clearSlots();
    makeFINSlots();
    clearMoney();
}

function makeFINSlots() {
    makeSlot("bfr-1", "B.F. Rare or Mythic #1");
    makeSlot("bfr-2", "B.F. Rare or Mythic #2");
    makeSlot("bfr-3", "B.F. Rare or Mythic #3");
    makeSlot("defaultrare", "Foil Rare or Mythic", true);
    makeSlot("nfbfcu", "Booster Fun (C/U)");
    makeSlot("foilbfcu", "Foil Booster Fun (C/U)", true);
    makeSlot("basicland", "Foil Basic Land", true);
    makeSlot("uncommon", "Foil Uncommons", true, 3);
    makeSlot("common", "Foil Commons", true, 3);
}

function pullFIN() {
    // Prevent slider from triggering pulls multiple times
    if (activeCheck == false) {
        activeCheck = true;

        // Reset the slider
        const slider = document.querySelector("#sound-slider");
        slider.value = 10;

        ghostPull_FIN();

        commonPull_FIN();

        uncommonPull_FIN();

        // rarePull_FIN();

        defaultRarePull_FIN();

        basicLandPull_FIN();

        nfBFCUPull_FIN();

        foilBFCU_FIN();

        threeBFRaresPull_FIN();

        sumTotals_FIN();
    } else {
    }
}

function rollForWildcard() {
    // Wildcard roll
    const getRandomNumber = (min, max) => {
        return Math.random() * (max - min) + min;
    };
    // Random number between 0 and 100
    wildcardRoll = getRandomNumber(0, 100);

    wildcardLink = "";

    // Override roll
    // wildcardRoll = 95.1;

    let wildcardType = "unknown";
    if (wildcardRoll <= 41.7) {
        wildcardType = "Wildcard Common";
        // Common (41.7%)
        // rarity:c, is:firstprinting
        wildcardLink = "https://api.scryfall.com/cards/random?q=set%3Amh3+is%3Afirstprinting+rarity%3Ac";
    } else if (wildcardRoll <= 75.1) {
        // Uncommon, not DFC (33.4%)
        // rarity:u, is:first-printing not:dfc
        wildcardLink = "https://api.scryfall.com/cards/random?q=set%3Amh3+%28game%3Apaper%29+rarity%3Au+is%3Afirst-printing+not%3Adfc";
        wildcardType = "Wildcard Uncommon non-DFC";
    } else if (wildcardRoll <= 83.4) {
        // Uncommon DFC (8.3%)
        // rarity:u is:first-printing is:dfc
        wildcardLink = "https://api.scryfall.com/cards/random?q=set%3Amh3+%28game%3Apaper%29+rarity%3Au+is%3Afirst-printing+is%3Adfc";
        wildcardType = "Wildcard Uncommon DFC";
    } else if (wildcardRoll <= 90.1) {
        // Rare (6.7%)
        // rarity:r (is:first-printing OR is:fetchland)
        wildcardLink = "https://api.scryfall.com/cards/random?q=set%3Amh3+%28game%3Apaper%29+rarity%3Ar+%28is%3Afirst-printing+OR+is%3Afetchland%29";
        wildcardType = "Wildcard Rare";
    } else if (wildcardRoll <= 91.2) {
        // Mythic (1.1%)
        // rarity:u is:first-printing is:dfc
        wildcardLink = "https://api.scryfall.com/cards/random?q=set%3Amh3+%28game%3Apaper%29+rarity%3Am+is%3Afirst-printing";
        wildcardType = "Wildcard Mythic";
    } else if (wildcardRoll <= 91.6) {
        // Borderless (0.4%)

        //  Borderless roll
        const getWildcardBorderlessRandom = () => {
            return Math.random() * (57 - 0);
        };
        // Random number between 0 and 100
        wildcardBorderlessRandom = getWildcardBorderlessRandom();
        if (wildcardBorderlessRandom <= 23) {
            // is Borderless Frame Break, 23 cards
            // (rarity:r or rarity:m) is:first-printing (type:creature OR type:instant OR type:sorcery OR type:enchantment) is:borderless -type:legendary
            wildcardLink =
                "https://api.scryfall.com/cards/random?q=set%3Amh3+is%3Afirstprinting+%28type%3Acreature+OR+type%3Ainstant+OR+type%3Asorcery+OR+type%3Aenchantment%29+is%3Aborderless+-type%3Alegendary";
            wildcardType = "Wildcard Borderless Frame Break";
        } else if (wildcardBorderlessRandom <= 39) {
            // is Other Borderless including DFC and fetchlands
            // (rarity:r or rarity:m) (is:borderless OR frame:extendedart) (is:dfc or is:fetchland or name="Ugin's Labyrinth") unique:art
            wildcardLink =
                'https://api.scryfall.com/cards/random?q=set%3Amh3+%28rarity%3Ar+or+rarity%3Am%29+%28is%3Aborderless+OR+frame%3Aextendedart%29+%28is%3Adfc+or+is%3Afetchland+or+name%3D"Ugin%27s+Labyrinth"%29+unique%3Aart';
            wildcardType = "Wildcard Other Borderless (DFC, Fetchland, Ugin's Labyrinth)";
        } else if (wildcardBorderlessRandom <= 54) {
            // is Borderless Profile
            // (rarity:r or rarity:m) is:first-printing -is:DFC is:borderless (type:creature AND type:legendary AND -is:concept AND -name="emrakul")
            wildcardLink =
                'https://api.scryfall.com/cards/random?q=set%3Amh3+%28rarity%3Ar+or+rarity%3Am%29+is%3Afirst-printing+-is%3ADFC+is%3Aborderless+%28type%3Acreature+AND+type%3Alegendary+AND+-is%3Aconcept+AND+-name%3D"emrakul"%29';
            wildcardType = "Wildcard Borderless Profile";
        } else {
            // is Concept Eldrazi
            // is:concept
            wildcardLink = "https://api.scryfall.com/cards/random?q=set%3Amh3+is%3Aconcept";
            wildcardType = "Wildcard Concept Eldrazi";
        }
    } else if (wildcardRoll <= 95.8) {
        // Retro frame including new-to-Modern uncommons (4.2%)
        // frame:old ((is:firstprinting  and is:fetchland) or (rarity:c or rarity:r or rarity:m) or (rarity:u and is:firstprinting))
        // In other words, all old-borders, *including* five Rare fetches, *including* four new-to-modern Uncommons, *excluding* Mythic Recruiter of the Guard (not new)
        wildcardLink =
            "https://api.scryfall.com/cards/random?q=set%3Amh3+frame%3Aold+%28%28is%3Afirstprinting++and+is%3Afetchland%29+or+%28rarity%3Ac+or+rarity%3Ar+or+rarity%3Am%29+or+%28rarity%3Au+and+is%3Afirstprinting%29%29";
        wildcardType = "Wildcard Retro Frame";
    } else if (wildcardRoll <= 99.5) {
        // Commander Mythic Rare (8 cards)
        // set:m3c rarity:m is:firstprinting
        wildcardLink = "https://api.scryfall.com/cards/random?q=set%3Am3c+rarity%3Am+is%3Afirstprinting";
        wildcardType = "Wildcard Commander Mythic";
    } else {
        //  Snow-Covered Waste, < 0.1%
        //  type:snow
        wildcardLink = "https://api.scryfall.com/cards/random?q=set%3Amh3+type%3Asnow";
        wildcardType = "Wildcard Snow-Covered Wastes";
    }

    return wildcardLink;
}

function ghostPull_FIN() {
    // Set prices and link
    totalBoosterSpend = (boostersBought + 1) * boosterValue;
    boosterSpendTop = convertToUSD(totalBoosterSpend + totalBoosterSpend * 0.12);
    boosterSpendBottom = convertToUSD(totalBoosterSpend - totalBoosterSpend * 0.12);

    ghostLinkHalf = "https://api.scryfall.com/cards/random?q=set%3Afic+unique%3Aprints+";
    ghostLinkConstructed = ghostLinkHalf + "USD>%3D" + boosterSpendBottom + "+" + "USD<%3D" + boosterSpendTop;

    topOutLink = "https://api.scryfall.com/cards/search?order=usd&q=set%3Amh3+unique%3Aprints+USD%3E%3D15";

    fetch(topOutLink)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Could not fetch resource");
            }
            return response.json();
        })

        // First we set the Ghost Card to the TOP PRICE card
        .then((data) => {
            ghostCard = data.data[0];

            if (ghostCard.prices.usd == !null) {
                ghostPrice = ghostCard.prices.usd;
            } else {
                ghostPrice = ghostCard.prices.usd_foil;
            }

            if (totalBoosterSpend <= ghostPrice) {
                ghostLink = ghostLinkConstructed;

                // Get the non-top card
                ghostCard = fetch(ghostLinkConstructed)
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        ghostCard = data;

                        ghostName = data.name;

                        setGhostData();
                    });
            } else {
                ghostLink = ghostCard;
                ghostName = ghostCard.name;

                setGhostData();
            }
        })
        .catch((error) => console.error(error));
}

async function commonPull_FIN() {
    //  Get card from Scryfall
    for (j = 1; j < 4; j++) {
        let response = await fetch("https://api.scryfall.com/cards/random?q=set%3Afin+rarity%3Ac+-type%3Abasic");
        let commonCard = await response.json();
        commonName = commonCard.name;
        commonPrice = convertCurrency(commonCard.prices.usd);

        //  Replace Img Source, check for DFC
        commonImage = commonCard.image_uris.normal;

        var commonImageId = "common-image-" + j;
        commonImageElement = document.getElementById(commonImageId);
        commonImageElement.src = commonImage;

        var commonPrice = Number(commonCard.prices.usd);
        if (currencyMode == "CAD") {
            commonPrice = Number(fx(commonPrice).from("USD").to("CAD"));
        } else {
        }

        //  Create Common Sum Element
        commonSum = commonSum + commonPrice;

        //  Push price to price array
        myPrices.push(commonPrice);

        const commonStack = document.getElementById("common-image-" + j).parentElement;
        commonImageElement.addEventListener("load", cardImageLoaded(commonImageElement, commonImage, commonStack));
    }

    const commonSumElement = document.getElementById("common-sum");
    commonSumElement.innerText = commonSum;

    // Set Sum on page, clear value.
    commonSumElement.innerText = "$" + commonSum.toFixed(2);
    // commonSum = 0;
}

async function uncommonPull_FIN() {
    uncommonSet = document.getElementById("uncommon-set");

    //  Get card from Scryfall
    for (k = 1; k < 4; k++) {
        //  Roll for Cid (the Cid slot is 1 of 109 Uncommons. There are 15 Cid alt-arts between CN 407-416).
        let cidRoll = getRandomInt(1, 109);
        if (cidRoll == 109) {
            response = await fetch("https://api.scryfall.com/cards/random?q=set%3Afin+cn>%3D407+and+cn<%3D416+unique%3Aart");
        } else {
            response = await fetch("https://api.scryfall.com/cards/random?q=set%3Afin+rarity%3Au");
        }

        let uncommonCard = await response.json();

        uncommonName = uncommonCard.name;
        uncommonPrice = convertCurrency(uncommonCard.prices.usd);

        //  Replace Img Source, check for DFC
        if (uncommonCard.layout == "transform" || uncommonCard.layout == "modal_dfc") {
            uncommonImage = uncommonCard.card_faces[0].image_uris.normal;
        } else {
            uncommonImage = uncommonCard.image_uris.normal;
        }

        var uncommonImageId = "uncommon-image-" + k;
        uncommonImageElement = document.getElementById(uncommonImageId);
        uncommonImageElement.src = uncommonImage;

        const uncommonStack = document.getElementById("uncommon-image-" + k).parentElement;
        uncommonImageElement.addEventListener("load", cardImageLoaded(uncommonImageElement, uncommonImage, uncommonStack));

        var uncommonPrice = Number(uncommonCard.prices.usd);
        if (currencyMode == "CAD") {
            uncommonPrice = Number(fx(uncommonPrice).from("USD").to("CAD"));
        } else {
        }

        //  Create Uncommon Sum Element
        uncommonSum = uncommonSum + uncommonPrice;

        //  Push price to price array
        myPrices.push(uncommonPrice);
    }

    const uncommonSumElement = document.getElementById("uncommon-sum");
    uncommonSumElement.innerText = uncommonSum;

    // Set Sum on page, clear value.
    uncommonSumElement.innerText = "$" + uncommonSum.toFixed(2);
    uncommonSum = 0;
}

// async function rarePull_FIN() {
//     //Rare roll
//     const getRandomNumber = (min, max) => {
//         return Math.random() * (max - min) + min;
//     };
//     // Random number between 0 and 100
//     rareRoll = getRandomNumber(0, 100);
//     var rareLink = "";

//     // Override roll
//     // rareRoll = 91;

//     if (rareRoll <= 79.8) {
//         rareType = "Normal Rare";
//         // rarity:r (is:first-printing OR is:fetchland)
//         rareLink = "https://api.scryfall.com/cards/random?q=set%3Amh3+%28game%3Apaper%29+rarity%3Ar+%28is%3Afirst-printing+OR+is%3Afetchland%29";
//     } else if (rareRoll <= 92.8) {
//         // Mythics include DFC Planeswalkers
//         // rarity:m  is:first-printing
//         rareLink = "https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+rarity%3Am+is%3Afirst-printing";
//         rareType = "Mythic Rare";
//     } else if (rareRoll <= 94.9) {
//         // Retro frames include 24 Rares, 8 Mythics
//         // (rarity:r OR rarity:m) frame:old
//         rareLink = "https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+%28rarity%3Ar+OR+rarity%3Am%29+frame%3Aold";
//         rareType = "Retro Frame";
//     } else {
//         // Borderless, fetch lands, concept Eldrazi, DFC planeswalkers, frame break, profile, other borderless rares or mythic rares.
//         //  (rarity:r OR rarity:m) (frame:extendedart OR is:concept OR type:planeswalker OR border:borderless)
//         rareLink =
//             "https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+%28rarity%3Ar+OR+rarity%3Am%29+%28frame%3Aextendedart+OR+is%3Aconcept+OR+type%3Aplaneswalker+OR+border%3Aborderless%29";
//         rareType = "Booster Fun";
//     }

//     let response = await fetch(rareLink);

//     // waits until Scryfall fetch completes...
//     let card = await response.json();
//     rareName = card.name;
//     rarePrice = convertCurrency(card.prices.usd);

//     // TO FIX: figure out if DFC....
//     if (card.layout == "transform" || card.layout == "modal_dfc") {
//         rareImagePrimary = card.card_faces[0].image_uris.normal;
//     } else {
//         rareImagePrimary = card.image_uris.normal;
//     }

//     //   Replace Img Source
//     rareImageElement = document.getElementById("rare-image");

//     //  When Rare Image has loaded...Flip and wait accordingly
//     const rareStack = document.getElementById("rare-image").closest(".both-cards");
//     rareImageElement.addEventListener("load", cardImageLoaded(rareImageElement, rareImagePrimary, rareStack));

//     //  Insert Price
//     const rarePriceElement = document.getElementById("rare-price");
//     rarePriceElement.innerText = USDollar.format(rarePrice);

//     //  Insert Roll
//     const rareRollElement = document.getElementById("rare-roll");
//     rareRollElement.innerText = "Roll: " + rareRoll.toFixed(0);

//     //  Push price to price array
//     myPrices.push(rarePrice);
// }

async function defaultRarePull_FIN() {
    defaultRareRoll = getRandomNumber(0, 100);
    var defaultRareLink = "";

    // Override roll
    // defaultRareRoll = 99;

    if (defaultRareRoll <= 87.75) {
        defaultRareType = "Default Frame Rare";
        //  1 Traditional foil default frame Rare (87.75%);
        //  set:fin rarity:r
        defaultRareType = "Default Frame Rare";
        defaultRareLink = "https://api.scryfall.com/cards/random?q=set%3Afin+rarity%3Ar";
    } else {
        //  1 Traditional foil default frame Mythic (12.25%)
        //  set:fin rarity:m
        defaultRareType = "Default Frame Mythic";
        defaultRareLink = "https://api.scryfall.com/cards/random?q=set%3Afin+rarity%3Am";
    }

    let response = await fetch(defaultRareLink);

    // waits until Scryfall fetch completes...
    let card = await response.json();
    defaultRareName = card.name;
    defaultRarePrice = Number(card.prices.usd);

    // TO FIX: figure out if DFC....
    if (card.layout == "transform" || card.layout == "modal_dfc") {
        defaultRareImagePrimary = card.card_faces[0].image_uris.normal;
    } else {
        defaultRareImagePrimary = card.image_uris.normal;
    }

    //  Replace Img Source
    defaultRareImageElement = document.getElementById("defaultrare-image");

    //  When New Modern Image has loaded...Flip and wait accordingly
    const defaultRareStack = document.getElementById("defaultrare-image").closest(".both-cards");
    defaultRareImageElement.addEventListener("load", cardImageLoaded(defaultRareImageElement, defaultRareImagePrimary, defaultRareStack));

    //  Insert Price
    const defaultRarePriceElement = document.getElementById("defaultrare-price");
    defaultRarePriceElement.innerText = USDollar.format(defaultRarePrice);

    //  Insert Roll
    const defaultRareRollElement = document.getElementById("defaultrare-roll");
    defaultRareRollElement.innerText = "Roll: " + defaultRareRoll.toFixed(0);

    //  Push price to price array
    myPrices.push(defaultRarePrice);
}

async function nfBFCUPull_FIN() {
    let nfBFCUType = "unknown";
    let nfBFCURoll = getRandomNumber(0, 100);

    if (nfBFCURoll <= 66.7) {
        // 1 of 40 Extended-art legendary uncommons (66.7%)
        // set:fin frame:extendedart rarity:u type:legendary
        nfBFCUType = "Extended-art Legendary Uncommon";
        nfBFCULink = "https://api.scryfall.com/cards/random?q=set%3Afin+frame%3Aextendedart+rarity%3Au+type%3Alegendary";
    } else if (nfBFCURoll <= 71.7) {
        // 1 of 3 Main set Booster Fun commons (5%)
        // set:fin is:boosterfun rarity:c -type:basic
        nfBFCUType = "Main Set Booster Fun Common";
        nfBFCULink = "https://api.scryfall.com/cards/random?q=set%3Afin+is%3Aboosterfun+rarity%3Ac+-type%3Abasic";
    } else if (nfBFCURoll <= 98.4) {
        // 1 of 13 Main set Booster Fun Uncommons (26.7%)
        // set:fin is:boosterfun rarity:u (CN>=324 AND CN<=373)
        nfBFCULink = "https://api.scryfall.com/cards/random?q=set%3Afin+is%3Aboosterfun+rarity%3Au+%28CN>%3D324+AND+CN<%3D373%29";
        nfBFCUType = "Wildcard Uncommon DFC";
    } else {
        // 1 of 3 Alternate-art Secret Rendezvous uncommons (1.6%)
        // set:fic (CN>=217 AND CN<=219) unique:art
        nfBFCUType = "Alternate-art Secret Rendezvous Uncommon";
        nfBFCULink = "https://api.scryfall.com/cards/random?q=set%3Afic+%28CN>%3D217+AND+CN<%3D219%29+unique%3Aart";
    }

    let response = await fetch(nfBFCULink);

    // waits until Scryfall fetch completes...
    let card = await response.json();
    nfBFCUName = card.name;
    nfBFCUdPrice = Number(card.prices.usd);

    //  Replace Img Source
    if (card.layout == "transform" || card.layout == "modal_dfc") {
        nfBFCUImagePrimary = card.card_faces[0].image_uris.normal;
    } else {
        nfBFCUImagePrimary = card.image_uris.normal;
    }

    //  Replace Img Source
    nfBFCUImageElement = document.getElementById("nfbfcu-image");

    //  When Wildcard Image has loaded...Flip and wait accordingly
    const nfBFCUStack = document.getElementById("nfbfcu-image").parentElement;
    nfBFCUImageElement.addEventListener("load", cardImageLoaded(nfBFCUImageElement, nfBFCUImagePrimary, nfBFCUStack));

    //  Insert Price
    nfBFCUPrice = Number(card.prices.usd) ? Number(card.prices.usd) : 0;
    const nfBFCUPriceElement = document.getElementById("nfbfcu-price");
    nfBFCUPriceElement.innerText = USDollar.format(nfBFCUPrice);

    //  Insert Roll
    const nfBFCURollElement = document.getElementById("nfbfcu-roll");
    nfBFCURollElement.innerText = "Roll: " + nfBFCURoll.toFixed(0);

    //  Push price to price array
    myPrices.push(nfBFCUPrice);
}

async function foilBFCU_FIN() {
    foilBFCURoll = getRandomNumber(0, 100);

    let foilBFCULink = "";

    // Override roll
    // foilBFCURoll = 99;

    let foilBFCUType = "unknown";
    if (foilBFCURoll <= 13.75) {
        //  1 of 3 Main set Booster Fun commons (13.75%)
        //  set:fin is:boosterfun rarity:c -type:basic
        foilBFCUType = "(Traditional Foil) Main Set Booster Fun Common";
        foilBFCULink = "https://api.scryfall.com/cards/random?q=set%3Afin+is%3Aboosterfun+rarity%3Ac+-type%3Abasic";
    } else if (foilBFCURoll <= 86.5) {
        //  1 of 13 Main set Booster Fun Uncommons (72.75%)
        //  set:fin is:boosterfun rarity:u (CN>=324 AND CN<=373)
        foilBFCUType = "(Traditional Foil) Main Set Booster Fun Uncommon";
        foilBFCULink = "https://api.scryfall.com/cards/random?q=set%3Afin+is%3Aboosterfun+rarity%3Au+%28CN>%3D324+AND+CN<%3D373%29";
    } else if (foilBFCURoll <= 91) {
        //  1 of 3 Alternate-art Secret Rendezvous uncommons (4.5%)
        //  set:fic (CN>=217 AND CN<=219) unique:art
        foilBFCUType = "(Traditional Foil) Alternate-art Secret Rendezvous Uncommon";
        foilBFCULink = "https://api.scryfall.com/cards/random?q=set%3Afic+%28CN>%3D217+AND+CN<%3D219%29+unique%3Aart";
    } else {
        //  1 of 4 Surge Foil Uncommon Borderless Character Cards (9%)
        //  set:fin rarity:u (CN>=519 AND CN<=550) -CN=526b
        foilBFCUType = "Surge Foil Uncommon Borderless Character Card";
        foilBFCULink = "https://api.scryfall.com/cards/random?q=set%3Afin+rarity%3Au+%28CN>%3D519+AND+CN<%3D550%29+-CN%3D526b+";
    }

    let response = await fetch(foilBFCULink);

    // waits until Scryfall fetch completes...
    let card = await response.json();
    foilBFCUName = card.name;
    foilBFCUPrice = Number(card.prices.usd_foil) ? Number(card.prices.usd_foil) : 0;

    //  Replace Img Source
    if (card.layout == "transform" || card.layout == "modal_dfc") {
        foilBFCUImagePrimary = card.card_faces[0].image_uris.normal;
    } else {
        foilBFCUImagePrimary = card.image_uris.normal;
    }

    //  Replace Img Source
    foilBFCUImageElement = document.getElementById("foilbfcu-image");

    //  When Foil Image has loaded...Flip and wait accordingly
    const foilBFCUStack = document.getElementById("foilbfcu-image").closest(".both-cards");
    foilBFCUImageElement.addEventListener("load", cardImageLoaded(foilBFCUImageElement, foilBFCUImagePrimary, foilBFCUStack));

    if (foilBFCUType == "Surge Foil Uncommon Borderless Character Card") {
        foilBFCUImageElement.previousElementSibling.classList.add("surge-gradient");
    } else {
        foilBFCUImageElement.previousElementSibling.classList.remove("surge-gradient");
    }

    //  Insert Price
    const foilBFCUPriceElement = document.getElementById("foilbfcu-price");
    foilBFCUPriceElement.innerText = USDollar.format(foilBFCUPrice);

    //  Insert Roll
    const foilBFCURollElement = document.getElementById("foilbfcu-roll");
    foilBFCURollElement.innerText = "Roll: " + foilBFCURoll.toFixed(0);

    //  Push price to price array
    myPrices.push(foilBFCUPrice);
}

async function basicLandPull_FIN() {
    basicLandRoll = getRandomNumber(0, 100);
    var basicLandLink = "";

    // Override roll
    // landcommonRoll = 98;

    basicLandLink = "https://api.scryfall.com/cards/random?q=set%3Afin+type%3Abasic+unique%3Aart&unique=cards";
    basicLandType = "Basic Land";

    let response = await fetch(basicLandLink);

    // waits until Scryfall fetch completes...
    let card = await response.json();
    basicLandName = card.name;

    // Set price
    basicLandPrice = Number(card.prices.usd_foil);

    basicLandImagePrimary = card.image_uris.normal;

    //  Replace Img Source
    basicLandImageElement = document.getElementById("basicland-image");

    //  When Land/Common Image has loaded...Flip and wait accordingly
    const basicLandStack = basicLandImageElement.closest(".both-cards");
    basicLandImageElement.addEventListener("load", cardImageLoaded(basicLandImageElement, basicLandImagePrimary, basicLandStack));

    //  Insert Price
    const basicLandPriceElement = document.getElementById("basicland-price");
    basicLandPriceElement.innerText = USDollar.format(basicLandPrice);

    //  Push price to price array
    myPrices.push(basicLandPrice);
}

function bfRareSingleRoll(allowFoil = true) {
    let bfRareRoll;
    let hitFoil = false;
    if (allowFoil) {
        bfRareRoll = getRandomNumber(0, 100);
        console.log("full rolling");
    } else {
        bfRareRoll = getRandomNumber(0, 91.0);
        console.log("no-foil rolling");
    }

    if (bfRareRoll > 91.0) {
        console.log("WE HIT FOIL");
        hitFoil = true;
    }

    // Override roll
    // bfRareRoll = 95;

    var bfRareLink = "";
    let foilType = "";

    if (bfRareRoll <= 23.1) {
        //  set:fin is:boosterfun rarity:r unique:art
        bfRareType = "Non-foil main set Booster Fun Rare (23.1%)";
        bfRareLink = "https://api.scryfall.com/cards/random?q=set%3Afin+is%3Aboosterfun+rarity%3Ar+unique%3Aart&unique=cards";
    } else if (bfRareRoll <= 26.9) {
        //  set:fin is:boosterfun rarity:m unique:art
        bfRareType = "Non-foil main set Booster Fun Mythic (3.8%)";
        bfRareLink = "https://api.scryfall.com/cards/random?q=set%3Afin+is%3Aboosterfun+rarity%3Am+unique%3Aart&unique=cards";
    } else if (bfRareRoll <= 45.1) {
        //  set:fin frame:extendedart type:legendary rarity:r unique:art
        bfRareType = "Non-foil extended-art legendary Mythic (18.2%, 44 cards)";
        bfRareLink = "https://api.scryfall.com/cards/random?q=set%3Afin+frame%3Aextendedart+type%3Alegendary+rarity%3Ar+unique%3Aart";
    } else if (bfRareRoll <= 48.0) {
        //  set:fin frame:extendedart type:legendary rarity:r unique:art
        bfRareType = "Non-foil extended-art legendary Mythic (2.9%, 14 cards)";
        bfRareLink = "https://api.scryfall.com/cards/random?q=set%3Afin+frame%3Aextendedart+type%3Alegendary+rarity%3Am+unique%3Aart";
    } else if (bfRareRoll <= 50.9) {
        //  set:fic is:boosterfun rarity:m unique:art (CN>=194 AND CN<=200)
        bfRareType = "Non-foil Booster Fun Commander Rare (2.9%, 16 cards)";
        bfRareLink = "https://api.scryfall.com/cards/random?q=set%3Afic+is%3Aboosterfun+rarity%3Ar+unique%3Aart+%28CN>%3D194+AND+CN<%3D200%29&unique=cards";
    } else if (bfRareRoll <= 54.2) {
        //  set:fic is:boosterfun rarity:m unique:art
        bfRareType = "Non-foil Booster Fun Commander Mythic (3.3%, 16 cards)";
        bfRareLink = "https://api.scryfall.com/cards/random?q=set%3Afic+is%3Aboosterfun+rarity%3Am+unique%3Aart&unique=cards";
    } else if (bfRareRoll <= 65.8) {
        //  set:fic rarity:r frame:extendedart -CN:228 (-type:"legendary creature" AND -type:"legendary artifact creature")
        //  !! Custom query, excludes Legendary Creatures and Herald's Horn, Buy-a-Box Promo
        bfRareType = "Non-foil extended-art non-Legendary Creature Commander Rare (11.6%, 28 cards)";
        bfRareLink =
            "https://api.scryfall.com/cards/random?q=set%3Afic+rarity%3Ar+frame%3Aextendedart+-CN%3A228+%28-type%3A'legendary+creature'+AND+-type%3A'legendary+artifact+creature'%29";
    } else if (bfRareRoll <= 89.4) {
        //  set:fic frame:extendedart rarity:r (type:legendary and type:creature)
        bfRareType = "Non-foil extended-art Legendary Creature Commander Rare (23.6%, 57 cards)";
        bfRareLink = "https://api.scryfall.com/cards/random?q=set%3Afic+frame%3Aextendedart+rarity%3Ar+%28type%3Alegendary+and+type%3Acreature%29";
    } else if (bfRareRoll <= 91.0) {
        //  set:fic frame:extendedart rarity:m (type:legendary and type:creature)
        bfRareType = "Non-foil extended-art Legendary Creature Commander Mythic (1.6%, 8 cards)";
        bfRareLink = "https://api.scryfall.com/cards/random?q=set%3Afic+frame%3Aextendedart+rarity%3Am+%28type%3Alegendary+and+type%3Acreature%29";
    } else if (bfRareRoll <= 92.4) {
        //  set:fic is:boosterfun rarity:r CN>=194
        //  !!! Assuming the Commander set is implied, and that the group of 7 is 7 Summons
        bfRareType = "Foil Booster Fun Rare (1.4%, 7 cards)";
        bfRareLink = "https://api.scryfall.com/cards/random?q=set%3Afic+is%3Aboosterfun+rarity%3Ar+CN>%3D194";
        foilType = "trad";
    } else if (bfRareRoll <= 98.2) {
        //  set:fic rarity:r frame:extendedart -CN:228 (-type:"legendary creature" AND -type:"legendary artifact creature")
        //  !! Custom query, excludes Legendary Creatures and Herald's Horn, Buy-a-Box Promo
        bfRareType = "Foil extended-art Commander Rare (5.8%, 28 cards)";
        bfRareLink =
            "https://api.scryfall.com/cards/random?q=set%3Afic+rarity%3Ar+frame%3Aextendedart+-CN%3A228+%28-type%3A'legendary+creature'+AND+-type%3A'legendary+artifact+creature'%29";
        foilType = "trad";
    } else if (bfRareRoll <= 99) {
        //  set:fic is:boosterfun rarity:m
        bfRareType = "Foil extended-art Commander Mythic (0.8%, 8 cards)";
        bfRareLink = "https://api.scryfall.com/cards/random?q=set%3Afic+rarity%3Am+frame%3Aextendedart";
        foilType = "trad";
    } else {
        //  set:fic is:boosterfun rarity:m
        bfRareType = "Surge Foil extended-art Commander Mythic (1%, 8 cards)";
        bfRareLink = "https://api.scryfall.com/cards/random?q=set%3Afic+rarity%3Am+frame%3Aextendedart";
        foilType = "surge";
    }
    console.log("bfRareRoll: " + bfRareRoll);
    return [bfRareLink, hitFoil, foilType];
}

async function threeBFRaresPull_FIN() {
    let results = [];
    let foilUsed = false;

    for (l = 1; l < 4; l++) {
        // Do a full roll first.
        let fohit = bfRareSingleRoll(!foilUsed);
        if (fohit[1] === true) {
            foilUsed = true;
        }
        results.push(fohit[2]);

        let response = await fetch(fohit[0]);

        // waits until Scryfall fetch completes...
        let card = await response.json();
        bfRareName = card.name;

        // Set price
        bfRarePrice = Number(card.prices.usd_foil);

        //  Set image
        if (card.layout == "transform" || card.layout == "modal_dfc") {
            bfRareImagePrimary = card.card_faces[0].image_uris.normal;
        } else {
            bfRareImagePrimary = card.image_uris.normal;
        }

        //  Replace Img Source
        bfRareImageElement = document.getElementById("bfr-" + l + "-image");

        //  When Land/Common Image has loaded...Flip and wait accordingly
        const bfRareStack = bfRareImageElement.closest(".both-cards");
        bfRareImageElement.addEventListener("load", cardImageLoaded(bfRareImageElement, bfRareImagePrimary, bfRareStack));

        //  Insert Price
        const bfRarePriceElement = document.getElementById("bfr-" + l + "-price");
        bfRarePriceElement.innerText = USDollar.format(bfRarePrice);

        //  Push price to price array
        myPrices.push(bfRarePrice);
    }

    console.log("results: " + results);
}

function sumTotals_FIN() {
    // Add Boosters Bought
    boostersBought++;
    boosterTotalValue = boostersBought * boosterValue;
    const boostersBoughtElement = document.getElementById("boosters-bought");
    boostersBoughtElement.innerText = boostersBought + (" (" + USDollar.format(boosterTotalValue) + ")");

    function checkIfFinished() {
        return myPrices.length >= 11;
    }

    var timeout = setInterval(function () {
        const loadingOverlay = document.getElementById("data-loading");
        if (checkIfFinished()) {
            console.log("checking if finished");
            clearInterval(timeout);
            isFinished = true;

            loadingOverlay.classList.remove("z-10", "loader-blur-effect");
            loadingOverlay.classList.add("-z-10", "opacity-0");

            const commonSumElement = document.getElementById("common-sum");
            commonSumElement.innerText = "$" + commonSum.toFixed(2);
            commonSum = 0;

            //  Sum up all prices in array
            myPrices.forEach((num) => {
                newTotal += num;
            });
            newTotal = newTotal - boosterValue;
            currentMoneyElement.innerText = "$" + newTotal.toFixed(2);
            currentMoneyElement.classList.add("px-3");

            if (newTotal > 0) {
                currentMoneyElement.classList.remove("bg-rose-500");
                currentMoneyElement.classList.add("bg-emerald-500");
            } else {
                currentMoneyElement.classList.remove("bg-emerald-500");
                currentMoneyElement.classList.add("bg-rose-500");
            }

            // Clear array
            myPrices = [];
            activeCheck = false;
            rareFirstFlip = false;
        }
    }, 100);
}
