import { Data } from "../data";
import { Keyboard } from "../keyboard";

export const EditDeck = {
    modal: document.querySelector("#edit-deck") as HTMLElement,
    name: document.querySelector("#edit-deck input") as HTMLInputElement,
    text: document.querySelector("#edit-deck textarea") as HTMLTextAreaElement,

    init() {
        Keyboard("Escape").press = () => (this.modal.hidden = true);

        this.text.addEventListener("keydown", function (event) {
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

        const confirm = document.querySelector("#edit-deck button") as HTMLElement;
        confirm.onclick = async () => {
            await this.editDeck();
            this.modal.hidden = true;
        }
    },

    _deck: 0,
    open(id: number) {
        this._deck = id;
        const deck = Data.decks[this._deck];

        this.modal.hidden = false;
        this.name.value = deck.name;
        this.text.value = deck.cards
            .map((card) => `${card.question}\t${card.answer}`)
            .join("\n");
    },

    async editDeck() {
        await Data.editDeck(this._deck, {
            name: this.name.value || undefined,
            text: this.text.value || undefined,
        })
    }
};
