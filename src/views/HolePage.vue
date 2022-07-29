<script
  setup
  lang="ts"
>
import { arrayFactory } from '@/utils/reflect'
import { DetailedFloor } from '@/types'
import { mark, camelizeKeys, timeDifference } from '@/utils'

const floors = arrayFactory(
  DetailedFloor,
  camelizeKeys([
    {
      anonyname: 'Dest1n1',
      content:
        "将$X$每行各个数除以该行模长，使每行变为单位行向量，得到$X'$，则$AY=X'X'^TY$。\n" +
        '\n' +
        "直接算是$O(n^2k+nkd)$的，先算$X'^TY$则可变为$O(nkd)$。",
      deleted: false,
      fold: '',
      hole_id: 0,
      id: 0,
      is_me: false,
      like: 0,
      liked: 0,
      mention: [],
      special_tag: '测试用例',
      storey: 0,
      time_created: '2022-07-27T17:07:39.802Z',
      time_updated: '2022-07-27T17:07:39.802Z'
    }
  ])
)

console.log(floors)
</script>

<template>
  <v-container class="px-0">
    <div class="flex">
      <v-col class="max-w-[55%] px-0">
        <v-list class="pt-0">
          <div class="text-h4 border-b-sm px-10 pb-8 flex justify-between">
            <div class="flex grow-0">#123123</div>
            <v-btn>发表评论</v-btn>
          </div>
          <v-list-item
            v-for="(floor, index) in floors"
            :key="index"
            class="pl-16 py-5 border-b-sm flex-col text-left"
          >
            <div
              class="w-full"
              v-html="mark(floor.content)"
            />
            <div class="w-full flex justify-end mt-2 text-neutral-400 text-sm">
              <span>发布于 {{ timeDifference(floor.timeUpdated) }}</span>
            </div>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="max-w-[25%] pl-5">
        <v-card
          class="mx-auto"
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
            <v-btn> Full Report</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </div>
  </v-container>
</template>

<style
  lang="scss"
  scoped
></style>
