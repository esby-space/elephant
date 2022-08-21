import { Data } from "../data";
import { Card } from "./card";

export const Deck = {
    decks: document.querySelector("#files") as HTMLElement,

    init() {
        // fill in side bar with card decks
        Data.decks.forEach((deck, i) => {
            this.createDeck(deck.name, i);
        });
        this.deck = 0;
    },

    createDeck(name: string, id: number) {
        const element = document.createElement("li");
        element.innerHTML = name;
        this.decks.append(element);
        element.onclick = () => (this.deck = id);
        this.deck = id;
    },

    set deck(i: number) {
        Card._deck = i;
        document.querySelector(".active-deck")?.classList.remove("active-deck");
        this.decks.children[i].classList.add("active-deck");

        Card.flipped = false;
        Card.card = 0;
    },
};
