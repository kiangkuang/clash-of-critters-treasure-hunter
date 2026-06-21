<script setup lang="ts">
import { computed } from 'vue'
import { CellState } from '@/types'
import type { GridCell } from '@/types'

const props = defineProps<{
  cell: GridCell
  probability: number
  treasureColor: string | null
  assigningInstanceId: string | null
}>()

const emit = defineEmits<{
  click: []
}>()

const isAssigning = computed(() => props.assigningInstanceId !== null)
const isMyCell = computed(
  () =>
    props.cell.state === CellState.TREASURE &&
    props.cell.assignedTo === props.assigningInstanceId,
)
const isOtherCell = computed(
  () =>
    props.cell.state === CellState.TREASURE &&
    props.assigningInstanceId !== null &&
    props.cell.assignedTo !== props.assigningInstanceId,
)

const probPercent = computed(() => Math.round(props.probability * 100))

const tooltip = computed(() => {
  if (isAssigning.value) {
    if (isMyCell.value) return 'Click to unmark this cell'
    if (props.cell.state === CellState.TREASURE) return 'Belongs to another treasure — cannot unmark here'
    if (props.cell.state === CellState.EMPTY) return 'Click to mark as treasure (overrides empty)'
    return 'Click to mark as part of this treasure'
  }
  if (props.cell.state === CellState.UNKNOWN) {
    return probPercent.value > 0
      ? `${probPercent.value}% chance of treasure — click to mark empty`
      : 'No treasure possible here — click to mark empty'
  }
  if (props.cell.state === CellState.EMPTY) return 'Dug empty — click to unmark'
  return 'Treasure found here'
})
</script>

<template>
  <button
    class="cell"
    :data-state="cell.state"
    :class="{
      'is-assigning': isAssigning,
      'is-my-cell': isMyCell,
      'is-other-cell': isOtherCell,
    }"
    :style="{
      ...(cell.state === CellState.UNKNOWN ? { '--prob': probability } : {}),
      ...(treasureColor ? { '--treasure-color': treasureColor } : {}),
    }"
    :title="tooltip"
    :aria-label="`Row ${cell.row + 1}, Col ${cell.col + 1}: ${tooltip}`"
    @click="emit('click')"
  >
    <span v-if="cell.state === CellState.EMPTY" class="glyph empty-glyph">✕</span>
    <span v-else-if="cell.state === CellState.TREASURE" class="glyph treasure-glyph">◆</span>
    <span v-else-if="probPercent > 0" class="prob-label">{{ probPercent }}%</span>
  </button>
</template>

<style scoped>
.cell {
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: 1px solid var(--surface-3);
  cursor: pointer;
  position: relative;
  transition: transform 0.08s, border-color 0.12s, background 0.12s;
  background: var(--surface-2);
}

.cell:hover {
  transform: scale(1.06);
  z-index: 1;
  border-color: var(--text-muted);
}

.cell.is-assigning:hover {
  border-color: var(--accent-2);
}

/* Cells belonging to another treasure are dimmed in assigning mode */
.cell.is-other-cell {
  opacity: 0.5;
  cursor: default;
}
.cell.is-other-cell:hover {
  transform: none;
}


.cell:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.cell[data-state="unknown"] {
  background: color-mix(
    in srgb,
    var(--danger) calc(var(--prob, 0) * 160%),
    color-mix(
      in srgb,
      var(--accent) calc(var(--prob, 0) * 80%),
      var(--surface-2)
    )
  );
  border-color: color-mix(
    in srgb,
    var(--danger) calc(var(--prob, 0) * 120%),
    var(--surface-3)
  );
}

/* In assigning mode, unknown cells show a subtle teal tint to invite marking */
.cell.is-assigning[data-state="unknown"] {
  background: color-mix(in srgb, var(--accent-2) 8%, var(--surface-2));
  border-color: var(--surface-3);
}

.cell[data-state="empty"] {
  background: var(--ground);
  border-color: var(--surface-2);
  border-style: dashed;
}

.cell[data-state="treasure"] {
  background: color-mix(in srgb, var(--treasure-color, var(--accent-2)) 18%, var(--ground));
  border-color: var(--treasure-color, var(--accent-2));
  border-width: 2px;
}

/* Active assigning cell gets a brighter fill */
.cell.is-my-cell {
  background: color-mix(in srgb, var(--treasure-color, var(--accent-2)) 30%, var(--ground));
}

.glyph {
  font-size: clamp(10px, 2vw, 18px);
  line-height: 1;
}

.empty-glyph {
  color: var(--surface-3);
}

.treasure-glyph {
  color: var(--treasure-color, var(--accent-2));
}

.prob-label {
  font-family: var(--font-mono);
  font-size: clamp(8px, 1.4vw, 13px);
  font-weight: 400;
  color: var(--text);
  line-height: 1;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
}
</style>
