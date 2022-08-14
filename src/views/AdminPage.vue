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
            <v-list class="pt-0">
              <v-list-item class="pl-16 py-5 border-b-sm flex-col text-left">
                <div class="w-full">
                  蓝图上的落差终归只是理念上的区分，在实践场域的分野也未必明晰。譬如当我们追寻心之所向时，在途中涉足权力的玉墀，这究竟是伴随着期望的泯灭还是期望的达成？在我们塑造生活的同时，生活也在浇铸我们。既不可否认原生的家庭性与社会性，又承认自己的图景有轻狂的失真，不妨让体验走在言语之前。用不被禁锢的头脑去体味切斯瓦夫·米沃什的大海与风帆，并效维特根斯坦之言，对无法言说之事保持沉默。
                </div>
                <div class="w-full flex justify-end mt-2 text-neutral-400 text-sm">
                  <span>引起不适</span>
                </div>
              </v-list-item>
              <v-list-item class="pl-16 py-5 border-b-sm flex-col text-left">
                <div class="w-full">
                  用在树上的生活方式体现个体的超越性，保持婞直却又不拘泥于所谓“遗世独立”的单向度形象。这便是卡尔维诺为我们提供的理想期望范式。生活在树上——始终热爱大地——升上天空。
                </div>
                <div class="w-full flex justify-end mt-2 text-neutral-400 text-sm">
                  <span>约炮</span>
                </div>
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

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AdminPage',
  data() {
    return {
      tab: 1 as number
    }
  }
})
</script>

<style scoped></style>
