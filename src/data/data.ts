import { ICard, IDeck, IData } from "./types";
import { readTextFile, writeTextFile, createDir, BaseDirectory } from "@tauri-apps/api/fs";

export const Data = {
    data: null as IData | null,

    async fetch() {
        const contents = await readTextFile("elephant.json", {
            dir: BaseDirectory.App,
        }).catch(async () => {
            const response = await fetch("./defaults.json");
            const data = await response.text();

            await createDir("", { dir: BaseDirectory.App, recursive: true });
            await writeTextFile("elephant.json", data, {
                dir: BaseDirectory.App,
            });
            return data;
        });

        this.data = JSON.parse(contents);
    },

    async updateJSON() {
        const data = JSON.stringify(this.data);
        await writeTextFile("elephant.json", data, { dir: BaseDirectory.App });
    },

    get decks() {
        return this.data?.decks as IDeck[];
    },

    get cards() {
        return this.data?.decks.map((deck) => deck.cards) as ICard[][];
    },

    async createDeck(name: string, text: string) {
        const cards = text.split("\n").map((line) => {
            const texts = line.split("\t");
            return {
                question: texts[0] ?? "",
                answer: texts[1] ?? "",
            } as ICard;
        });

        const deck = { name, cards } as IDeck;
        this.data!.decks.push(deck);
        await this.updateJSON();
        return deck;
    },

    async deleteDeck(id: number) {
        this.decks.splice(id, id);
        await this.updateJSON();
    },

    async editDeck(id: number, { name, text }: { name?: string; text?: string }) {
        const deck = this.decks[id];
        if (name) deck.name = name;
        if (text) {
            deck.cards = text.split("\n").map((line) => {
                const texts = line.split("\t");
                return {
                    question: texts[0] ?? "",
                    answer: texts[1] ?? "",
                } as ICard;
            });
        }

        await this.updateJSON();
        return deck;
    },
};
