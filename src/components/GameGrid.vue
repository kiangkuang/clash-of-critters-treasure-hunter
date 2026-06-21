<script setup lang="ts">
import { useGameState } from '@/composables/useGameState'
import GridCell from './GridCell.vue'

const {
  cells,
  gridSize,
  cycleCell,
  cellProbability,
  cellProbabilityNormalized,
  cellColor,
  cellLabel,
  currentStage,
  probabilityLoading,
  probabilityExact,
  assigningInstanceId,
} = useGameState()
</script>

<template>
  <div class="grid-wrap">
    <div class="grid-header">
      <span class="grid-label">{{ currentStage.size }}×{{ currentStage.size }} EXCAVATION GRID</span>
      <div class="grid-status">
        <span v-if="probabilityLoading" class="status-chip loading">calculating…</span>
        <span v-else-if="!probabilityExact" class="status-chip approx" title="Grid is complex — showing probability estimate from sampling">~approx</span>
        <span v-else class="status-chip exact">exact</span>
      </div>
    </div>

    <div class="assigning-banner" :class="{ visible: assigningInstanceId }">
      Marking mode active — tap cells to assign ◆ to selected treasure
    </div>

    <div
      class="grid"
      :style="{ '--grid-cols': gridSize }"
      :class="{ 'is-assigning': !!assigningInstanceId }"
      role="grid"
      :aria-label="`${gridSize} by ${gridSize} treasure grid`"
    >
      <GridCell
        v-for="cell in cells"
        :key="`${cell.row}-${cell.col}`"
        :cell="cell"
        :probability="cellProbability(cell.row, cell.col)"
        :probabilityNormalized="cellProbabilityNormalized(cell.row, cell.col)"
        :treasureColor="cellColor(cell)"
        :treasureLabel="cellLabel(cell)"
        :assigningInstanceId="assigningInstanceId"
        @click="cycleCell(cell.row, cell.col)"
      />
    </div>

    <div class="legend">
      <div class="legend-item">
        <span class="swatch swatch-cool"></span>
        <span>Low prob</span>
      </div>
      <div class="legend-item">
        <span class="swatch swatch-warm"></span>
        <span>Medium</span>
      </div>
      <div class="legend-item">
        <span class="swatch swatch-hot"></span>
        <span>Dig here</span>
      </div>
      <div class="legend-item">
        <span class="swatch swatch-empty"></span>
        <span>Dug empty</span>
      </div>
      <div class="legend-item">
        <span class="swatch swatch-treasure"></span>
        <span>Treasure here</span>
      </div>
    </div>

    <p class="grid-hint">Click: empty ↔ unknown &nbsp;·&nbsp; Use ◇ mark button to assign treasure cells</p>
  </div>
</template>

<style scoped>
.grid-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
}

.grid-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.grid-label {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.grid-status {
  display: flex;
  align-items: center;
}

.status-chip {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 3px;
  letter-spacing: 0.06em;
}

.status-chip.loading {
  background: var(--surface-3);
  color: var(--text-muted);
  animation: pulse 1s ease-in-out infinite;
}

.status-chip.approx {
  background: var(--accent-dim);
  color: var(--accent);
  border: 1px solid var(--accent);
  cursor: help;
}

.status-chip.exact {
  background: var(--surface-2);
  color: var(--text-muted);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.assigning-banner {
  font-family: var(--font-mono);
  font-size: 11px;
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  letter-spacing: 0.04em;
  text-align: center;
  color: transparent;
  background: transparent;
  border: 1px solid transparent;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}

.assigning-banner.visible {
  color: var(--accent-2);
  background: var(--accent-2-dim);
  border-color: var(--accent-2);
}

.grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-cols), 1fr);
  gap: 4px;
  width: 100%;
  max-width: min(540px, 90vw);
  transition: box-shadow 0.15s;
}

.grid.is-assigning {
  box-shadow: 0 0 0 2px var(--accent-2);
  border-radius: var(--radius-sm);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-muted);
}

.swatch {
  display: inline-block;
  width: 13px;
  height: 13px;
  border-radius: 3px;
  border: 1px solid var(--surface-3);
  flex-shrink: 0;
}

.swatch-cool { background: color-mix(in srgb, var(--heat-lo) 60%, var(--surface-2)); }
.swatch-warm { background: color-mix(in srgb, var(--heat-hi) 50%, var(--heat-lo)); }
.swatch-hot  { background: var(--heat-hi); }
.swatch-empty {
  background: var(--ground);
  border-style: dashed;
}
.swatch-treasure {
  background: var(--accent-2-dim);
  border-color: var(--accent-2);
}

.grid-hint {
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
}
</style>
