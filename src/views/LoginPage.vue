<template>
  <v-container class="px-0">
    <div class="flex lg:px-4">
      <v-col class="max-w-full lg:max-w-[65%] 3xl:max-w-[55%] px-0">
        <div class="text-3xl border-b-2 px-6 pb-8 mb-8 flex justify-between">
          <div class="flex grow-0">登录</div>
        </div>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="10"
            class="text-center"
          >
            <v-card
              class="py-8"
              elevation="4"
            >
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <div class="pl-7 pr-10">
                  <v-text-field
                    v-model="email"
                    label="邮箱"
                    prepend-icon="mdi-email"
                    :clearable="!valid"
                    :rules="emailRules"
                    @keydown.enter="gotoPassword"
                  />

                  <v-text-field
                    ref="passwordElement"
                    v-model="password"
                    label="密码"
                    prepend-icon="mdi-lock"
                    type="password"
                    :clearable="!valid"
                    :rules="passwordRules"
                    @keydown.enter="emailLogin"
                  />
                </div>
                <div class="px-10">
                  <v-btn
                    class="my-4"
                    color="primary"
                    block
                    :disabled="!valid"
                    @click="emailLogin"
                  >
                    登录
                  </v-btn>
                </div>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onDeactivated } from 'vue'
import { login } from '@/apis'
const password = ref('')
const valid = ref(false)
const email = ref('')
const emailRules = [
  (v: string) => !!v || 'E-mail is required',
  (v: string) => /.+@.+/.test(v) || 'E-mail must be valid'
]
const passwordRules = [(pwd: string) => pwd.length >= 8 || 'Password must be over 8 characters']
const emailLogin = async () => {
  const response = await login(email.value, password.value)
}
onDeactivated(() => {
  email.value = ''
  password.value = ''
})

const passwordElement = ref<HTMLElement>()
const gotoPassword = () => {
  passwordElement.value?.focus()
}
</script>

<style scoped lang="scss">
.v-field {
  background: rgb(var(--v-theme-surface));
  border-color: transparent;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}
</style>
