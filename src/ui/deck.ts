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

    context: document.querySelector("#deck-context") as HTMLElement,
    delete: document.querySelector("#delete-deck") as HTMLElement,

    createDeck(name: string, id: number) {
        const element = document.createElement("li");
        this.decks.append(element);
        element.innerHTML = name;
        element.onclick = () => {
            this.deck = Array.from(this.decks.children).findIndex(
                (search) => search == element
            );
        };

        // custom context menu
        element.oncontextmenu = (event) => {
            event.preventDefault();

            const box = element.getBoundingClientRect();
            this.context.style.top = `${box.top - box.height / 2}px`;
            this.context.style.left = `${box.right}px`;
            this.context.hidden = false;

            this.delete.onclick = async () => await this.deleteDeck(id);
        };

        // close context menu
        document.body.addEventListener("click", (event) => {
            if ((event.target as HTMLElement).offsetParent != this.context) {
                this.context.hidden = true;
            }
        });

        this.deck = id;
    },

    async deleteDeck(id: number) {
        await Data.deleteDeck(id);
        this.decks.children[id].remove();
    },

    set deck(i: number) {
        Card._deck = i;
        document.querySelector(".active-deck")?.classList.remove("active-deck");
        this.decks.children[i].classList.add("active-deck");

        Card.flipped = false;
        Card.card = 0;
    },
};
