<script setup lang="ts">
import { useGameState } from '@/composables/useGameState'
import { STAGES } from '@/data/gameData'

const { selectedStageId, currentStage, selectStage } = useGameState()

function onStageChange(e: Event) {
  selectStage(Number((e.target as HTMLSelectElement).value))
}
</script>

<template>
  <div class="stage-selector">
    <label class="label" for="stage-select">STAGE</label>
    <select id="stage-select" :value="selectedStageId" @change="onStageChange">
      <option v-for="stage in STAGES" :key="stage.id" :value="stage.id">
        Stage {{ stage.id }}{{ stage.treasures.length === 0 ? ' (WIP)' : '' }}
      </option>
    </select>

    <div class="stage-meta">
      <div class="meta-row">
        <span class="meta-key">Grid</span>
        <span class="meta-val">{{ currentStage.size }}×{{ currentStage.size }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-key">Pickaxes/tile</span>
        <span class="meta-val">{{ currentStage.pickaxesPerTile }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-key">Reward</span>
        <span class="meta-val reward">{{ currentStage.reward }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stage-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

select {
  width: 100%;
  padding: 8px 12px;
  background: var(--surface-2);
  color: var(--text);
  border: 1px solid var(--surface-3);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a8070' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;
  transition: border-color 0.15s;
}

select:focus {
  outline: none;
  border-color: var(--accent);
}

.stage-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
  border-left: 2px solid var(--accent);
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.meta-key {
  font-size: 11px;
  color: var(--text-muted);
}

.meta-val {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text);
}

.meta-val.reward {
  color: var(--accent);
  font-size: 12px;
  text-align: right;
}
</style>
