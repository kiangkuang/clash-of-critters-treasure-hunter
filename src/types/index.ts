export const CellState = {
  UNKNOWN: 'unknown',
  EMPTY: 'empty',
  TREASURE: 'treasure',
} as const
export type CellState = (typeof CellState)[keyof typeof CellState]

export interface TreasureDefinition {
  id: string
  name: string
  rows: number
  cols: number
}

export interface TreasureInstance {
  id: string
  definitionId: string
  found: boolean
  color: string
  label: string // A, B, C… assigned by position across all instances in the stage
}

export interface GridCell {
  row: number
  col: number
  state: CellState
  assignedTo: string | null  // treasure instance id when state === TREASURE
}

export type ProbabilityMap = Map<string, number>

export interface StageTreasure {
  definitionId: string
  count: number
}

export interface Stage {
  id: number
  size: number
  treasures: StageTreasure[]
  pickaxesPerTile: number
  reward: string
}
