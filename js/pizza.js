var showMessage = document.querySelector('.showMessage')
document.addEventListener('alpine:init', () => {

    Alpine.data('pizzaCart', () => {
        return {
            title: 'Cheeky Pitsa',
            pizzas: [],
            username: '',
            cartId: '',
            cartPizzas: [],
            paymentAmount: 0,
            cartTotal: 0.00,
            message: '',
            login() {
                if (this.username.length > 3) {
                    localStorage['username'] = this.username;
                    this.createCart()
                }
                else {
                    this.cartId = 'Username too short.'
                }
            },

            logout() {
                if (confirm('Do you want to log out?')) {
                    this.username = '';
                    this.cartId = "";
                    localStorage['username'] = '';
                    localStorage['cartId'] = '';
                    this.message = '';
                    this.cartId = '';
                    this.cartPizzas = [];
                    this.cartTotal = 0.00;
                    this.paymentAmount = 0;
                }

            },
            createCart() {
                if (!this.username) {
                    this.cartId = 'Please enter username.'
                    return;
                }

                const cartId = localStorage['cartId']

                if (cartId) {
                    this.cartId = cartId;
                } else {
                    const createCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
                    return axios.get(createCartURL)
                        .then(result => {
                            this.cartId = result.data.cart_code
                            localStorage['cartId'] = this.cartId
                        })
                }

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

                const username = localStorage['username']
                if (username) {
                    this.username = username

                }

                axios
                    .get('https://pizza-api.projectcodex.net/api/pizzas')
                    .then(result => {
                        // console.log(result.data)
                        this.pizzas = result.data.pizzas
                    });

                // this.showCart();

                if (!this.cartId) {
                    this
                        .createCart()
                    //         .then(() => {
                    //             this.showCart();
                    //         })
                }
                this.showCart();

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
                            showMessage.classList.add('messageSuccess')
                            this.message = result.data.message;
                            setTimeout(() => {
                                this.message = ''
                                showMessage.classList.remove('messageSuccess')

                            }, 3000)
                        }
                        else {
                            showMessage.classList.add('messageError')
                            this.message = 'Payment received!'
                            setTimeout(() => {
                                showMessage.classList.remove('messageError')
                                this.message = '';
                                this.cartId = '';
                                this.cartPizzas = [];
                                this.cartTotal = 0.00;
                                this.paymentAmount = 0;
                                localStorage['cartId'] = '';
                                this.createCart();
                            }, 3000)
                        }
                    })
            }
        }
    })
}) 