import { CellState } from '@/types'
import type { GridCell, TreasureDefinition, ProbabilityMap } from '@/types'
import type { WorkerInput, WorkerOutput } from './probabilityWorker'

let worker: Worker | null = null

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./probabilityWorker.ts', import.meta.url), {
      type: 'module',
    })
  }
  return worker
}

export function computeProbabilities(
  gridSize: number,
  cells: GridCell[],
  remainingTreasures: TreasureDefinition[],
): Promise<{ map: ProbabilityMap; exact: boolean }> {
  return new Promise((resolve) => {
    if (remainingTreasures.length === 0) {
      resolve({ map: new Map(), exact: true })
      return
    }

    const blockedCells: number[] = []
    for (const cell of cells) {
      if (cell.state === CellState.EMPTY || cell.state === CellState.TREASURE) {
        blockedCells.push(cell.row * gridSize + cell.col)
      }
    }

    const input: WorkerInput = {
      gridSize,
      blockedCells,
      treasures: remainingTreasures.map((t) => ({ rows: t.rows, cols: t.cols })),
    }

    const w = getWorker()

    const handler = (e: MessageEvent<WorkerOutput>) => {
      w.removeEventListener('message', handler)
      const map: ProbabilityMap = new Map(Object.entries(e.data.probabilities))
      resolve({ map, exact: e.data.exact })
    }
    w.addEventListener('message', handler)
    w.postMessage(input)
  })
}
