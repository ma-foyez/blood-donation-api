const asyncHandler = require("express-async-handler");
const Divisions = require("../models/DivisionsModel");

/**
 * Store Divisions 
 */

// code: { type: String, required: true, unique: true  },
// name: { type: Number, required: true},
// bn_name: { type: String, required: true},
// coordinates: { type: String, required: true},
// url: { type: String, required: true},
// created_at: { type: Date, default: Date.now, required: true },
// updated_at: { type: Date, default: null },

const storeDivision = asyncHandler(async (req, res) => {
    const { code, name, email, bn_name, coordinates, url } = req.body;

    if (!code || !name || !bn_name || !coordinates || !url) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const alreadyExits = await Divisions.exists({ code: code });

    if (alreadyExits) {
        res.status(400);
        throw new Error("This division codes is already used for another division!");
    }

    const storeDivision = await Client.create({
        code,
        name,
        bn_name,
        coordinates,
        url,
    });

    if (storeDivision) {
        res.status(200).json({
            status: 200,
            message: "You have successfully store divisions!",
            data: {
                _id: storeDivision._id,
                code: storeDivision.code,
                name: storeDivision.name,
                bn_name: storeDivision.bn_name,
                coordinates: storeDivision.coordinates,
                url: storeDivision.url,
            },
        });
    } else {
        res.status(400);
        throw new Error("Failed to store divisions!");
    }
});


/**
 * Get Client Information List
 */

const getClientList = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const auth_user = req.user.id;

    const countPromise = Client.countDocuments({ auth_user: auth_user });
    const itemsPromise = Client.find({ auth_user: auth_user }).limit(limit).skip(page > 1 ? skip : 0);
    const [count, items] = await Promise.all([countPromise, itemsPromise]);
    const pageCount = count / limit;
    const viewCurrentPage = count > limit ? Math.ceil(pageCount) : page;

    if (!items) {
        res.status(400);
        throw new Error("Failed to load Client list.");
    }

    const clientList = [];

    for (let i = 0; i < items.length; i++) {
        const Client = items[i];
        const transactions = await Transaction.find({ client_id: Client._id });

        let totalPayable = 0;
        let totalLiabilities = 0;
        let dueLiabilities = 0;
        let duePayable = 0;

        transactions.forEach(transaction => {
            if (transaction.type_of_transaction === "payable") {
                totalPayable += transaction.amount;
            } else if (transaction.type_of_transaction === "liabilities") {
                totalLiabilities += transaction.amount;
            }
        });

        if (totalPayable > totalLiabilities) {
            duePayable = totalPayable - totalLiabilities;
        } else {
            dueLiabilities = totalLiabilities - totalPayable;
        }

        const updatedClient = {
            ...Client._doc,
            total_payable: totalPayable,
            total_liabilities: totalLiabilities,
            due_liabilities: dueLiabilities,
            due_payable: duePayable
        };
        clientList.push(updatedClient);
    }

    res.status(200).json({
        pagination: {
            total_data: count,
            total_page: viewCurrentPage,
            current_page: page,
            data_load_current_page: items.length,
        },
        data: clientList,
        status: 200,
        message: "Client list loaded successfully!",
    });
});



/**
 * Get Single Client
 */
const getClientDetails = asyncHandler(async (req, res) => {
    const ClientId = req.params.id;

    const singleClient = await Client.findById(ClientId);
    if (!singleClient) {
        res.status(400);
        throw new Error("Failed to load Client");
    }

    const transactions = await Transaction.find({ client_id: ClientId });

    let totalPayable = 0;
    let totalLiabilities = 0;
    let dueLiabilities = 0;
    let duePayable = 0;

    transactions.forEach(transaction => {
        if (transaction.type_of_transaction === "payable") {
            totalPayable += transaction.amount;
        } else if (transaction.type_of_transaction === "liabilities") {
            totalLiabilities += transaction.amount;
        }
    });

    if (totalPayable > totalLiabilities) {
        duePayable = totalPayable - totalLiabilities;
    } else {
        dueLiabilities = totalLiabilities - totalPayable;
    }

    res.status(200).json({
        data: {
            Client: {
                ...singleClient._doc,
                total_liabilities: totalLiabilities,
                total_payable: totalPayable,
                due_liabilities: dueLiabilities,
                due_payable: duePayable
            },
        },
        status: 200,
        message: "Client loaded successfully!",
    });
});


/**
 * Update Client Info
 */
const updateClient = asyncHandler(async (req, res) => {

    const { _id, name, mobile, email, relation, address, pic } = req.body;

    if (!_id || !name || !mobile || !relation || !address) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const alreadyExits = await Client.findOne({ _id });

    const updateOne = await Client.updateOne({ _id }, {
        $set: {
            _id: _id,
            name: name,
            mobile: mobile,
            email: email,
            relation: relation,
            address: address,
            pic: pic,

        }
    });

    if (updateOne) {
        res.status(200).json({
            data: {
                _id: _id,
                name: name,
                mobile: mobile,
                email: email,
                relation: relation,
                address: address,
                total_liabilities: alreadyExits.total_liabilities,
                total_payable: alreadyExits.total_payable,
                pic: pic
            },
            status: 200,
            message: "Client updated successfully!"
        });
    } else {
        res.status(400);
        throw new Error("Failed to Client");
    }
});


/**
 * Delete Single Client
 */
const deleteClient = asyncHandler(async (req, res) => {
    const auth_user = req.user.id;
    // const removeClient = await Client.findByIdAndDelete(req.params.id);
    const removeClient = await Profile.findOneAndDelete({
        _id: req.params.id,
        auth_user: auth_user
    });

    // const removeTransaction = await Transaction.deleteMany({
    //     client_id: req.params.id,
    //     auth_user: auth_user
    // });


    if (removeClient) {
        res.status(200).json({
            status: 200,
            message: "Client deleted successfully!"
        });
    } else {
        res.status(400);
        throw new Error("Failed to delete Client");
    }
});

module.exports = { storeDivision, getClientList, getClientDetails, updateClient, deleteClient }