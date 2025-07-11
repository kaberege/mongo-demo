const mongoose = require('mongoose');
const { Schema } = mongoose;

//mongodb://localhost:27017
/* console.log("Started...");

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const ConnectDb = async () => {
    try {
        await client.connect();
        console.log("connected!");
    } catch (error) {
        console.log(error);

    }

}; */
mongoose.connect('mongodb://localhost:27017')
    .then(() => console.log("Mongoose is connected!"));

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    product: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true

            }
        }]
    }
});

const Product = mongoose.model("Product", productSchema);
const User = mongoose.model("User", userSchema);
const newProduct = new Product({
    title:"My recipe",
    product: "Mango",
    price:"2",
    description:"A sweet yellow fruits.",
    imageURL: "http://localhost:8000",
    userId: "67ed5647d7b8ef800486b206"

});
newProduct.save();
// const newProducts = Product.findByIdAndDelete("67ed29713219c09fcea4e33d")
//     .then(prod => console.log("I deleted this product"));


const newUser = new User(
    {
        name: "kaberege",
        email: "kgn123@gmail.com",
        cart: {
            items: []
        }
    }
);

//newUser.save();
