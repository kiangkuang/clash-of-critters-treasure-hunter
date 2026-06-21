// Web Worker: runs exact backtracking with time-budget fallback to sampling

export interface WorkerInput {
  gridSize: number
  blockedCells: number[] // flat indices of EMPTY + TREASURE cells
  treasures: Array<{ rows: number; cols: number }>
}

export interface WorkerOutput {
  probabilities: Record<string, number> // "row,col" → 0–1
  exact: boolean
  configs: number
}

function getOrientations(rows: number, cols: number): Array<[number, number]> {
  const o: Array<[number, number]> = [[rows, cols]]
  if (rows !== cols) o.push([cols, rows])
  return o
}

function buildPlacements(
  rows: number,
  cols: number,
  gridSize: number,
  initiallyBlocked: Uint8Array,
): number[][] {
  const result: number[][] = []
  for (const [h, w] of getOrientations(rows, cols)) {
    for (let r = 0; r <= gridSize - h; r++) {
      for (let c = 0; c <= gridSize - w; c++) {
        const cells: number[] = []
        let blocked = false
        for (let dr = 0; dr < h && !blocked; dr++) {
          for (let dc = 0; dc < w && !blocked; dc++) {
            const idx = (r + dr) * gridSize + (c + dc)
            if (initiallyBlocked[idx]) blocked = true
            else cells.push(idx)
          }
        }
        if (!blocked) result.push(cells)
      }
    }
  }
  return result
}

function buildProbabilities(
  coverage: Float64Array,
  totalConfigs: number,
  gridSize: number,
  total: number,
  initiallyBlocked: Uint8Array,
): Record<string, number> {
  const probabilities: Record<string, number> = {}
  if (totalConfigs > 0) {
    for (let i = 0; i < total; i++) {
      if (coverage[i] > 0 && !initiallyBlocked[i]) {
        probabilities[`${Math.floor(i / gridSize)},${i % gridSize}`] = coverage[i] / totalConfigs
      }
    }
  }
  return probabilities
}

function compute(input: WorkerInput): WorkerOutput {
  const { gridSize, blockedCells, treasures } = input
  const total = gridSize * gridSize

  const initiallyBlocked = new Uint8Array(total)
  for (const idx of blockedCells) initiallyBlocked[idx] = 1

  const placementsByTreasure = treasures.map((t) =>
    buildPlacements(t.rows, t.cols, gridSize, initiallyBlocked),
  )

  // Sort most-constrained first
  const order = placementsByTreasure
    .map((_, i) => i)
    .sort((a, b) => placementsByTreasure[a].length - placementsByTreasure[b].length)
  const sorted = order.map((i) => placementsByTreasure[i])

  if (sorted.some((p) => p.length === 0)) {
    return { probabilities: {}, exact: true, configs: 0 }
  }

  const coverage = new Float64Array(total)
  let totalConfigs = 0
  const occupied = new Uint8Array(total)

  const BUDGET_MS = 80
  const start = Date.now()
  let timedOut = false
  let nodeCount = 0

  // placedCells[depth] holds the indices placed by sorted[depth]
  const placedCells: number[][] = new Array(sorted.length)

  function backtrack(idx: number) {
    if (timedOut) return
    // Check timer every 1024 nodes to amortise Date.now() cost
    if ((++nodeCount & 1023) === 0 && Date.now() - start > BUDGET_MS) {
      timedOut = true
      return
    }

    if (idx === sorted.length) {
      totalConfigs++
      // Accumulate only the actually-placed cells
      for (let d = 0; d < sorted.length; d++) {
        for (const ci of placedCells[d]) coverage[ci]++
      }
      return
    }

    for (const placement of sorted[idx]) {
      let conflict = false
      for (const ci of placement) {
        if (occupied[ci]) { conflict = true; break }
      }
      if (conflict) continue

      for (const ci of placement) occupied[ci] = 1
      placedCells[idx] = placement
      backtrack(idx + 1)
      for (const ci of placement) occupied[ci] = 0
    }
  }

  backtrack(0)

  if (!timedOut) {
    return {
      probabilities: buildProbabilities(coverage, totalConfigs, gridSize, total, initiallyBlocked),
      exact: true,
      configs: totalConfigs,
    }
  }

  // Timed out — Monte Carlo rejection sampling
  coverage.fill(0)
  totalConfigs = 0

  const SAMPLES = 200_000
  const attemptLimit = SAMPLES * 20

  for (let attempt = 0; attempt < attemptLimit && totalConfigs < SAMPLES; attempt++) {
    let valid = true
    const placed: number[][] = []

    for (const plist of sorted) {
      const pick = plist[Math.floor(Math.random() * plist.length)]
      let conflict = false
      for (const ci of pick) {
        if (occupied[ci]) { conflict = true; break }
      }
      if (conflict) {
        valid = false
        break
      }
      for (const ci of pick) occupied[ci] = 1
      placed.push(pick)
    }

    if (valid) {
      totalConfigs++
      for (const cells of placed) for (const ci of cells) coverage[ci]++
    }

    for (const cells of placed) for (const ci of cells) occupied[ci] = 0
  }

  return {
    probabilities: buildProbabilities(coverage, totalConfigs, gridSize, total, initiallyBlocked),
    exact: false,
    configs: totalConfigs,
  }
}

self.onmessage = (e: MessageEvent<WorkerInput>) => {
  const result = compute(e.data)
  self.postMessage(result)
}
