// describing the structure of cards.json

type IData = {
    decks: IDeck[];
}

type IDeck = {
    name: string;
    cards: ICard[];
}

type ICard = {
    question: string;
    answer: string;
};

export type { ICard, IDeck, IData };

