import { Data } from "../data/data";
import { Card } from "./card";
import { EditDeck } from "./edit-deck";

export const Deck = {
    decks: document.querySelector("#files") as HTMLElement,
    findID(element: HTMLElement) {
        return Array.from(this.decks.children).findIndex(
            (search) => search == element
        );
    },

    init() {
        // fill in side bar with card decks
        Data.decks.forEach((deck) => {
            this.createDeck(deck.name);
        });
        this.deck = 0;
    },

    context: document.querySelector("#deck-context") as HTMLElement,
    delete: document.querySelector("#deck-delete") as HTMLElement,
    edit: document.querySelector("#deck-edit") as HTMLElement,

    createDeck(name: string) {
        const element = document.createElement("li");
        this.decks.append(element);

        element.innerHTML = name;
        element.onclick = () => {
            console.log(this.findID(element));
            this.deck = this.findID(element);
        };

        // custom context menu
        element.oncontextmenu = (event) => {
            event.preventDefault();

            const box = element.getBoundingClientRect();
            this.context.style.top = `${box.top - box.height / 2}px`;
            this.context.style.left = `${box.right}px`;
            this.context.hidden = false;

            const id = this.findID(element);
            this.edit.onclick = () => EditDeck.open(id);
            this.delete.onclick = async () => {
                await Data.deleteDeck(id);
                this.decks.children[id].remove();
                this.deck = id;
            };
        };

        // close context menu
        document.body.addEventListener("click", (event) => {
            if ((event.target as HTMLElement).offsetParent != this.context) {
                this.context.hidden = true;
            }
        });

        this.deck = this.findID(element);
    },

    set deck(id: number) {
        if (id < 0 || id >= this.decks.children.length) return;
        Card._deck = id;
        document.querySelector(".active-deck")?.classList.remove("active-deck");
        this.decks.children[id].classList.add("active-deck");

        Card.flipped = false;
        Card.card = 0;
    },
};
