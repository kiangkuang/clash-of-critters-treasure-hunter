<script setup lang="ts">
import { computed } from 'vue'
import { useGameState } from '@/composables/useGameState'
import { TREASURE_DEFINITIONS } from '@/data/gameData'

const {
  treasureInstances,
  currentStage,
  assigningInstanceId,
  toggleTreasureFound,
  setAssigningInstance,
  markedCountForInstance,
  maxCellsForInstance,
  resetGrid,
} = useGameState()

const flatTreasures = computed(() => {
  const copyCounter: Record<string, number> = {}
  return treasureInstances.value.map((instance) => {
    copyCounter[instance.definitionId] = (copyCounter[instance.definitionId] ?? 0) + 1
    const def = TREASURE_DEFINITIONS.find((d) => d.id === instance.definitionId)!
    const markedCount = markedCountForInstance(instance.id)
    const maxCells = maxCellsForInstance(instance.id)
    return { instance, def, copyNum: copyCounter[instance.definitionId], markedCount, maxCells }
  })
})

const foundCount = computed(() => treasureInstances.value.filter((t) => t.found).length)
const totalCount = computed(() => treasureInstances.value.length)
const allFound = computed(() => foundCount.value === totalCount.value)

const assigningItem = computed(() =>
  assigningInstanceId.value
    ? flatTreasures.value.find((f) => f.instance.id === assigningInstanceId.value) ?? null
    : null,
)
</script>

<template>
  <div class="treasure-list">
    <div class="list-header">
      <span class="label">TREASURES</span>
      <span class="count" :class="{ complete: allFound }">{{ foundCount }}/{{ totalCount }}</span>
    </div>

    <div v-if="currentStage.treasures.length === 0" class="empty-state">
      No treasure data for this stage yet.
    </div>

    <div v-else class="items">
      <div
        v-for="{ instance, def, copyNum, markedCount, maxCells } in flatTreasures"
        :key="instance.id"
        class="item"
        :class="{
          found: instance.found,
          assigning: assigningInstanceId === instance.id,
          full: !instance.found && markedCount >= maxCells && maxCells > 0,
        }"
        :style="{ '--t-color': instance.color }"
        @click="instance.found ? toggleTreasureFound(instance.id) : setAssigningInstance(instance.id)"
      >
        <button
          class="assign-btn"
          :class="{ active: assigningInstanceId === instance.id }"
          :disabled="instance.found"
          :title="
            instance.found
              ? 'Already excavated'
              : assigningInstanceId === instance.id
                ? 'Stop marking cells'
                : 'Mark cells for this treasure on the grid'
          "
          @click.stop
        >
          <template v-if="markedCount > 0">◆ {{ markedCount }}/{{ maxCells }}</template>
          <template v-else>◇ mark</template>
        </button>

        <div class="item-info">
          <span class="item-name">{{ def.name }}</span>
          <span class="item-sub">Copy {{ copyNum }} · {{ def.rows }}×{{ def.cols }}</span>
        </div>
      </div>
    </div>

    <div class="assigning-hint" :class="{ visible: assigningItem }">
      <template v-if="assigningItem">
        <template v-if="assigningItem.markedCount >= assigningItem.maxCells">
          All {{ assigningItem.maxCells }} cells marked.
        </template>
        <template v-else>
          Mark {{ assigningItem.maxCells - assigningItem.markedCount }}
          more cell{{ assigningItem.maxCells - assigningItem.markedCount === 1 ? '' : 's' }}
          on the grid. Tap ◆ to unmark.
        </template>
      </template>
    </div>

    <button class="reset-btn" @click="resetGrid">Reset grid</button>
  </div>
</template>

<style scoped>
.treasure-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

.count {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  transition: color 0.2s;
}

.count.complete {
  color: var(--accent-2);
}

.empty-state {
  font-size: 12px;
  color: var(--text-muted);
  padding: 12px;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
  text-align: center;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px 6px 10px;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--t-color, var(--surface-3));
  transition: background 0.1s;
  cursor: pointer;
  user-select: none;
}

.item:not(.found):hover {
  background: var(--surface-3);
}

.item.found {
  cursor: pointer;
  opacity: 0.5;
}

.item.assigning {
  background: color-mix(in srgb, var(--t-color, var(--accent-2)) 12%, var(--surface-2));
  outline: 1px solid var(--t-color, var(--accent-2));
}

.item.full:not(.found) {
  background: color-mix(in srgb, var(--accent-2) 6%, var(--surface-2));
}

.assign-btn {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 3px;
  border: 1px solid var(--surface-3);
  background: var(--surface-3);
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: border-color 0.12s, color 0.12s, background 0.12s;
}

.assign-btn:hover:not(:disabled) {
  border-color: var(--t-color, var(--accent-2));
  color: var(--t-color, var(--accent-2));
}

.assign-btn.active {
  border-color: var(--t-color, var(--accent-2));
  color: var(--t-color, var(--accent-2));
  background: color-mix(in srgb, var(--t-color, var(--accent-2)) 15%, transparent);
}

.assign-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 13px;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item.found .item-name {
  color: var(--accent-2);
  text-decoration: line-through;
  text-decoration-color: var(--accent-2);
}

.item-sub {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
}

.assigning-hint {
  font-size: 11px;
  padding: 7px 10px;
  min-height: 2.5em;
  border-radius: var(--radius-sm);
  border-left: 2px solid transparent;
  line-height: 1.5;
  color: transparent;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}

.assigning-hint.visible {
  color: var(--accent-2);
  background: var(--accent-2-dim);
  border-left-color: var(--accent-2);
}

.reset-btn {
  width: 100%;
  padding: 8px;
  background: var(--surface-2);
  color: var(--text-muted);
  border: 1px solid var(--surface-3);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-family: var(--font-mono);
  letter-spacing: 0.06em;
  transition: border-color 0.15s, color 0.15s;
  cursor: pointer;
}

.reset-btn:hover {
  border-color: var(--danger);
  color: var(--danger);
}
</style>
