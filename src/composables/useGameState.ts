import { ref, computed, watch } from 'vue'
import { CellState } from '@/types'
import type { GridCell, TreasureInstance } from '@/types'
import { STAGES, TREASURE_DEFINITIONS } from '@/data/gameData'
import { computeProbabilities } from '@/utils/probability'

// Blues, purples, cyan, pink — avoids red/yellow/green used by the heatmap
// Blues, purples, cyans, fuchsia — avoids red/yellow/green used by the heatmap
const INSTANCE_PALETTE = [
  '#60a5fa', // sky blue
  '#a78bfa', // violet
  '#e879f9', // fuchsia
  '#2dd4bf', // cyan
  '#c084fc', // purple
  '#38bdf8', // light blue
  '#818cf8', // indigo
  '#4ecdc4', // teal
  '#f0abfc', // lavender pink
  '#67e8f9', // light cyan
  '#b197fc', // soft violet
]

const selectedStageId = ref<number>(1)
const cells = ref<GridCell[]>([])
const treasureInstances = ref<TreasureInstance[]>([])
const assigningInstanceId = ref<string | null>(null)

const probabilityMap = ref<Map<string, number>>(new Map())
const probabilityExact = ref<boolean>(true)
const probabilityLoading = ref<boolean>(false)

function buildCells(size: number): GridCell[] {
  const result: GridCell[] = []
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      result.push({ row: r, col: c, state: CellState.UNKNOWN, assignedTo: null })
    }
  }
  return result
}

function buildInstances(stageId: number): TreasureInstance[] {
  const stage = STAGES.find((s) => s.id === stageId)!
  const result: TreasureInstance[] = []
  for (const { definitionId, count } of stage.treasures) {
    for (let i = 1; i <= count; i++) {
      result.push({
        id: `${definitionId}-${i}`,
        definitionId,
        found: false,
        color: INSTANCE_PALETTE[result.length % INSTANCE_PALETTE.length],
        label: String.fromCharCode(65 + result.length), // A, B, C…
      })
    }
  }
  return result
}

cells.value = buildCells(STAGES[0].size)
treasureInstances.value = buildInstances(STAGES[0].id)

async function recalculate() {
  probabilityLoading.value = true
  const stage = STAGES.find((s) => s.id === selectedStageId.value)!
  const remaining = treasureInstances.value
    .filter((t) => !t.found)
    .map((t) => TREASURE_DEFINITIONS.find((d) => d.id === t.definitionId)!)
  const { map, exact } = await computeProbabilities(stage.size, cells.value, remaining)
  probabilityMap.value = map
  probabilityExact.value = exact
  probabilityLoading.value = false
}

let recalcTimer: ReturnType<typeof setTimeout> | null = null
function scheduleRecalc() {
  if (recalcTimer) clearTimeout(recalcTimer)
  recalcTimer = setTimeout(recalculate, 80)
}

watch([cells, treasureInstances], scheduleRecalc, { deep: false })
recalculate()

export function useGameState() {
  const currentStage = computed(() => STAGES.find((s) => s.id === selectedStageId.value)!)
  const gridSize = computed(() => currentStage.value.size)

  function cellAt(row: number, col: number): GridCell {
    return cells.value[row * gridSize.value + col]
  }

  function unmarkCell(row: number, col: number): string | null {
    const instanceId = cellAt(row, col).assignedTo
    cells.value = cells.value.map((c) =>
      c.row === row && c.col === col ? { ...c, state: CellState.UNKNOWN, assignedTo: null } : c,
    )
    return instanceId
  }

  function selectStage(id: number) {
    selectedStageId.value = id
    const stage = STAGES.find((s) => s.id === id)!
    cells.value = buildCells(stage.size)
    treasureInstances.value = buildInstances(id)
    assigningInstanceId.value = null
  }

  function cycleCell(row: number, col: number) {
    if (assigningInstanceId.value !== null) {
      const instanceId = assigningInstanceId.value
      const current = cellAt(row, col)

      // Clicking a cell already assigned to this instance → unmark it
      if (current.state === CellState.TREASURE && current.assignedTo === instanceId) {
        unmarkCell(row, col)
        return
      }

      // Cell is already assigned to a different instance → ignore
      if (current.state === CellState.TREASURE) return

      // At capacity — ignore
      const maxCells = maxCellsForInstance(instanceId)
      if (markedCountForInstance(instanceId) >= maxCells) return

      const nextCells = cells.value.map((cell) =>
        cell.row === row && cell.col === col
          ? { ...cell, state: CellState.TREASURE, assignedTo: instanceId }
          : cell,
      )
      cells.value = nextCells

      // Auto-mark as found when all cells for this instance are placed
      const nowMarked = nextCells.filter(
        (c) => c.state === CellState.TREASURE && c.assignedTo === instanceId,
      ).length
      if (nowMarked >= maxCells) {
        treasureInstances.value = treasureInstances.value.map((t) =>
          t.id === instanceId ? { ...t, found: true } : t,
        )
        assigningInstanceId.value = null
      }
      return
    }

    // Normal mode: UNKNOWN ↔ EMPTY; TREASURE cells are cleared
    const current = cellAt(row, col)
    if (current.state === CellState.TREASURE) {
      const instanceId = unmarkCell(row, col)
      // Revert found state since the instance is no longer fully marked
      if (instanceId) {
        const instance = treasureInstances.value.find((t) => t.id === instanceId)
        if (instance?.found) {
          treasureInstances.value = treasureInstances.value.map((t) =>
            t.id === instanceId ? { ...t, found: false } : t,
          )
        }
      }
      return
    }
    cells.value = cells.value.map((cell) =>
      cell.row === row && cell.col === col
        ? { ...cell, state: cell.state === CellState.UNKNOWN ? CellState.EMPTY : CellState.UNKNOWN }
        : cell,
    )
  }

  function toggleTreasureFound(instanceId: string) {
    const instance = treasureInstances.value.find((t) => t.id === instanceId)!
    if (!instance.found) {
      // Marking found: exit assigning mode
      if (assigningInstanceId.value === instanceId) assigningInstanceId.value = null
    } else {
      // Un-marking: clear all cells assigned to this instance
      cells.value = cells.value.map((c) =>
        c.assignedTo === instanceId ? { ...c, state: CellState.UNKNOWN, assignedTo: null } : c,
      )
    }
    treasureInstances.value = treasureInstances.value.map((t) =>
      t.id === instanceId ? { ...t, found: !t.found } : t,
    )
  }

  function setAssigningInstance(instanceId: string | null) {
    assigningInstanceId.value =
      assigningInstanceId.value === instanceId ? null : instanceId
  }

  function markedCountForInstance(instanceId: string): number {
    return cells.value.filter(
      (c) => c.state === CellState.TREASURE && c.assignedTo === instanceId,
    ).length
  }

  function maxCellsForInstance(instanceId: string): number {
    const instance = treasureInstances.value.find((t) => t.id === instanceId)
    if (!instance) return 0
    const def = TREASURE_DEFINITIONS.find((d) => d.id === instance.definitionId)
    return def ? def.rows * def.cols : 0
  }

  // Observed range for color normalization
  const probRange = computed(() => {
    const values = [...probabilityMap.value.values()]
    if (values.length === 0) return { min: 0, max: 1 }
    const min = Math.min(...values)
    const max = Math.max(...values)
    return { min, max }
  })

  function cellProbability(row: number, col: number): number {
    return probabilityMap.value.get(`${row},${col}`) ?? 0
  }

  function cellProbabilityNormalized(row: number, col: number): number {
    const raw = probabilityMap.value.get(`${row},${col}`) ?? 0
    if (raw === 0) return 0
    const { min, max } = probRange.value
    if (max === min) return 1
    return (raw - min) / (max - min)
  }

  function cellInstance(cell: GridCell) {
    if (cell.state !== CellState.TREASURE || !cell.assignedTo) return null
    return treasureInstances.value.find((t) => t.id === cell.assignedTo) ?? null
  }

  function cellColor(cell: GridCell): string | null {
    return cellInstance(cell)?.color ?? null
  }

  function cellLabel(cell: GridCell): string | null {
    return cellInstance(cell)?.label ?? null
  }

  function resetGrid() {
    const stage = currentStage.value
    cells.value = buildCells(stage.size)
    treasureInstances.value = buildInstances(stage.id)
    assigningInstanceId.value = null
  }

  return {
    selectedStageId,
    cells,
    treasureInstances,
    assigningInstanceId,
    probabilityMap,
    probabilityExact,
    probabilityLoading,
    currentStage,
    gridSize,
    selectStage,
    cycleCell,
    toggleTreasureFound,
    setAssigningInstance,
    markedCountForInstance,
    maxCellsForInstance,
    cellProbability,
    cellProbabilityNormalized,
    cellColor,
    cellLabel,
    resetGrid,
  }
}
