<template>
  <div>
    <template v-if="!props.source">
      <v-notice type="warning">
        {{ t('relationship_not_setup') }}
      </v-notice>
    </template>

    <template v-if="view.loaded && (!view.options || view.options.length === 0)">
      <v-notice>
        {{ t('no_items') }}
      </v-notice>
    </template>

    <template v-else>
      <ul>
        <li v-for="(item, k) in view.options" :key="k" @click="toggleSelectItem(item)">
          <div class="label">
            <v-icon :name="getIconName(item)" :color="getIconColor(item)"></v-icon>
            <span>{{ item.text }}</span>
          </div>
          <div class="icon" v-if="item.icon">
            <v-icon :name="item.icon" :color="getIconColor(item)"></v-icon>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '@directus/extensions-sdk'
import { computed, onMounted, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

type Props = {
  value?: string[]
  source?: string
}

type OptionItem = {
  text: string
  value: string
  icon?: string
}

type CollectionItem = Partial<OptionItem>

const api = useApi()
const { t } = useI18n()

const emit = defineEmits<{
  (event: 'input', value: string[]): void
}>()

const props = defineProps<Props>()

const payload = reactive({
  selecteds: [] as string[],
})

const view = reactive({
  loaded: false,
  items: [] as CollectionItem[],

  options: computed((): OptionItem[] => {
    return view.items
      .filter((item) => item.text)
      .map((item) => ({
        text: item?.text || '',
        value: item?.value || '',
        icon: item?.icon,
      }))
  }),
})

onMounted(() => {
  fetch()
  refreshModel()
})

watch(
  () => props.value,
  () => {
    refreshModel()
  }
)

function refreshModel() {
  if (props.value instanceof Array) {
    const val = [...(props.value || [])]
    payload.selecteds = val
  }
}

async function fetch() {
  if (!props.source) {
    return
  }

  const collection = props.source
  const res = await api.get<{ data: CollectionItem[] }>(`items/${collection}/?limit=-1`)
  view.items = res.data.data
  view.loaded = true
}

function toggleSelectItem(item: OptionItem) {
  const index = payload.selecteds.indexOf(item.value)

  if (index === -1) {
    payload.selecteds.push(item.value)
  } else {
    payload.selecteds.splice(index, 1)
  }

  // emit the new value
  emit('input', payload.selecteds)
}

function getIconName(item: OptionItem) {
  return payload.selecteds.indexOf(item.value) === -1
    ? 'radio_button_unchecked'
    : 'radio_button_checked'
}

function getIconColor(item: OptionItem) {
  return payload.selecteds.indexOf(item.value) === -1 ? null : 'var(--v-checkbox-color)'
}
</script>

<style lang="scss" scoped>
ul {
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 6px;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    padding: var(--input-padding);
    border: var(--border-width) solid var(--border-normal);
    border-radius: var(--border-radius);
    justify-content: space-between;
    gap: 6px;

    .label {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
}
</style>
