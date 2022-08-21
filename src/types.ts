// describing the structure of cards.json

type Data = {
    decks: Deck[];
}

type Deck = {
    name: string;
    cards: Card[];
}

type Card = {
    question: string;
    answer: string;
};

export type { Card, Deck, Data };

