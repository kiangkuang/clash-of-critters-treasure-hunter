<script setup lang="ts">
import StageSelector from '@/components/StageSelector.vue'
import TreasureList from '@/components/TreasureList.vue'
import GameGrid from '@/components/GameGrid.vue'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="header-inner">
        <div class="title-block">
          <span class="title-eyebrow">CLASH OF CRITTERS</span>
          <h1 class="title">Treasure Hunter</h1>
        </div>
        <p class="subtitle">
          Mark every dug tile — including partial treasure finds — to see the best odds for your next dig.
          <span class="tip">Tip: locate all treasures before digging any up. Even partial finds should be marked here so the calculator can narrow down where the remaining treasures are — maximising the chance that bombs uncover extra tiles for you.</span>
        </p>
      </div>
    </header>

    <main class="app-body">
      <aside class="sidebar">
        <div class="sidebar-inner">
          <StageSelector />
          <div class="divider"></div>
          <TreasureList />
        </div>
      </aside>

      <section class="grid-area">
        <GameGrid />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  border-bottom: 1px solid var(--surface-3);
  background: var(--surface);
  padding: 16px 24px;
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: baseline;
  gap: 24px;
  flex-wrap: wrap;
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.title-eyebrow {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--text-muted);
}

.title {
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 400;
  color: var(--accent);
  letter-spacing: 0.04em;
  line-height: 1.1;
}

.subtitle {
  font-size: 13px;
  color: var(--text-muted);
  max-width: 400px;
  line-height: 1.6;
}

.tip {
  display: block;
  margin-top: 4px;
  color: var(--accent);
  font-size: 12px;
}

.app-body {
  flex: 1;
  display: flex;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  gap: 24px;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 24px;
}

.divider {
  height: 1px;
  background: var(--surface-3);
}

.grid-area {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4px;
}

@media (max-width: 640px) {
  .app-body {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }

  .sidebar {
    width: 100%;
  }

  .sidebar-inner {
    position: static;
  }
}
</style>
