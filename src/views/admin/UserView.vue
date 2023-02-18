<template>
  <div class="flex">
    <div class="max-w-full lg:max-w-[65%] 3xl:max-w-[55%] grow">
      <v-list class="py-2">
        <div class="flex px-6 lg:px-10 py-2">
          <span class="self-center font-semibold"> 搜索用户： </span>
          <v-text-field
            v-model="userIdStr"
            class="grow mr-2"
            hide-details
            variant="outlined"
            autofocus
            density="compact"
            placeholder="请输入用户 ID"
          />
          <v-btn
            class="self-center"
            @click="searchUser"
          >
            搜索
          </v-btn>
        </div>
        <v-divider class="my-2" />
        <template v-if="user">
          <div class="text-left px-6 lg:px-10 py-2">
            <p class="text-xl font-semibold">用户信息：</p>
            <div class="grow mt-2 ml-2">
              <div v-if="user">
                <div class="flex">
                  <span class="self-center font-semibold"> ID： </span>
                  <span class="self-center ml-2"> {{ user.id }} </span>
                </div>
                <div class="flex">
                  <span class="self-center font-semibold"> 昵称： </span>
                  <span class="self-center ml-2"> {{ user.nickname }} </span>
                </div>
                <div class="flex">
                  <span class="self-center font-semibold"> 管理员： </span>
                  <span
                    class="self-center ml-2"
                    :class="{ 'text-red-500 font-semibold': isAdmin }"
                  >
                    {{ isAdmin ? '是' : '否' }}
                  </span>
                </div>
              </div>
              <div v-else>
                <span class="self-center"> 未搜索到用户 </span>
              </div>
            </div>
          </div>
        </template>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '@/composables/notification'
import { UserAuth } from '@/types'
import { computed, ref } from 'vue'
import { getUserById } from '@/apis'

const not = useNotification()

const userIdStr = ref('')
const user = ref<UserAuth | null>(null)
const isAdmin = computed(() => user.value && user.value.isAdmin)

const searchUser = async () => {
  if (userIdStr.value === '') {
    not.error('请输入用户 ID')
    return
  }
  if (Number.isNaN(parseInt(userIdStr.value))) {
    not.error('用户 ID 必须是数字')
    return
  }
  user.value = await getUserById(parseInt(userIdStr.value))
}
</script>

<style lang="scss" scoped></style>
