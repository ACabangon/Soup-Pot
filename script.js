// ======================================
// HOTPOT BROWSER EDITION
// SETUP & GAME INITIALIZATION
// ======================================

// ---------- DOM ELEMENTS ----------

const playerHandEl = document.getElementById("player-hand");
const discardCardEl = document.getElementById("discard-card");
const gameLogEl = document.getElementById("game-log");
const deckCountEl = document.getElementById("deck-count");
const turnIndicatorEl = document.getElementById("turn-indicator");

const drawDeckBtn = document.getElementById("draw-deck-btn");
const takeDiscardBtn = document.getElementById("take-discard-btn");
const newGameBtn = document.getElementById("new-game-btn");

// ---------- HOTPOT INGREDIENTS ----------

// 8 categories
// 3 ingredients per category
// 4 copies of each ingredient

const INGREDIENTS = {
    vegetables: [
        "Carrot",
        "Corn",
        "Potato"
    ],

    spices: [
        "Garlic",
        "Chili Pepper",
        "Flower"
    ],

    meat: [
        "Steak",
        "Bacon",
        "Sausage"
    ],

    seafood: [
        "Fish",
        "Shrimp",
        "Crab"
    ],

    noodles: [
        "Ramen",
        "Rice Noodle",
        "Udon"
    ],

    mushrooms: [
        "Red Mushroom",
        "Blue Mushroom",
        "Enoki"
    ],

    greens: [
        "Bok Choy",
        "Napa Cabbage",
        "Green Onion"
    ],

    tofu: [
        "Firm Tofu",
        "Silken Tofu",
        "Fried Tofu"
    ]
};

// ---------- GAME STATE ----------

let deck = [];
let discardPile = [];

let currentPlayer = 0;

let players = [
    {
        name: "You",
        hand: [],
        isBot: false
    },

    {
        name: "Bot 1",
        hand: [],
        isBot: true
    },

    {
        name: "Bot 2",
        hand: [],
        isBot: true
    },

    {
        name: "Bot 3",
        hand: [],
        isBot: true
    }
];

let hasDrawnThisTurn = false;

function chooseBotMove(bot) {
    return chooseBestDiscard(bot);
}

// ---------- CREATE DECK ----------

function createDeck() {

    const newDeck = [];

    for (const category in INGREDIENTS) {

        const ingredients = INGREDIENTS[category];

        ingredients.forEach(ingredient => {

            for (let i = 0; i < 4; i++) {

            newDeck.push({
                name: ingredient,
                category: category,
                image: `assets/cards/${ingredient
                .toLowerCase()
                .replaceAll(" ", "_")}.png`
            });

            }

        });

    }

    return newDeck;
}

// ---------- SHUFFLE ----------

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

}

// ---------- DEAL CARDS ----------

function dealCards() {

    players.forEach(player => {
        player.hand = [];
    });

    // 8 cards each

    for (let round = 0; round < 8; round++) {

        players.forEach(player => {

            player.hand.push(deck.pop());

        });

    }

}

// ---------- UPDATE DECK COUNT ----------

function updateDeckCount() {

    deckCountEl.textContent =
        `Deck: ${deck.length}`;

}

// ---------- UPDATE BOT COUNTS ----------

function updateBotDisplays() {

    for (let i = 1; i <= 3; i++) {

        const botElement =
            document.getElementById(`bot${i}`);

        botElement.querySelector("span")
            .textContent = players[i].hand.length;

        const cardsContainer =
            botElement.querySelector(".bot-cards");

        cardsContainer.innerHTML = "";

players[i].hand.forEach(card => {

    const img =
        document.createElement("img");

    img.src = card.image;

    img.className = "bot-card-image";

    cardsContainer.appendChild(img);

});

    }

}

// ---------- RENDER PLAYER HAND ----------

function renderPlayerHand() {

    playerHandEl.innerHTML = "";

    players[0].hand.forEach((card, index) => {

        const cardEl = document.createElement("div");

        cardEl.classList.add("card");
        cardEl.classList.add(card.category);

        cardEl.dataset.index = index;

        cardEl.innerHTML = `
        <img src="${card.image}"
         alt="${card.name}"
         class="card-image">
`;

        cardEl.addEventListener("click", () => {
            discardPlayerCard(index);
        });

        playerHandEl.appendChild(cardEl);

    });

}

// ---------- RENDER DISCARD ----------

function renderDiscardPile() {

    if (discardPile.length === 0) {
        discardCardEl.textContent = "Empty";
        return;
    }

    const card =
        discardPile[discardPile.length - 1];

    discardCardEl.innerHTML = `
        <img src="${card.image}"
             alt="${card.name}"
             class="card-image">
    `;
}

// ---------- LOGS ON THE MOVES ----------

function addLog(message) {

    const logEntry =
        document.createElement("div");

    logEntry.classList.add("log-entry");

    logEntry.textContent = message;

    gameLogEl.prepend(logEntry);

}


// ---------- START NEW GAME ----------

function startNewGame() {

    deck = createDeck();

    shuffle(deck);

    discardPile = [];

    currentPlayer = 0;

    hasDrawnThisTurn = false;

    dealCards();

    updateDeckCount();

    updateBotDisplays();

    renderPlayerHand();

    autoCheckWin();

    renderDiscardPile();

    turnIndicatorEl.textContent = "Your Turn";
        
    console.log("New game started.");

    gameLogEl.innerHTML = "";
    addLog("New Game Started");

}

// ---------- BUTTON EVENTS ----------

newGameBtn.addEventListener(
    "click",
    startNewGame
);

// ---------- INITIAL LOAD ----------

startNewGame();

// ======================================
// TURNS, DRAWING & BOT AI
// ======================================

// ---------- DRAW FROM DECK ----------

function drawFromDeck() {

    if (currentPlayer !== 0) return;

    if (hasDrawnThisTurn) {
        alert("You already drew a card.");
        return;
    }

    if (deck.length === 0) {

        deck = createDeck();
        shuffle(deck);
        console.log("Deck reshuffled");

    }

    const card = deck.pop();

    players[0].hand.push(card);

    addLog(
        `You drew ${card.name}`
    );

    hasDrawnThisTurn = true;

    updateDeckCount();
    renderPlayerHand();
    autoCheckWin();

}

// ---------- TAKE DISCARD ----------

function takeDiscard() {

    if (currentPlayer !== 0) return;

    if (hasDrawnThisTurn) {
        alert("You already drew a card.");
        return;
    }

    if (discardPile.length === 0) {
        alert("Discard pile is empty.");
        return;
    }

    const card = discardPile.pop();

    players[0].hand.push(card);

    addLog(
        `You took ${card.name}`
    );

    hasDrawnThisTurn = true;

    renderDiscardPile();
    renderPlayerHand();
    autoCheckWin();

}

// ---------- PLAYER DISCARD ----------

function discardPlayerCard(cardIndex) {

    if (currentPlayer !== 0) return;

    if (!hasDrawnThisTurn) {
        alert("Draw a card first.");
        return;
    }

    const card =
        players[0].hand.splice(cardIndex, 1)[0];

    discardPile.push(card);
    addLog(
        `You discarded ${card.name}`
    );

    hasDrawnThisTurn = false;

    renderPlayerHand();
    renderDiscardPile();
        if (autoCheckWin()) {
            return;
        }
    nextTurn();

}

// ---------- NEXT TURN ----------

function nextTurn() {
    
    console.log("nextTurn called");

    currentPlayer++;

    if (currentPlayer >= players.length) {
        currentPlayer = 0;
    }

    updateTurnDisplay();

    if (players[currentPlayer].isBot) {

        setTimeout(() => {
            botTurn(currentPlayer);
        }, 1000);

    }

}

// ---------- TURN DISPLAY ----------

function updateTurnDisplay() {

    turnIndicatorEl.textContent =
        `${players[currentPlayer].name}'s Turn`;

}


// ---------- BOT LOGIC ----------

function evaluateHand(hand) {

    let score = 0;

    const cardCounts = {};

    hand.forEach(card => {

        cardCounts[card.name] =
            (cardCounts[card.name] || 0) + 1;

    });

    Object.values(cardCounts)
        .forEach(count => {

            if (count === 1)
                score += 5;

            else if (count === 2)
                score += 20;

            else if (count === 3)
                score += 50;

            else if (count > 3)
                score += 50 - ((count - 3) * 30);

        });

    return score;

}

function shouldTakeDiscard(bot) {

    if (discardPile.length === 0) {
        return false;
    }

    const top =
        discardPile[discardPile.length - 1];

    const sameName =
        bot.hand.filter(
            c => c.name === top.name
        ).length;

    const sameCategory =
        bot.hand.filter(
            c => c.category === top.category
        ).length;

    return (
        sameName >= 1 ||
        sameCategory >= 2
    );

}

function chooseBestDiscard(bot) {

    let bestIndex = 0;
    let bestScore = -Infinity;

    for (
        let i = 0;
        i < bot.hand.length;
        i++
    ) {

        const testHand =
            [...bot.hand];

        testHand.splice(i, 1);

        const score =
            evaluateHand(testHand);

        if (score > bestScore) {

            bestScore = score;
            bestIndex = i;

        }

    }

    return bestIndex;

}

// ---------- PLAYER BUTTON EVENTS ----------

drawDeckBtn.addEventListener(
    "click",
    drawFromDeck
);

takeDiscardBtn.addEventListener(
    "click",
    takeDiscard
);

// ---------- PREVENT ACTIONS DURING BOT TURNS ----------

function isPlayerTurn() {

    return currentPlayer === 0;

}

// ======================================
// HOTPOT WIN CHECKING
// ======================================

// ---------- COUNT CARD OCCURRENCES ----------

function getCardCounts(hand) {

    const counts = {};

    hand.forEach(card => {

        const key = card.name;

        counts[key] = (counts[key] || 0) + 1;

    });

    return counts;

}

// ---------- FIND IDENTICAL SETS ----------

function findIdenticalSets(hand) {

    const counts = getCardCounts(hand);

    let setsFound = 0;

    Object.values(counts).forEach(count => {

        if (count >= 3) {
            setsFound++;
        }

    });

    return setsFound;

}

// ---------- FIND CATEGORY SETS ----------

function findCategorySets(hand) {

    let setsFound = 0;

    for (const category in INGREDIENTS) {

        const ingredients =
            INGREDIENTS[category];

        const hasAllThree =
            ingredients.every(ingredient =>
                hand.some(card =>
            card.name === ingredient.name
                )
            );

        if (hasAllThree) {
            setsFound++;
        }

    }

    return setsFound;

}

// ---------- WIN CHECK ----------
//
// Simplified Phase 1 version:
// A winning hand contains
// THREE valid sets total.
//
// Set Types:
// - 3 identical cards
// - 3 different cards in same category
//
// Example:
// Carrot Carrot Carrot
// Fish Fish Fish
// Corn Potato Carrot
//
// = WIN
//

function checkWinningHand(hand) {

    console.log("checkWinningHand called");

    const identicalSets =
        findIdenticalSets(hand);

    const categorySets =
        findCategorySets(hand);

    const totalSets =
        identicalSets + categorySets;

    console.log(
        "Identical:",
        identicalSets,
        "Category:",
        categorySets,
        "Total:",
        totalSets
    );

    return totalSets >= 3;
}

// ---------- PLAYER CHECK WIN ----------

function playerCheckWin() {

    const hand = players[0].hand;

    const won =
        checkWinningHand(hand);

    if (won) {

        alert(
            "Congratulations! You won!"
        );

    } else {

        const identical =
            findIdenticalSets(hand);

        const category =
            findCategorySets(hand);

        alert(
            `Not a winning hand.\n\n` +
            `Identical Sets: ${identical}\n` +
            `Category Sets: ${category}\n\n` +
            `Need at least 3 sets total.`
        );

    }

}

// ---------- BOT WIN CHECK HELPER ----------

function checkAllBotsForWin() {

    for (let i = 1; i < players.length; i++) {

        if (
            checkWinningHand(
                players[i].hand
            )
        ) {

            alert(
                `${players[i].name} wins!`
            );

            return true;

        }

    }

    return false;

}

// ---------- DEBUG COMMANDS ----------

window.debugHand = function () {

    console.table(
        players[0].hand
    );

};

window.debugWin = function () {

    console.log(
        checkWinningHand(
            players[0].hand
        )
    );

};

// ---------- STARTUP MESSAGE ----------

console.log(
    "Hotpot Browser Edition Loaded"
);

// ---------- BOT TURN ----------

function botTurn(playerIndex) {

    console.log("Bot turn started:", playerIndex);
    const bot = players[playerIndex];

    // Infinite / reshuffling deck

    if (deck.length === 0) {

        deck = createDeck();
        shuffle(deck);
        console.log("Deck reshuffled for bots");

    }

// Draw card

let drawnCard;

    if (shouldTakeDiscard(bot)) {
        drawnCard = discardPile.pop();
        addLog(
            `${bot.name} took discard`
        );

    } else {
        drawnCard = deck.pop();
    }

    bot.hand.push(drawnCard);

if (checkWinningHand(bot.hand)) {

    addLog(`🏆 ${bot.name} wins!`);
    alert(`${bot.name} wins!`);
    startNewGame();
    return;

}

    addLog(
        `${bot.name} drew a card`
    );

    updateDeckCount();

    // Choose discard

    const discardIndex =
        chooseBotMove(bot);

    // Safety check

    if (
        discardIndex === undefined ||
        discardIndex === null ||
        discardIndex < 0 ||
        discardIndex >= bot.hand.length
    ) {

        console.error(
            "INVALID DISCARD INDEX:",
            discardIndex
        );

        return;

    }

    const discardedCard =
        bot.hand.splice(discardIndex, 1)[0];

    discardPile.push(discardedCard);

    addLog(
        `${bot.name} discarded ${discardedCard.name}`
    );

    renderDiscardPile();

    updateBotDisplays();

    // Check win

    if (autoCheckWin()) {
        return;
    }

    console.log(
    bot.name,
    "Identical Sets:",
    findIdenticalSets(bot.hand),
    "Category Sets:",
    findCategorySets(bot.hand)
    );

    // Advance turn

    currentPlayer++;

    if (currentPlayer >= players.length) {
        currentPlayer = 0;
    }

    updateTurnDisplay();

    // Continue bot chain

    if (players[currentPlayer].isBot) {

        setTimeout(() => {

            botTurn(currentPlayer);

        }, 1000);

    }

}

function autoCheckWin() {

    // Player win

    if (checkWinningHand(players[0].hand)) {

        setTimeout(() => {

            alert("🏆 You Win!");
            startNewGame();
        }, 100);

        return true;
    }

    // Bot wins

    for (let i = 1; i < players.length; i++) {

        if (checkWinningHand(players[i].hand)) {

            setTimeout(() => {

                alert(`🏆 ${players[i].name} Wins!`);
                startNewGame();

            }, 100);

            return true;
        }
    }

    return false;
}

function calculateSetProgress(hand) {

    let score = 0;

    hand.forEach(card => {

        const sameName =
            hand.filter(
                c => c.name === card.name
            ).length;

        const sameCategory =
            hand.filter(
                c => c.category === card.category
            ).length;

        score += sameName * 5;
        score += sameCategory;

    });

    return score;

}