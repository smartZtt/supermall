<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        class="check-button"
        :is-checked="isSelectAll"
        @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>

    <div class="price">
      <span>合计：{{totalPrice}}</span>
    </div>

    <div class="calculate">
      <span>去计算：{{checkLength}}</span>
    </div>
  </div>
</template>

<script>

  import CheckButton from "./CheckButton";

    export default {
        name: "CartBottomBar",
      components: {
        CheckButton
      },
      computed: {
        totalPrice() {
          return '￥' + this.$store.state.cartList.filter(item => {
            return item.checked
          }).reduce((preValue, item) => {
            return preValue + item.price * item.count
          },0).toFixed(2)
        },
        checkLength() {
          return this.$store.state.cartList.filter(item => item.checked).length
        },
        isSelectAll() {
          if(this.$store.state.cartList.length === 0) return false
          // return !(this.$store.state.cartList.filter(item => !item.checked).length)
          return !(this.$store.state.cartList.find(item => !item.checked))

        }
      },
      methods: {
        checkClick() {
          if (this.isSelectAll) {//全部选中
            this.$store.state.cartList.forEach(item => item.checked = false)
          } else {
            this.$store.state.cartList.forEach((item => item.checked = true))
          }
        }
      }
    }
</script>

<style scoped>
  .bottom-bar {
    position: fixed;
    display: flex;
    width: 100%;
    height: 40px;
    bottom: 49px;
    line-height: 40px;
    background-color: #eee;
  }
  .check-content {
    display: flex;
    width: 100px;
    align-items: center;
    margin-left: 10px;
  }
  .check-button {
    width: 22px;
    height: 22px;
    line-height: 22px;
    margin-right: 10px;
  }
  .price {
    margin-left: 30px;
    flex: 1;
  }
  .calculate {
    width: 90px;
    text-align: center;
    background-color: #ff5900;
    color: #fff;
  }
</style>
