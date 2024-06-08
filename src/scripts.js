rarePrice = 0;
newTotal = 0;
boosterValue = 15;
boostersBought = 0;
commonSum = 0;
uncommonSum = 0;

myPrices = [];

function hitMe() {
  commonPull_1();

  // Pull several Commons
  multiplePull("Common", "common-set", 2, 5, "https://api.scryfall.com/cards/random?q=set%3Amh3+%28game%3Apaper%29+rarity%3Ac+-type%3Abasic");

  uncommonPull();

  rarePull();

  newModernPull();

  sumTotals();
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
    // Regular Common, set:mh3, rarity:c
    commonType = "Common";
    commonLink_1 = "https://api.scryfall.com/cards/random?q=set%3Amh3+%28game%3Apaper%29+rarity%3Ac+-type%3Abasic";
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
  imagePrimary = common_1.image_uris.normal;
  document.getElementById("common-image-1").src = imagePrimary;

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
      imagePrimary = card.card_faces[0].image_uris.normal;
    } else {
      imagePrimary = card.image_uris.normal;
    }

    //  Make card element
    var cardElement = document.createElement("div");
    var positionClass = "position-" + i;
    cardElement.classList.add("card-default", "w-96", "sm:w-60", positionClass);

    // Make image element, append to card
    var cardImage = document.createElement("img");
    cardImage.classList.add("w-full", "rounded-lg");
    cardImage.src = imagePrimary;

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
      imagePrimary = uncommonCard.card_faces[0].image_uris.normal;
    } else {
      imagePrimary = uncommonCard.image_uris.normal;
    }

    var uncommonImageId = "uncommon-image-" + j;
    uncommonImageElement = document.getElementById(uncommonImageId);
    uncommonImageElement.src = imagePrimary;

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

  let rareType = "unknown";
  if (rareRoll <= 79.8) {
    rareType = "Normal Rare";
    // rarity:r
    rareLink = "https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+rarity%3Ar";
  } else if (rareRoll <= 92.8) {
    // Mythics include DFC Planeswalkers
    // (rarity:r OR rarity:m)
    rareLink = "https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+rarity%3Am";
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
      'https://api.scryfall.com/cards/random?q=%28game%3Apaper%29+set%3Amh3+%28rarity%3Ar+OR+rarity%3Am%29+-type%3Aland+not%3Afirstprinting+is%3Aborderless+-"breya"+-"k%27rrik"+-"laelia"&unique=cards&as=grid&order=name';
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

function sumTotals() {
  // Add Boosters Bought
  boostersBought++;
  boosterTotalValue = boostersBought * boosterValue;
  const boostersBoughtElement = document.getElementById("boosters-bought");
  boostersBoughtElement.innerText = boostersBought + (" (" + USDollar.format(boosterTotalValue) + ")");

  function checkIfFinished() {
    return myPrices.length >= 9;
  }

  var timeout = setInterval(function () {
    if (checkIfFinished()) {
      clearInterval(timeout);
      isFinished = true;
      console.log("bonk");
      console.log(myPrices);

      const commonSumElement = document.getElementById("common-sum");
      commonSum = commonSum + commonPrice_1;
      commonSumElement.innerText = "Total: $" + commonSum.toFixed(2);
      // commonSumElement.innerText = "$" + commonSum.toFixed(2);
      commomSum = 0;

      //  Sum up all prices in array
      currentMoneyElement = document.getElementById("current-money");
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
