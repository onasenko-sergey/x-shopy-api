Product collection contains general information about product(brand, name ...).

ProductType contains detailed information about specific product type(size, price ...).

CartItem collection combines user and product data. Using unique index it prevents duplication(creating multiple orders 
of the same product by one user). CartItems are not grouped into Cart to make editing operations atomic.

Order collection stores bundle of ex-cartItems once purchased by user. It has poor validation because cartItems are 
already validated before ordering.

User collection holds user information(basically authentication).
