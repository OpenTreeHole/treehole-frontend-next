<script
  setup
  lang="ts"
>
import { arrayFactory } from '@/utils/reflect'
import { DetailedFloor, Floor, Tag } from '@/types'
import { camelizeKeys } from '@/utils'
import FloorItem from '@/components/floor/FloorItem.vue'
import Editor from '@/components/editor/Editor.vue'
import TagChip from '@/components/tag/TagChip.vue'
import { useEditor } from '@/composables/editor'

const floors = arrayFactory(
  DetailedFloor,
  camelizeKeys([
    {
      anonyname: 'Dest1n1',
      content:
        '现代社会以海德格尔的一句“一切实践传统都已经瓦解完了”为嚆矢。滥觞于家庭与社会传统的期望正失去它们的借鉴意义。但面对看似无垠的未来天空，我想循卡尔维诺“树上的男爵”的生活好过过早地振翮。' +
        '\n' +
        '我们怀揣热忱的灵魂天然被赋予对超越性的追求，不屑于古旧坐标的约束，钟情于在别处的芬芳。但当这种期望流于对过去观念不假思索的批判，乃至走向虚无与达达主义时，便值得警惕了。',
      deleted: false,
      fold: [],
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
    },
    {
      anonyname: 'Dest1n1',
      content:
        '现代社会以海德格尔的一句“一切实践传统都已经瓦解完了”为嚆矢。滥觞于家庭与社会传统的期望正失去它们的借鉴意义。但面对看似无垠的未来天空，我想循卡尔维诺“树上的男爵”的生活好过过早地振翮。' +
        '\n' +
        '我们怀揣热忱的灵魂天然被赋予对超越性的追求，不屑于古旧坐标的约束，钟情于在别处的芬芳。但当这种期望流于对过去观念不假思索的批判，乃至走向虚无与达达主义时，便值得警惕了。',
      deleted: true,
      fold: ['该内容寄了，已被折叠'],
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

const tags = arrayFactory(
  Tag,
  camelizeKeys([
    {
      name: '树洞',
      tag_id: 1,
      temperature: 1
    },
    {
      name: '提问',
      tag_id: 1,
      temperature: 1
    }
  ])
)

const { editorData, initEditor, clearEditor } = useEditor()
</script>

<template>
  <v-container class="px-0">
    <div class="flex">
      <v-col class="max-w-full lg:max-w-[55%] px-0">
        <v-list class="pt-0">
          <div class="border-b-sm">
            <div class="text-h4 px-10 pb-2 flex justify-between">
              <div class="flex grow-0">#123123</div>
              <v-btn @click="initEditor('')">发表评论</v-btn>
            </div>
            <div class="px-10 pb-2 flex">
              <TagChip
                v-for="(tag, index) in tags"
                :key="index"
                class="mr-2"
                :tag="tag"
              ></TagChip>
            </div>
            <template v-if="editorData">
              <v-divider class="mx-10 my-2" />
              <Editor
                :key="editorData"
                class="mx-6"
                :data="editorData"
                @close="clearEditor"
              ></Editor>
            </template>
          </div>

          <v-list-item
            v-for="(floor, index) in floors"
            :key="index"
            class="px-0 py-5 border-b-sm flex-col text-left"
          >
            <FloorItem
              class="pl-10 lg:pl-16"
              :floor="floor"
            />
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="hidden lg:block max-w-[25%] pl-5">
        <v-card
          class="mx-auto"
          max-width="368"
        >
          <v-card-item>
            <v-card-title class="text-h5 text-left px-1 font-semibold">相关讨论</v-card-title>
          </v-card-item>

          <v-divider />

          <v-card-text class="text-lg text-left">
            <p class="px-1 py-2">
              #123124
              <TagChip
                class="mx-2"
                :tag="tags[0]"
              ></TagChip>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </div>
  </v-container>
</template>

<style
  lang="scss"
  scoped
></style>
