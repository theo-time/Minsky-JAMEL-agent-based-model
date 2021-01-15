function order(emetter, prop) {
    this.emetter = emetter
    this.prop = prop
    this.id = Math.floor(random(1000000))
    this.state = 'unmet'
    this.creationDate = frameCount
    this.validity = 1
}

function toMarketOrder(q, emetter, prop) {
	//Call properties from order constructor
	order.call(this, emetter, prop)

	//Specific properties
	this.type = "to-market"
    this.q = q
}

function limitedOrder(price, q, emetter, prop) {
	//Call properties from order constructor
	order.call(this, emetter, prop)

	//Specific properties
	this.type = "limited-order"
    this.q = q
    this.price = price
    this.initQ = q
}

function bestlimitOrder(q, emetter, prop) {
	//Call properties from order constructor
	order.call(this, emetter, prop)

	//Specific properties
	this.type = "bestlimit-Order"
    this.q = q
    this.price = price
}