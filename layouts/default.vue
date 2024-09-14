<template>
  <div>
    <NuxtLoadingIndicator />
    <header class="header">
      <div class="container between">
        <div class="header__left">
          <nuxt-link to="/" class="logo">LooK动漫</nuxt-link>
          <nav v-if="route.path.indexOf('/user') === -1" class="hidden-sm-and-down">
            <ul>
              <li :class="route.path === '/' ? 'active' : ''"><NuxtLink to="/">首页</NuxtLink></li>
              <li
                v-for="item in navigation.data"
                :key="item.id"
                :class="route.params.column === item.value ? 'active' : ''"
              >
                <nuxt-link v-if="+item.type === 1" :to="`/column/${item.value}`">{{ item.name }}</nuxt-link>
                <nuxt-link v-if="+item.type === 2" :to="item.value" target="_blank">{{ item.name }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
        <div v-if="route.path !== '/search'" class="header__right items-center">
          <el-input
            v-model="searchValue"
            class="w-50 m-2 mr-20"
            placeholder="请输入搜索的动漫名"
            :suffix-icon="ElIconSearch"
            @keyup.enter="handleSearch"
          />
          <ClientOnly>
            <template v-if="token">
              <el-dropdown @command="handleCommand">
                <el-button circle :icon="ElIconUserFilled" color="#155FAA"></el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="user">个人中心</el-dropdown-item>
                    <el-dropdown-item divided command="logOut">退出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template v-else>
              <el-button circle :icon="ElIconUserFilled" @click="goLogin"></el-button>
            </template>
          </ClientOnly>
        </div>
      </div>
      <div v-if="route.path.indexOf('/user') === -1" class="mobile-nav hidden-sm-only hidden-sm-and-up">
        <ul>
          <li
            v-for="(item, index) in navigation.data"
            :key="index"
            :class="route.params.column === item.value ? 'active' : ''"
          >
            <nuxt-link v-if="+item.type === 1" :to="`/column/${item.value}`">{{ item.name }}</nuxt-link>
            <nuxt-link v-if="+item.type === 2" :to="item.value" target="_blank">{{ item.name }}</nuxt-link>
          </li>
        </ul>
      </div>
    </header>
    <div class="header__height__placeholder"></div>
    <slot />
    <div class="container default__text-muted">
      本网站为动漫演示站，提供的资源均系收集于各大视频网站<br />
      <br />
      本站仅供测试和学习交流。请大家支持正版。
    </div>
    <footer>Copyright {{ $dayjs().format('YYYY') }} LooK Inc. All Rights Reserved.</footer>
    <LoginPop />
    <el-backtop />
  </div>
</template>

<script setup lang="ts">
  import LoginPop from '~/components/LoginPop.vue';
  import { useServerRequest } from '~/composables/useServerRequest';

  const tokenCookie = useCookie<string | undefined>('token');
  const token = useToken();
  const route = useRoute();
  const loginDialogVisible = useLoginDialogVisible();

  const searchValue = ref('');

  // 导航结果navigation
  const { data: navigation } = await useServerRequest('/column/all', {
    query: { status: 0 }
  });

  function handleSearch() {
    navigateTo('/search?keyword=' + searchValue.value);
  }

  function goLogin() {
    loginDialogVisible.value = true;
  }

  function handleCommand(command: string) {
    switch (command) {
      case 'logOut':
        logOut();
        break;
      default:
        navigateTo('/user');
        break;
    }
  }

  function logOut() {
    tokenCookie.value = undefined;
    token.value = '';
    if (route.path.includes('/user')) {
      navigateTo('/');
    }
  }
</script>

<style lang="scss">
  /*头部*/
  .header {
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 55px;
    background: linear-gradient(270deg, #efefef 0%, #ffa5bb 100%);
    /*标题*/
    &__left {
      display: flex;
      .logo {
        display: flex;
        width: 150px;
        height: 55px;
        line-height: 55px;
        font-size: 24px;
        color: #eeeeee;
        font-weight: bold;
        background-position: 50% 50% !important;
        background-size: cover !important;
        overflow: hidden;
      }
      nav {
        ul {
          display: flex;
          li {
            a {
              display: inline-block;
              height: 55px;
              line-height: 55px;
              font-size: 15px;
              padding: 0 20px;
              color: #fff;
            }
            &.active {
              a {
                background-color: #155faa;
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
  .header__height__placeholder {
    height: 55px;
  }

  footer {
    padding: 40px 0;
    text-align: center;
  }

  .default__text-muted {
    padding: 20px 0 0;
    color: #999999;
    text-align: center;
  }

  @media only screen and (max-width: 991px) {
    .header {
      position: relative;

      .mobile-nav {
        border-top: $light-gray solid 1px;
        background: $drak-blue;
        position: absolute;
        height: 46px;
        bottom: -46px;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        box-sizing: border-box;
        padding-top: 8px;
        z-index: 9;
        &::-webkit-scrollbar {
          display: none;
        }
        ul {
          white-space: nowrap;
          li {
            display: inline-block;
            position: relative;
            &.active {
              a {
                color: #1583f3;
              }
            }
            a {
              display: inline-block;
              padding: 5px 19px;
              color: #ffffff;
              font-size: 16px;
            }
          }
        }
      }
    }
    .header__height__placeholder {
      height: 46px;
    }
  }
</style>
