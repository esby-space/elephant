import { Keyboard } from "./keyboard";
import {
    readTextFile,
    writeTextFile,
    createDir,
    BaseDirectory,
} from "@tauri-apps/api/fs";

const main = async () => {
    const data = await fetchData();
    UI.init(data);
};

const fetchData = async () => {
    const contents = await readTextFile("cards.json", {
        dir: BaseDirectory.App,
    }).catch(async () => {
        const response = await fetch("./default.json");
        const data = await response.text();

        await createDir("", { dir: BaseDirectory.App, recursive: true });
        await writeTextFile("cards.json", data, { dir: BaseDirectory.App });
        return data;
    });

    return JSON.parse(contents);
};

const UI = (() => ({
    data: null as any,
    files: document.querySelector("#files") as HTMLElement,
    init(data: any) {
        this.data = data;

        // fill in side bar with card decks
        data.decks.forEach((deck: any, i: number) => {
            const element = document.createElement("li");
            element.innerHTML = deck.name;
            this.files.append(element);
            element.onclick = () => (this.deck = i);
        });

        // handle cards
        const card = document.querySelector("#card") as HTMLElement;
        card.onclick = () => (this.flipped = !this.flipped);
        Keyboard("ArrowRight").press = () => this.card++;
        Keyboard("ArrowLeft").press = () => this.card--;
    },

    _deck: 0,
    set deck(i: number) {
        this._deck = i;
        document.querySelector(".active-deck")?.classList.remove("active-deck");
        this.files.children[i].classList.add("active-deck");

        this.flipped = false;
        this.card = 0;
    },

    _card: 0,
    question: document.querySelector("#question") as HTMLElement,
    answer: document.querySelector("#answer") as HTMLElement,
    set card(i: number) {
        const deck = this.data.decks[this._deck];
        if (i < 0 || i >= deck.cards.length) return;

        this._card = i;
        this.question.innerHTML = deck.cards[i].question;
        this.answer.innerHTML = deck.cards[i].answer;
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
}))();

main();
