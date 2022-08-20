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

const UI = {
    data: null as any,

    files: document.querySelector("#files") as HTMLElement,
    card: document.querySelector("#card") as HTMLElement,
    init(data: any) {
        this.data = data;

        // fill in side bar with card decks
        this.data.decks.forEach((deck: any) => {
            const element = document.createElement("li");
            element.innerHTML = deck.name;
            this.files.append(element);
            element.onclick = (event) => this.changeDeck(event);
        });

        // flip card when click
        this.card.onclick = () => this.flipCard();
    },

    changeDeck(event: MouseEvent) {
        document.querySelector(".active-deck")?.classList.remove("active-deck");
        (event.target as HTMLUListElement).classList.add("active-deck");
    },

    question: document.querySelector("#question") as HTMLElement,
    answer: document.querySelector("#answer") as HTMLElement,
    flipCard() {
        this.question.hidden = !this.question.hidden;
        this.answer.hidden = !this.answer.hidden;
    },
};

main();
