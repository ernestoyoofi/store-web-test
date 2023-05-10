let APIInitStore = {
  items: [
    {
      image: "https://dummyimage.com/1500x600/2600ff/ffffff.png",
      title: "Gorengan Tempe",
      id: "464a9451-6c87-4781-b0c5-b1aea25a0943",
      price: 2000,
      isSoldout: false
    },
    {
      image: "https://dummyimage.com/1500x600/2600ff/ffffff.png",
      title: "Mie Goreng",
      id: "133d633b-3e18-40ec-8ba9-dbd60d193f23",
      price: 5500,
      isSoldout: false
    },
    {
      image: "https://dummyimage.com/1500x600/2600ff/ffffff.png",
      title: "Teh Manis (Es/Anget)",
      id: "2505128d-9ffc-44b4-b6ef-049a90d9bfef",
      price: 2500,
      isSoldout: false
    }
  ],
  content: {
    listShop: document.querySelector(".list-items-shop"),
    listShopBtn: ".list-items-shop [addcards]",
    listCheckout: document.querySelector(".list-items-checkout")
  },
  builderUUID: () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  )
}

let StoreAPIDB = {
  get: () => {
    const loc_ = localStorage.getItem("db-store-items")
    try {
      if(!loc_) {
        localStorage.setItem("db-store-items", "{}")
      }
      return JSON.parse(loc_||"{}")
    } catch(err) {
      localStorage.setItem("db-store-items", "{}")
    }
  },
  set: (data) => {
    localStorage.setItem("db-store-items", JSON.stringify(data))
  }
}

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
}).format

// Builders List Shop

APIInitStore.items.forEach(data => {
  const buildCards = document.createElement("div")
  const imageItems = document.createElement("img")
  const detailsInfo = document.createElement("div")
  const titleItems = document.createElement("p")
  const priceItems = document.createElement("span")
  const buttonAdds = document.createElement("button")
  buildCards.classList.add("items-shop")
  detailsInfo.classList.add("items-details")

  buttonAdds.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>'
  buttonAdds.setAttribute("addcards", data.id)
  titleItems.innerText = data.title
  imageItems.style.width = "100%"
  imageItems.src = data.image
  priceItems.innerHTML = `<i class="fa-solid fa-money-bill"></i> ${formatter(data.price)} / items`

  detailsInfo.appendChild(buttonAdds)
  detailsInfo.appendChild(titleItems)
  detailsInfo.appendChild(priceItems)
  buildCards.appendChild(imageItems)
  buildCards.appendChild(detailsInfo)
  if(!data.isSoldout) {
    APIInitStore.content.listShop.appendChild(buildCards)
  }
})

const updateContentCheckOut = () => {
  const appsDep = document.querySelector('.payment-details')
  const data = StoreAPIDB.get()
  let totalprice = 0
  let appendToApp = ""
  Object.keys(data).forEach(namevariables => {
    const mitems = data[namevariables]
    const totalPriceItems = mitems.price * mitems.request
    const realData = APIInitStore.items[APIInitStore.items.map(z => z.id).indexOf(namevariables)]
    // IF not avaiable !
    if(APIInitStore.items.map(z => z.id).indexOf(namevariables) === -1) {
      return ;
    }
    totalprice = totalprice + totalPriceItems
    appendToApp += `<li><button action-payment="remove-items" id-items=${namevariables}><i class="fa-regular fa-trash-can"></i></button><div class="payment-items-controller"><button add-index-items=${namevariables}><i class="fa-solid fa-plus"></i></button><button remove-index-items=${namevariables}><i class="fa-solid fa-minus"></i></button></div><div class="payment-items-contents"><b>${realData.title}</b> <span types="prices">${formatter(totalPriceItems)} / ${mitems.request}</span></div></li>`
  })
  let headerApp = `<div class="payment-headers"><p>Total: <b>${formatter(totalprice)}</b></p><button><i class="fa-solid fa-check"></i></button></div><ul class="payment-checkout">${appendToApp}</ul>`

  appsDep.innerHTML = headerApp

  document.querySelector('.payment-headers button').addEventListener("click", () => {
    if(totalprice < 1) {
      return ;
    }
    const isConfirm = confirm("Apakah kamu sudah melakukan pembayaran, semua item yang disini akan terhapus")
    if(isConfirm) {
      StoreAPIDB.set({})
      updateContentCheckOut()
    }
  })
  document.querySelectorAll('.payment-details [action-payment="remove-items"][id-items]').forEach((datas, i) => {
    datas.addEventListener("click", () => {
      const id = datas.getAttribute("id-items")
      if(!id) {
        return ;
      }
      const isConfirm = confirm("Apakah kamu ingin menghapus item ini ?")
      if(isConfirm === true) {
        delete data[id]
        StoreAPIDB.set(data)
        updateContentCheckOut()
      }
    })
  })

  document.querySelectorAll('[add-index-items]').forEach((datas, i) => {
    datas.addEventListener("click", () => {
      const id = datas.getAttribute("add-index-items")
      if(!id) {
        return ;
      }
      data[id].request = isNaN(data[id].request)? 1 : Number(data[id].request) + 1
      StoreAPIDB.set(data)
      updateContentCheckOut()
    })
  })
  document.querySelectorAll('[remove-index-items]').forEach((datas, i) => {
    datas.addEventListener("click", () => {
      const id = datas.getAttribute("remove-index-items")
      if(!id) {
        return ;
      }
      data[id].request = isNaN(data[id].request)? 0 : Number(data[id].request) - 1
      if(data[id].request < 1) {
        const isConfirm = confirm("Apakah kamu ingin menghapus item ini ?")
        if(isConfirm === true) {
          delete data[id]
          StoreAPIDB.set(data)
          updateContentCheckOut()
        }
        return ;
      }
      StoreAPIDB.set(data)
      updateContentCheckOut()
    })
  })
}
updateContentCheckOut()

document.querySelectorAll(APIInitStore.content.listShopBtn)
.forEach(data => {
  data.addEventListener("click", () => {
    if(data.getAttribute("addcards")) {
      const idItem = data.getAttribute("addcards")
      const datadb = StoreAPIDB.get()
      const search = APIInitStore.items.map(z => z.id).indexOf(idItem)

      alert("Barang telah ditambahkan, buka pada tab keranjang !")
      if(!datadb[idItem] && search != -1) {
        datadb[idItem] = {
          price: APIInitStore.items[search].price,
          request: 1,
        }
        StoreAPIDB.set(datadb)
        updateContentCheckOut()
        return ;
      }
      
      if(search != -1) {
        datadb[idItem] = {
          ...datadb[idItem],
          request: datadb[idItem].request + 1
        }
        console.log(data)
        StoreAPIDB.set(datadb)
        updateContentCheckOut()
        return ;
      }
    }
  })
})