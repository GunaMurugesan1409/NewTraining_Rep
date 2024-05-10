/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            function updateSalesOrders(params) {
                // Define search filters
                var filters = [
                    ["type", "anyof", "SalesOrd"],
                    "AND",
                    ["shipdate", "within", "4/30/2024", "5/3/2024"],
                    "AND",
                    ["status", "anyof", "SalesOrd:G", "StPickUp:A", "VendBill:B"]
                ]

                // Create search to find sales orders
                var salesOrderSearch = search.create({
                    type: search.Type.SALES_ORDER,
                    filters: filters
                });

                // Retrieve sales orders
                var salesOrderResults = salesOrderSearch.run().getRange({
                    start: 1,
                    end: 100
                });

                // Calculate new ship date and update sales orders
                salesOrderResults.forEach(function (result) {
                    var salesOrderId = result.id;
                    var shipDate = new Date();
                    // Add 3 business days to the current date
                    shipDate.setDate(shipDate.getDate() + 3);
                    // Update ship date on the sales order
                    record.submitFields({
                        type: record.Type.SALES_ORDER,
                        id: salesOrderId,
                        values: {
                            shipdate: shipDate
                        }
                    });
                    log.debug('Sales Order Updated', 'ID: ' + salesOrderId + ', New Ship Date: ' + shipDate);
                });
            }

            return {
                each: updateSalesOrders
            };
        }

        return {each}

    });
