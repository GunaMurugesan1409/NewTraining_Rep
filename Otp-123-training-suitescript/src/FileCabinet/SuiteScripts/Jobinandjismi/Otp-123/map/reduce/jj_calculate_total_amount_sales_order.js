/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/search', 'N/log'],

    function (search, log) {

        function getInputData() {
            // Search for sales orders
            return search.create({
                type: 'salesorder',
                filters: [
                    ["type", "anyof", "SalesOrd"],
                    "AND",
                    ["trandate", "within", "lastmonth"],
                    "AND",
                    ["mainline", "is", "T"]
                ],
                columns: [
                    search.createColumn({ name: "entity", label: "Name" }),
                    search.createColumn({ name: "amount", label: "Amount" }),
                ]
            });
        }

        function map(context) {
            // Extract customer and sales amount from each sales order
            var searchResult = JSON.parse(context.value);
            var customerId = searchResult.values['entity'].text;
            var salesAmount = searchResult.values['amount'];

            // Emit customer as key and sales amount as value
            context.write(customerId, salesAmount);
        }

        function reduce(context) {
            // Sum up sales amounts for each customer
            var customerId = context.key;
           // log.debug('customerId')
            var salesAmounts = context.values;
           // log.debug('salesAmounts')

            // Initialize total sales to zero
           // var totalSales = 0;

            // Iterate over sales amounts and sum them up
            salesAmounts.forEach(function (amount) {
                // Parse amount to float and add to totalSales
                totalSales += parseFloat(amount);
            });

            // Log the total sales for debugging
            log.debug({
                title: 'Total sales for customer ' + customerId,
                details: totalSales
            });

            // Emit the total sales for each customer
            context.write(customerId, totalSales);
        }

        function summarize(summaryContext) {
            
        }

        // Expose functions
        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };

    });
