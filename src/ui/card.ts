import { Keyboard } from "../lib/keyboard";
import { Data } from "../data/data";

export const Card = {
    init() {
        const card = document.querySelector("#card") as HTMLElement;
        card.onclick = () => (Card.flipped = !Card.flipped);
        Keyboard("ArrowRight").press = () => Card.card++;
        Keyboard("ArrowLeft").press = () => Card.card--;
    },

    question: document.querySelector("#question") as HTMLElement,
    answer: document.querySelector("#answer") as HTMLElement,

    _card: 0,
    _deck: 0,
    set card(i: number) {
        if (i < 0 || i >= Data.cards[this._deck].length) return;
        this._card = i;

        const card = Data.cards[this._deck][this._card];
        this.question.innerHTML = card.question;
        this.answer.innerHTML = card.answer;
        this.flipped = false;
    },

    get card() {
        return this._card;
    },

    set flipped(flipped: boolean) {
        this.question.hidden = flipped;
        this.answer.hidden = !flipped;
    },

    get flipped() {
        return this.question.hidden;
    },
};
