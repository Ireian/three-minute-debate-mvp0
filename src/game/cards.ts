export const CARD_IDS = [
  "bold-claim",
  "supported-claim",
  "question-premise",
  "counterexample",
  "distinction",
  "clarify-terms",
] as const;

export type CardId = (typeof CARD_IDS)[number];

export interface CardDefinition {
  id: CardId;
  category: "主张" | "质疑" | "区分";
  name: string;
  description: string;
  baseDamage: number;
  selfDamage?: number;
  selfHeal?: number;
  bonusDamageWhenOpponentNotWeaker?: number;
  nextCardDamageBonus?: number;
  responseReduction?: number;
}

export const CARDS: Record<CardId, CardDefinition> = {
  "bold-claim": {
    id: "bold-claim",
    category: "主张",
    name: "强势主张",
    description: "对手 −4，自己 −1",
    baseDamage: 4,
    selfDamage: 1,
  },
  "supported-claim": {
    id: "supported-claim",
    category: "主张",
    name: "有据主张",
    description: "对手 −3",
    baseDamage: 3,
  },
  "question-premise": {
    id: "question-premise",
    category: "质疑",
    name: "追问前提",
    description: "对手 −2，自己 +1",
    baseDamage: 2,
    selfHeal: 1,
  },
  counterexample: {
    id: "counterexample",
    category: "质疑",
    name: "反例质疑",
    description: "对手不弱于自己时造成 3，否则造成 2",
    baseDamage: 2,
    bonusDamageWhenOpponentNotWeaker: 1,
  },
  distinction: {
    id: "distinction",
    category: "区分",
    name: "概念区分",
    description: "对手 −1，下一张卡额外 −2",
    baseDamage: 1,
    nextCardDamageBonus: 2,
  },
  "clarify-terms": {
    id: "clarify-terms",
    category: "区分",
    name: "澄清术语",
    description: "对手 −2，本回合对手回应减少 1",
    baseDamage: 2,
    responseReduction: 1,
  },
};

export function getCard(cardId: CardId): CardDefinition {
  return CARDS[cardId];
}

