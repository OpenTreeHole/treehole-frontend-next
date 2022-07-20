<template>
  <div>
    <v-app-bar
      color="primary"
      density="compact"
    >
      <v-app-bar-title>
        <div class="max-w-7xl mx-auto flex">
          <v-img
            :src="Logo"
            max-width="199px"
          ></v-img>
          <v-combobox
            class="search-bar max-w-3xl ml-8"
            variant="outlined"
            color="white"
            density="compact"
            full-width
            hide-details
            prepend-inner-icon="mdi-magnify"
            placeholder="使用标签、帖子编号、楼层编号、或文本进行搜索（筛选）"
          ></v-combobox>
        </div>
      </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer
      class="z-20 pt-4 pb-10 w-[calc(50%-40rem+180px)]"
      :width="null"
    >
      <div class="flex justify-end">
        <div class="w-[180px]">
          <v-list>
            <v-list-subheader> 分区 </v-list-subheader>
            <v-list-item
              value="树洞"
              active-color="#03a9f4"
            >
              <v-list-item-title>树洞</v-list-item-title>
            </v-list-item>
            <v-list-item
              value="圆桌"
              active-color="#03a9f4"
            >
              <v-list-item-title>圆桌</v-list-item-title>
            </v-list-item>
            <v-list-item
              value="站务"
              active-color="#03a9f4"
            >
              <v-list-item-title>站务</v-list-item-title>
            </v-list-item>
            <v-divider class="mb-3" />
            <v-list-item
              value="设置"
              active-color="#03a9f4"
            >
              <v-list-item-title>设置</v-list-item-title>
            </v-list-item>
            <v-list-item
              value="协议"
              active-color="#03a9f4"
            >
              <v-list-item-title>协议</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script
  setup
  lang="ts"
>
import Logo from '@/assets/img.png'
</script>

<style lang="scss">
.search-bar {
  --v-input-padding-top: 6px !important;
}

.search-bar .v-field {
  background: rgb(var(--v-theme-surface));
  border-color: transparent;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.search-bar .v-field__prepend-inner {
  padding-top: 8px;
}
</style>
