/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
            var lineDetails = [];
            var greaterthantwo = false;

            // Retrieve line-level details using a search
            var lineSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: [['internalid', 'is', requestParams.entityID]],
                columns: ['item', 'quantity', 'rate', 'amount']
            });

            lineSearch.run().each(function (result) {
                var itemName = result.getText('item');
                var quantity = result.getValue('quantity');
                var rate = result.getValue('rate');
                var amount = result.getValue('amount');

                // Check if any of the values are empty or undefined
                if (!itemName || !quantity || !rate || !amount) {
                    // If any value is missing, skip this line and continue with the next one
                    return true;
                }

                // Convert quantity and rate to numbers
                quantity = parseInt(quantity);
                rate = parseFloat(rate);
                amount = parseFloat(amount);

                // Check if quantity is more than 2
                if (quantity > 2) {
                    greaterthantwo = true;
                }

                // Push line-level details to lineDetails array
                lineDetails.push({
                    "Item Name": itemName,
                    "Quantity": quantity,
                    "Rate": rate,
                    "Amount": amount
                });

                return true;
            });

            var message = "Line Details:";
            if (greaterthantwo) {
                message += " More than two quantities are available.";
            }

            return {
                "Message": message,
                "Line Details": lineDetails
            };
        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {
      
        }
      


        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {
        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {

        }

        return {get, put, post, delete: doDelete}

    });
