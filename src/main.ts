import { Data } from "./data/data";
import { Card } from "./ui/card";
import { Deck } from "./ui/deck";
import { CreateDeck } from "./ui/create-deck";
import { EditDeck } from "./ui/edit-deck";

const main = async () => {
    await Data.fetch();
    UI.init();
};

const UI = {
    init() {
        Card.init();
        Deck.init();
        CreateDeck.init();
        EditDeck.init();
    },
};

main();

