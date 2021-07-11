const jwt = require('jsonwebtoken');
const authn = require('./authn');
const bcrypt = require("bcrypt");

exports.setApp = function (app, db_client) {

// Account Endpoints
// Register
app.post("/api/account/create", async (req, res, next) => {
    const {username, first_name, last_name, email, phone, role, checkin, checkout, room} = req.body;
    const db = db_client.db();
    const results = await
        // search if username already exists
        db.collection('Accounts').find({Login:username}).toArray();
        console.log(results);
    if (results.length > 0) {
        return res.status(400).json(errGen(400, "Username Taken"));
    }
    else {
        let newUser = {AccountType: role, Login: username, Password: hashPassword(""), FirstName: first_name, LastName: last_name,
        Email: email, PhoneNumber: phone, RoomNumber: room, CheckInDate: checkin, CheckOutDate: checkout};
        let createAction = await db.collection('Accounts').insertOne(newUser);

        return res.status(200).json(accountGen(createAction.ops[0]));
    }
})
// Login
app.post("/api/account/login", async (req, res, next) => {
    // grab login and password from request
    const {username, password} = req.body;
    const db = db_client.db();
    // Once createAccount has been implemented, we should instead search for
    //      only the login and verify the password with bcrypt.
    const results = await
        db.collection('Accounts').find({Login:username, Password:password}).toArray();
    if (results.length > 0) {
        // It's generally considered best practice to use let instead of var.
        // var has some oddities; let is considered more stable.
        let acc = results[0].AccountType;
        let id = results[0].UserID;
        let fn = results[0].FirstName;
        let ln = results[0].LastName;
        let ret = { UserID:id, AccountType:acc, FirstName:fn, LastName:ln, error:''}
        // Actually, this endpoint should return a JWT, not information on the user. So let's generate that.
        // And note how we are embedding in both the username and the role. This makes things a bit easier later on.
        const token = jwt.sign({'username': username, 'role': acc.toLowerCase()}, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            // https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
            "token": "Bearer " + token
        });
    }
    else
        return res.status(401).json(errGen(401));
})

// Admin Endpoints
// Get room information by room Number
app.get("/api/room/:room_id", [authn.isAuthorized, authn.isStaff], async (req, res, next) => {
  const {room_id} = req.body;
  const db = db_client.db();
  const results = await
      // search if username already exists
      db.collection('Room').find({RoomID: room_id}).toArray();
      console.log(results);
  if (results.length > 0) {
    db.collection('Room').deleteOne({RoomID: room_id});

    return res.status(200).json(errGen(200, "Success!"));
  }
  else
    return res.status(404).json(errGen(404, "Room Not Found"));
})
// Create room with given room number, if it does not yet exist
app.post("/api/room/:room_id", [authn.isAuthorized, authn.isAdmin], async (req, res, next) => {
  const {room_id, occupant, orders, floor} = req.body;
  const db = db_client.db();
  const results = await
      // search if username already exists
      db.collection('Room').find({RoomID:room_id}).toArray();
      console.log(results);
  if (results.length > 0) {
      return res.status(400).json(errGen(400, "Room Occupied"));
  }
  else {
      let newRoom = {RoomID: room_id, Occupant: occupant, Orders: orders, Floor: floor};
      let createAction = await db.collection('Room').insertOne(newRoom);

      return res.status(200).json(roomGen(createAction.ops[0]));
  }
})
// Edit a preexisting room
app.patch("/api/room/:room_id", [authn.isAuthorized, authn.isAdmin], async (req, res, next) => {

})
// Delete a room
app.delete("/api/room/:room_id", [authn.isAuthorized, authn.isAdmin], async (req, res, next) => {
  const {room_id} = req.body;
  const db = db_client.db();
  const results = await
      // search if username already exists
      db.collection('Room').find({RoomID: room_id}).toArray();
      console.log(results);
  if (results.length > 0) {
    db.collection('Room').deleteOne({RoomID: room_id});

    return res.status(200).json(errGen(200, "Success!"));
  }
  else
    return res.status(404).json(errGen(404, "Room Not Found"));
})
// Get all rooms on a given floor
app.get("/api/floor/:floor_number", [authn.isAuthorized, authn.isStaff], async (req, res, next) => {

})

// List all Items from Inventory
app.get("/api/inventory", authn.isAuthorized, async (req, res, next) => {
    const db = db_client.db();
    const results = await
        db.collection('Inventory').find({}).toArray();
    let formatted = []
    for (let i = 0; i < results.length; i++) {
        formatted[i] = inventoryGen(results[i]);
    }
    return res.status(200).json(formatted);
})
// Add Item to Inventory
app.post("/api/inventory", [authn.isAuthorized, authn.isAdmin], async (req, res, next) => {
    // Admin guard: authn.isAdmin. Requires isAuthorized to be called FIRST; Order matters a lot here!
    // Can be replaced with isStaff to check if an endpoint is available for staff and admin (not guest).

    let {name, description, img, quantity} = req.body;
    if (!name) return res.status(403).json(errGen(403, 'Missing "name" field in request.'));
    if (!description) description = "";
    if (!img) img = "";
    if (!quantity) quantity = -1;

    // What will end up in the DB, sans item ID.
    const obj = {
        "Name": name,
        "Description": description,
        "IMG": img,
        "Quantity": quantity
    };

    const db = db_client.db();
    // Insert, format, and then return.
    db.collection('Inventory').insertOne(obj).then((out) => {
        const results = out.ops[0];
        return res.status(200).json(inventoryGen(results));
    }).catch((err) => {
        return res.status(500).json(errGen(500, err));
    });
})
// Delete Item from Inventory
app.delete("/api/inventory/:inventory_id", [authn.isAuthorized, authn.isAdmin], async (req, res, next) => {
    let inventory_id = req.params.inventory_id;
    try {
        inventory_id = Number(inventory_id);
        if (isNaN(inventory_id))
            return res.status(400).json(errGen(400, "Invalid item ID."));
    } catch(err) {
        // If we can't cast a number
        return res.status(400, "Invalid item ID.");
    }
    db_client.db().collection('Inventory').deleteOne({Item_ID: inventory_id}).then((out) => {
        if (out.deletedCount === 0)
            return res.status(200).json(errGen(200, "No items deleted."));
        return res.status(200).json(errGen(200, "Item successfully deleted."));
    }).catch((err) => {
        return res.status(500).json(errGen(500, err));
    });
});
//
app.patch("/api/inventory/:inventory_id", [authn.isAuthorized, authn.isStaff], async (req, res, next) => {
    // Get inventory ID and validate it is, indeed, a number.
    let inventory_id = req.params.inventory_id;
    try {
        inventory_id = Number(inventory_id);
        if (isNaN(inventory_id))
            return res.status(400).json(errGen(400, "Invalid item ID."));
    } catch(err) {
        // If we can't cast a number
        return res.status(400, "Invalid item ID.");
    }

    const {name, quantity, description, img} = req.body;
    let newObj = {}
    // Properties staff AND admin can edit.
    if (quantity) newObj.Quantity = quantity;
    // Properties ONLY admin can edit.
    if (req.user.role === "admin") {
        if (name) newObj.Name = name;
        if (description) newObj.Description = description;
        if (img) newObj.IMG = img;
    }

    db_client.db().collection('Inventory').findOneAndUpdate({Item_ID: inventory_id}, {$set: newObj})
        .then((out) => {
            return res.status(200).json(inventoryGen(out.value));
            })
        .catch((err) => {
            return res.status(500).json(errGen(500, err));
    });
});

// Guest Endpoints
// Get Current Room Information
app.get("/api/room/:room_id", authn.isAuthorized, async (req, res, next) =>
{
    let room_id = req.params.room_id
    const db = db_client.db()
    const results = await
        db.collection('Room').find({RoomID:room_id}).toArray()
    let formatted = []
    formatted[0] = roomGen(results[0])
    return res.status(200).json(formatted)
});

// Orders an inventory item to a user's room

// Get information on a specific inventory entry
app.get("/api/inventory/:inventory_id", authn.isAuthorized, async (req, res, next) => {
    let inventory_id = req.params.inventory_id
    try {
        inventory_id = Number(inventory_id);
        if (isNaN(inventory_id))
            return res.status(400).json(errGen(400, "Invalid item ID."));
    } catch(err) {
        // If we can't cast a number
        return res.status(400, "Invalid item ID.");
    }
    const db = db_client.db()
    const results = await
        db.collection('Inventory').find({Item_ID:inventory_id}).toArray()
    if (results.length > 0) {
        let formatted = []
        formatted[0] = inventoryGen(results[0])
        return res.status(200).json(formatted)
    }
    else
        res.status(404).json(errGen(404,"Asset not found"))
});

app.use('api/hotel', async(req, res, next) => {

        var error = '';

        const db = db_client.db();
        const results = await db.collection('Hotel_Detail').find({}).toArray();

        var N = '';
        var C = '';
        var B = '';
        var D = '';
        var ret;

        if(results.length > 0){
            N = results[0].Name;
            C = results[0].Color;
            B = results[0].Background;
            D = results[0].Description;
        }else{
            ret = {error: 'Where the Beep is the Hotel'}
        }

        res.status(200).json(ret);
    });

// bcrypt hash password function for POST/api/createAcc
const hashPassword = async (password, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        // hash password
        return await bcrypt.hash(password, salt)
    } catch (err) {
        console.log(err)
    }
    // return null if error
    return null
}


}
