<template>
    <div id="detail">
      <detail-nav-bar class="detail-nav" @itemClickEvent="itemClickEvent" ref="nav"/>
      <scroll class="content"
              ref="scroll"
              @scroll="scrollContent"
              :probe-type="3">
        <detail-swiper :top-images="topImages"></detail-swiper>
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
        <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
        <detail-comment :comment="comment" ref="comment"></detail-comment>
        <goods-list :goods="recommends" ref="recommend"></goods-list>
      </scroll>
      <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
      <back-top @click.native="backClick" v-show="isShowTopBack"></back-top>
      <toast :message="message" :show="show"></toast>
    </div>
</template>

<script>

  import detailNavBar from "./childComps/detailNavBar";
  import detailSwiper from "./childComps/detailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailComment from "./childComps/DetailComment";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/context/goods/GoodsList";
  import BackTop from "components/context/backTop/BackTop";
  import Toast from "components/common/toast/Toast";

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";
  import {debounce} from "common/utils";
  import { mapActions } from 'vuex'



  export default {
      name: "Detail",
      components: {
        detailNavBar,
        detailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailComment,
        DetailBottomBar,
        Scroll,
        GoodsList,
        BackTop,
        Toast
      },
      data() {
        return {
          iid: null,
          topImages: [],
          goods: {},
          shop: {},
          detailInfo: {},
          paramInfo: {},
          comment: {},
          recommends: [],
          themeTopY: [],
          getThemeTopY: null,
          currentIndex: [],
          isShowTopBack: false,
          message:'',
          show: false
        }
      },
      created() {
        // 1. 保存传入的iid
        this.iid = this.$route.params.iid

        //2. 根据iid请求数据
        getDetail(this.iid).then(res => {
          const data = res.result
          //获取轮播图数据
          this.topImages = data.itemInfo.topImages

          // 获取商品信息
          this.goods = new Goods (data.itemInfo, data.columns, data.shopInfo.services)


          // 创建店铺信息的对象
          this.shop = new Shop(data.shopInfo)

          // 保存商品的详情数据
          this.detailInfo = data.detailInfo;

          // 获取参数信息
          this.paramInfo =  new GoodsParam(data.itemParams.info, data.itemParams.rule)

          //获取评论
          if (data.rate.cRate != 0) {
            this.comment = data.rate.list[0];
          }
        })

        // 3. 请求推荐数据
        getRecommend().then(res =>{
          this.recommends = res.data.list
        })

        // 4. 给getThemeTopY赋值，做防抖操作
        this.getThemeTopY = debounce(() => {
          this.themeTopY = []
          this.themeTopY.push(0)
          this.themeTopY.push(this.$refs.params.$el.offsetTop)
          this.themeTopY.push(this.$refs.comment.$el.offsetTop)
          this.themeTopY.push(this.$refs.recommend.$el.offsetTop)
          this.themeTopY.push(Number.MAX_VALUE)
        },200)

        //等到组件渲染完毕，再拿取offsetTop值
        // this.$nextTick(() => {
        //根据最新的数据，对应的DOM是已经被渲染出来
        //单数图片依然还没有加载完（目前获取的offsetTop)不包含其中的图片）
        //offsetTop值不对的时候，都是因为图片的问题
        //   this.themeTopY = []
        //   this.themeTopY.push(0)
        //   this.themeTopY.push(this.$refs.params.$el.offsetTop)
        //   this.themeTopY.push(this.$refs.comment.$el.offsetTop)
        //   this.themeTopY.push(this.$refs.recommend.$el.offsetTop)
        //
        //   console.log(this.themeTopY)
        // })

      },
      // updated() {
      //   this.themeTopY = []
      //   this.themeTopY.push(0)
      //   this.themeTopY.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopY.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopY.push(this.$refs.recommend.$el.offsetTop)
      //
      //   console.log(this.themeTopY)
      // },
    methods: {
        ...mapActions(['addCart']),
      imageLoad() {
          this.$refs.scroll.refresh()
          this.getThemeTopY()
        },
      itemClickEvent(index) {
          this.$refs.scroll.scrollTo(0, - this.themeTopY[index], 100)
        },
      scrollContent(position) {

          const positionY = - position.y
          let length = this.themeTopY.length
          // for(let i = 0; i < length; i++) {
          //   if ( this.currentIndex != i && ((i < length - 1 && positionY >= this.themeTopY[i]
          //     && positionY < this.themeTopY[i+1])
          //     || ( i === length - 1 && positionY >= this.themeTopY[i]))) {
          //     this.currentIndex = i
          //     this.$refs.nav.currentIndex = this.currentIndex
          //   }
          // }

          for (let i = 0; i < length - 1; i++){
            if(this.currentIndex != i && ( positionY >= this.themeTopY[i] && positionY < this.themeTopY[i+1]))
            {
              this.currentIndex = i
              this.$refs.nav.currentIndex = this.currentIndex
            }
          }
          this.isShowTopBack = (- position.y) > 1000
        },
      backClick() {
        this.$refs.scroll.scrollTo(0,0,150)
      },
      addToCart() {
        // 1.创建对象，获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        // 传值给vuex的mutation改变state
        // this.$store.commit('addCart', product) 同步
        this.$store.dispatch('addCart', product).then(res => {  //异步
          this.show = true
          this.message = res

          setTimeout(() => {
            this.show = false
            this.message = ''
          },1500)
        })
        // this.addCart(product).then(res => {
        //   this.$toast.show(res, 2000)
        //   // console.log(res);
        // })
      }
    }
    }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    height: 100vh;
    background-color: #fff;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 49px);
    overflow: hidden;
  }
</style>
