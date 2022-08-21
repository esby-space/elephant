import { Keyboard } from "./keyboard";
import { Card, Deck, Data } from "./types";
import {
    readTextFile,
    writeTextFile,
    createDir,
    BaseDirectory,
} from "@tauri-apps/api/fs";

const main = async () => {
    await Data.fetch();
    UI.init();
};

const Data = {
    data: null as Data | null,

    async fetch() {
        const contents = await readTextFile("cards.json", {
            dir: BaseDirectory.App,
        }).catch(async () => {
            const response = await fetch("./default.json");
            const data = await response.text();

            await createDir("", { dir: BaseDirectory.App, recursive: true });
            await writeTextFile("cards.json", data, { dir: BaseDirectory.App });
            return data;
        });

        this.data = JSON.parse(contents);
    },

    async updateJSON() {
        const data = JSON.stringify(this.data);
        await writeTextFile("cards.json", data, { dir: BaseDirectory.App });
    },

    deck(id: number) {
        return this.data?.decks[id] as Deck;
    },

    card(deck: number, card: number) {
        return this.deck(deck).cards[card];
    },

    async newDeck(name: string, deckString: string) {
        const cards = deckString.split("\n").map((line) => {
            const texts = line.split("\t");
            return {
                question: texts[0],
                answer: texts[1],
            } as Card;
        });

        const deck = { name, cards } as Deck;
        this.data!.decks.push(deck);
        await this.updateJSON();
        return deck;
    },
};

const UI = {
    files: document.querySelector("#files") as HTMLElement,
    init() {
        // fill in side bar with card decks
        Data.data?.decks.forEach((deck: any, i: number) => {
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

        // modals
        const deckModal = document.querySelector("#new-deck") as HTMLElement;
        const create = document.querySelector("#create") as HTMLElement;
        create.onclick = () => (deckModal.hidden = false);
        Keyboard("Escape").press = () => (deckModal.hidden = true);

        // new deck modal
        const deckName = document.querySelector(
            "#new-deck input"
        ) as HTMLInputElement;
        const textArea = document.querySelector(
            "#new-deck textarea"
        ) as HTMLTextAreaElement;

        // allow user to type tab
        textArea.addEventListener("keydown", function (event) {
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
            const deck = await Data.newDeck(deckName.value, textArea.value);
            const element = document.createElement("li");
            element.innerHTML = deck.name;
            this.files.append(element);
            element.onclick = () => (this.deck = Data.data!.decks.length - 1);
        };
    },

    _deck: 0,
    set deck(i: number) {
        this._deck = i;
        document.querySelector(".active-deck")?.classList.remove("active-deck");
        this.files.children[i].classList.add("active-deck");

        this.flipped = false;
        this.card = 0;
    },

    question: document.querySelector("#question") as HTMLElement,
    answer: document.querySelector("#answer") as HTMLElement,

    _card: 0,
    set card(i: number) {
        if (i < 0 || i >= Data.deck(this._deck).cards.length) return;
        this._card = i;

        const card = Data.card(this._deck, this._card);
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

main();
