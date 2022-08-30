<template>
  <v-container class="mx-0 px-0 pt-0">
    <div class="flex">
      <v-col class="max-w-[55%] px-0 py-0">
        <div class="text-h4 border-b-sm flex justify-between">
          <v-tabs
            v-model="tab"
            background-color="primary"
          >
            <v-tab value="1">举 报</v-tab>
            <v-tab value="2">处罚记录</v-tab>
            <v-tab value="3">API 记录</v-tab>
          </v-tabs>
        </div>
        <v-window v-model="tab">
          <v-window-item value="1">
            <v-list class="pt-0 lg:px-4">
              <v-list-item
                v-for="(report, i) in reports"
                :key="i"
                class="px-0 py-5 border-b-sm flex-col text-left"
              >
                <ReportBlock
                  class="px-6"
                  :report="report"
                />
              </v-list-item>
            </v-list>
          </v-window-item>
          <v-window-item value="2">
            <v-list class="pt-0">
              <v-list-item class="pl-16 py-5 border-b-sm flex-col text-left">
                <div class="w-full">嘉然</div>
                <div class="w-full flex justify-end mt-2 text-neutral-400 text-sm">
                  <span>永久封禁</span>
                </div>
              </v-list-item>
              <v-list-item class="pl-16 py-5 border-b-sm flex-col text-left">
                <div class="w-full">向晚</div>
                <div class="w-full flex justify-end mt-2 text-neutral-400 text-sm">
                  <span>封禁至 2022/7/21</span>
                </div>
              </v-list-item>
            </v-list>
          </v-window-item>
          <v-window-item value="3">
            <v-list class="pt-0">
              <v-list-item class="pl-16 py-5 border-b-sm flex-col text-left">
                <div class="w-full">删除帖子"嘉然今天吃什么"</div>
                <div class="w-full flex justify-end mt-2 text-neutral-400 text-sm">
                  <span>永雏塔菲 于2022/7/21</span>
                </div>
              </v-list-item>
              <v-list-item class="pl-16 py-5 border-b-sm flex-col text-left">
                <div class="w-full">用户 嘉然 站务区 三级封禁</div>
                <div class="w-full flex justify-end mt-2 text-neutral-400 text-sm">
                  <span>罕见 于2022/7/21</span>
                </div>
              </v-list-item>
            </v-list>
          </v-window-item>
        </v-window>
      </v-col>
    </div>
  </v-container>
</template>

<script
  setup
  lang="ts"
>
import { ref } from 'vue'
import ReportBlock from '@/components/floor/ReportBlock.vue'
import { arrayFactory } from '@/utils/reflect'
import { Report } from '@/types'
import { camelizeKeys } from '@/utils'

const tab = ref('1')
const reports = arrayFactory(
  Report,
  camelizeKeys([
    {
      dealt: false,
      id: 1,
      reason: '嘉然嘉然嘉然嘉然嘉然嘉然嘉然嘉然嘉然嘉然嘉然嘉然嘉然嘉然嘉然',
      floor: {
        anonyname: 'Dest1n1',
        content:
          '现代社会以海德格尔的一句“一切实践传统都已经瓦解完了”为嚆矢。滥觞于家庭与社会传统的期望正失去它们的借鉴意义。但面对看似无垠的未来天空，我想循卡尔维诺“树上的男爵”的生活好过过早地振翮。' +
          '\n' +
          '我们怀揣热忱的灵魂天然被赋予对超越性的追求，不屑于古旧坐标的约束，钟情于在别处的芬芳。但当这种期望流于对过去观念不假思索的批判，乃至走向虚无与达达主义时，便值得警惕了。',
        deleted: false,
        fold: '',
        hole_id: 0,
        id: 100001,
        is_me: false,
        like: 0,
        liked: 0,
        mention: [],
        special_tag: '测试用例',
        storey: 0,
        time_created: '2022-07-27T17:07:39.802Z',
        time_updated: '2022-07-27T17:07:39.802Z'
      },
      time_created: '2022-08-30T09:51:32.279Z',
      time_updated: '2022-08-30T09:51:32.279Z'
    },
    {
      dealt: false,
      id: 2,
      reason: '嘉然嘉然嘉然嘉然嘉然嘉然嘉然嘉然嘉然嘉然嘉然嘉然',
      floor: {
        anonyname: 'Dest1n1',
        content:
          '现代社会以海德格尔的一句“一切实践传统都已经瓦解完了”为嚆矢。滥觞于家庭与社会传统的期望正失去它们的借鉴意义。但面对看似无垠的未来天空，我想循卡尔维诺“树上的男爵”的生活好过过早地振翮。' +
          '\n' +
          '我们怀揣热忱的灵魂天然被赋予对超越性的追求，不屑于古旧坐标的约束，钟情于在别处的芬芳。但当这种期望流于对过去观念不假思索的批判，乃至走向虚无与达达主义时，便值得警惕了。',
        deleted: true,
        fold: '该内容寄了，已被折叠',
        hole_id: 0,
        id: 100002,
        is_me: false,
        like: 0,
        liked: 0,
        mention: [],
        special_tag: '测试用例',
        storey: 0,
        time_created: '2022-07-27T17:07:39.802Z',
        time_updated: '2022-07-27T17:07:39.802Z'
      },
      time_created: '2022-08-30T09:51:32.279Z',
      time_updated: '2022-08-30T09:51:32.279Z'
    }
  ])
)
</script>

<style scoped></style>
