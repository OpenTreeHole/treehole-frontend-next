<template>
  <div>
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
  </div>
</template>

<script
  setup
  lang="ts"
>
import { arrayFactory } from '@/utils/reflect'
import { Report } from '@/types'
import { camelizeKeys } from '@/utils'
import ReportBlock from '@/components/floor/ReportBlock.vue'

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

<style
  lang="scss"
  scoped
></style>
