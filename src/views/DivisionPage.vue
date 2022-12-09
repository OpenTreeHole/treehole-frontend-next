<template>
  <v-container class="px-0 pt-0">
    <div class="flex">
      <div class="w-full lg:max-w-[65%] 3xl:max-w-[55%] px-0 pt-4 grow">
        <v-list class="py-2">
          <div class="text-h4 border-b-sm px-6 lg:px-10 pb-8 flex justify-between">
            <div class="flex grow-0">
              {{ divisionStore.getDivisionById(props.divisionId)?.name }}
            </div>
            <v-btn class="self-center">发布树洞</v-btn>
          </div>

          <v-list-item
            v-for="hole in holeStore.getHolesByDivisionId(props.divisionId)"
            :key="hole.id"
            class="px-0 py-0 border-b-sm flex-col text-left hover:bg-black-700"
          >
            <HoleBlock :hole="hole"></HoleBlock>
          </v-list-item>
        </v-list>
      </div>
      <div class="hidden lg:block lg:max-w-[35%] xl:max-w-[30%] 3xl:max-w-[25%] pl-5 pt-4 grow">
        <v-card
          class="mx-auto py-2"
          max-width="368"
        >
          <v-card-item>
            <v-card-title class="text-h5">Florida</v-card-title>

            <v-card-subtitle>
              <v-icon
                icon="mdi-alert"
                size="18"
                color="error"
                class="mr-1 pb-1"
              ></v-icon>

              Extreme Weather Alert
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="py-0">
            <v-row
              align="center"
              hide-gutters
              no-gutters
            >
              <v-col
                class="text-h2"
                cols="6"
              >
                64&deg;F
              </v-col>

              <v-col
                cols="6"
                class="text-right"
              >
                <v-icon
                  size="88"
                  color="error"
                  icon="mdi-weather-hurricane"
                ></v-icon>
              </v-col>
            </v-row>
          </v-card-text>

          <v-list-item density="compact">
            <v-list-item-avatar left>
              <v-icon icon="mdi-weather-windy"></v-icon>
            </v-list-item-avatar>

            <v-list-item-subtitle>123 km/h</v-list-item-subtitle>
          </v-list-item>

          <v-list-item density="compact">
            <v-list-item-avatar left>
              <v-icon icon="mdi-weather-pouring"></v-icon>
            </v-list-item-avatar>

            <v-list-item-subtitle>48%</v-list-item-subtitle>
          </v-list-item>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn> Full Report </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, provide } from 'vue'
import { useDivisionStore, useHoleStore } from '@/store'
import HoleBlock from '@/components/hole/HoleBlock.vue'

const props = defineProps<{ divisionId: number }>()
const holeStore = useHoleStore()
const divisionStore = useDivisionStore()

provide('divisionId', props.divisionId)

onMounted(() => {
  divisionStore.currentDivisionId = props.divisionId
  holeStore.fetchDivisionHoles(props.divisionId)
})
</script>

<style lang="scss" scoped></style>
