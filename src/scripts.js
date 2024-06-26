rarePrice = 0;
newTotal = 0;
boosterValue = 15;
boostersBought = 0;
commonSum = 0;
uncommonSum = 0;

myPrices = [];

function hitMe() {
  // Reset the slider
  const slider = document.querySelector("#sound-slider");
  slider.value = 10;

  //  update hitCount to track multiple triggers
  // var hitCount = document.getElementById("hit-counter");
  // hitCount.innerText += "0";

  commonPull_1();

  // Pull several Commons, is:first-printing
  multiplePull("Common", "common-set", 2, 7, "https://api.scryfall.com/cards/random?q=set%3Amh3+%28game%3Apaper%29+rarity%3Ac+is%3Afirst-printing");

  uncommonPull();

  rarePull();

  newModernPull();

  landcommonPull();

  wildcardPull();

  foilPull();

  sumTotals();
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
    console.log("Roll for Wildcard: " + wildcardBorderlessRandom);
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

  console.log("Wildcard Type: " + wildcardType);
  return wildcardLink;
}

let USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

async function commonPull_1() {
  var commonLink_1 = "";

  //Common 1 roll - Is list?
  commonRollRaw = getRandomNumber(60, 64);
  commonRoll = Math.round(commonRollRaw);

  // Override roll
  // commonRoll = 64;

  if (commonRoll === 64) {
    // Special Guest, set:spg date:2024-06-07
    commonType = "Special Guest";
    commonLink_1 = "https://api.scryfall.com/cards/random?q=set%3Aspg+date%3A2024-06-07+%28game%3Apaper%29";
  } else {
    // Regular Common
    // rarity:c is:first-printing
    commonType = "Common";
    commonLink_1 = "https://api.scryfall.com/cards/random?q=set%3Amh3+%28game%3Apaper%29+rarity%3Ac+is%3Afirst-printing";
  }

  let response = await fetch(commonLink_1);

  //  waits until Scryfall fetch completes...
  let common_1 = await response.json();
  console.log(common_1);
  commonName_1 = common_1.name;

  //  Set Price, but check for Foil Price
  if (common_1.prices.usd !== null) {
    commonPrice_1 = Number(common_1.prices.usd);
  } else {
    commonPrice_1 = Number(common_1.prices.usd_foil);
  }

  //  Push price to price array
  myPrices.push(commonPrice_1);

  //  Replace Img Source
  commonImage_1 = common_1.image_uris.normal;
  document.getElementById("common-image-1").src = commonImage_1;

  //  Insert Price Element for Common-1
  //  const commonPriceElement_1 = document.getElementById("common-price-1");
  //  commonPriceElement_1.innerText = USDollar.format(commonPrice_1);

  console.log("Common #1 Price: " + commonPrice_1);
}

async function multiplePull(rarity, pageElement, startNum, endNum, scryfallLink) {
  // Clear out all common card divs, if they exist
  commonSum = 0;
  cardSet = document.getElementById(pageElement);
  while (cardSet.firstChild) {
    cardSet.removeChild(cardSet.lastChild);
  }

  //  Get card from Scryfall
  for (i = startNum; i < endNum; i++) {
    let response = await fetch(scryfallLink);
    let card = await response.json(scryfallLink);
    // console.log(card);
    cardName = card.name;
    cardPrice = Number(card.prices.usd);

    //  Replace Img Source, check for DFC
    if (cardName.includes("//")) {
      uncommonImage = card.card_faces[0].image_uris.normal;
    } else {
      uncommonImage = card.image_uris.normal;
    }

    //  Make card element
    var cardElement = document.createElement("div");
    var positionClass = "position-" + i;
    cardElement.classList.add("card-default", "w-44", "sm:w-60", positionClass);

    // Make image element, append to card
    var cardImage = document.createElement("img");
    cardImage.classList.add("w-full", "rounded-lg");
    cardImage.src = uncommonImage;

    //  Append the card element, attach image to the last one
    cardSet.appendChild(cardElement);
    cardSet.lastChild.appendChild(cardImage);

    //  Append Title and price
    var cardTitle = "Slot #" + i + " - " + rarity;
    var cardTitleElement = document.createElement("div");
    cardTitleElement.classList.add("text-center");
    cardTitleElement.innerText = cardTitle;
    cardElement.appendChild(cardTitleElement);

    var cardPrice = Number(card.prices.usd);
    var cardPriceElement = document.createElement("div");
    cardPriceElement.classList.add("text-center");
    cardPriceElement.innerText = "$" + cardPrice.toFixed(2);
    cardElement.appendChild(cardPriceElement);

    //  Create Sum Element
    commonSum = commonSum + cardPrice;

    console.log("Common #" + i + " price: " + cardPrice);

    //  Push price to price array
    myPrices.push(cardPrice);
    console.log("now pushed: " + myPrices);
  }
}

async function uncommonPull() {
  // Clear out all uncommon card divs, if they exist
  uncommonSet = document.getElementById("uncommon-set");
  // while (uncommonSet.firstChild) {
  //   uncommonSet.removeChild(uncommonSet.lastChild);
  // }
  //  Get card from Scryfall
  for (j = 1; j < 4; j++) {
    let response = await fetch("https://api.scryfall.com/cards/random?q=set%3Amh3+%28game%3Apaper%29+rarity%3Au+is%3Afirstprinting");
    let uncommonCard = await response.json();
    // console.log(uncommonCard);
    uncommonName = uncommonCard.name;
    uncommonPrice = Number(uncommonCard.prices.usd);

    //  Replace Img Source, check for DFC
    if (uncommonName.includes("//")) {
      uncommonImage = uncommonCard.card_faces[0].image_uris.normal;
    } else {
      uncommonImage = uncommonCard.image_uris.normal;
    }

    var uncommonImageId = "uncommon-image-" + j;
    uncommonImageElement = document.getElementById(uncommonImageId);
    uncommonImageElement.src = uncommonImage;

    //  Make card element
    // var uncommonElement = document.createElement("div");
    // var uncommonPositionClass = "position-" + j;
    // uncommonElement.classList.add("card-default", uncommonPositionClass);

    // Make image element, append to card
    // var uncommonImage = document.createElement("img");
    // uncommonImage.classList.add("w-60", "rounded-lg");
    // uncommonImage.src = imagePrimary;

    //  Append the card element, attach image to the last one
    // uncommonSet.appendChild(uncommonElement);
    // uncommonSet.lastChild.appendChild(uncommonImage);

    //  Append Title and price
    // var uncommonTitle = "Slot #" + j + " - Uncommon";
    // var uncommonTitleElement = document.createElement("div");
    // uncommonTitleElement.classList.add("text-center");
    // uncommonTitleElement.innerText = uncommonTitle;
    // uncommonElement.appendChild(uncommonTitleElement);

    var uncommonPrice = Number(uncommonCard.prices.usd);
    // var uncommonPriceElement = document.createElement("div");
    // uncommonPriceElement.classList.add("text-center");
    // uncommonPriceElement.innerText = "$" + uncommonPrice.toFixed(2);
    // uncommonElement.appendChild(uncommonPriceElement);

    //  Create Uncommon Sum Element
    uncommonSum = uncommonSum + uncommonPrice;

    //  Push price to price array
    console.log("Uncommon " + j + " price: " + uncommonPrice);
    myPrices.push(uncommonPrice);
  }

  const uncommonSumElement = document.getElementById("uncommon-sum");
  uncommonSumElement.innerText = uncommonSum;

  // Set Sum on page, clear value.
  uncommonSumElement.innerText = "Total: $" + uncommonSum.toFixed(2);
  uncommonSum = 0;
}

async function rarePull() {
  //Rare roll
  const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  // Random number between 0 and 100
  rareRoll = getRandomNumber(0, 100);
  var rareLink = "";

  // Override roll
  // rareRoll = 91;

  if (rareRoll <= 79.8) {
    rareType = "Normal Rare";
    // rarity:r (is:first-printing OR is:fetchland)
    rareLink = "https://api.scryfall.com/cards/random?q=set%3Amh3+%28game%3Apaper%29+rarity%3Ar+%28is%3Afirst-printing+OR+is%3Afetchland%29";
  } else if (rareRoll <= 92.8) {
    // Mythics include DFC Planeswalkers
    // rarity:m  is:first-printing
    rareLink = "https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+rarity%3Am+is%3Afirst-printing";
    rareType = "Mythic Rare";
  } else if (rareRoll <= 94.9) {
    // Retro frames include 24 Rares, 8 Mythics
    // (rarity:r OR rarity:m) frame:old
    rareLink = "https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+%28rarity%3Ar+OR+rarity%3Am%29+frame%3Aold";
    rareType = "Retro Frame";
  } else {
    // Borderless, fetch lands, concept Eldrazi, DFC planeswalkers, frame break, profile, other borderless rares or mythic rares.
    //  (rarity:r OR rarity:m) (frame:extendedart OR is:concept OR type:planeswalker OR border:borderless)
    rareLink =
      "https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+%28rarity%3Ar+OR+rarity%3Am%29+%28frame%3Aextendedart+OR+is%3Aconcept+OR+type%3Aplaneswalker+OR+border%3Aborderless%29";
    rareType = "Booster Fun";
  }

  let response = await fetch(rareLink);

  // waits until Scryfall fetch completes...
  let card = await response.json();
  // console.log(card);
  rareName = card.name;
  rarePrice = Number(card.prices.usd);

  // TO FIX: figure out if DFC....
  if (rareName.includes("//")) {
    rareImagePrimary = card.card_faces[0].image_uris.normal;
  } else {
    rareImagePrimary = card.image_uris.normal;
  }

  //   Replace Img Source
  document.getElementById("rare-image").src = rareImagePrimary;

  //  Insert Price
  const rarePriceElement = document.getElementById("rare-price");
  rarePriceElement.innerText = USDollar.format(rarePrice);

  //  Insert Roll
  const rareRollElement = document.getElementById("rare-roll");
  rareRollElement.innerText = "Roll: " + rareRoll.toFixed(0);

  //  Push price to price array
  console.log("Rare price: " + rarePrice);
  myPrices.push(rarePrice);
}

async function newModernPull() {
  //  New-to-Modern roll
  const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  // Random number between 0 and 100
  newModernRoll = getRandomNumber(0, 100);
  var newModernLink = "";

  // Override roll
  // newModernRoll = 99;

  let newModernType = "unknown";
  if (newModernRoll <= 75.0) {
    newModernType = "Uncommon New-to-Modern";
    // Uncommon, New-to-Modern (75%)
    // rarity:u, not:firstprinting
    newModernLink = "https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+rarity%3Au+not%3Afirstprinting";
  } else if (newModernRoll <= 96.3) {
    // Rare, New-to-Modern (21.3%)
    // rarity:u, not:firstprinting
    newModernLink = "https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+rarity%3Ar++not%3Afirstprinting+-type%3Aland";
    newModernType = "Rare New-to-Modern";
  } else if (newModernRoll <= 98.6) {
    // Mythic, New-to-Modern (2.3%)
    // rarity:m not:firstprinting
    newModernLink = "https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+rarity%3Am+not%3Afirstprinting";
    newModernType = "Mythic, New-to-Modern";
  } else if (newModernRoll <= 99.4) {
    // NO DATA? Medallions, Orim's Chant, and Kaalia. Exclude K'rrik, Laelia, Breya
    //
    newModernLink =
      'https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+%28rarity%3Ar+OR+rarity%3Am%29+-type%3Aland+not%3Afirstprinting+is%3Aborderless+-"breya"+-"k%27rrik"+-"laelia"';
    newModernType = "Rare or Mythic, New-to-Modern Frame Break";
  } else if (newModernRoll <= 99.7) {
    // NO DATA? Breya, Kaalia, K'rrik, Laeli
    //  (rarity:r OR rarity:m) not:firstprinting is:borderless (type:legendary AND type:creature)
    newModernLink =
      "https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+%28rarity%3Ar+OR+rarity%3Am%29+not%3Afirstprinting+is%3Aborderless+%28type%3Alegendary+AND+type%3Acreature%29";
    newModernType = "Rare or Mythic, New-to-Modern Borderless Profile";
  } else if (newModernRoll <= 99.9) {
    //  HARD DATA: Rare or Mythic Retro Frame, but NOT Flusterstorm
    //  (rarity:r OR rarity:m) -type:land not:firstprinting frame:old -"flusterstorm"
    newModernLink =
      'https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+%28rarity%3Ar+OR+rarity%3Am%29+-type%3Aland+not%3Afirstprinting+frame%3Aold+-"flusterstorm"';
    newModernType = "Rare or Mythic, New-to-Modern Retro Frame";
  } else {
    // Mythic Retro Frame (just Recruiter of the Guard)
    //  rarity:m not:firstprinting frame:old
    newModernLink = "https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+rarity%3Am+not%3Afirstprinting+frame%3Aold";
    newModernType = "Mythic New-to-Modern Borderless";
  }

  let response = await fetch(newModernLink);

  // waits until Scryfall fetch completes...
  let card = await response.json();
  // console.log(card);
  newModernName = card.name;
  newModernPrice = Number(card.prices.usd);

  // TO FIX: figure out if DFC....
  if (newModernName.includes("//")) {
    newModernImagePrimary = card.card_faces[0].image_uris.normal;
  } else {
    newModernImagePrimary = card.image_uris.normal;
  }

  //  Replace Img Source
  document.getElementById("new-modern-image").src = newModernImagePrimary;

  //  Insert Price
  const newModernPriceElement = document.getElementById("new-modern-price");
  newModernPriceElement.innerText = USDollar.format(newModernPrice);

  //  Insert Roll
  const newModernRollElement = document.getElementById("new-modern-roll");
  newModernRollElement.innerText = "Roll: " + newModernRoll.toFixed(0);

  //  Push price to price array
  console.log("New-to-Modern price: " + newModernPrice);
  myPrices.push(newModernPrice);
}

async function wildcardPull() {
  rollForWildcard();

  console.log("please work" + wildcardLink);

  let response = await fetch(wildcardLink);

  // waits until Scryfall fetch completes...
  let card = await response.json();
  console.log(card);
  wildcardName = card.name;
  wildcardPrice = Number(card.prices.usd);

  //  Replace Img Source
  if (wildcardName.includes("//")) {
    wildcardImagePrimary = card.card_faces[0].image_uris.normal;
  } else {
    wildcardImagePrimary = card.image_uris.normal;
  }
  document.getElementById("wildcard-image").src = wildcardImagePrimary;

  //  Insert Price
  const wildcardPriceElement = document.getElementById("wildcard-price");
  wildcardPriceElement.innerText = USDollar.format(wildcardPrice);

  //  Insert Roll
  const wildcardRollElement = document.getElementById("wildcard-roll");
  wildcardRollElement.innerText = "Roll: " + wildcardRoll.toFixed(0);

  //  Push price to price array
  console.log("Wildcard price: " + wildcardPrice);
  myPrices.push(wildcardPrice);
}

async function foilPull() {
  //  Foil roll
  const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  // Random number between 0 and 100
  foilRoll = getRandomNumber(0, 100);

  var foilLink = "";

  // Override roll
  // foilRoll = 100;

  let foilType = "unknown";
  if (foilRoll <= 43) {
    // 43 card
    // rarity:c, is:firstprinting
    foilLink = "https://api.scryfall.com/cards/random?q=set%3Amh3+not%3Afirstprinting+-type%3Abasic+not%3Afetchland";
    foilType = "Foil New-to-Modern";
  } else if (foilRoll <= 51) {
    // 8 cards
    // not:firstprinting (-type:basic and not:fetchland) frame:old
    foilLink = "https://api.scryfall.com/cards/random?q=set%3Amh3+not%3Afirstprinting+(-type%3Abasic+and+not%3Afetchland)+frame%3Aold";
    foilType = "Foil Retro-frame New-to-Modern";
  } else {
    //  362 cards
    //  see logic for Wildcard roll
    rollForWildcard();

    foilLink = wildcardLink;
    foilType = "Foil Wildcard ";
  }

  console.log("Foil Type: " + foilType);
  console.log("Foil Link: " + foilLink);

  let response = await fetch(wildcardLink);

  // waits until Scryfall fetch completes...
  let card = await response.json();
  console.log(card);
  foilName = card.name;
  foilPrice = Number(card.prices.usd_foil);

  //  Add foil effect
  var foilCard = document.getElementById("foil-card");
  foilCard.firstElementChild.classList.add("foil-gradient");

  //  Replace Img Source
  if (foilName.includes("//")) {
    foilImagePrimary = card.card_faces[0].image_uris.normal;
  } else {
    foilImagePrimary = card.image_uris.normal;
  }
  document.getElementById("foil-image").src = foilImagePrimary;

  //  Insert Price
  const foilPriceElement = document.getElementById("foil-price");
  foilPriceElement.innerText = USDollar.format(foilPrice);

  //  Insert Roll
  const foilRollElement = document.getElementById("foil-roll");
  foilRollElement.innerText = "Roll: " + foilRoll.toFixed(0);

  //  Push price to price array
  console.log("Foil price: " + foilPrice);
  myPrices.push(foilPrice);
}

async function landcommonPull() {
  //Rare roll
  const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  // Random number between 0 and 100
  landcommonRoll = getRandomNumber(0, 100);
  var landcommonLink = "";

  // Override roll
  // landcommonRoll = 98;

  let landcommonType = "unknown";
  if (landcommonRoll <= 50) {
    // rarity:c is:firstprinting
    landcommonLink = "https://api.scryfall.com/cards/random?q=set%3Amh3+rarity%3Ac+is%3Afirstprinting";
    landcommonType = "Common";
  } else if (landcommonRoll <= 70) {
    // Non-foil basic land
    // type:"basic land" unique:art  not:boosterfun not:fullart
    landcommonLink = 'https://api.scryfall.com/cards/random?q=set%3Amh3+type%3A"basic+land"+unique%3Aart++not%3Afullart+not%3Aboosterfun';
    landcommonType = "Non-foil Land";
  } else if (landcommonRoll <= 83.3) {
    // Foil basic land
    // type:"basic land" unique:art  not:boosterfun not:fullart
    landcommonLink = 'https://api.scryfall.com/cards/random?q=set%3Amh3+type%3A"basic+land"+unique%3Aart++not%3Afullart+not%3Aboosterfun';
    landcommonType = "Foil Land";
  } else if (landcommonRoll <= 93.3) {
    // Non-foil full-art Eldrazi land
    // type:"basic land" unique:art is:foil is:fullart
    landcommonLink = 'https://api.scryfall.com/cards/random?q=set%3Amh3+type%3A"basic+land"+unique%3Aart+is%3Afoil+is%3Afullart';
    landcommonType = "Non-Foil Full-Art Land";
  } else {
    // Foil full-art Edlrazi land
    // type:"basic land" unique:art is:foil is:fullart
    landcommonLink = 'https://api.scryfall.com/cards/random?q=set%3Amh3+type%3A"basic+land"+unique%3Aart+is%3Afoil+is%3Afullart';
    landcommonType = "Foil Full-Art Land";
  }

  let response = await fetch(landcommonLink);

  // waits until Scryfall fetch completes...
  let card = await response.json();
  // console.log(card);
  landcommonName = card.name;

  var landcommonCard = document.getElementById("landcommon-card");

  // Add foil effect if foil
  if (landcommonType == "Foil Land" || landcommonType == "Foil Full-Art Land") {
    landcommonCard.firstElementChild.classList.add("foil-gradient");
  } else {
  }

  // Set price, foil price if foil
  if (landcommonType == "Foil Land" || landcommonType == "Foil Full-Art Land") {
    landcommonPrice = Number(card.prices.usd_foil);
  } else {
    landcommonPrice = Number(card.prices.usd);
  }

  landcommonImagePrimary = card.image_uris.normal;

  //   Replace Img Source
  document.getElementById("landcommon-image").src = landcommonImagePrimary;

  //  Insert Price
  const landcommonPriceElement = document.getElementById("landcommon-price");
  landcommonPriceElement.innerText = USDollar.format(landcommonPrice);

  //  Insert Roll
  const landcommonRollElement = document.getElementById("landcommon-roll");
  landcommonRollElement.innerText = "Roll: " + landcommonRoll.toFixed(0);

  //  Push price to price array
  console.log("Land/Common price: " + landcommonPrice);
  console.log("###########: Land Type: " + landcommonType);
  myPrices.push(landcommonPrice);
}

function sumTotals() {
  // Add Boosters Bought
  boostersBought++;
  boosterTotalValue = boostersBought * boosterValue;
  const boostersBoughtElement = document.getElementById("boosters-bought");
  boostersBoughtElement.innerText = boostersBought + (" (" + USDollar.format(boosterTotalValue) + ")");

  function checkIfFinished() {
    return myPrices.length >= 14;
  }

  var timeout = setInterval(function () {
    const loadingOverlay = document.getElementById("data-loading");
    if (checkIfFinished()) {
      clearInterval(timeout);
      isFinished = true;
      console.log("bonk");
      console.log(myPrices);

      loadingOverlay.classList.remove("z-1", "opacity-50");

      const commonSumElement = document.getElementById("common-sum");
      commonSum = commonSum + commonPrice_1;
      commonSumElement.innerText = "Total: $" + commonSum.toFixed(2);
      commomSum = 0;

      //  Sum up all prices in array
      currentMoneyElement = document.getElementById("current-money");
      console.log("sending money up");
      myPrices.forEach((num) => {
        newTotal += num;
      });
      newTotal = newTotal - boosterValue;
      currentMoneyElement.innerText = "$" + newTotal.toFixed(2);

      // Clear array
      myPrices = [];
    }
  }, 100);
}
