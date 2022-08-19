import { readTextFile, writeTextFile, createDir, BaseDirectory } from "@tauri-apps/api/fs";

const main = async () => {
    const contents = await readTextFile("cards.json", {
        dir: BaseDirectory.App,
    }).catch(async () => {
        await createDir("", { dir: BaseDirectory.App, recursive: true });
        await writeTextFile("cards.json", "{}", { dir: BaseDirectory.App });
        return "{}";
    });

    const cards = JSON.parse(contents);
    console.log(cards, typeof(cards));
};

main();

