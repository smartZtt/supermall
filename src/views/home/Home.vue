<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">服装商城</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
  <scroll class="content"
          ref="scroll"
          :probe-type="3"
          @scroll="contentScroll"
          :pull-up-load="true"
          @pullingUp="loadMore">
    <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
    <recommend-view :recommends="recommends"></recommend-view>
    <feature-view></feature-view>
    <tab-control class="tab-control"
                 :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                  ref="tabControl2"/>
    <goods-list :goods="showGoods"></goods-list>
  </scroll>

    <back-top @click.native="backClick" v-show="isShowTopBack"></back-top>
  </div>
</template>

<script>

  import HomeSwiper from "./childComps/HomeSwiper";
  import recommendView from "./childComps/recommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/context/tabControl/TabControl";
  import GoodsList from "components/context/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/context/backTop/BackTop";
  import GoodsListItem from "components/context/goods/GoodsListItem";

  import {getHomeMultidata, getHomeGoods} from "network/home";
  import {debounce} from "common/utils"




  export default {
    name: "Home",
    components: {
      GoodsListItem,
      NavBar,
      HomeSwiper,
      recommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        isShowTopBack: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        scrollY: 0
      }
    },
    created() {
      this.getHomeMultidata()

      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },

    mounted() {
      //图片加载完成的时间监听
      const refresh = debounce(this.$refs.scroll.refresh,2000)
      this.$bus.$on('itemImageLoad',() =>{
        refresh()
      })


    },

    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed() {
      console.log('home destroyed');
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.scrollY, 1)
      this.$refs.scroll.refresh()

    },
    deactivated() {
      this.scrollY = this.$refs.scroll.getScrollY()
    },

    methods: {

      // 事件监听相关方法

      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick() {
        this.$refs.scroll.scrollTo(0,0)
      },
      contentScroll(position) {
        // 判断backtop是否显示
        this.isShowTopBack = (-position.y) > 1000

        // 吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
        // console.log('上拉加载更多')
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },

      //
      // 网络请求相关的方法
      //

      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        //箭头函数的指向会向上找
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          // 完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    height: 100vh;
    position: relative;
  }
  .home-nav {
    /*position: fixed;*/
    /*top: 0;*/
    /*right: 0;*/
    /*left: 0;*/
    z-index: 9;
    background-color: #ff8198;
    color: #fff;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    right: 0;
    left: 0;
    overflow: hidden;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }


</style>
