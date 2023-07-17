var showMessage = document.querySelector('.showMessage')
document.addEventListener('alpine:init', () => {

    Alpine.data('pizzaCart', () => {
        return {
            title: 'Cheeky Pitsa',
            pizzas: [],
            username: 'asiFen',
            cartId: '',
            cartPizzas: [],
            paymentAmount: 0,
            cartTotal: 0.00,
            message: '',

            createCart() {
                const createCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
                return axios.get(createCartURL)
                    .then(result => {
                        this.cartId = result.data.cart_code
                    })
            },
            getCart() {
                const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`
                //call the api
                return axios.get(getCartURL)
            },
            addPizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/add',
                    {
                        "cart_code": this.cartId,
                        "pizza_id": pizzaId
                    })
            },

            removePizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/remove',
                    {
                        "cart_code": this.cartId,
                        "pizza_id": pizzaId
                    })
            },
            payTotal(amount) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', {
                    "cart_code": this.cartId,
                    amount
                })
            },

            showCart() {
                this.getCart().then(result => {
                    const cartData = result.data
                    this.cartPizzas = cartData.pizzas
                    this.cartTotal = cartData.total

                });
            },


            init() {
                axios
                    .get('https://pizza-api.projectcodex.net/api/pizzas')
                    .then(result => {
                        // console.log(result.data)
                        this.pizzas = result.data.pizzas
                    });

                this.showCart();

                if (!this.cartId) {
                    this.createCart()
                        .then(result => {
                            this.showCart()
                        })
                }
            },


            addPizzaToCart(pizzaId) {
                this.addPizza(pizzaId)
                    .then(() => {
                        this.showCart();
                    })
            },

            removePizzaFromCart(pizzaId) {
                this.removePizza(pizzaId)
                    .then(() => {
                        this.showCart();
                    })
            },
            payForCart() {
                this
                    .payTotal(this.paymentAmount)
                    .then(result => {
                        if (result.data.status == 'failure') {
                            this.message = result.data.message;
                            setTimeout(() => {
                                this.message = ''
                                // showMessage.classList.add('messageSuccess')
                            }, 3000)
                        }
                        else {
                            this.message = 'Payment received!'

                            setTimeout(() => {
                                // showMessage.classList.remove('messageSuccess')
                                this.message = '';
                                this.cartId = '';
                                this.cartPizzas = [];
                                this.cartTotal = 0.00
                                this.paymentAmount = 0;
                                this.createCart();
                            }, 3000)
                        }
                    })
            }
        }
    })
}) 