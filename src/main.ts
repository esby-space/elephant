import { Data } from "./data";
import { Card } from "./ui/card";
import { Deck } from "./ui/deck";
import { CreateDeck } from "./ui/create-deck";

const main = async () => {
    await Data.fetch();
    UI.init();
};

const UI = {
    init() {
        Card.init();
        Deck.init();
        CreateDeck.init();
    },
};

main();
