export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      //1. 查找之前的数组中是否有该商品
      let oldProduct = context.state.cartList.find(function (item) {
        return item.iid === payload.iid
      })

      //2.判断oldProduct
      if (oldProduct) {// 当前商品数量＋1
        context.commit('addCounter', oldProduct)
        resolve('当前商品数量+1')
      }else {//添加新的商品
        payload.count = 1
        context.commit('addToCart', payload)
        resolve('✔成功加入购物车')
      }
    })

  }
}
