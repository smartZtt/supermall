<template>
  <div class="cart">
    <nav-bar class="nar-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <cart-list></cart-list>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>

  import NavBar from "components/common/navbar/NavBar";
  import CartBottomBar from "./childComps/CartBottomBar";
  import CartList from "./childComps/CartList";

  export default {
    name: "Cart",

    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      cartLength() {
        return this.$store.state.cartList.length
      }
    }

  }
</script>

<style scoped>
  .nar-bar {
    background-color: var(--color-tint);
    color: #fff;
  }
</style>
