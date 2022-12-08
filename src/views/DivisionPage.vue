<template>
  <v-container class="px-0 pt-0">
    <div class="flex">
      <div class="w-full lg:max-w-[65%] 3xl:max-w-[55%] px-0 pt-4">
        <v-list class="pt-2">
          <div class="text-h4 border-b-sm px-6 lg:px-10 pb-8 flex justify-between">
            <div class="flex grow-0">树洞</div>
            <v-btn class="self-center">发布树洞</v-btn>
          </div>

          <router-link to="/hole/1">
          <v-list-item class="pl-16 py-5 border-b-sm flex-col text-left hover:bg-black-700">
            <HoleBlock :hole="holeMock"></HoleBlock>
          </v-list-item>
        </router-link>

          <v-list-item class="pl-16 py-5 border-b-sm flex-col text-left">
            <div class="w-full">
              在孜孜矻矻以求生活意义的道路上，对自己的期望本就是在与家庭与社会对接中塑型的动态过程。而我们的底料便是对不同生活方式、不同角色的觉感与体认。生活在树上的柯希莫为强盗送书，兴修水利，又维系自己的爱情。他的生活观念是厚实的，也是实践的。倘若我们在对过往借韦伯之言“祓魅”后，又对不断膨胀的自我进行“赋魅”，那么在丢失外界预期的同时，未尝也不是丢了自我。
            </div>
            <div class="w-full flex justify-end mt-2 text-neutral-400 text-sm">
              <span>发布于 2022/7/21</span>
            </div>
          </v-list-item>

          <v-list-item class="pl-16 py-5 border-b-sm flex-col text-left">
            <div class="w-full">
              毫无疑问，从家庭与社会角度一觇的自我有偏狭过时的成分。但我们所应摒弃的不是对此的批判，而是其批判的廉价，其对批判投诚中的反智倾向。在尼采的观念中，如果在成为狮子与孩子之前，略去了像骆驼一样背负前人遗产的过程，那其“永远重复”洵不能成立。何况当矿工诗人陈年喜顺从编辑的意愿，选择写迎合读者的都市小说，将他十六年的地底生涯降格为桥段素材时，我们没资格斥之以媚俗。
            </div>
            <div class="w-full flex justify-end mt-2 text-neutral-400 text-sm">
              <span>发布于 2022/7/21</span>
            </div>
          </v-list-item>
          <v-list-item class="pl-16 py-5 border-b-sm flex-col text-left">
            <div class="w-full">
              蓝图上的落差终归只是理念上的区分，在实践场域的分野也未必明晰。譬如当我们追寻心之所向时，在途中涉足权力的玉墀，这究竟是伴随着期望的泯灭还是期望的达成？在我们塑造生活的同时，生活也在浇铸我们。既不可否认原生的家庭性与社会性，又承认自己的图景有轻狂的失真，不妨让体验走在言语之前。用不被禁锢的头脑去体味切斯瓦夫·米沃什的大海与风帆，并效维特根斯坦之言，对无法言说之事保持沉默。
            </div>
            <div class="w-full flex justify-end mt-2 text-neutral-400 text-sm">
              <span>发布于 2022/7/21</span>
            </div>
          </v-list-item>
          <v-list-item class="pl-16 py-5 border-b-sm flex-col text-left">
            <div class="w-full">
              用在树上的生活方式体现个体的超越性，保持婞直却又不拘泥于所谓“遗世独立”的单向度形象。这便是卡尔维诺为我们提供的理想期望范式。生活在树上——始终热爱大地——升上天空。
            </div>
            <div class="w-full flex justify-end mt-2 text-neutral-400 text-sm">
              <span>发布于 2022/7/21</span>
            </div>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="hidden lg:block lg:max-w-[35%] xl:max-w-[30%] 3xl:max-w-[25%] pl-5">
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
            <v-btn> Full Report </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useDivisionStore, useHoleStore } from '@/store'
import { timeDifference } from '@/utils'
import { arrayFactory } from '@/utils/reflect'
import { camelizeKeys } from '@/utils'
import { Tag, Floor, Hole } from '@/types'
import { ref } from 'vue'
import HoleBlock from '@/components/hole/HoleBlock.vue'

const props = defineProps<{ divisionId: number }>()
const divisionStore = useDivisionStore()
const holeStore = useHoleStore()

watch(
  () => props.divisionId,
  () => {
    divisionStore.currentDivisionId = props.divisionId
  },
  { immediate: true }
)

const allTags = arrayFactory(
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
    },
    {
      name: '*引起不适',
      tag_id: 1,
      temperature: 1
    }
  ])
)

const tags = ref(allTags)

const specialTag = '测试用例'

const contents = [
  '我们怀揣热忱的灵魂天然被赋予对超越性的追求，不屑于古旧坐标的约束，钟情于在别处的芬芳。但当这种期望流于对过去观念不假思索的批判，乃至走向虚无与达达主义时，便值得警惕了。与秩序的落差、错位向来不能为越矩的行为张本。而纵然我们已有翔实的蓝图，仍不能自持已在浪潮之巅立下了自己的沉锚。',
  '“我的生活故事始终内嵌在那些我由之获得自身身份共同体的故事之中。”麦金太尔之言可谓切中了肯綮。人的社会性是不可祓除的，而我们欲上青云也无时无刻不在因风借力。社会与家庭暂且被我们把握为一个薄脊的符号客体，一定程度上是因为我们尚缺乏体验与阅历去支撑自己的认知。而这种偏见的傲慢更远在知性的傲慢之上。',
  '在孜孜矻矻以求生活意义的道路上，对自己的期望本就是在与家庭与社会对接中塑型的动态过程。而我们的底料便是对不同生活方式、不同角色的觉感与体认。生活在树上的柯希莫为强盗送书，兴修水利，又维系自己的爱情。他的生活观念是厚实的，也是实践的。倘若我们在对过往借韦伯之言“祓魅”后，又对不断膨胀的自我进行“赋魅”，那么在丢失外界预期的同时，未尝也不是丢了自我。',
  '毫无疑问，从家庭与社会角度一觇的自我有偏狭过时的成分。但我们所应摒弃的不是对此的批判，而是其批判的廉价，其对批判投诚中的反智倾向。在尼采的观念中，如果在成为狮子与孩子之前，略去了像骆驼一样背负前人遗产的过程，那其“永远重复”洵不能成立。何况当矿工诗人陈年喜顺从编辑的意愿，选择写迎合读者的都市小说，将他十六年的地底生涯降格为桥段素材时，我们没资格斥之以媚俗。',
  '蓝图上的落差终归只是理念上的区分，在实践场域的分野也未必明晰。譬如当我们追寻心之所向时，在途中涉足权力的玉墀，这究竟是伴随着期望的泯灭还是期望的达成？在我们塑造生活的同时，生活也在浇铸我们。既不可否认原生的家庭性与社会性，又承认自己的图景有轻狂的失真，不妨让体验走在言语之前。用不被禁锢的头脑去体味切斯瓦夫·米沃什的大海与风帆，并效维特根斯坦之言，对无法言说之事保持沉默。',
  '用在树上的生活方式体现个体的超越性，保持婞直却又不拘泥于所谓“遗世独立”的单向度形象。这便是卡尔维诺为我们提供的理想期望范式。生活在树上——始终热爱大地——升上天空。'
]

const contentsShort = [
  '我们怀揣热忱的灵魂天然被赋予对超越性的追求，不屑于古旧坐标的约束，钟情于在别处的芬芳。',
  '“我的生活故事始终内嵌在那些我由之获得自身身份共同体的故事之中。”麦金太尔之言可谓切中了肯綮。',
  '在孜孜矻矻以求生活意义的道路上，对自己的期望本就是在与家庭与社会对接中塑型的动态过程。而我们的底料便是对不同生活方式、不同角色的觉感与体认。',
  '毫无疑问，从家庭与社会角度一觇的自我有偏狭过时的成分。但我们所应摒弃的不是对此的批判，而是其批判的廉价，其对批判投诚中的反智倾向。在尼采的观念中，如果在成为狮子与孩子之前，略去了像骆驼一样背负前人遗产的过程，那其“永远重复”洵不能成立。',
  '蓝图上的落差终归只是理念上的区分，在实践场域的分野也未必明晰。',
  '用在树上的生活方式体现个体的超越性，保持婞直却又不拘泥于所谓“遗世独立”的单向度形象。这便是卡尔维诺为我们提供的理想期望范式。生活在树上——始终热爱大地——升上天空。'
]

const reply =
  '用在树上的生活方式体现个体的超越性，保持婞直却又不拘泥于所谓“遗世独立”的单向度形象。这便是卡尔维诺为我们提供的理想期望范式。生活在树上——始终热爱大地——升上天空。'

const floors = arrayFactory(
  Floor,
  camelizeKeys([
    {
      content: contents[0],
      holeId: 114514,
      specialTag: specialTag,
      anonyname: 'Rick Ashley',
      deleted: false,
      id: 1919810,
      storey: 1,
      fold: '',
      like: 0,
      time_created: '2022-07-27',
      time_updated: '2022-07-27'
    },
    {
      content: contents[1],
      holeId: 114515,
      specialTag: specialTag,
      anonyname: 'Rick Ashley',
      deleted: false,
      id: 1919810,
      storey: 1,
      fold: '',
      like: 0,
      time_created: '2022-07-27',
      time_updated: '2022-07-27'
    },
    {
      content: contents[2],
      holeId: 114516,
      specialTag: specialTag,
      anonyname: 'Rick Ashley',
      deleted: false,
      id: 1919810,
      storey: 1,
      fold: '',
      like: 0,
      time_created: '2022-07-27',
      time_updated: '2022-07-27'
    },
    {
      content: contents[3],
      holeId: 114517,
      specialTag: specialTag,
      anonyname: 'Rick Ashley',
      deleted: false,
      id: 1919810,
      storey: 1,
      fold: '',
      like: 0,
      time_created: '2022-07-27',
      time_updated: '2022-07-27'
    },
    {
      content: contents[4],
      holeId: 114518,
      specialTag: specialTag,
      anonyname: 'Rick Ashley',
      deleted: false,
      id: 1919810,
      storey: 1,
      fold: '',
      like: 0,
      time_created: '2022-07-27',
      time_updated: '2022-07-27'
    },
    {
      content: contents[5],
      holeId: 114514,
      specialTag: specialTag,
      anonyname: 'Linus',
      deleted: false,
      id: 1919810,
      storey: 2,
      fold: '',
      like: 0,
      time_created: '2022-07-27',
      time_updated: '2022-07-27'
    }
  ])
)

console.log('firstFloor:', floors[0])

const holeMock: Hole = {
  divisionId: 1,
  id: 1,
  floors: floors,
  firstFloor: floors[0],
  lastFloor: floors[floors.length - 1],
  reply: 810,
  tags: allTags,
  timeCreated: new Date(),
  timeUpdated: new Date()
}
</script>

<style lang="scss" scoped></style>
