import { Data } from "../data";
import { Keyboard } from "../keyboard";
import { Deck } from "./deck";

export const CreateDeck = {
    init() {
        // modals
        const deckModal = document.querySelector("#new-deck") as HTMLElement;
        const create = document.querySelector("#create") as HTMLElement;
        create.onclick = () => (deckModal.hidden = false);
        Keyboard("Escape").press = () => (deckModal.hidden = true);

        // new deck modal
        const name = document.querySelector(
            "#new-deck input"
        ) as HTMLInputElement;
        const text = document.querySelector(
            "#new-deck textarea"
        ) as HTMLTextAreaElement;

        // allow user to type tab
        text.addEventListener("keydown", function (event) {
            if (event.key == "Tab") {
                event.preventDefault();

                const start = this.selectionStart;
                const end = this.selectionEnd;
                this.value =
                    this.value.substring(0, start) +
                    "\t" +
                    this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 1;
            }
        });

        // create a new deck
        const createDeck = document.querySelector(
            "#new-deck button"
        ) as HTMLElement;
        createDeck.onclick = async () => {
            this.createDeck(name.value, text.value);
            deckModal.hidden = true;
            text.value = "";
            name.value = "";
        };
    },

    async createDeck(name: string, text: string) {
        const deck = await Data.createDeck(name, text);
        Deck.createDeck(name, Data.decks.length - 1);
        return deck;
    },
};
