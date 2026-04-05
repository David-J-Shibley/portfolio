export type Difficulty = 1 | 2 | 3 | 4;

export type ConnectionGroupDef = {
  title: string;
  words: [string, string, string, string];
  difficulty: Difficulty;
};

export type ConnectionPuzzle = {
  id: string;
  name: string;
  groups: [ConnectionGroupDef, ConnectionGroupDef, ConnectionGroupDef, ConnectionGroupDef];
};

export type PlacedWord = {
  id: string;
  word: string;
  groupIndex: number;
};

export type SolvedStrip = {
  groupIndex: number;
  title: string;
  words: string[];
  difficulty: Difficulty;
};

export type SubmitResult =
  | { kind: "solved"; strip: SolvedStrip }
  | { kind: "wrong"; oneAway: boolean }
  | { kind: "need_four" };
