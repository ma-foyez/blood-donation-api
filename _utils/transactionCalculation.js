const Profile = require("../models/peopleModal");

const transactionCalculationForPeople = async (personaId, amount, transactionType) => {
    // Retrieve user profile from the database
    const getUserById = await Profile.findOne({ _id: personaId });
    const { total_liabilities, total_payable, due_liabilities, due_payable } = getUserById;

    // Initialize variables with profile data
    let TotalLiabilities = total_liabilities;
    let totalPayable = total_payable;
    let dueLiabilities = due_liabilities;
    let duePayable = due_payable;

    // Calculate values based on transaction type
    if (transactionType === "liabilities") {
        // Increase total liabilities by the amount
        TotalLiabilities += amount;

        // Handle existing due payable
        if (duePayable > 0) {
            const newPayable = duePayable - amount;

            // If new payable is negative, update due liabilities and set due payable to 0
            if (newPayable < 0) {
                dueLiabilities += Math.abs(newPayable);
                duePayable = 0;
            } else {
                // Otherwise, update due payable and set due liabilities to 0
                duePayable = Math.abs(newPayable);
                dueLiabilities = 0;
            }
        } else {
            // If no existing due payable, increase due liabilities by the amount
            dueLiabilities += amount;
        }
    } else {
        // Increase total payable by the amount
        totalPayable += amount;

        // Handle existing due liabilities
        if (dueLiabilities > 0) {
            const newDueLiabilities = dueLiabilities - amount;

            // If new due liabilities is negative, update due payable and set due liabilities to 0
            if (newDueLiabilities < 0) {
                duePayable += Math.abs(newDueLiabilities);
                dueLiabilities = 0;
            } else {
                // Otherwise, update due liabilities and set due payable to 0
                dueLiabilities = Math.abs(newDueLiabilities);
                duePayable = 0;
            }
        } else {
            // If no existing due liabilities, increase due payable by the amount
            duePayable += amount;
        }
    }

    // Return the updated calculation values
    return {
        TotalLiabilities,
        totalPayable,
        dueLiabilities,
        duePayable
    };
};

module.exports = { transactionCalculationForPeople };
